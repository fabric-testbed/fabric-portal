import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/App.scss';

export const metadata = {
  title: 'Fabric Portal',
  description: 'Portal for Fabric'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body>
      <Header />
      <main>{children}</main>
      <Footer />
    </body>
  </html>
  )
}
