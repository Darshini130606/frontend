import "@/styles/globals.css";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata = {
  title: "CoWork Hub",
  description: "Coworking space management system"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
