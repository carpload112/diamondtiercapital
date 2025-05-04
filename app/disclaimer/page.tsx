import Link from "next/link"

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Disclaimer</h1>

      <div className="prose prose-slate max-w-none">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <p className="text-sm text-blue-700">
            <strong>Last Updated:</strong> May 4, 2025
          </p>
          <p className="text-sm text-blue-700 mt-2">Please read this disclaimer carefully before using our services.</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Consultation Services Only</h2>
          <p>
            Diamond Tier Capital ("we," "our," or "us") provides business funding consultation services only. We are not
            a lender, bank, credit card issuer, or financial institution. We do not directly provide loans, credit
            cards, lines of credit, or any other financial products. Our role is limited to providing information,
            education, and consultation services to help businesses explore potential funding options.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. No Financial Advice</h2>
          <p>
            The information provided on our website, during consultations, or through any other communication channels
            is for general informational purposes only and should not be construed as financial, legal, tax, or
            investment advice. We do not provide personalized financial advice, and nothing we communicate constitutes a
            recommendation to engage in any particular financial strategy or transaction.
          </p>
          <p className="mt-4">
            Before making any financial decisions, we strongly encourage you to consult with qualified professionals
            such as financial advisors, accountants, attorneys, or other professionals who can provide advice tailored
            to your specific circumstances.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. No Guarantees</h2>
          <p>
            Diamond Tier Capital does not guarantee that you will be approved for any loan, credit card, line of credit,
            or other financial product. Approval for financial products is solely at the discretion of the lenders,
            banks, or financial institutions that provide these products. Your credit score, business history, financial
            situation, and other factors will determine your eligibility.
          </p>
          <p className="mt-4">
            We do not guarantee any specific results, outcomes, or improvements to your credit score or business funding
            situation. Any examples of potential funding amounts, interest rates, or terms are illustrative only and
            should not be relied upon as guarantees of what you may receive.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Third-Party Information</h2>
          <p>
            We may provide information about third-party lenders, financial institutions, or service providers. This
            information is provided as a convenience and does not constitute an endorsement, recommendation, or warranty
            regarding these third parties. We are not responsible for the actions, services, products, or content of any
            third-party entities.
          </p>
          <p className="mt-4">
            When you engage with any third-party lender or financial institution, you will be subject to their terms,
            conditions, and privacy policies. We encourage you to review these documents carefully before proceeding
            with any application or agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Accuracy of Information</h2>
          <p>
            While we strive to provide accurate and up-to-date information, we make no representations or warranties
            about the completeness, reliability, accuracy, or availability of the information on our website or provided
            during consultations. Financial products, terms, rates, and eligibility criteria change frequently, and the
            information we provide may not reflect the most current offerings or policies of financial institutions.
          </p>
          <p className="mt-4">
            Any reliance you place on such information is strictly at your own risk. We reserve the right to make
            changes to the information on our website at any time without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Risk Acknowledgment</h2>
          <p>
            All financial decisions involve risk. Taking on debt, including business loans, credit cards, or lines of
            credit, carries inherent risks that could impact your business and personal financial situation. These risks
            include, but are not limited to:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Inability to repay debt, which may result in default, collections, or legal actions</li>
            <li>Negative impacts on your business and personal credit scores</li>
            <li>Loss of collateral or personal assets if secured financing is obtained</li>
            <li>Increased financial strain on your business operations</li>
            <li>Changes in interest rates or terms that may affect repayment amounts</li>
          </ul>
          <p className="mt-4">
            You acknowledge and accept these risks when pursuing any financial product or strategy discussed during our
            consultations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Testimonials and Reviews</h2>
          <p>
            Testimonials, reviews, or success stories featured on our website or marketing materials represent
            individual experiences. These are not guarantees of similar outcomes for all clients. Results vary based on
            numerous factors, including but not limited to credit history, business performance, market conditions, and
            lender criteria. The testimonials shared are genuine but represent exceptional results that may not be
            typical.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. External Links</h2>
          <p>
            Our website may contain links to external websites that are not operated by us. We have no control over the
            content and practices of these sites and cannot accept responsibility for their respective privacy policies
            or practices. You acknowledge that you access any third-party website at your own risk.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Diamond Tier Capital, its affiliates, officers,
            directors, employees, and agents shall not be liable for any direct, indirect, incidental, consequential, or
            punitive damages, including but not limited to loss of profits, data, business opportunities, or anticipated
            savings, arising out of or in connection with:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Your use of our website or services</li>
            <li>Any decisions made based on information provided during consultations</li>
            <li>Any financial products obtained through third-party lenders or institutions</li>
            <li>Any actions taken or not taken as a result of our consultation services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Diamond Tier Capital, its affiliates, officers, directors,
            employees, and agents from and against any claims, liabilities, damages, losses, costs, expenses, or fees
            (including reasonable attorneys' fees) that arise from or relate to your use of our services or violation of
            this disclaimer.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Changes to This Disclaimer</h2>
          <p>
            We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon
            posting on our website. Your continued use of our services after any changes indicates your acceptance of
            the modified disclaimer.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
          <p>If you have any questions about this disclaimer, please contact us at:</p>
          <div className="mt-4">
            <p>
              <strong>Diamond Tier Capital</strong>
            </p>
            <p>1501 Biscayne Blvd, Suite 501</p>
            <p>Miami, FL 33132</p>
            <p>
              Email:{" "}
              <a href="mailto:info@diamondtier.solutions" className="text-blue-600 hover:underline">
                info@diamondtier.solutions
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href="tel:+13059223379" className="text-blue-600 hover:underline">
                (305) 922-3379
              </a>
            </p>
          </div>
        </section>

        <div className="mt-12 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
