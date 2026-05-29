import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anany Kotawala",
  description:
    "Anany Kotawala — reinforcement learning and quantitative research.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'||(s===null&&matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {children}
        <Script src="/cardioid.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
