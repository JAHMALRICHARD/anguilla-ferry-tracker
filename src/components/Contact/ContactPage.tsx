"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  MailIcon,
  PhoneIcon,
  MessageCircleIcon,
  CalendarIcon,
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl w-full">
        {/* Left Section */}
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Let&apos;s connect
            </CardTitle>
            <CardDescription>
              Have a question or ready to start your journey? We&apos;re here to
              help you find the perfect ferry service.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <div className="flex items-start gap-4">
              <MailIcon className="mt-1" />
              <div>
                <p className="font-medium">Email Us</p>
                <p className="text-muted-foreground">
                  hello@anguillaferries.com
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <PhoneIcon className="mt-1" />
              <div>
                <p className="font-medium">Call Us</p>
                <p className="text-muted-foreground">+1 (264) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MessageCircleIcon className="mt-1" />
              <div>
                <p className="font-medium">Live Chat</p>
                <Link href="/chat" className="text-blue-600 hover:underline">
                  Start a chat
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CalendarIcon className="mt-1" />
              <div>
                <p className="font-medium">Book a Demo</p>
                <Link href="/demo" className="text-blue-600 hover:underline">
                  Schedule now
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Section */}
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              We&apos;ll get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Your name" />
              <Input type="email" placeholder="Your email" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="How can we help you?" rows={4} />
            <Button className="w-full">Send Message</Button>
            <p className="text-xs text-muted-foreground text-center">
              By submitting this form, you agree to our{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
