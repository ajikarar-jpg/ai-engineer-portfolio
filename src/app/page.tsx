import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Projects } from "@/components/Projects";
import { Services } from "@/components/Services";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Projects />
      <Services />
      <Process />
      <About />
      <Contact />
    </>
  );
}
