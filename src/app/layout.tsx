import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner"; // ✅ import sonner

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Anguilla Ferry Times",
  description:
    "Live schedules, travel info, and booking for ferries to/from Anguilla.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <div className="min-h-screen">
            {children}
            <Toaster richColors position="top-center" />{" "}
            {/* ✅ Toasts rendered here */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
