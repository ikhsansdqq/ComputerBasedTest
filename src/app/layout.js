import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CBT Web App - A Tensorflow Implementation",
  description: "Monitoring Exams and Assignments with AI",
  keywords: "CBT, AI, Tensorflow, Exams, Assignments, Monitoring",
  author: "Ikhsan Assidiqie",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
