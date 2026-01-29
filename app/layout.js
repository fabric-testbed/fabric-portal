import Footer from "../components/Footer";
import ClientOnlyLoader from "../components/ClientOnlyLoader";
import "@/styles/custom.scss";
import "@/styles/App.scss";

export const metadata = {
  title: "Fabric Portal",
  description: "Portal for Fabric",
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
