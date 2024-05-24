"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Sparkles, Lightbulb, SquarePlus, FileQuestion } from "lucide-react";
import { ChangeEvent, ErrorInfo, useState } from "react";
import { Empty } from "@/components/empty";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Loader } from "@/components/loader";

type ErrorType = {
  message: string;
  status: number;
};

type InterviewQuestions = {
  question: string;
  answer: string;
};

type Questions = {
  job_title?: string;
  company?: string;
  industry?: string;
  interview_questions: InterviewQuestions[];
  additional_questions: string[];
  tips: string[];
  score: number | string;
};

const MAX_FILE_SIZE = 500000; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const formSchema = z.object({
  job_title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  job_description: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  company_description: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  file: z.any({ required_error: "Please upload CV" }),
  // .refine((files) => files?.length === 1, "CV is required")
  // .refine(
  //   (files) => files?.[0]?.size <= MAX_FILE_SIZE,
  //   `Max file size is 5MB.`
  // )
  // .refine(
  //   (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
  //   ".pdf, .doc, .docx files are accepted."
  // ),
});

export default function Home() {
  const [questions, setQuestions] = useState<Questions | undefined>([1]);
  const [cv, setCV] = useState<File>();
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<ErrorType>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job_title: "",
      job_description: "",
      company_description: "",
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCV(e.target.files[0]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!cv) {
        throw 403;
      }
      values.file = cv;
      setLoader(true);
      const response = await axios.post("/api/openai", values, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        console.log(response?.data?.response);
        setQuestions(response?.data?.response);
      }
      setLoader(false);
    } catch (e: any) {
      if (e?.response?.status === 429) {
        setError({
          status: 429,
          message:
            "You have used available requests for today. Try again tomorrow.",
        });
      }
      if (e === 403) {
        setError({ status: 403, message: "Your CV is required" });
      }
      setLoader(false);
      console.log(e);
    }
  };

  return (
    <main className="flex">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="h-screen w-full text-white p-5 space-y-5"
        >
          <FormField
            control={form.control}
            name="job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter job title"
                    id="title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="job_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type the job description here."
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type the company profile here."
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Input
            onChange={handleFileChange}
            name="file"
            type="file"
            accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            required={true}
          />

          <Button
            className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold"
            size="lg"
            type="submit"
          >
            <Sparkles className="text-yellow-300 mr-2" />
            Get Interview Questions
          </Button>
          {error && (
            <p className="text-red-500 font-semibold">{error?.message}</p>
          )}
        </form>
      </Form>
      <div className="h-screen w-full border-l px-5 overflow-scroll py-8 space-y-5">
        {questions !== undefined ? (
          <>
            <div className="flex items-center">
              <h3 className="text-2xl font-bold underline mr-3">Best Match</h3>
              <h4 className="text-xl">{questions?.score}/10</h4>
            </div>
            <div className="flex items-center">
              <FileQuestion className="w-8 h-8 text-violet-500 mr-3" />
              <h3 className="text-2xl font-bold underline">Questions</h3>
            </div>
            <div className="space-y-2">
              {questions?.interview_questions?.map((question, index) => (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full text-sm bg-zinc-800 px-3 rounded-xl"
                  key={index}
                >
                  <AccordionItem value={question?.question}>
                    <AccordionTrigger className="text-left">
                      {question?.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {question?.answer}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
            <>
              <div className="flex items-center">
                <SquarePlus className="w-8 h-8 text-orange-500 mr-3" />
                <h3 className="text-2xl font-bold underline">
                  Additional Questions
                </h3>
              </div>
              <ul className="text-sm space-y-3">
                {questions?.additional_questions?.map((aq, index) => (
                  <li className="p-4 bg-zinc-800 rounded-xl" key={index}>
                    {aq}
                  </li>
                ))}
              </ul>
            </>
            <>
              <div className="flex items-center">
                <Lightbulb className="w-8 h-8 text-yellow-500 mr-3" />
                <h3 className="text-2xl font-bold underline">
                  Tips to prepare
                </h3>
              </div>
              <ul className="text-sm space-y-3">
                {questions?.tips?.map((aq, index) => (
                  <li className="p-4 bg-zinc-800 rounded-xl" key={index}>
                    {aq}
                  </li>
                ))}
              </ul>
            </>
          </>
        ) : (
          <>
            {loader ? (
              <Loader label="Please wait it may take sometime" />
            ) : (
              <Empty label="Please enter details to get interview questions." />
            )}
          </>
        )}
      </div>
    </main>
  );
}
