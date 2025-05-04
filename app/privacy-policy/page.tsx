"use client"

import { motion } from "framer-motion"
import { ScrollToTop } from "@/components/ui/scroll-to-top"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-32 pb-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8"
        >
          <h1 className="text-3xl font-bold text-blue-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-6">Last Updated: May 4, 2025</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-blue-800 mb-3">1. Introduction</h2>
              <p className="text-gray-700 mb-3">
                Diamond Tier Capital ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you visit our website
                diamondtiercapital.com (the "Site") or use our services.
              </p>
              <p className="text-gray-700">
                Please read this Privacy Policy carefully. By accessing or using our Site and services, you acknowledge
                that you have read, understood, and agree to be bound by all the terms outlined in this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 mb-3">2. Information We Collect</h2>
              <h3 className="text-lg font-medium text-blue-700 mb-2">Personal Information</h3>
              <p className="text-gray-700 mb-3">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <li>Fill out forms on our website</li>
                <li>Register for consultations or services</li>
                <li>Subscribe to our newsletter</li>
                <li>Request information or assistance</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p className="text-gray-700 mb-3">This personal information may include:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Mailing address</li>
                <li>Business information</li>
                <li>Financial information (for consultation purposes)</li>
              </ul>

              <h3 className="text-lg font-medium text-blue-700 mb-2">Payment Information</h3>
              <p className="text-gray-700 mb-3">
                When you make payments through our Site, your payment information is processed by our third-party
                payment processor, Stripe. We do not store your complete credit card details on our servers. For more
                information on how Stripe processes your data, please refer to Stripe's Privacy Policy.
              </p>

              <h3 className="text-lg font-medium text-blue-700 mb-2">Automatically Collected Information</h3>
              <p className="text-gray-700 mb-3">
                When you access our Site, we may automatically collect certain information about your device and usage
                of the Site, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Operating system</li>
                <li>Device information</li>
                <li>Usage data (pages visited, time spent on pages)</li>
                <li>Referral source</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-3">
                We may use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <li>Providing, maintaining, and improving our services</li>
                <li>Processing transactions and sending related information</li>
                <li>Responding to your comments, questions, and requests</li>
                <li>Sending you technical notices, updates, security alerts, and administrative messages</li>
                <li>Communicating with you about products, services, offers, and events</li>
                <li>Monitoring and analyzing trends, usage, and activities in connection with our services</li>
                <li>Detecting, investigating, and preventing fraudulent transactions and other illegal activities</li>
                <li>Personalizing and improving your experience on our Site</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 mb-3">4. Sharing Your Information</h2>
              <p className="text-gray-700 mb-3">We may share your information in the following situations:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <li>
                  <strong>Service Providers:</strong> We may share your information with third-party vendors, service
                  providers, contractors, or agents who perform services for us or on our behalf.
                </li>
                <li>
                  <strong>Payment Processing:</strong> We use Stripe to process payments made through our Site. When you
                  make a payment, your payment information is transmitted directly to Stripe and is subject to Stripe's
                  privacy policy.
                </li>
                <li>
                  <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a
                  portion of our assets, your information may be transferred as part of that transaction.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or
                  in response to valid requests by public authorities.
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may share your information with your consent or at your
                  direction.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 mb-3">5. Data Security</h2>
              <p className="text-gray-700 mb-3">
                We implement appropriate technical and organizational measures to protect the security of your personal
                information. However, please be aware that no method of transmission over the Internet or electronic
                storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 mb-3">6. Third-Party Services</h2>
              <p className="text-gray-700 mb-3">
                Our Site may contain links to third-party websites and services. We have no control over, and assume no
                responsibility for, the content, privacy policies, or practices of any third-party sites or services. We
                encourage you to review the privacy policies of any third-party sites you visit.
              </p>
              <h3 className="text-lg font-medium text-blue-700 mb-2">Payment Processing</h3>
              <p className="text-gray-700 mb-3">
                We use Stripe for payment processing. When you make a payment through our Site, you provide your payment
                information directly to Stripe. Stripe's use of your personal information is governed by their Privacy
                Policy. We recommend reviewing Stripe's Privacy Policy to understand how they collect, use, and disclose
                your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 mb-3">7. Your Rights</h2>
              <p className="text-gray-700 mb-3">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <li>The right to access the personal information we have about you</li>
                <li>The right to request correction of inaccurate personal information</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to object to processing of your personal information</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
              <p className="text-gray-700">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section
                below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 mb-3">8. Children's Privacy</h2>
              <p className="text-gray-700 mb-3">
                Our Site is not intended for children under the age of 18. We do not knowingly collect personal
                information from children under 18. If you are a parent or guardian and believe that your child has
                provided us with personal information, please contact us, and we will delete such information from our
                systems.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 mb-3">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-3">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy
                Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 mb-3">10. Contact Us</h2>
              <p className="text-gray-700 mb-3">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Diamond Tier Capital</p>
                <p className="text-gray-700">1501 Biscayne Blvd, Suite 501</p>
                <p className="text-gray-700">Miami, FL 33132</p>
                <p className="text-gray-700">Email: info@diamondtier.solutions</p>
                <p className="text-gray-700">Phone: (305) 922-3379</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
      <ScrollToTop />
    </div>
  )
}
