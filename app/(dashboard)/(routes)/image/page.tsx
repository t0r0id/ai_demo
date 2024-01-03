"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Heading from "@/components/heading";
import React from "react";
import { tools } from "@/shared/constants";
import { useForm } from "react-hook-form";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Empty from "@/components/empty";
import Loader from "@/components/loader";

import TextareaAutosize from "react-textarea-autosize";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Download } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

const ImagePage = () => {
  const proModal = useProModal();
  const router = useRouter();

  const [images, setImages] = React.useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setImages([]);
    try {
      const response = await axios.post("/api/image", values);

      setImages(response.data.images);
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

  const tool = tools["image"];
  return (
    <div className="flex flex-col h-full w-full justify-start overflow-auto">
      <div>
        <Heading
          title={tool.label}
          description={tool.description}
          icon={tool.icon}
          iconColor={tool.color}
          bgColor={tool.bgColor}
        />
      </div>
      <div>
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
          grid
          grid-cols-12
          gap-2
          "
          >
            <FormField
              name="prompt"
              render={({ field }) => {
                const placeholderText =
                  "Office entrance of a corporate office. It is lobby of the building where employees have to swipe their id card and enter the office. A picture of fat beaver as corporate software developer wearing an Amazon t-shirt. However, the orange part of logo is upside down. The beaver is holding a cup of coffee in his right hand and entering office.";

                return (
                  <FormItem className="col-span-12">
                    <FormControl className="m-0 p-0">
                      <TextareaAutosize
                        className="border-0 outline-none w-full
                  focus-visible:ring-0 focus-visible:ring-transparent
                  resize-y"
                        disabled={isLoading}
                        maxRows={5}
                        placeholder={placeholderText}
                        {...field}
                      ></TextareaAutosize>
                    </FormControl>
                  </FormItem>
                );
              }}
            ></FormField>
            <FormField
              name="amount"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    {...field}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value}>
                          {field.value}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {amountOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            ></FormField>
            <FormField
              name="resolution"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    {...field}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value}>
                          {field.value}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resolutionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            ></FormField>
            <Button className="col-span-12 w-full" disabled={isLoading}>
              Generate
            </Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4 mt-4">
        {isLoading && (
          <div className="p-20">
            <Loader />
          </div>
        )}
        {images.length === 0 && !isLoading && (
          <Empty label="No Images Generated" />
        )}

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
        xl:grid-cols-4 gap-4 mt-8 overflow-auto"
        >
          {images.map((buffer, index) => (
            <Card key={index} className="rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  alt="Image"
                  fill
                  src={`data:image/png;base64, ${buffer}`}
                />
              </div>
              <CardFooter className="p-2">
                <Button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = `data:image/png;base64, ${buffer}`;
                    link.download = "image.jpg"; // Set to desired filename
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
