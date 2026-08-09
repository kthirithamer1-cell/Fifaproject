

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flawless 🇹🇳 — كل تونسي أسطورة! كروت تونسية مخصصة 100%",
  description: "كل تونسي أسطورة... يلزملو غير الكارطة الصحيحة! صمّم كارتك التونسية 100% باسمك، بصورتك، وستاتيكس تلقّى فيها روحك تضحك وتعتز بيها مع طباعة PVC فاخرة وتوصيل لكل تونس.",
  openGraph: {
    title: "Flawless 🇹🇳 — كل تونسي أسطورة! كروت تونسية مخصصة 100%",
    description: "كل تونسي أسطورة... يلزملو غير الكارطة الصحيحة! صمّم كارتك التونسية 100% باسمك، بصورتك، وستاتيكس تلقّى فيها روحك مع طباعة PVC فاخرة وتوصيل لكل تونس 🇹🇳",
    type: "website",
    locale: "ar_TN",
    siteName: "Flawless Tunisia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flawless 🇹🇳 — كل تونسي أسطورة!",
    description: "كل تونسي أسطورة... يلزملو غير الكارطة الصحيحة! صمّم كارتك التونسية 100% باسمك، بصورتك، وستاتيكس تلقّى فيها روحك 🇹🇳",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script
          id="bis-skin-remover"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=function(){var e=document.querySelectorAll('[bis_skin_checked]');for(var i=0;i<e.length;i++)e[i].removeAttribute('bis_skin_checked')};r();if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',r)}}catch(e){}})();`,
          }}
          suppressHydrationWarning
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
