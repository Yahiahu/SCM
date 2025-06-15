import React, { useState, useEffect } from "react";
import {
  FileText,
  Calendar,
  Scale,
  Shield,
  Users,
  AlertCircle,
  CheckCircle,
  Eye,
  Lock,
  Globe,
} from "lucide-react";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState("");
  const [lastUpdated] = useState(new Date("2025-01-15"));

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>("[data-section]");
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (
          window.scrollY >= sectionTop - 200 &&
          window.scrollY < sectionTop + sectionHeight - 200
        ) {
          const id = section.getAttribute("data-section");
          if (id) current = id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tableOfContents = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      id: "services",
      title: "Description of Services",
      icon: <Globe className="w-4 h-4" />,
    },
    {
      id: "accounts",
      title: "User Accounts",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "conduct",
      title: "Acceptable Use",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "privacy",
      title: "Privacy & Data",
      icon: <Lock className="w-4 h-4" />,
    },
    {
      id: "intellectual",
      title: "Intellectual Property",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: <Scale className="w-4 h-4" />,
    },
    {
      id: "termination",
      title: "Termination",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    {
      id: "changes",
      title: "Changes to Terms",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: <Eye className="w-4 h-4" />,
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar isLoggedIn={true} />

      <main className="max-w-7xl mx-auto px-6 py-8 pt-20">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Terms of Service
              </h1>
              <p className="text-gray-600 mt-2">
                Please read these terms carefully before using our services
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Last Updated:
              </span>
              <span className="text-sm text-blue-700">
                {lastUpdated.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-700">
                Effective immediately upon posting
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Table of Contents
              </h2>
              <nav className="space-y-2">
                {tableOfContents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      activeSection === item.id
                        ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Section 1: Acceptance of Terms */}
            <section
              data-section="acceptance"
              className="bg-white rounded-xl shadow-md border border-blue-100 p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  1. Acceptance of Terms
                </h2>
              </div>
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  By accessing and using TSX's services, you accept and agree to
                  be bound by the terms and provision of this agreement. These
                  Terms of Service ("Terms") govern your use of our website,
                  applications, and services (collectively, the "Service").
                </p>
                <p className="mb-4">
                  If you do not agree to abide by the above, please do not use
                  this service. We reserve the right to update and change the
                  Terms of Service from time to time without notice.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <p className="text-blue-800 font-medium">
                    Important: By continuing to use our service after changes
                    are made, you agree to be bound by the revised Terms of
                    Service.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Description of Services */}
            <section
              data-section="services"
              className="bg-white rounded-xl shadow-md border border-blue-100 p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  2. Description of Services
                </h2>
              </div>
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  TSX provides a comprehensive web application platform that
                  includes but is not limited to:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Cloud-based application hosting and deployment</li>
                  <li>Database management and storage solutions</li>
                  <li>API development and integration tools</li>
                  <li>User authentication and authorization services</li>
                  <li>Analytics and monitoring capabilities</li>
                </ul>
                <p className="mb-4">
                  We reserve the right to modify, suspend, or discontinue any
                  part of our service at any time. We may also impose limits on
                  certain features or restrict access to parts of the service
                  without notice or liability.
                </p>
              </div>
            </section>

            {/* Section 3: User Accounts */}
            <section
              data-section="accounts"
              className="bg-white rounded-xl shadow-md border border-blue-100 p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  3. User Accounts
                </h2>
              </div>
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  When you create an account with us, you must provide
                  information that is accurate, complete, and current at all
                  times. You are responsible for safeguarding the password and
                  for maintaining the security of your account.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Your Responsibilities:
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Maintain accurate account information</li>
                      <li>• Keep your password secure</li>
                      <li>• Notify us of unauthorized access</li>
                      <li>• Use strong authentication methods</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">
                      Account Restrictions:
                    </h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• One account per person</li>
                      <li>• No sharing of account credentials</li>
                      <li>• No automated account creation</li>
                      <li>• Must be 13+ years old</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Acceptable Use */}
            <section
              data-section="conduct"
              className="bg-white rounded-xl shadow-md border border-blue-100 p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  4. Acceptable Use Policy
                </h2>
              </div>
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  You agree not to use the Service for any unlawful purpose or
                  in any way that could damage, disable, overburden, or impair
                  our servers or networks.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Prohibited Activities:
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Uploading malicious code or viruses</li>
                    <li>• Attempting to gain unauthorized access</li>
                    <li>• Harassing or threatening other users</li>
                    <li>• Distributing spam or unsolicited messages</li>
                    <li>• Violating intellectual property rights</li>
                    <li>• Engaging in fraudulent activities</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5: Privacy & Data */}
            <section
              data-section="privacy"
              className="bg-white rounded-xl shadow-md border border-blue-100 p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Lock className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  5. Privacy & Data Protection
                </h2>
              </div>
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Your privacy is important to us. Our Privacy Policy explains
                  how we collect, use, and protect your information when you use
                  our Service. By using our Service, you agree to the collection
                  and use of information in accordance with our Privacy Policy.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Data Commitments:
                  </h4>
                  <p className="text-sm text-blue-700">
                    We implement industry-standard security measures to protect
                    your data and will never sell your personal information to
                    third parties.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Intellectual Property */}
            <section
              data-section="intellectual"
              className="bg-white rounded-xl shadow-md border border-blue-100 p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  6. Intellectual Property Rights
                </h2>
              </div>
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  The Service and its original content, features, and
                  functionality are and will remain the exclusive property of
                  TSX and its licensors. The Service is protected by copyright,
                  trademark, and other laws.
                </p>
                <p className="mb-4">
                  You retain ownership of content you create using our Service,
                  while granting us a license to host, display, and distribute
                  your content as necessary to provide the Service.
                </p>
              </div>
            </section>

            {/* Section 7: Limitation of Liability */}
            <section
              data-section="liability"
              className="bg-white rounded-xl shadow-md border border-blue-100 p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Scale className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  7. Limitation of Liability
                </h2>
              </div>
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  In no event shall TSX, its directors, employees, partners,
                  agents, suppliers, or affiliates be liable for any indirect,
                  incidental, special, consequential, or punitive damages
                  arising out of your use of the Service.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Disclaimer:</strong> Our Service is provided on an
                    "AS IS" and "AS AVAILABLE" basis without warranties of any
                    kind.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8: Termination */}
            <section
              data-section="termination"
              className="bg-white rounded-xl shadow-md border border-blue-100 p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <AlertCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  8. Termination
                </h2>
              </div>
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  We may terminate or suspend your account and bar access to the
                  Service immediately, without prior notice or liability, under
                  our sole discretion, for any reason whatsoever, including but
                  not limited to a breach of the Terms.
                </p>
                <p className="mb-4">
                  You may terminate your account at any time by contacting us.
                  Upon termination, your right to use the Service will cease
                  immediately.
                </p>
              </div>
            </section>

            {/* Section 9: Changes to Terms */}
            <section
              data-section="changes"
              className="bg-white rounded-xl shadow-md border border-blue-100 p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  9. Changes to Terms
                </h2>
              </div>
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  We reserve the right to modify or replace these Terms at any
                  time. If a revision is material, we will provide at least 30
                  days notice prior to any new terms taking effect.
                </p>
                <p className="mb-4">
                  What constitutes a material change will be determined at our
                  sole discretion. Your continued use of the Service after any
                  such changes constitutes acceptance of the new Terms.
                </p>
              </div>
            </section>

            {/* Section 10: Contact Information */}
            <section
              data-section="contact"
              className="bg-white rounded-xl shadow-md border border-blue-100 p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Eye className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  10. Contact Information
                </h2>
              </div>
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Email Support:
                      </h4>
                      <p className="text-blue-700">legal@tsx.com</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Mailing Address:
                      </h4>
                      <p className="text-blue-700 text-sm">
                        TSX Legal Department
                        <br />
                        123 Tech Street
                        <br />
                        San Francisco, CA 94105
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
