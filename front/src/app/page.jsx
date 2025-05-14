import Image from "next/image";
import Navbar from "../../components/Navbar";
import "./globals.css";
import HeroSection from "../../components/HeroSection";
import Vantagens from "../../components/Vantagens";
import Footer from "../../components/footer";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <HeroSection />
      <Vantagens />
      <Footer />
    </div>
  );
}
