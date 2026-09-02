import PageWrapper from "@/components/page-wrapper";

export const handle = {
  seo: {
    title: "Privacy Policy",
    description: "Read our privacy policy to understand how we collect and use your data.",
  },
};

export default function PrivacyPage() {
  return (
    <PageWrapper className="min-h-screen p-[20px]">
      <h1 className="text-3xl sm:text-4xl font-bold font-grotesk text-foreground mb-8">
        Privacy Policy
      </h1>

      <div className="space-y-8 font-geist text-muted-foreground text-sm sm:text-base leading-relaxed">
        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            1. Introduction
          </h2>
          <p>
            Eventra ("we", "our", or "us") operates the Eventra website and mobile application.
            This page informs you of our policies regarding the collection, use, and disclosure
            of personal data when you use our website and the choices you have associated with that
            data.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            2. Information Collection and Use
          </h2>
          <p>
            We collect several different types of information for various purposes to provide and
            improve our service to you.
          </p>

          <h3 className="text-lg font-bold font-grotesk text-foreground mt-4 mb-2">
            Types of Data Collected:
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground">Personal Data:</strong> Name, email address, phone
              number, postal address
            </li>
            <li>
              <strong className="text-foreground">Cookies and Usage Data:</strong> Browser type, IP
              address, pages visited, time spent on pages
            </li>
            <li>
              <strong className="text-foreground">Payment Information:</strong> Credit card details
              (processed securely through third-party providers)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            3. Use of Data
          </h2>
          <p>Eventra uses the collected data for various purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To allow you to participate in interactive features</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so we can improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            4. Security of Data
          </h2>
          <p>
            The security of your data is important to us, but remember that no method of
            transmission over the Internet or method of electronic storage is 100% secure. While we
            strive to use commercially acceptable means to protect your personal data, we cannot
            guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            5. Cookies
          </h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our service and
            hold certain information. You can instruct your browser to refuse all cookies or to
            indicate when a cookie is being sent. However, if you do not accept cookies, you may not
            be able to use some portions of our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            6. Third-Party Services
          </h2>
          <p>
            Our service may contain links to other sites that are not operated by us. If you click on
            a third-party link, you will be directed to that third party's site. We strongly advise
            you to review the Privacy Policy of every site you visit.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            7. Children's Privacy
          </h2>
          <p>
            Our service does not address anyone under the age of 13. We do not knowingly collect
            personally identifiable information from children under 13. If we become aware that we
            have collected personal data from children without verification of parental consent, we
            take steps to remove such information and terminate the child's account.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            8. Changes to This Privacy Policy
          </h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page and updating the "Last updated" date at the
            top of this Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            9. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:contact@eventra.com" className="text-[#0F6E56] dark:text-[#4ADE80] font-medium hover:underline">
              contact@eventra.com
            </a>{" "}
            or visit our{" "}
            <a href="/contact" className="text-[#0F6E56] dark:text-[#4ADE80] font-medium hover:underline">
              contact page
            </a>.
          </p>
        </section>
      </div>
    </PageWrapper>
  );
}