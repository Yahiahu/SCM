import React, { useState, useEffect } from "react";
import {
  Shield,
  Eye,
  Lock,
  Users,
  Database,
  Globe,
  FileText,
  Clock,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronRight,
  Search,
} from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import * as Tabs from "@radix-ui/react-tabs";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";

// Privacy Policy Page Component
const PrivacyPolicyPage = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const sections = [
    {
      id: "overview",
      title: "Privacy Overview",
      icon: Eye,
      content: {
        summary:
          "Our commitment to protecting your personal information and privacy rights.",
        details: [
          {
            title: "Our Privacy Promise",
            text: "At SkyTech, we believe privacy is a fundamental right. We are committed to being transparent about how we collect, use, and protect your personal information. This privacy policy explains our practices in clear, understandable terms.",
          },
          {
            title: "What This Policy Covers",
            text: "This privacy policy applies to all SkyTech services, websites, and applications. It describes how we handle your personal information when you use our services, create an account, or interact with our platform.",
          },
          {
            title: "Regular Updates",
            text: "We regularly review and update this privacy policy to ensure it remains current with our practices and applicable laws. We will notify you of any significant changes and obtain your consent where required by law.",
          },
        ],
      },
    },
    {
      id: "data-collection",
      title: "Data Collection",
      icon: Database,
      content: {
        summary: "Information we collect and how we collect it.",
        details: [
          {
            title: "Information You Provide",
            text: "We collect information you voluntarily provide when creating an account, using our services, or contacting us. This includes your name, email address, phone number, and any content you create or share through our platform.",
          },
          {
            title: "Automatically Collected Information",
            text: "We automatically collect certain information about your device and usage patterns, including IP address, browser type, operating system, pages visited, and interaction data. This helps us improve our services and provide better user experiences.",
          },
          {
            title: "Third-Party Information",
            text: "We may receive information about you from third-party services you connect to our platform, such as social media accounts or integration partners. We only collect this information with your explicit consent.",
          },
        ],
      },
    },
    {
      id: "data-usage",
      title: "How We Use Your Data",
      icon: Globe,
      content: {
        summary: "The purposes for which we process your personal information.",
        details: [
          {
            title: "Service Provision",
            text: "We use your information to provide, maintain, and improve our services. This includes processing your requests, personalizing your experience, and enabling core functionality of our platform.",
          },
          {
            title: "Communication",
            text: "We may use your contact information to send you important service updates, security alerts, and respond to your inquiries. You can opt out of marketing communications at any time.",
          },
          {
            title: "Analytics and Improvement",
            text: "We analyze usage patterns and feedback to understand how our services are used and identify areas for improvement. This helps us develop new features and enhance existing ones.",
          },
        ],
      },
    },
    {
      id: "data-sharing",
      title: "Data Sharing",
      icon: Users,
      content: {
        summary: "When and how we share your information with others.",
        details: [
          {
            title: "Service Providers",
            text: "We may share your information with trusted third-party service providers who help us operate our business, such as cloud hosting, payment processing, and customer support. These providers are contractually obligated to protect your information.",
          },
          {
            title: "Legal Requirements",
            text: "We may disclose your information if required by law, court order, or government request. We will notify you of such requests unless prohibited by law or if notification would compromise an investigation.",
          },
          {
            title: "Business Transfers",
            text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction. We will provide notice before your information is transferred and becomes subject to a different privacy policy.",
          },
        ],
      },
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      content: {
        summary:
          "How we protect your information from unauthorized access and misuse.",
        details: [
          {
            title: "Technical Safeguards",
            text: "We implement industry-standard security measures including encryption, secure protocols, and access controls to protect your information. Our systems are regularly tested and updated to address emerging security threats.",
          },
          {
            title: "Administrative Safeguards",
            text: "Access to your personal information is restricted to authorized personnel who need it to perform their job functions. Our employees receive regular training on privacy and security practices.",
          },
          {
            title: "Physical Safeguards",
            text: "Our data centers and offices have physical security measures in place, including restricted access, surveillance systems, and environmental controls to protect against unauthorized access and natural disasters.",
          },
        ],
      },
    },
    {
      id: "your-rights",
      title: "Your Privacy Rights",
      icon: CheckCircle,
      content: {
        summary:
          "Your rights regarding your personal information and how to exercise them.",
        details: [
          {
            title: "Access and Portability",
            text: "You have the right to access your personal information and request a copy in a structured, machine-readable format. You can download your data through your account settings or by contacting our support team.",
          },
          {
            title: "Correction and Deletion",
            text: "You can update or correct your personal information through your account settings. You also have the right to request deletion of your personal information, subject to certain legal and operational requirements.",
          },
          {
            title: "Communication Preferences",
            text: "You can control how we communicate with you by updating your preferences in your account settings. You can opt out of marketing communications while still receiving important service notifications.",
          },
        ],
      },
    },
  ];

  const privacyHighlights = [
    {
      icon: Shield,
      title: "GDPR Compliant",
      description: "Full compliance with European privacy regulations",
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "Your data is encrypted in transit and at rest",
    },
    {
      icon: Eye,
      title: "Transparent Practices",
      description: "Clear policies with no hidden data collection",
    },
    {
      icon: Users,
      title: "No Data Selling",
      description: "We never sell your personal information to third parties",
    },
  ];

  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.content.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <Navbar isLoggedIn={true} />

      {/* Hero Section */}
      <div className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="inline-flex items-center space-x-2 bg-sky-100 text-sky-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>Privacy Policy</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-sky-900 via-blue-900 to-sky-900 bg-clip-text text-transparent mb-6">
              Your Privacy Matters
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              We're committed to protecting your privacy and being transparent
              about how we handle your data. Learn about our privacy practices
              and your rights.
            </p>

            <div className="flex items-center space-x-2 bg-sky-100 text-sky-800 px-4 py-2 rounded-lg text-sm font-medium inline-flex">
              <Clock className="w-4 h-4" />
              <span>Last updated: June 14, 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {privacyHighlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-sky-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 text-sm">{highlight.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="bg-white rounded-2xl shadow-lg border border-sky-100 p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search policies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-2xl shadow-lg border border-sky-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-sky-600" />
                  Quick Navigation
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          activeSection === section.id
                            ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
                            : "text-gray-700 hover:bg-sky-50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium text-sm">
                          {section.title}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-sky-100 overflow-hidden">
              {filteredSections.map((section) => (
                <div
                  key={section.id}
                  className={`${
                    activeSection === section.id ? "block" : "hidden"
                  }`}
                >
                  <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-8 text-white">
                    <div className="flex items-center space-x-3 mb-2">
                      <section.icon className="w-8 h-8" />
                      <h2 className="text-3xl font-bold">{section.title}</h2>
                    </div>
                    <p className="text-sky-100 text-lg">
                      {section.content.summary}
                    </p>
                  </div>

                  <div className="p-8">
                    <Accordion.Root
                      type="single"
                      collapsible
                      className="space-y-4"
                    >
                      {section.content.details.map((detail, index) => (
                        <Accordion.Item
                          key={index}
                          value={`item-${index}`}
                          className="border border-sky-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <Accordion.Header>
                            <Accordion.Trigger className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-sky-50 transition-colors group">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {detail.title}
                              </h3>
                              <ChevronDown className="w-5 h-5 text-sky-500 group-data-[state=open]:rotate-180 transition-transform" />
                            </Accordion.Trigger>
                          </Accordion.Header>
                          <Accordion.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                            <div className="px-6 pb-6 pt-2">
                              <p className="text-gray-700 leading-relaxed">
                                {detail.text}
                              </p>
                            </div>
                          </Accordion.Content>
                        </Accordion.Item>
                      ))}
                    </Accordion.Root>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Mail className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">
                Privacy Questions?
              </h2>
            </div>
            <p className="text-sky-100 text-lg mb-8 max-w-2xl mx-auto">
              Our privacy team is here to help answer any questions about our
              data practices, your rights, or how to exercise them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-sky-600 px-8 py-4 rounded-xl font-semibold hover:bg-sky-50 transition-all shadow-lg flex items-center justify-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Email Privacy Team</span>
              </button>
              <button className="bg-sky-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-sky-700 transition-all border border-sky-400 flex items-center justify-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Data Request Form</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Additional Resources
            </h2>
            <p className="text-gray-600 text-lg">
              Learn more about privacy and data protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Security Practices",
                description:
                  "Learn about our comprehensive security measures and certifications.",
                link: "#",
              },
              {
                icon: Globe,
                title: "Cookie Policy",
                description:
                  "Understand how we use cookies and similar tracking technologies.",
                link: "#",
              },
              {
                icon: FileText,
                title: "Terms of Service",
                description:
                  "Review our complete terms and conditions for using our services.",
                link: "#",
              },
            ].map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-sky-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-200 transition-colors">
                    <Icon className="w-6 h-6 text-sky-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <button className="flex items-center space-x-2 text-sky-600 hover:text-sky-700 font-medium">
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
