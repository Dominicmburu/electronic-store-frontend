import { useState, useEffect } from "react";
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setShowHeader(window.innerWidth >= 576);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {showHeader && <Header />}
      <NavBar />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;