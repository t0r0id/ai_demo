"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Heading from "@/components/heading";
import React from "react";
import { tools } from "@/shared/constants";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";
import { ConversationMessageType } from "@/shared/types";
import { SendHorizonalIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

const CodePage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [messages, setMessages] = React.useState<ConversationMessageType[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ConversationMessageType = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post<ConversationMessageType>("/api/code", {
        messages: newMessages,
      });
      setMessages((current) => [...current, userMessage, response.data]);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      router.refresh();
    }
  };

  const tool = tools["code"];
  return (
    <div className="flex flex-col h-full w-full justify-start">
      <div className="flex flex-col w-full h-5/6">
        <div>
          <Heading
            title={tool.label}
            description={tool.description}
            icon={tool.icon}
            iconColor={tool.color}
            bgColor={tool.bgColor}
          />
        </div>
        <div className="flex flex-col-reverse overflow-y-auto h-3/4">
          <div className="space-y-4 mt-4 w-full flex flex-col">
            <div className="flex flex-col gap-y-4 justify-end">
              {messages.map(
                (message, index) =>
                  typeof message.content === "string" && (
                    <div
                      key={index}
                      className={cn(
                        "p-8 w-full flex items-start gap-x-8 rounded-lg",
                        message.role === "user"
                          ? "bg-white border border-black/10"
                          : "bg-muted"
                      )}
                    >
                      {message.role === "user" ? (
                        <div className="flex items-center justify-end w-full gap-3">
                          <p className="text-sm overflow-auto text-wrap">
                            {message.content}
                          </p>
                          <UserAvatar />
                        </div>
                      ) : (
                        <div className="flex items-center justify-start w-full gap-x-3.5">
                          <BotAvatar />
                          <ReactMarkdown
                            components={{
                              pre: ({ node, ...props }) => (
                                <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                  <pre {...props} />
                                </div>
                              ),
                              code: ({ node, ...props }) => (
                                <code
                                  className="bg-black/10 rounded-lg p-1"
                                  {...props}
                                />
                              ),
                            }}
                            className="text-sm overflow-hidden leading-7"
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  )
              )}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
        {messages.length === 0 && !isLoading && (
          <Empty label="No Code Generated" />
        )}
      </div>

      <div className="fixed bottom-2  h-18 right-2 left-2 md:bottom-4 md:right-8 md:left-80">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
          rounded-lg
          border
          w-full
          p-4
          px-3
          md:px-6
          focus-within:shadow-sm
          flex
          items-center
          justify-between
          "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="w-[90%]">
                  <FormControl className="m-0 p-0">
                    <TextareaAutosize
                      className="border-0 outline-none
                  focus-visible:ring-0 focus-visible:ring-transparent w-full"
                      disabled={isLoading}
                      maxRows={5}
                      placeholder="Simple toggle button using react hooks"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                      {...field}
                    ></TextareaAutosize>
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <Button disabled={isLoading}>
              <SendHorizonalIcon />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CodePage;
