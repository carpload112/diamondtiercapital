import Navigation from "./components/Navigation"
import Hero from "./components/Hero"
import Services from "./components/Services"
import HowItWorks from "./components/HowItWorks"
import ContactForm from "./components/ContactForm"
import CreditRepairSection from "./components/CreditRepairSection"

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Navigation />
      <Hero />
      <Services />
      <HowItWorks />
      <ContactForm />
      <CreditRepairSection />
    </main>
  )
}

