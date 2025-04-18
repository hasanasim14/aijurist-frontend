"use client";

import BackButton from "@/components/utility/BackButtton";
import Footer from "@/components/utility/Footer";

const SafeHTML = ({ html }: { html: string }) => {
  const styledHtml = html.replace(
    /<a /g,
    '<a class="text-blue-600 hover:text-blue-800 hover:underline" '
  );
  return <span dangerouslySetInnerHTML={{ __html: styledHtml }} />;
};

const TermsofUse = () => {
  const sections = [
    // Introduction and Acceptance
    {
      title: "Introduction and Acceptance",
      content: [
        `Welcome to The AI Jurist ("Company," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of our AI-powered legal assistant platform, ong with any associated software applications and websites (collectively, the "Services"). These Terms constitute a legally binding agreement between you ("User," "you," or "your") and [Your Company Name/Owners of Theaijurist].`,
        `By creating an account, accessing, or using the Services, you acknowledge that you have read, understood, and agree to be bound by these Terms, including our Privacy Policy (incorporated herein by reference) and any other policies or guidelines we make available. If you are using the Services on behalf of an entity or organization, you represent and warrant that you have the authority to bind that entity to these Terms, and "you" and "your" will refer to that entity. `,
      ],
    },
    // Definitions
    {
      title: "Definitions ",
      content: [
        {
          subtitle: " ",
          items: [
            {
              subitem: "1. Application:",
              description:
                " Refers to the AI-powered legal assistant platform provided by the Company.",
            },
            {
              subitem: "2. Content:",
              description:
                "Refers to any case law, summaries, documentation, drafts, text, or other information provided by or generated through the Application, including Output.",
            },
            {
              subitem: "3. LLM:",
              description:
                "Large Language Model, a type of artificial intelligence used by the Application.",
            },
            {
              subitem: "4. Output:",
              description:
                "Refers to the content generated by the AI components of the Services in response to User input (e.g., summaries, drafted documents, research answers).",
            },
            {
              subitem: "5. Query:",
              description:
                "Any question, instruction, prompt, or request submitted by the User to the Application.",
            },
            {
              subitem: "6. Services:",
              description: "As defined in Section 1.",
            },
            {
              subitem: "7. Subscription Plan:",
              description:
                "Refers to the specific plan (e.g., Free Trial, Basic, Enterprise, Pay-as-you-go) governing your access level, features, and usage limits",
            },
            {
              subitem: "8. User:",
              description: "Any individual or entity using the Application.",
            },
            {
              subitem: "9. User Content:",
              description:
                "Any content, data, or information provided by the User to the Services, including uploaded files, queries, and feedback.",
            },
          ],
        },
      ],
    },
    // Eligibility and Account Registration
    {
      title: "Eligibility and Account Registration",
      content: [
        {
          subtitle: " ",
          items: [
            {
              subitem: "1. Eligibility:",
              description:
                "The Services are intended for professional use by legal practitioners, law firms, and related professionals. By using the Services, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into a binding agreement.",
            },
            {
              subitem: "2. Account Creation:",
              description:
                "To access most features of the Services, you must register for an account. You agree to: (a) provide accurate, current, and complete information during ; (b)  the security of your password and accept all risks of unauthorized access; (c) maintain and promptly update your account information; (d) protect the One-Time Password (OTP) used during signup and notify us immediately of any unauthorized use of your account or any other breach of security.",
            },
          ],
        },
      ],
    },
    // License Grant and Restrictions
    {
      title: "License Grant and Restrictions",
      content: [
        "Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Services to:",
        {
          subtitle: "1. License:",
          items: [
            {
              subitem: " ",
              description:
                "Subject to your compliance with these Terms, the Company grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license access and use the Services for your internal professional purposes according to your subscribed plan.",
            },
          ],
        },
        {
          subtitle: "2. Restrictions:",
          items: [
            {
              subitem: " ",
              description: "You agree not to, and will not permit others to:",
            },
            {
              subitem: "2.1.",
              description:
                "Use the Services for any illegal, unethical, or unauthorized purpose.",
            },
            {
              subitem: "2.2.",
              description:
                "Reverse engineer, decompile, disassemble, or attempt to discover the source code or underlying components (models, algorithms, systems) of the Services.",
            },
            {
              subitem: "2.3.",
              description:
                "Modify, copy, lease, sell, distribute, or create derivative works based on the Services.",
            },
            {
              subitem: "2.4.",
              description:
                "Interfere with, disrupt, or circumvent any security measures, rate limits, or restrictions of the Services.",
            },
            {
              subitem: "2.5.",
              description:
                "Use automated means (scraping, data mining) to extract data or Output from the Services.",
            },
            {
              subitem: "2.6.",
              description:
                "Represent Output as human-generated when it is not.",
            },
            {
              subitem: "2.7.",
              description:
                "Upload malicious code, illegal content, or content that violates the rights of others (including intellectual property rights).",
            },
            {
              subitem: "2.8.",
              description:
                "Submit queries, feedback, or content that is discriminatory, hateful, harassing, defamatory, obscene, promotes violence or illegal acts, or violates our Usage Policies.",
            },
            {
              subitem: "2.9.",
              description:
                "Share your login credentials or allow unauthorized access to your account.",
            },
            {
              subitem: "2.10.",
              description:
                "Use the Services in a way that infringes, misappropriates, or violates anyone’s rights.",
            },
            {
              subitem: "2.11.",
              description:
                "Neglect your individual responsibility for data security, including compliance with organizational policies.",
            },
          ],
        },
      ],
    },
    // Subscription Plans, Payment, and Usage Limits
    {
      title: "Subscription Plans, Payment, and Usage Limits ",
      content: [
        {
          subtitle: " ",
          items: [
            {
              subitem: "1. Subscription Plans:",
              description:
                "We offer various Subscription Plans with different features and usage limits (e.g., based on the number of Queries allowed per month). Details of current plans and pricing are available on our website or upon request.",
            },
          ],
        },
        {
          subtitle: " ",
          items: [
            {
              subitem: "2. Payment:",
              description:
                "You agree to pay all fees associated with your chosen Subscription Plan. Payments are currently processed via bank transfer as per invoice instructions. We reserve the right to introduce other payment methods and processors. Fees are typically billed in advance on a recurring basis (e.g., monthly, annually) unless otherwise (e.g., Pay-as-you-go). All fees are non-refundable except as expressly stated in our Refund Policy or required by law.",
            },
          ],
        },
        {
          subtitle: " ",
          items: [
            {
              subitem: "3. Metered Usage & Limits:",
              description:
                "Your Subscription Plan includes specific usage limits (e.g., a maximum number of Queries per billing cycle). You can monitor your usage via your user dashboard. If your usage exceeds the limits associated with your plan, we reserve the right to: (a) suspend your account access, or (b) charge you for the excess  on a pay-as-you-go basis at our then-current rates, or (c) require you to upgrade your plan. We will notify you if such actions are taken due to exceeding limits.",
            },
          ],
        },
        {
          subtitle: " ",
          items: [
            {
              subitem: "4. Changes:",
              description:
                " We may change our Subscription Plans and pricing from time to time. We will provide you with at least 30 days' notice of any price increases, which will take effect on your next renewal date, allowing you to cancel if you do not agree.",
            },
          ],
        },
      ],
    },
    // User Content and Feedback
    {
      title: "User Content and Feedback",
      content: [
        {
          subtitle: " ",
          items: [
            {
              subitem: "1. Ownership:",
              description:
                "You retain ownership of your User Content (uploaded files, queries).",
            },
          ],
        },
        {
          subtitle: " ",
          items: [
            {
              subitem: "2. License to Us:",
              description:
                "You grant the Company a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, process, and display your User Content solely for the purpose of providing, maintaining, and improving the Services for you.",
            },
          ],
        },
        {
          subtitle: " ",
          items: [
            {
              subitem: "3. Feedback",
              description: `If you provide feedback, suggestions, or comments ("Feedback"), you grant the Company a worldwide, perpetual, irrevocable, royalty-free license to use and incorporate such Feedback into the Services or for other business purposes (including marketing, on an anonymized basis) without any obligation or compensation to you.`,
            },
          ],
        },
      ],
    },
    // Intellectual Property Rights
    {
      title: "Intellectual Property Rights",
      content: [
        "Except for the limited license granted in Section 4, the Company and its licensors retain all right, title, and interest in and to the Services, including all related intellectual property rights (trademarks, logos, software, content generated by us). The Theaijurist name and logos are trademarks of the Company. You may not use these trademarks without our prior written consent, except for fair use references that are accurate and non-misleading.",
      ],
    },
    // Third-Party Services and AI Disclaimers
    {
      title: "Third-Party Services and AI Disclaimers",
      content: [
        {
          subtitle: "1. Third-Party Reliance:",
          items: [
            {
              subitem: " ",
              description:
                "The Services may integrate with or rely on third-party services (e.g., cloud hosting like Microsoft Azure, AI providers like OpenAI, analytics like Google Analytics). Your use of the Services constitutes acknowledgment that we are not responsible for the performance, availability, or data handling practices of these third parties. Their terms and privacy policies may apply. ",
            },
          ],
        },
        {
          subtitle: "2. AI Disclaimer (LLM Usage):",
          items: [
            {
              subitem: " ",
              description:
                "The Services utilize LLMs. You understand and agree that:",
            },
            {
              subitem: "2.1. Not Professional Advice:",
              description:
                " The Output is generated for informational purposes only and <b>DOES NOT CONSTITUTE LEGAL ADVICE</b> or a substitute for consulting a qualified legal professional.",
            },
            {
              subitem: "2.2. Accuracy Not Guaranteed:",
              description:
                "Due to the probabilistic nature of AI, Output may not always be accurate, complete, or up-to-date. It may contain errors or omissions, or reflect biases present in training data. Output may not accurately reflect real people, places, or facts.",
            },
            {
              subitem: "2.3. User Responsibility:",
              description:
                "You are solely responsible for evaluating the accuracy, appropriateness, and applicability of any Output for your specific use case.<b> You must independently verify all information and Output before relying on it or using it in any professional capacity.</b> Use human review as appropriate.",
            },
            {
              subitem: "2.4. No Liability:",
              description:
                "The Company disclaims all liability for any actions taken or not taken based on the Output provided by the Services. Use of the AI features is entirely at your own risk.",
            },
          ],
        },
      ],
    },
    // Disclaimer of Warranties
    {
      title: "Disclaimer of Warranties",
      content: [
        `THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. THE COMPANY DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS, NOR DOES IT WARRANT THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY CONTENT OR OUTPUT OBTAINED THROUGH THE SERVICES. YOUR USE OF THE SERVICES IS AT YOUR SOLE RISK.`,
      ],
    },
    // Limitation of Liability
    {
      title: "Limitation of Liability",
      content: [
        "TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE COMPANY, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE SERVICES, WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE, EVEN IF THE COMPANY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
        "IN NO EVENT SHALL THE COMPANY'S TOTAL AGGREGATE LIABILITY TO YOU FOR ALL DAMAGES, LOSSES, OR CAUSES OF ACTION ARISING OUT OF OR RELATING TO THESE TERMS OR YOUR USE OF THE SERVICES EXCEED THE AMOUNT YOU PAID TO THE COMPANY, IF ANY, IN THE SIX (6) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE LIABILITY, OR ONE HUNDRED U.S. DOLLARS (USD $100), WHICHEVER IS GREATER.",
      ],
    },
    // Indemnification
    {
      title: "Indemnification",
      content: [
        "You agree to defend, indemnify, and hold harmless the Company, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Services, including, but not limited to, your User Content, any use of the Service's Content or Output other than as expressly authorized in these Terms, or your reliance on any Output generated by the Services.",
      ],
    },
    // Termination and Suspension
    {
      title: "Termination and Suspension",
      content: [
        {
          subtitle: "1. Termination by You:",
          items: [
            {
              subitem: " ",
              description:
                "You can cancel your paid subscription at any time through your account settings or by contacting us. Cancellation will be effective at the end of your current billing period, and you will retain access until then. Payments are non-refundable as per our Refund Policy.",
            },
          ],
        },
        {
          subtitle: "2. Suspension/Termination by Us:",
          items: [
            {
              subitem: " ",
              description:
                "We reserve the right to suspend or terminate your account and access to the Services, with or without notice, if:",
            },
            {
              subitem: "2.1.",
              description: "You breach these Terms or associated policies.",
            },
            {
              subitem: "2.2.",
              description: "You fail to pay applicable fees when due.",
            },
            {
              subitem: "2.3.",
              description:
                "Your usage exceeds the limits of your Subscription Plan (subject to Section 5).",
            },
            {
              subitem: "2.4.",
              description:
                "You misuse the Services in a way that is harmful to us, other users, or third parties.",
            },
            {
              subitem: "2.5.",
              description: "Required by law or due to security concerns.",
            },
          ],
        },
        {
          subtitle: "3. Effect of Termination:",
          items: [
            {
              subitem: " ",
              description:
                "Upon termination, your right to use the Services ceases immediately. We may delete your account and associated data, subject to our data retention practices outlined in the Privacy Policy. Sections 6 (Feedback license), 7, 8, 9, 10, 11, 13, 16, and 17 will survive termination.",
            },
          ],
        },
        {
          subtitle: "4. Service Discontinuation:",
          items: [
            {
              subitem: " ",
              description:
                "We reserve the right to modify or discontinue the Services (or any part thereof) at any time, temporarily or permanently. We will provide advance notice where feasible, especially for discontinuation of major services. We are not liable for any modification, suspension, or discontinuation, except potentially adjusting subscription fees as appropriate for paid plans if discontinuation occurs mid-cycle.",
            },
          ],
        },
      ],
    },
    // Governing Law and Dispute Resolution
    {
      title: "Governing Law and Dispute Resolution",
      content: [
        "These Terms shall be governed by and construed in accordance with the laws of Pakistan, with specific reference to the jurisdiction of Karachi, the principal place of operation for The AI Jurist, without regard to its conflict of law principles. Any dispute, controversy, or claim arising out of or relating to these Terms or the breach, termination, enforcement, interpretation, or validity thereof, including the determination of the scope or applicability of this agreement to arbitrate, shall be determined by mandatory arbitration in Karachi, Pakistan, in accordance with the arbitration rules then in effect within that jurisdiction.",
      ],
    },
    // Service Modifications and Interruptions
    {
      title: "Service Modifications and Interruptions",
      content: [
        `We reserve the right to modify, suspend, or discontinue the Services or any features at any time. While we strive for high availability, the Services are provided on a "best effort" basis and may be subject to interruptions due to maintenance, updates, system failures, third party service disruptions (including hosting and AI providers), or unforeseen circumstances. We will attempt to provide notice of planned maintenance but are not obligated to do so. We disclaim liability for any loss or damage caused by service interruptions or downtime.`,
      ],
    },
    // Force Majeure
    {
      title: "Force Majeure",
      content: [
        "The Company shall not be liable for any failure or delay in performance of its obligations under these Terms resulting from causes beyond its reasonable control, including but not limited to acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, pandemics, strikes, or shortages of transportation facilities, fuel, energy, labor, materials, or failures of public or private telecommunications networks or third-party service providers (including hosting and AI API providers).",
      ],
    },
    // Entire Agreement
    {
      title: "Entire Agreement",
      content: [
        "These Terms, together with the Privacy Policy and any other policies or Service-specific terms referenced herein, constitute the entire agreement between you and the Company regarding the Services and supersede all prior or contemporaneous agreements, communications, and proposals (whether oral, written, or electronic) between you and the Company.",
      ],
    },
    // Changes to Terms
    {
      title: "Changes to Terms",
      content: [
        "We reserve the right, in our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide reasonable notice (e.g., via email or in-app notification) prior to the new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Services after those revisions become effective, you agree to be bound by the revised terms.",
      ],
    },
    // Contact Information
    {
      title: "Contact Information",
      content: [
        {
          subtitle: " ",
          items: [
            {
              subitem: " ",
              description:
                "If you have any questions about these Terms, please contact us at:",
            },
            {
              subitem: " ",
              description:
                "<a href='mailto:support@theaijurist.com'>support@theaijurist.com</a>",
            },
            {
              subitem: " ",
              description: "[Your Company Name]",
            },
            {
              subitem: " ",
              description: "Your Company Address, Karachi, Pakistan]",
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BackButton />
        {/* Policy Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-m text-gray-600 font-bold mx-16 mt-10">
            PLEASE READ THESE TERMS OF SERVICE CAREFULLY. BY ACCESSING OR USING
            THE SERVICES, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT
            AGREE TO ALL OF THESE TERMS, DO NOT ACCESS OR USE THE SERVICES.
          </p>
        </div>

        {/* Introduction */}

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
                                {typeof item.description === "string" &&
                                (item.description.includes("<a ") ||
                                  item.description.includes("<b>")) ? (
                                  <SafeHTML html={item.description} />
                                ) : item.description ? (
                                  item.description
                                ) : (
                                  String(item)
                                )}
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

export default TermsofUse;
