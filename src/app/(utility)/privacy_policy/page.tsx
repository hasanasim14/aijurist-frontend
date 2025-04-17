"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "@/components/utility/Footer";

const PrivacyPolicy = () => {
  const router = useRouter();
  const sections = [
    // Definitions
    {
      title: "Definitions",
      content: [
        {
          subtitle: " ",
          items: [
            {
              subitem: "1. Application:",
              description:
                "Refers to the AI-powered legal assistant platform provided by the Company.",
            },
            {
              subitem: "2. Personal Data:",
              description:
                "Any information relating to an identified or identifiable natural person.",
            },
            {
              subitem: "3. Processing:",
              description:
                "Any operation performed on Personal Data, such as collection, recording, organization, storage, adaptation, retrieval, use, disclosure, or destruction.",
            },
            {
              subitem: "4. Services:",
              description: "As defined in the Introduction.",
            },
            {
              subitem: "5. User:",
              description: "Any individual or entity using the Application.",
            },
          ],
        },
      ],
    },
    // Information We Collect
    {
      title: "Information We Collect",
      content: [
        "We may collect information about you in a variety of ways. The information we may collect via Services includes:",
        {
          subtitle: "1. Personal Data",
          items: [
            {
              subitem: "1.1 Account Information",
              description:
                "When you register for an account, we collect information such as your name, email address, contact number, and potentially professional details you provide.",
            },
            {
              subitem: "1.2 Payment Information",
              description:
                "While payments are currently processed via bank transfer, we may collect necessary transaction details to process your subscription payments. This may change, and any future payment processor's involvement will be updated here.",
            },
          ],
        },
        {
          subtitle: "2. Derivative Data & Usage Information:",
          items: [
            {
              subitem: "2.1 Queries and Uploaded Files:",
              description:
                "We collect the queries you submit and any documents or files you upload to the Application for processing to provide the core functionalities of the Services (e.g., research summarization, drafting).",
            },
            {
              subitem: "2.2 Usage Metrics:",
              description:
                "We automatically collect information about your use of the Services, such as the features you use, the number of queries submitted (relevant to your subscription plan limits), the general nature of your interactions, IP address, browser type, access times, and referring website addresses. This helps us improve the Application and monitor resource usage.",
            },
            {
              subitem: "2.3 Feedback:",
              description:
                "We collect any feedback, comments, or suggestions you voluntarily provide about the Services.",
            },
          ],
        },
        {
          subtitle: "3. Third-Party Analytics:",
          items: [
            {
              subitem: "3.1 Queries and Uploaded Files:",
              description: `We use third-party analytics services, such as Google Analytics, to help analyze how users use the Services. These services may use cookies (though we currently do not deploy other cookies) or other tracking technologies to collect information such as your IP address, time of visit, whether you are a return visitor, and any referring website. We use this information to improve our Services. Google's ability to use and share information collected by Google Analytics about your visits is restricted by the Google Analytics Terms of Service and the Google Privacy Policy. You can learn more here: https://support.google.com/analytics/answer/7318509?hl=en `,
            },
          ],
        },
      ],
    },
    // How We Use Your Information
    {
      title: "How We Use Your Information",
      content: [
        "Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Services to:",
        {
          subtitle: `${" "}`,
          items: [
            {
              subitem: `${" "}`,
              description: "1. Create and manage your account.",
            },
            {
              subitem: `${" "}`,
              description: "2. Provide, operate, and maintain the Services.",
            },
            {
              subitem: `${" "}`,
              description:
                "3. Process your queries and uploaded documents to generate responses, summaries, drafts, and research results.",
            },
            {
              subitem: `${" "}`,
              description: "4. Process payments and manage your subscriptions.",
            },
            {
              subitem: `${" "}`,
              description:
                "5. Monitor and analyze usage and trends to improve your experience with the Services and develop new features.",
            },
            {
              subitem: `${" "}`,
              description:
                "6. Respond to your comments, questions, and provide customer support.",
            },
            {
              subitem: `${" "}`,
              description:
                "7. Monitor usage against subscription plan limits (e.g., query limits) and notify you regarding usage.",
            },
            {
              subitem: `${" "}`,
              description:
                "8. Send you technical notices, updates, security alerts, and support messages.",
            },
            {
              subitem: `${" "}`,
              description:
                "9. Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.",
            },
            {
              subitem: `${" "}`,
              description: "10. Comply with legal and regulatory obligations.",
            },
            {
              subitem: `${" "}`,
              description:
                "11. Use anonymized and aggregated feedback for service improvement, training, or informational/marketing purposes, ensuring no personally identifiable information is disclosed.",
            },
          ],
        },
      ],
    },
    // Disclosure of Your Information
    {
      title: "Disclosure of Your Information",
      content: [
        "We do not share, sell, rent, or trade your Personal Data with third parties for their commercial purposes. We may share information we have collected about you in certain situations:",
        {
          subtitle: "1. By Law or to Protect Rights:",
          items: [
            {
              subitem: `${" "}`,
              description:
                " If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.",
            },
          ],
        },
        {
          subtitle: "2. Third-Party Service Providers:",
          items: [
            {
              subitem: `${" "}`,
              description:
                " We may share your information with third parties that perform services for us or on our behalf, including:",
            },
            {
              subitem: "2.1 Cloud Hosting:",
              description:
                "Our Services are hosted on Microsoft Azure. Data stored on our platform resides within their infrastructure. [Link to Microsoft Azure Privacy Information]",
            },
            {
              subitem: "2.2 AI Processing (OpenAI):",
              description:
                "To provide certain features (like generating summaries, drafts, or processing complex queries), we may send your queries and potentially relevant excerpts of uploaded content to OpenAI's API. We rely on OpenAI's standard API data usage policies, which state that data submitted via their API is not used for training their models. You can review their policies here: [Link to relevant OpenAI API Data Usage Policy]. Your use of our Services constitutes acknowledgment of this processing.",
            },
            {
              subitem: "2.3 Analytics Providers:",
              description: "As mentioned, we use Google Analytics.",
            },
            {
              subitem: "2.4 (Future Payment Processors):",
              description:
                " If we integrate third-party payment processors (e.g., Stripe), we will share necessary information with them to facilitate transactions.",
            },
          ],
        },
        {
          subtitle: "3. Business Transfers:",
          items: [
            {
              subitem: `${" "}`,
              description:
                "We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.",
            },
          ],
        },
        {
          subtitle: "4. With Your Consent:",
          items: [
            {
              subitem: `${" "}`,
              description:
                "We may disclose your Personal Data for any other purpose with your consent.",
            },
          ],
        },
      ],
    },
    // Data Security
    {
      title: "Data Security",
      content: [
        "We use administrative, technical, and physical security measures to help protect your Personal Data. These include encryption (in transit and at rest), secure authentication protocols (including OTP for signup), regular vulnerability assessments, and restricted access controls. While we have taken reasonable steps to secure the Personal Data you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse. Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide Personal Data. In the event of a data breach that affects your Personal Data under our control, we will notify you promptly in accordance with applicable law.",
      ],
    },
    // Data Retention
    {
      title: "Data Retention",
      content: [
        "We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy, unless a longer retention period is required or permitted by law.",
        {
          subtitle: `${" "}`,
          items: [
            {
              subitem: "1. Account Information:",
              description:
                "Retained as long as your account is active, and for a reasonable period thereafter for legal or operational purposes (e.g., facilitating reactivation, complying with legal obligations).",
            },
            {
              subitem: "2. Queries and Uploaded Files:",
              description:
                " Stored temporarily for processing and deleted after a defined retention period (e.g., 30 days, subject to change at our discretion), unless required otherwise by law.",
            },
            {
              subitem: "3. User Chat History:",
              description:
                " Retained based on your subscription plan or until account deletion request is processed.",
            },
            {
              subitem: "4. Usage Data:",
              description:
                " May be retained for longer periods in an aggregated or anonymized form for analytical purposes.",
            },
          ],
        },
      ],
    },
    // Your Data Protection Rights
    {
      title: "Your Data Protection Rights",
      content: [
        "Depending on your location, you may have the following rights regarding your Personal Data:",
        {
          subtitle: `${" "}`,
          items: [
            {
              subitem: "1. Right to Access:",
              description:
                "You have the right to request copies of your Personal Data.",
            },
            {
              subitem: "2. Right to Rectification:",
              description:
                "You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.",
            },
            {
              subitem: "3. Right to Erasure:",
              description:
                "You have the right to request that we erase your Personal Data, under certain conditions.",
            },
            {
              subitem: "4. Right to Restrict Processing:",
              description:
                "You have the right to request that we restrict the processing of your Personal Data, under certain conditions.",
            },
            {
              subitem: "5. Right to Object to Processing:",
              description:
                "You have the right to object to our processing of your Personal Data, under certain conditions.",
            },
            {
              subitem: "6. Right to Data Portability:",
              description:
                "You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.",
            },
          ],
        },
        "To exercise these rights, please contact us at support@theaijurist.com. We will respond to your request within a reasonable timeframe (typically around one week), subject to standard verification procedures and applicable legal limitations.",
      ],
    },
    // Cookies and Tracking Technologies
    {
      title: "Cookies and Tracking Technologies",
      content: [
        "Currently, The AI Jurist website and Application do not use cookies, web beacons, tracking pixels, or other tracking technologies, except for those inherently used by our third-party analytics provider (Google Analytics) as described in Section 3. We may update this section if our use of tracking technologies changes",
      ],
    },
    // International Data Transfers
    {
      title: "International Data Transfers",
      content: [
        "Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction. Specifically, using services like Microsoft Azure for hosting and OpenAI's API for processing means your data may be processed in countries outside of Pakistan. We rely on the security measures and data protection agreements provided by these third-party services as safeguards for these transfers. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.",
      ],
    },
    // Children's Privacy
    {
      title: "Children's Privacy",
      content: [
        "Our Services are not intended for use by individuals under the age of 18. We do not knowingly collect Personal Data from children under 18. If we become aware that we have collected Personal Data from a child under 18 without verification of parental consent, we take steps to remove that information from our servers.",
      ],
    },
    // Changes to This Privacy Policy
    {
      title: "Changes to This Privacy Policy",
      content: [
        `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date." You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page. For significant changes, we may also notify you via email or through an in-app notification.`,
      ],
    },
    // Contact Us
    {
      title: "Contact Us",
      content: [
        "If you have any questions about this Privacy Policy, please contact us at:",
        "support@theaijurist.com",
        "[Your Company Name] ",
        "[Your Company Address, Karachi, Pakistan]",
      ],
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-10 flex items-center px-4 py-2 shadow-sm cursor-pointer"
      >
        <ArrowLeft className="mr-2" />
        Go Back
      </Button>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Policy Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Privacy Policy for The Theaijurist
          </p>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-4xl mx-auto mb-16 text-gray-700">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 text-center">
            Introduction
          </h1>
          <p className="text-center">
            Welcome to The AI Jurist ("Company," "we," "us," or "our"). We are
            committed to protecting the privacy of our users ("User," "you," or
            "your"). This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our AI-powered legal
            assistant platform, including any associated software applications
            and websites (collectively, the "Services"). Please read this
            privacy policy carefully. If you do not agree with the terms of this
            privacy policy, please do not access the Services.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 md:p-10 max-w-4xl mx-auto">
          {sections.map((section, index) => (
            <div key={index} className="mb-12 last:mb-0">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
                {section.title}
              </h2>

              {section.content.map((content, i) => {
                if (typeof content === "string") {
                  return (
                    <p key={i} className="text-gray-700 mb-4">
                      {content}
                    </p>
                  );
                } else if (content.subtitle) {
                  return (
                    <div key={i} className="mb-6">
                      <h3 className="text-xl font-medium text-gray-900 mb-4">
                        {content.subtitle}
                      </h3>
                      {content.items && (
                        <ul className="list-none pl-6 space-y-3 text-gray-700">
                          {content.items.map((item, j) => (
                            <li key={j}>
                              {item.subitem && (
                                <span className="font-medium text-black">
                                  {item.subitem}
                                </span>
                              )}{" "}
                              <span>
                                {item.description
                                  ? item.description
                                  : String(item)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
