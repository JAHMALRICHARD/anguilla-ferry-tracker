"use client";

import React from "react";
import { StarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsSection() {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8">Testimonials</h2>

      <Card className="bg-background border-muted shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className="h-5 w-5 text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>

          <p className="text-muted-foreground mb-4">
            &quot;Outstanding service! The ferry was on time and the staff was
            incredibly helpful. Made traveling between islands a breeze.&quot;
          </p>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <p className="font-medium">Sarah Mitchell</p>
              <p className="text-sm text-muted-foreground">Frequent Traveler</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
