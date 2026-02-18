import HeroSection from "@/components/wedding/HeroSection";
import InfoSection from "@/components/wedding/InfoSection";
import RsvpSection from "@/components/wedding/RsvpSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <InfoSection />
      <RsvpSection />
    </div>
  );
};

export default Index;