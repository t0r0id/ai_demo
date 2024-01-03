"use client";

import { it } from "node:test";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonials = [
  {
    name: "Ayush",
    avatar: "A",
    title: "Enterprise Sales",
    description:
      "T0r0!d allowed me to respond to my customers faster and more efficiently. I can now focus on the more important tasks at hand.",
  },
  {
    name: "Neha",
    avatar: "N",
    title: "Data Scientist",
    description: "Now I'm able to generate code 10x faster.",
  },
  {
    name: "Tanmay",
    avatar: "T",
    title: "Content Creator",
    description:
      "I'm able to create custom content for my clients using image generation functionality of T0r0!d.",
  },
  {
    name: "Madhuri",
    avatar: "T",
    title: "House Wife",
    description: "I use T0r0!d to learn new healthy recipes.",
  },
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10 ">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.description}
            className="bg-[#192339] border-none text-white"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{testimonial.name}</p>
                  <p className="text-zinc-400 text-sm">{testimonial.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {testimonial.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
