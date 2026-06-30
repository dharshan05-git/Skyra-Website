import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
