import Hero from "./components/Hero"
import Partners from "./components/Partners"
import Services from "./components/Services"
import HowItWorks from "./components/HowItWorks"
import Testimonials from "./components/Testimonials"
import FAQ from "./components/FAQ"
import ContactForm from "./components/ContactForm"
import CreditRepairSection from "./components/CreditRepairSection"

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Hero />
      <Partners />
      <Services />
      <HowItWorks />
      <Testimonials />
      <CreditRepairSection />
      <FAQ />
      <ContactForm />
    </main>
  )
}
