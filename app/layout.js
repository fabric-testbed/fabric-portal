import Footer from '../components/Footer';
import '@/styles/custom.scss';
import '@/styles/App.scss';
import InitialLoader from "@/components/InitialLoader";

export const metadata = {
  title: 'Fabric Portal',
  description: 'Portal for Fabric'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body>
      <InitialLoader>
        {children}
      </InitialLoader>
      <Footer />
    </body>
  </html>
  )
}
