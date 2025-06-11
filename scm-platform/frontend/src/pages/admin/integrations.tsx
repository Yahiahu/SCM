import React, { useState } from "react";
import {
  Cloud,
  Code,
  Database,
  CreditCard,
  Truck,
  Mail,
  MessageSquare,
  Calendar,
  BarChart2,
  Lock,
  Globe,
  Server,
  Zap,
  CheckCircle,
  XCircle,
  Loader2,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Reuse background effect
const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

const ApiIntegrationPage: React.FC = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: "payment",
      name: "Payment Gateway",
      description: "Connect to Stripe, PayPal, or other payment processors",
      icon: <CreditCard className="h-5 w-5" />,
      connected: false,
      loading: false,
    },
    {
      id: "shipping",
      name: "Shipping Providers",
      description: "Integrate with FedEx, UPS, DHL, and other carriers",
      icon: <Truck className="h-5 w-5" />,
      connected: false,
      loading: false,
    },
    {
      id: "email",
      name: "Email Service",
      description: "Connect to SendGrid, Mailchimp, or other email providers",
      icon: <Mail className="h-5 w-5" />,
      connected: false,
      loading: false,
    },
    {
      id: "sms",
      name: "SMS Notifications",
      description: "Integrate with Twilio or other SMS gateway providers",
      icon: <MessageSquare className="h-5 w-5" />,
      connected: false,
      loading: false,
    },
    {
      id: "calendar",
      name: "Calendar Sync",
      description: "Connect with Google Calendar or Outlook Calendar",
      icon: <Calendar className="h-5 w-5" />,
      connected: false,
      loading: false,
    },
    {
      id: "analytics",
      name: "Analytics",
      description: "Integrate with Google Analytics or other analytics tools",
      icon: <BarChart2 className="h-5 w-5" />,
      connected: false,
      loading: false,
    },
    {
      id: "auth",
      name: "Authentication",
      description: "Connect with Auth0, Firebase Auth, or other providers",
      icon: <Lock className="h-5 w-5" />,
      connected: false,
      loading: false,
    },
    {
      id: "maps",
      name: "Maps & Geolocation",
      description: "Integrate with Google Maps or Mapbox services",
      icon: <Globe className="h-5 w-5" />,
      connected: false,
      loading: false,
    },
    {
      id: "storage",
      name: "Cloud Storage",
      description:
        "Connect to AWS S3, Google Cloud Storage, or other providers",
      icon: <Server className="h-5 w-5" />,
      connected: false,
      loading: false,
    },
    {
      id: "crm",
      name: "CRM Systems",
      description: "Integrate with Salesforce, HubSpot, or other CRM platforms",
      icon: <Database className="h-5 w-5" />,
      connected: false,
      loading: false,
    },
    {
      id: "erp",
      name: "ERP Systems",
      description: "Connect to SAP, Oracle, or other enterprise systems",
      icon: <Cloud className="h-5 w-5" />,
      connected: false,
      loading: false,
    },
    {
      id: "custom",
      name: "Custom API",
      description: "Connect to any REST or GraphQL API endpoint",
      icon: <Code className="h-5 w-5" />,
      connected: false,
      loading: false,
    },
  ]);

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleIntegration = async (id: string) => {
    setIntegrations(
      integrations.map((integration) =>
        integration.id === id ? { ...integration, loading: true } : integration
      )
    );

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIntegrations(
      integrations.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              connected: !integration.connected,
              loading: false,
            }
          : integration
      )
    );
  };

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "connected" && integration.connected) ||
      (activeTab === "available" && !integration.connected);

    const matchesSearch =
      searchTerm === "" ||
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.2)_1px,transparent_1px)] bg-[size:50px_50px] z-0"></div>

      <Navbar isLoggedIn={true} />

      <div className="p-8 pt-20 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-sky-50 rounded-xl shadow p-6">
              <h1 className="text-3xl font-bold text-blue-500">
                API Integrations
              </h1>
              <p className="text-blue-700 mt-1">
                Connect your application with external services and platforms
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Zap className="h-4 w-4 mr-2" />
                Quick Connect
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Updated to grid format */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Available
                </p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {integrations.length}
                </p>
                <div className="flex items-center text-sm text-blue-600 font-medium mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+5% MoM</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Cloud className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Connected</p>
                <p className="text-2xl font-semibold text-green-600 mt-1">
                  {integrations.filter((i) => i.connected).length}
                </p>
                <div className="flex items-center text-sm text-blue-600 font-medium mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12% YoY</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Available</p>
                <p className="text-2xl font-semibold text-yellow-600 mt-1">
                  {integrations.filter((i) => !i.connected).length}
                </p>
                <div className="flex items-center text-sm text-blue-600 font-medium mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+8% WoW</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <XCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex space-x-1 p-1 bg-gray-100/70 backdrop-blur-sm rounded-lg">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "all"
                  ? "bg-white/70 backdrop-blur-sm shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("connected")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "connected"
                  ? "bg-white/70 backdrop-blur-sm shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Connected
            </button>
            <button
              onClick={() => setActiveTab("available")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "available"
                  ? "bg-white/70 backdrop-blur-sm shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Available
            </button>
          </div>

          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
            />
            <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* API Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50 hover:border-blue-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 mr-3 rounded-lg bg-blue-50 text-blue-600">
                    {integration.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {integration.name}
                  </h3>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    integration.connected
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {integration.connected ? "Connected" : "Available"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                {integration.description}
              </p>
              <button
                onClick={() => handleIntegration(integration.id)}
                disabled={integration.loading}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  integration.connected
                    ? "bg-white/70 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-gray-50/70"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {integration.loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : integration.connected ? (
                  "Disconnect"
                ) : (
                  "Connect"
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Documentation Section */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            API Integration Documentation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200/50 rounded-lg hover:border-blue-200 transition-colors bg-white/50 backdrop-blur-sm">
              <div className="flex items-center mb-3">
                <div className="p-2 mr-3 rounded-lg bg-blue-50 text-blue-600">
                  <Code className="h-5 w-5" />
                </div>
                <h4 className="font-medium text-gray-900">Developer Guide</h4>
              </div>
              <p className="text-sm text-gray-600">
                Learn how to implement and customize API integrations in your
                application.
              </p>
            </div>
            <div className="p-4 border border-gray-200/50 rounded-lg hover:border-blue-200 transition-colors bg-white/50 backdrop-blur-sm">
              <div className="flex items-center mb-3">
                <div className="p-2 mr-3 rounded-lg bg-blue-50 text-blue-600">
                  <Lock className="h-5 w-5" />
                </div>
                <h4 className="font-medium text-gray-900">Authentication</h4>
              </div>
              <p className="text-sm text-gray-600">
                Understand our security protocols and how to authenticate your
                API calls.
              </p>
            </div>
            <div className="p-4 border border-gray-200/50 rounded-lg hover:border-blue-200 transition-colors bg-white/50 backdrop-blur-sm">
              <div className="flex items-center mb-3">
                <div className="p-2 mr-3 rounded-lg bg-blue-50 text-blue-600">
                  <Zap className="h-5 w-5" />
                </div>
                <h4 className="font-medium text-gray-900">Troubleshooting</h4>
              </div>
              <p className="text-sm text-gray-600">
                Solutions for common issues and how to get support when you need
                it.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ApiIntegrationPage;
