export const handle = {
    seo: {
        title: "Terms of Service",
        description: "Read our terms of service and conditions of use.",
    },
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 mb-10">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-foreground mb-8 underline decoration-green-600 underline-offset-2">Terms of Service</h1>
                
                <div className="prose prose-invert max-w-none space-y-6 text-foreground/80">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-[#0f6e56]">1. Introduction</h2>
                        <p>
                            Welcome to Eventra. These Terms of Service ("Terms") govern your use of our website, mobile application, and services. By accessing or using Eventra, you agree to be bound by these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-[#0f6e56]">2. Use License</h2>
                        <p>
                            You are granted a limited, non-exclusive, and non-transferable license to use Eventra solely for personal, non-commercial purposes, or as otherwise permitted by these Terms. This license does not include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Any resale or commercial use</li>
                            <li>Modification or derivative works</li>
                            <li>Downloading or copying of accounts or information</li>
                            <li>Use of data mining or similar data gathering methods</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#0f6e56] mb-4">3. User Accounts</h2>
                        <p>
                            When you create an account on Eventra, you are responsible for maintaining the confidentiality of your password and account information. You agree to accept responsibility for all activities that occur under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#0f6e56] mb-4">4. Ticket Purchases</h2>
                        <p>
                            All ticket purchases are final unless otherwise stated by the event organizer. Eventra is not responsible for refunds, cancellations, or modifications made by event organizers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#0f6e56] mb-4">5. User Conduct</h2>
                        <p>
                            You agree not to use Eventra for any unlawful purposes or in any way that violates these Terms. You further agree not to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Harass or cause distress or inconvenience to any person</li>
                            <li>Disrupt the normal flow of dialogue in Eventra</li>
                            <li>Post or transmit obscene or offensive content</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#0f6e56] mb-4">6. Limitation of Liability</h2>
                        <p>
                            Eventra provides its services on an "as is" basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#0f6e56] mb-4">7. Changes to Terms</h2>
                        <p>
                            Eventra reserves the right to modify these Terms at any time. Your continued use of Eventra following the posting of revised Terms means that you accept and agree to the changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#0f6e56] mb-4">8. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us through the <a href="/contact" className="text-primary hover:underline">contact page</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
