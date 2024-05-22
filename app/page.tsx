"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  file: z
    .any()
    .refine((files) => files?.length === 1, "CV is required")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf, .doc, .docx files are accepted."
    ),
});

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job_title: "",
      job_description: "",
      company_description: "",
      file: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
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

          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload CV</FormLabel>
                <FormControl>
                  <Input type="file" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold"
            size="lg"
            type="submit"
          >
            <Sparkles className="text-yellow-300 mr-2" />
            Get Interview Questions
          </Button>
        </form>
      </Form>
      <div className="h-screen w-2/3 border-l p-3">
        {questions?.length > 0 ? (
          <>
            <h3 className="text-2xl font-bold underline">Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles that matches the other
                  components&apos; aesthetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>
                  {`Yes. It's animated by default, but you can disable it if you
              prefer.`}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <>
              <h3 className="text-2xl font-bold underline">
                Additional Questions
              </h3>
            </>
            <>
              <h3 className="text-2xl font-bold underline">Tips to prepare</h3>
              <ul>
                <li></li>
              </ul>
            </>
          </>
        ) : (
          <>
            <Empty label="Please enter details to get interview questions." />
          </>
        )}
      </div>
    </main>
  );
}
