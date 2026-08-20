

import type { Metadata } from "next";
import "./globals.css";
import { AffiliateTrackerProvider } from "./_components/AffiliateTrackerProvider";

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
      data-scroll-behavior="smooth"
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
        {/* Meta Pixel Code */}
        <script
          id="meta-pixel"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','2660680664349474');fbq('track','PageView');`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2660680664349474&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <AffiliateTrackerProvider />
        {children}
      </body>
    </html>
  );
}
