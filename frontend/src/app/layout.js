import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./provider";
import Sidebar from "./components/sidebar";
import { MuiThemeProvider } from "./mui_theme_provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EchoDraft",
  description:
    "EchoDraft is an AI Assistand tool which can help you rephrase and improve your text instantly with clear tone control and polished grammar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MuiThemeProvider>
          <Providers>
            <Sidebar>
              {children}
              <Toaster
                position="bottom-center"
                richColors
                expand={false}
                duration={4000}
                closeButton
                toastOptions={{
                  style: {
                    background: "white",
                    border: "1px solid #e5e7eb",
                    color: "#374151",
                  },
                  className: "my-toast",
                  descriptionClassName: "my-toast-description",
                }}
              />
            </Sidebar>
          </Providers>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
