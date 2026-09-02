import PageWrapper from "@/components/page-wrapper";

export const handle = {
  seo: {
    title: "Terms of Service",
    description: "Read our terms of service and conditions of use.",
  },
};

export default function TermsPage() {
  return (
    <PageWrapper className="min-h-screen p-[20px]">
      <h1 className="text-3xl sm:text-4xl font-bold font-grotesk text-foreground mb-8">
        Terms of Service
      </h1>

      <div className="space-y-8 font-geist text-muted-foreground text-sm sm:text-base leading-relaxed">
        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            1. Introduction
          </h2>
          <p>
            Welcome to Eventra. These Terms of Service ("Terms") govern your use of our website,
            mobile application, and services. By accessing or using Eventra, you agree to be
            bound by these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            2. Use License
          </h2>
          <p>
            You are granted a limited, non-exclusive, and non-transferable license to use
            Eventra solely for personal, non-commercial purposes, or as otherwise permitted by
            these Terms. This license does not include:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Any resale or commercial use</li>
            <li>Modification or derivative works</li>
            <li>Downloading or copying of accounts or information</li>
            <li>Use of data mining or similar data gathering methods</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            3. User Accounts
          </h2>
          <p>
            When you create an account on Eventra, you are responsible for maintaining the
            confidentiality of your password and account information. You agree to accept
            responsibility for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            4. Ticket Purchases
          </h2>
          <p>
            All ticket purchases are final unless otherwise stated by the event organizer. Eventra
            is not responsible for refunds, cancellations, or modifications made by event
            organizers.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            5. User Conduct
          </h2>
          <p>
            You agree not to use Eventra for any unlawful purposes or in any way that violates
            these Terms. You further agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Harass or cause distress or inconvenience to any person</li>
            <li>Disrupt the normal flow of dialogue in Eventra</li>
            <li>Post or transmit obscene or offensive content</li>
            <li>Attempt to gain unauthorized access to our systems</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            6. Limitation of Liability
          </h2>
          <p>
            Eventra provides its services on an "as is" basis. We make no warranties, expressed or
            implied, and hereby disclaim and negate all other warranties including, without
            limitation, implied warranties or conditions of merchantability, fitness for a particular
            purpose, or non-infringement of intellectual property.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            7. Changes to Terms
          </h2>
          <p>
            Eventra reserves the right to modify these Terms at any time. Your continued use of
            Eventra following the posting of revised Terms means that you accept and agree to the
            changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold font-grotesk text-foreground mb-3">
            8. Contact Us
          </h2>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
            <a
              href="mailto:contact@eventra.com"
              className="text-[#0F6E56] dark:text-[#4ADE80] font-medium hover:underline"
            >
              contact@eventra.com
            </a>{" "}
            or visit our{" "}
            <a
              href="/contact"
              className="text-[#0F6E56] dark:text-[#4ADE80] font-medium hover:underline"
            >
              contact page
            </a>.
          </p>
        </section>
      </div>
    </PageWrapper>
  );
}