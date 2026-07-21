import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PopularGames from "@/components/PopularGames";
import MiniSlider from "@/components/MiniSlider";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-white">
      <Navbar />
      <Hero />
      <PopularGames />
      <MiniSlider />
      <Footer />
    </main>
  );
}
