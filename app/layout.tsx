

import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flawless - #1 Custom Football Meme Cards in Tunisia",
  description: "Redesign your friends into football legends with funny Tunisian stats and custom printed PVC cards.",
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
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <Script
          id="bis-skin-remover"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                const removeBisSkin = () => {
                  document.querySelectorAll('[bis_skin_checked]').forEach(el => el.removeAttribute('bis_skin_checked'));
                };
                removeBisSkin();
                document.addEventListener('DOMContentLoaded', removeBisSkin);
              }
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
