import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function AffiliateProgram() {
  const siteUrl = "https://www.diamondtiercapital.com"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Join Our Affiliate Program</h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Partner with Diamond Tier Capital and earn substantial commissions by referring clients to our financial
              services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                <Link href="/affiliate-program/register">Apply Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                <Link href="/affiliate/login">Affiliate Login</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Become an Affiliate?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Our affiliate program offers competitive commissions and comprehensive support to help you succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Competitive Commissions</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Earn up to 25% commission on every successful referral, with tiered rates based on performance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v4" />
                  <path d="M12 18v4" />
                  <path d="m4.93 4.93 2.83 2.83" />
                  <path d="m16.24 16.24 2.83 2.83" />
                  <path d="M2 12h4" />
                  <path d="M18 12h4" />
                  <path d="m4.93 19.07 2.83-2.83" />
                  <path d="m16.24 7.76 2.83-2.83" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Multi-Level Marketing</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Earn commissions not only on your direct referrals but also on referrals made by your network.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Marketing Resources</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access professional marketing materials, including banners, email templates, and landing pages.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Tracking</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your performance with our comprehensive dashboard, tracking clicks, conversions, and earnings.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Commission Structure */}
      <div className="bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Commission Structure</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Our tiered commission structure rewards your performance and growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-amber-200">
              <CardContent className="pt-6">
                <div className="text-amber-600 mb-4 text-center">
                  <h3 className="text-2xl font-bold">Bronze</h3>
                  <p className="text-3xl font-bold mt-2">10%</p>
                </div>
                <ul className="space-y-2 mt-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Entry level tier</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>No minimum requirements</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Basic marketing materials</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-300">
              <CardContent className="pt-6">
                <div className="text-gray-600 mb-4 text-center">
                  <h3 className="text-2xl font-bold">Silver</h3>
                  <p className="text-3xl font-bold mt-2">15%</p>
                </div>
                <ul className="space-y-2 mt-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>5+ successful referrals</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>3+ approved applications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Premium marketing materials</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-yellow-300">
              <CardContent className="pt-6">
                <div className="text-yellow-600 mb-4 text-center">
                  <h3 className="text-2xl font-bold">Gold</h3>
                  <p className="text-3xl font-bold mt-2">20%</p>
                </div>
                <ul className="space-y-2 mt-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>10+ successful referrals</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>5+ approved applications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Custom landing pages</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-300">
              <CardContent className="pt-6">
                <div className="text-purple-600 mb-4 text-center">
                  <h3 className="text-2xl font-bold">Platinum</h3>
                  <p className="text-3xl font-bold mt-2">25%</p>
                </div>
                <ul className="space-y-2 mt-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>20+ successful referrals</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>10+ approved applications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Dedicated affiliate manager</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Getting started with our affiliate program is simple and straightforward.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Apply</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Complete our simple application form to join our affiliate program.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Promote</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Share your unique referral links and marketing materials with your network.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Earn</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Receive commissions for every successful referral that converts into a client.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/affiliate-program/register">Apply Now</Link>
          </Button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find answers to common questions about our affiliate program.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Who can join the affiliate program?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our affiliate program is open to individuals and businesses who can refer potential clients to our
                  financial services. This includes financial advisors, business consultants, bloggers, and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">How do I track my referrals?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Once approved, you'll have access to a dedicated affiliate dashboard where you can track clicks,
                  conversions, and commissions in real-time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">When and how do I get paid?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Commissions are paid monthly for all approved applications from the previous month. We offer multiple
                  payment methods, including bank transfers, PayPal, and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">What marketing materials are provided?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We provide a variety of marketing materials, including banners, email templates, social media content,
                  and custom landing pages for higher-tier affiliates.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Have more questions about our affiliate program?</p>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join our affiliate program today and start earning commissions by referring clients to our financial
              services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                <Link href="/affiliate-program/register">Apply Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                <Link href="/affiliate-terms">Terms & Conditions</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
