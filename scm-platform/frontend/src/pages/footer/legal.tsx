import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Scale,
  Shield,
  FileText,
  Users,
  Eye,
  Lock,
  AlertTriangle,
} from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";

// Main Legal Page Component
const LegalPage = () => {
  const [activeSection, setActiveSection] = useState("terms");

  const legalSections = [
    {
      id: "terms",
      title: "Terms of Service",
      icon: FileText,
      content: [
        {
          title: "Acceptance of Terms",
          text: "By accessing and using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and our company.",
        },
        {
          title: "User Responsibilities",
          text: "Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account. You agree to notify us immediately of any unauthorized use of your account.",
        },
        {
          title: "Service Availability",
          text: "While we strive to maintain continuous service availability, we do not guarantee uninterrupted access. Scheduled maintenance and unforeseen technical issues may temporarily affect service availability.",
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: Shield,
      content: [
        {
          title: "Data Collection",
          text: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include personal information like your name, email address, and payment information.",
        },
        {
          title: "Data Usage",
          text: "We use your information to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and promotional offers.",
        },
        {
          title: "Data Protection",
          text: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
        },
      ],
    },
    {
      id: "cookies",
      title: "Cookie Policy",
      icon: Eye,
      content: [
        {
          title: "What Are Cookies",
          text: "Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.",
        },
        {
          title: "Types of Cookies",
          text: "We use essential cookies for basic website functionality, analytics cookies to understand user behavior, and preference cookies to remember your settings and choices.",
        },
        {
          title: "Cookie Management",
          text: "You can control and manage cookies through your browser settings. However, disabling certain cookies may affect the functionality of our website and your user experience.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <Navbar isLoggedIn={true} />

      {/* Hero Section */}
      <div className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-flex items-center space-x-2 bg-sky-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <AlertTriangle className="w-4 h-4" />
              <span>Legal Information</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-900 via-sky-800 to-blue-700 bg-clip-text text-transparent mb-6">
              Legal Documentation
            </h1>
            <p className="text-xl text-sky-800 max-w-3xl mx-auto leading-relaxed">
              Comprehensive legal policies designed to protect your rights and
              ensure transparency in our business practices.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-sky-200/50 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Scale className="w-5 h-5 mr-2 text-blue-600" />
                Quick Navigation
              </h3>
              <nav className="space-y-2">
                {legalSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeSection === section.id
                          ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg"
                          : "text-sky-900 hover:bg-sky-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-sky-200/50 overflow-hidden">
              {legalSections.map((section) => (
                <div
                  key={section.id}
                  className={`${
                    activeSection === section.id ? "block" : "hidden"
                  }`}
                >
                  <div className="bg-gradient-to-r from-sky-600 to-blue-600 p-8 text-white">
                    <div className="flex items-center space-x-3 mb-2">
                      <section.icon className="w-8 h-8" />
                      <h2 className="text-3xl font-bold">{section.title}</h2>
                    </div>
                    <p className="text-sky-200">
                      Last updated: {new Date().toLocaleDateString()}
                    </p>
                  </div>

                  <div className="p-8">
                    <Accordion.Root
                      type="single"
                      collapsible
                      className="space-y-4"
                    >
                      {section.content.map((item, index) => (
                        <Accordion.Item
                          key={index}
                          value={`item-${index}`}
                          className="border border-sky-200 rounded-xl overflow-hidden"
                        >
                          <Accordion.Header>
                            <Accordion.Trigger className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-sky-50 transition-colors group">
                              <h3 className="text-lg font-semibold text-blue-900">
                                {item.title}
                              </h3>
                              <ChevronDown className="w-5 h-5 text-sky-500 group-data-[state=open]:rotate-180 transition-transform" />
                            </Accordion.Trigger>
                          </Accordion.Header>
                          <Accordion.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                            <div className="px-6 pb-6 pt-2">
                              <p className="text-sky-800 leading-relaxed">
                                {item.text}
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

            {/* Contact Section */}
            <div className="mt-8 bg-gradient-to-r from-sky-600 to-blue-600 rounded-2xl p-8 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6" />
                <h3 className="text-2xl font-bold">
                  Questions About Our Policies?
                </h3>
              </div>
              <p className="text-sky-200 mb-6">
                Our legal team is here to help clarify any questions you may
                have about our terms, privacy practices, or cookie usage.
              </p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-sky-100 transition-colors">
                Contact Legal Team
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LegalPage;
