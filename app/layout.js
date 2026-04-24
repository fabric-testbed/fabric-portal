import Footer from "../components/Footer";
import ClientOnlyLoader from "../components/ClientOnlyLoader";
import "@/styles/globals.scss";

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
      <body>
        <ClientOnlyLoader>
          {children}
        </ClientOnlyLoader>
        <Footer />
      </body>
    </html>
  );
}
