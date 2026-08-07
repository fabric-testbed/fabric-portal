import { Inter } from "next/font/google";
import Footer from "../components/Footer";
import ClientOnlyLoader from "../components/ClientOnlyLoader";
import "@/styles/globals.scss";

const inter = Inter({ subsets: ["latin", "latin-ext"], weight: ["300", "400", "500", "600", "700"] });

export const metadata = {
  title: {
    default: "FABRIC Portal",
    template: "%s | FABRIC Portal",
  },
  description: "FABRIC is a unique national research infrastructure to enable cutting-edge and exploratory research at-scale in networking, cybersecurity, distributed computing, storage, virtual reality, 5G, machine learning, and science applications.",
  icons: {
    icon: "/fabric.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="main-content">
          <ClientOnlyLoader>
            {children}
          </ClientOnlyLoader>
        </div>
        <Footer />
      </body>
    </html>
  );
}
