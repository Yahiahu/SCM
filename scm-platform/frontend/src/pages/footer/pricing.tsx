import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Star,
  Zap,
  Crown,
  Shield,
  Users,
  BarChart3,
  Headphones,
  Globe,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Switch from "@radix-ui/react-switch";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";

// Main Pricing Page Component
const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for individuals and small teams getting started",
      monthlyPrice: 9,
      annualPrice: 7,
      icon: Sparkles,
      color: "from-sky-400 to-sky-600",
      features: [
        { text: "Up to 5 projects", included: true },
        { text: "10GB storage", included: true },
        { text: "Basic analytics", included: true },
        { text: "Email support", included: true },
        { text: "Advanced integrations", included: false },
        { text: "Priority support", included: false },
        { text: "Custom branding", included: false },
      ],
      popular: false,
    },
    {
      id: "professional",
      name: "Professional",
      description: "Ideal for growing businesses and professional teams",
      monthlyPrice: 29,
      annualPrice: 24,
      icon: Crown,
      color: "from-blue-500 to-blue-700",
      features: [
        { text: "Unlimited projects", included: true },
        { text: "100GB storage", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Priority email support", included: true },
        { text: "Advanced integrations", included: true },
        { text: "Team collaboration", included: true },
        { text: "Custom branding", included: false },
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Comprehensive solution for large organizations",
      monthlyPrice: 99,
      annualPrice: 79,
      icon: Shield,
      color: "from-sky-600 to-blue-800",
      features: [
        { text: "Unlimited everything", included: true },
        { text: "Unlimited storage", included: true },
        { text: "Enterprise analytics", included: true },
        { text: "24/7 phone support", included: true },
        { text: "All integrations", included: true },
        { text: "Advanced security", included: true },
        { text: "Custom branding", included: true },
      ],
      popular: false,
    },
  ];

  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into your data with real-time reporting",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work seamlessly with your team members",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security for your sensitive data",
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Lightning-fast performance worldwide",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock assistance when you need it",
    },
    {
      icon: Zap,
      title: "API Access",
      description: "Full API access for custom integrations",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <Navbar isLoggedIn={true} />

      {/* Hero Section */}
      <div className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="inline-flex items-center space-x-2 bg-sky-100 text-sky-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>Simple, Transparent Pricing</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-sky-900 via-blue-900 to-sky-900 bg-clip-text text-transparent mb-6">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Start free, scale as you grow. No hidden fees, no surprises.
              Cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span
                className={`text-sm font-medium ${
                  !isAnnual ? "text-sky-600" : "text-gray-500"
                }`}
              >
                Monthly
              </span>
              <Switch.Root
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-sky-500 transition-colors"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform data-[state=checked]:translate-x-5 translate-x-0.5" />
              </Switch.Root>
              <span
                className={`text-sm font-medium ${
                  isAnnual ? "text-sky-600" : "text-gray-500"
                }`}
              >
                Annual
                <span className="ml-1 bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full text-xs">
                  Save 20%
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const isHovered = hoveredPlan === plan.id;

            return (
              <div
                key={plan.id}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`relative bg-white rounded-3xl shadow-xl border transition-all duration-300 ${
                  plan.popular
                    ? "border-sky-200 scale-105 shadow-2xl"
                    : "border-gray-200 hover:border-sky-200 hover:shadow-2xl hover:scale-105"
                } ${isHovered ? "transform -translate-y-2" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="mb-8">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-bold text-gray-900">
                        ${price}
                      </span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    {isAnnual && (
                      <p className="text-sm text-sky-600 mt-1">
                        Billed annually (${price * 12}/year)
                      </p>
                    )}
                  </div>

                  <button
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all mb-8 ${
                      plan.popular
                        ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 shadow-lg"
                        : "bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-200"
                    }`}
                  >
                    {plan.popular ? "Start Free Trial" : "Get Started"}
                  </button>

                  <div className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            feature.included
                              ? "bg-sky-100 text-sky-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {feature.included ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            feature.included ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-sky-100 text-xl max-w-3xl mx-auto">
              Powerful features designed to help you build, grow, and scale your
              business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sky-100">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We're here to help.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Can I change my plan at any time?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing accordingly.",
              },
              {
                question: "Is there a free trial available?",
                answer:
                  "Yes, we offer a 14-day free trial for all paid plans. No credit card required to get started.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, PayPal, and wire transfers for enterprise customers.",
              },
              {
                question: "Do you offer refunds?",
                answer:
                  "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who trust SkyTech with their
            business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center space-x-2">
              <span>Start Free Trial</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="bg-white text-sky-600 px-8 py-4 rounded-xl font-semibold hover:bg-sky-50 transition-all border border-sky-200">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;
