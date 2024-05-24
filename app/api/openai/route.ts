export const maxDuration = 60;
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { ratelimit } from "@/lib/limit";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});
const agentId: string = process.env.AGENT_ID || "";

// Define the POST handler for the file upload
export const POST = async (req: NextRequest) => {
  const ip = req.ip ?? "127.0.0.1";
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        error: {
          message: "Rate limit reached",
          limit,
          reset,
          remaining,
        },
      },
      { status: 429 }
    );
  }
  // Parse the incoming form data
  const data = await req.formData();

  const cv = data.get("file") as File;
  if (!cv) {
    // If no file is received, return a JSON response with an error and a 400 status code
    return NextResponse.json(
      { response: null, message: "No CV received." },
      { status: 400 }
    );
  }
  const file = await openai.files.create({
    file: cv,
    purpose: "assistants",
  });
  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: `Job Title: ${data.get("job_title")}
        Job description: 
        ${data.get("job_description")}
        Company Description:
        ${data.get("company_description")}
        Interview Stage:
        ${data.get("interview_stage")}
        CV is attached. 
        Please provide a valid JSON response.
        `,
        attachments: [
          {
            file_id: file.id,
            tools: [{ type: "file_search" }],
          },
        ],
      },
    ],
  });

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: agentId,
  });

  const messages: any = await openai.beta.threads.messages.list(thread.id);
  let result = messages?.data[0]?.content[0]?.text?.value;
  result = result.replace(/```json\n?|```/g, "");
  result = result.replace(/\\(?!["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "\\\\");
  result = JSON.parse(result);

  if (run.status === "completed") {
    return NextResponse.json(
      { response: result, message: "success" },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { response: null, message: "failed" },
      { status: 500 }
    );
  }
};
