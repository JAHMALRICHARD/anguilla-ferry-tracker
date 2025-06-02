"use client";

import {
  InstagramIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t border-border px-6 md:px-12 py-16 rounded-t-2xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Branding */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Anguilla Ferry Times
          </h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Real-time ferry schedules, operators, and charter info connecting
            Anguilla and St. Martin.
          </p>
          <div className="flex items-center gap-4 mt-6 text-muted-foreground">
            <InstagramIcon className="h-5 w-5 hover:text-primary transition" />
            <FacebookIcon className="h-5 w-5 hover:text-primary transition" />
            <TwitterIcon className="h-5 w-5 hover:text-primary transition" />
            <LinkedinIcon className="h-5 w-5 hover:text-primary transition" />
          </div>
        </div>

        {/* Product Links */}
        <div>
          <h3 className="text-sm font-semibold mb-4 text-foreground">
            Product
          </h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>
              <a href="#">Overview</a>
            </li>
            <li>
              <a href="#">Schedule</a>
            </li>
            <li>
              <a href="#">Charters</a>
            </li>
            <li>
              <a href="#">Operators</a>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-sm font-semibold mb-4 text-foreground">
            Company
          </h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Team</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Terms</a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-semibold mb-4 text-foreground">
            Newsletter
          </h3>
          <div className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="Email"
              className="bg-input text-foreground border-muted placeholder:text-muted-foreground"
            />
            <Button className="bg-primary text-primary-foreground hover:opacity-90">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            By subscribing, you agree to our{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      <div className="mt-16 pt-6 border-t border-border text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center">
        <span>
          © {new Date().getFullYear()} Anguilla Ferry Times. All rights
          reserved.
        </span>
        <span className="mt-4 md:mt-0">
          Made with ❤️ by{" "}
          <a
            href="https://github.com/jahmalrichard"
            target="_blank"
            className="underline"
          >
            Jahmal Richard
          </a>
        </span>
      </div>
    </footer>
  );
}
