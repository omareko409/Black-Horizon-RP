import "./globals.css";
import Header from "@/components/Header";
import AudioPlayer from "@/components/AudioPlayer";
import Providers from "@/components/Providers";
import Loader from "@/components/Loader";
import CustomCursor from "@/components/CustomCursor";
import Scroll3DBackground from "@/components/Scroll3DBackground";
import DevToolsBlocker from "@/components/DevToolsBlocker";
import AccessGuard from "@/components/AccessGuard";

export const metadata = {
  title: "Black Horizon RP",
  description: "A dark, modern, and cinematic FiveM server website.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <DevToolsBlocker />
        <Loader />
        <CustomCursor />
        <Scroll3DBackground />
        <Providers>
          <AccessGuard>
            <div className="page-wrapper">
              <Header />
              <main className="main-content">
                {children}
              </main>
              <AudioPlayer />
            </div>
          </AccessGuard>
        </Providers>
      </body>
    </html>
  );
}

