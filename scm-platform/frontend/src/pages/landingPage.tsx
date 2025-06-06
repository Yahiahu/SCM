"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FaTruck,
  FaChartLine,
  FaCloud,
  FaShieldAlt,
  FaArrowRight,
  FaBoxOpen,
  FaWarehouse,
  FaBarcode,
  FaMapMarkedAlt,
  FaClipboardCheck,
  FaExchangeAlt,
  FaPlane,
} from "react-icons/fa";
import { MdInventory, MdTimeline } from "react-icons/md";
import { GiFactory, GiDeliveryDrone } from "react-icons/gi";
import Footer from "../components/footer";
import Navbar from "../components/nb";
import screenshot from "../assets/Screenshot1.png";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import router from "next/router";
import Image from "next/image";

// Custom animations
const fadeIn = "animate-fade-in";
const slideInLeft = "animate-slide-in-left";
const slideInRight = "animate-slide-in-right";
const floatUp = "animate-float-up";
const scaleUp = "animate-scale-up";
const pulseGlow = "animate-pulse-glow";

const PlaneAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="absolute bottom-14 left-[-50px] z-10"
          style={{
            animation: `plane-animation 12s linear ${index * 4}s infinite`,
          }}
        >
          <FaPlane className="w-8 h-8 text-white" />
        </div>
      ))}
    </div>
  );
};

const useScrollAnimation = (threshold: number = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    if (ref.current) {
      const { top, bottom } = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (
        top < viewportHeight * (1 - threshold) &&
        bottom > viewportHeight * threshold
      ) {
        setIsVisible(true);
      }
    }
  }, [threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return [ref, isVisible] as const;
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  animationDelay: number;
  animationType?: string;
  badgeText?: string;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  animationDelay,
  animationType = "fade-in",
  badgeText,
}: FeatureCardProps) => {
  const [ref, isVisible] = useScrollAnimation(0.3);

  const animationClasses = {
    "fade-in": fadeIn,
    "slide-in-left": slideInLeft,
    "slide-in-right": slideInRight,
    "scale-up": scaleUp,
    "float-up": floatUp,
  }[animationType];

  return (
    <Card
      ref={ref}
      className={cn(
        "p-6 flex flex-col items-center text-center gap-4 transition-all hover:-translate-y-1 hover:shadow-lg relative border border-blue-200/50 bg-white/90 backdrop-blur-sm",
        isVisible ? animationClasses : "opacity-0",
        "hover:before:absolute hover:before:inset-0 hover:before:rounded-lg hover:before:bg-blue-100/30"
      )}
      style={{
        animationDelay: isVisible ? `${animationDelay}s` : "0s",
      }}
    >
      {badgeText && (
        <Badge className="absolute top-0 right-0 translate-x-1 -translate-y-1/2 bg-blue-600 text-white">
          {badgeText}
        </Badge>
      )}
      <div className="p-3 rounded-full bg-blue-100/80">
        <Icon className="w-6 h-6 text-blue-700" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Card>
  );
};

const SupplyChainNetwork = () => {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const nodes = [
    { icon: FaBoxOpen, label: "Suppliers" },
    { icon: GiFactory, label: "Manufacturing" },
    { icon: FaWarehouse, label: "Warehousing" },
    { icon: FaTruck, label: "Distribution" },
    { icon: GiDeliveryDrone, label: "Last Mile" },
  ];

  return (
    <div
      ref={ref}
      className={cn(
        "py-16 relative bg-gradient-to-t from-blue-500 via-blue-700/80 to-blue-500",
        isVisible ? fadeIn : "opacity-0"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          End-to-End Supply Chain Visibility
        </h2>

        <div className="relative">
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-300/70 to-transparent" />

          <div className="flex flex-col md:flex-row justify-between items-center relative">
            {nodes.map((node, index) => (
              <div
                key={node.label}
                className={cn(
                  "flex flex-col items-center p-4 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all z-10 mb-8 md:mb-0",
                  isVisible ? floatUp : "opacity-0",
                  "border border-blue-200/50"
                )}
                style={{
                  animationDelay: isVisible ? `${0.2 * index}s` : "0s",
                }}
              >
                <div className="p-3 mb-3 rounded-full bg-blue-100/80">
                  <node.icon className="w-6 h-6 text-blue-700" />
                </div>
                <span className="font-semibold text-blue-800">
                  {node.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p
          className={cn(
            "mt-12 text-lg text-center max-w-3xl mx-auto text-blue-100",
            isVisible ? fadeIn : "opacity-0"
          )}
          style={{
            animationDelay: isVisible ? "1.2s" : "0s",
          }}
        >
          Our platform provides real-time tracking across your entire supply
          network with predictive analytics and automated alerts.
        </p>
      </div>
    </div>
  );
};

const InventoryDashboardPreview = () => {
  const [ref, isVisible] = useScrollAnimation(0.3);

  const inventoryItems = [
    { id: "SKU-1001", name: "Widget A", quantity: 245, location: "WH-1-A12" },
    { id: "SKU-1002", name: "Gadget B", quantity: 189, location: "WH-2-B05" },
    {
      id: "SKU-1003",
      name: "Component C",
      quantity: 532,
      location: "WH-1-C22",
    },
    { id: "SKU-1004", name: "Part D", quantity: 76, location: "WH-3-D14" },
  ];

  return (
    <div
      ref={ref}
      className={cn(
        "py-16 relative bg-gradient-to-b from-blue-500 via-blue-300/70 to-blue-100",
        isVisible ? fadeIn : "opacity-0"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-center text-blue-800">
            Real-Time Inventory Management
          </h2>

          <Card className="p-6 w-full max-w-4xl mx-auto relative overflow-hidden border border-blue-200/50 bg-white/90 backdrop-blur-sm">
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-blue-800">
                Current Inventory
              </h3>
              <Badge className="bg-blue-600 text-white px-3 py-1 rounded-full">
                Live Updates
              </Badge>
            </div>

            <div className="flex flex-col gap-4">
              {inventoryItems.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 bg-blue-50/70 rounded-md border-l-4 border-blue-600 relative transition-all hover:translate-x-1 hover:shadow-md",
                    isVisible ? fadeIn : "opacity-0"
                  )}
                  style={{
                    animationDelay: isVisible ? `${0.1 * index}s` : "0s",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-bold text-blue-800">
                        {item.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {item.id} • {item.location}
                      </span>
                    </div>
                    <Badge
                      className={cn(
                        "px-3 py-1 rounded-full",
                        item.quantity < 100 ? "bg-red-500" : "bg-green-500"
                      )}
                    >
                      {item.quantity} units
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="mt-6 w-full border border-blue-300 hover:bg-blue-50"
                  size="lg"
                >
                  View Full Dashboard <FaArrowRight className="ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle className="text-blue-800">
                    Inventory Dashboard Preview
                  </DialogTitle>
                </DialogHeader>
                <div className="relative aspect-video rounded-md overflow-hidden border border-blue-200">
                  <Image
                    src={screenshot}
                    alt="Screenshot of website"
                    className="rounded-md border"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline">Close</Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push("/login")}
                  >
                    See Demo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
        </div>
      </div>
    </div>
  );
};

const SupplyChainMetrics = () => {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const metrics = [
    { value: "98.7%", label: "Order Accuracy", icon: FaClipboardCheck },
    { value: "24h", label: "Avg. Delivery Time", icon: FaTruck },
    { value: "35%", label: "Cost Reduction", icon: FaChartLine },
    { value: "99.9%", label: "System Uptime", icon: FaShieldAlt },
  ];

  return (
    <div
      ref={ref}
      className={cn(
        "py-16 relative bg-gradient-to-t from-blue-300 via-blue-500 to-blue-500",
        isVisible ? fadeIn : "opacity-0"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 text-center">
          <h2 className="text-3xl font-bold text-white">
            Supply Chain Performance Metrics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            {metrics.map((metric, index) => (
              <Card
                key={metric.label}
                className={cn(
                  "p-6 flex flex-col items-center gap-3 border border-blue-200/50 bg-white/90 backdrop-blur-sm",
                  isVisible ? floatUp : "opacity-0"
                )}
                style={{
                  animationDelay: isVisible ? `${0.2 * index}s` : "0s",
                }}
              >
                <div className="p-3 rounded-full bg-blue-100/80">
                  <metric.icon className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="text-3xl font-bold text-blue-700">
                  {metric.value}
                </h3>
                <p className="text-sm font-medium text-gray-700">
                  {metric.label}
                </p>
              </Card>
            ))}
          </div>

          <p
            className={cn(
              "text-sm text-center max-w-2xl mx-auto text-blue-100",
              isVisible ? fadeIn : "opacity-0"
            )}
            style={{
              animationDelay: isVisible ? "0.8s" : "0s",
            }}
          >
            *Based on average results from clients after 12 months of
            implementation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 text-gray-800 overflow-x-hidden">
      {/* Fixed Header */}
      <Navbar isLoggedIn={true} />

      {/* Hero Section */}
      <section
        className={cn(
          "pt-32 pb-20 min-h-screen flex items-center justify-center text-center relative overflow-hidden",
          "bg-gradient-to-b from-sky-50 via-blue-200 to-blue-500"
        )}
      >
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(140,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <PlaneAnimation />

        {/* Animated Factory to Warehouse Supply Path */}
        <div className="absolute bottom-0 left-0 right-0 h-24 z-10 pointer-events-none">
          {/* Factory */}
          <div className="absolute bottom-0 left-0 w-20 h-20 flex items-end justify-center z-20">
            <GiFactory className="w-24 h-24 text-blue-200" />
          </div>

          {/* Warehouse */}
          <div className="absolute bottom-0 right-0 w-20 h-20 flex items-end justify-center z-20">
            <FaWarehouse className="w-16 h-16 text-blue-200" />
          </div>

          {/* Animated Trucks */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute bottom-2 left-0"
              style={{
                animation: `truck-drive 14s linear ${i * 2}s infinite`,
              }}
            >
              <FaTruck className="w-8 h-8 text-white" />
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col gap-8">
            <h1
              className={cn(
                "text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-balance",
                floatUp,
                "opacity-0"
              )}
            >
              <span className="text-blue-500">Transform Your Supply Chain</span>
              <br />
              <span className="text-blue-400">With Intelligent Automation</span>
            </h1>

            <p
              className={cn(
                "text-xl md:text-2xl max-w-3xl mx-auto text-white",
                floatUp,
                "opacity-0"
              )}
              style={{ animationDelay: "0.3s" }}
            >
              Real-time visibility, predictive analytics, and seamless
              integration across your entire supply network.
            </p>

            <div
              className={cn("flex gap-4 justify-center", floatUp, "opacity-0")}
              style={{ animationDelay: "0.6s" }}
            >
              <Button
                onClick={() => router.push("/login")}
                className="bg-white text-blue-700 hover:bg-blue-100 group border border-blue-300"
                size="lg"
              >
                Get Started
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                onClick={() => router.push("/demo")}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-700/30 hover:text-white"
                size="lg"
              >
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Supply Chain Network */}
      <section>
        <SupplyChainNetwork />
      </section>

      {/* Inventory Dashboard Preview */}
      <InventoryDashboardPreview />

      {/* Key Features Section */}
      <section id="features">
        <div className="w-full py-16 text-center bg-gradient-to-b from-blue-100 via-blue-300 to-blue-500">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <h2 className="text-3xl font-bold text-blue-800">
              Supply Chain Solutions
            </h2>

            <p
              className={cn(
                "text-lg max-w-3xl mx-auto text-blue-700",
                fadeIn,
                "opacity-0"
              )}
              style={{ animationDelay: "0.2s" }}
            >
              Comprehensive tools designed specifically for modern supply chain
              challenges.
            </p>

            <div className="px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 w-full">
                <FeatureCard
                  icon={MdInventory}
                  title="Inventory Optimization"
                  description="Automated tracking and predictive restocking to maintain optimal inventory levels."
                  animationDelay={0.2}
                  animationType="slide-in-left"
                  badgeText="AI-Powered"
                />
                <FeatureCard
                  icon={FaWarehouse}
                  title="Warehouse Management"
                  description="Streamline operations with smart bin locations and picking routes."
                  animationDelay={0.3}
                  animationType="float-up"
                />
                <FeatureCard
                  icon={FaTruck}
                  title="Logistics Coordination"
                  description="Real-time tracking and route optimization for all shipments."
                  animationDelay={0.4}
                  animationType="slide-in-right"
                  badgeText="New"
                />
                <FeatureCard
                  icon={FaBarcode}
                  title="Asset Tracking"
                  description="End-to-end visibility from manufacturer to end customer."
                  animationDelay={0.5}
                  animationType="slide-in-left"
                />
                <FeatureCard
                  icon={FaExchangeAlt}
                  title="Supplier Integration"
                  description="Seamless connection with your supplier network for just-in-time delivery."
                  animationDelay={0.6}
                  animationType="float-up"
                />
                <FeatureCard
                  icon={MdTimeline}
                  title="Demand Forecasting"
                  description="Predict market trends and adjust production accordingly."
                  animationDelay={0.7}
                  animationType="slide-in-right"
                  badgeText="AI-Powered"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supply Chain Metrics */}
      <SupplyChainMetrics />

      {/* Problem/Solution Section */}
      <section id="solutions">
        <div className="w-full py-16 text-center bg-gradient-to-b from-blue-300 via-blue-100 to-white">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-blue-800">
                Supply Chain Pain Points We Solve
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
            <Card
              className={cn(
                "p-6 flex flex-col items-start gap-4 h-full text-left bg-white/90 backdrop-blur-sm border border-blue-200/50",
                slideInLeft,
                "opacity-0"
              )}
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="text-xl font-semibold text-blue-800">
                Common Challenges
              </h3>
              <ul className="flex flex-col gap-3">
                {[
                  "Inventory inaccuracies",
                  "Supplier communication gaps",
                  "Lack of real-time visibility",
                  "Inefficient warehouse operations",
                  "Demand forecasting errors",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card
              className={cn(
                "p-6 flex flex-col items-start gap-4 h-full text-left bg-white/90 backdrop-blur-sm border border-blue-200/50",
                slideInRight,
                "opacity-0"
              )}
              style={{ animationDelay: "0.4s" }}
            >
              <h3 className="text-xl font-semibold text-blue-800">
                Our Solutions
              </h3>
              <ul className="flex flex-col gap-3">
                {[
                  {
                    icon: FaClipboardCheck,
                    text: "Automated inventory tracking",
                  },
                  { icon: FaCloud, text: "Supplier collaboration portal" },
                  { icon: FaMapMarkedAlt, text: "Real-time GPS tracking" },
                  { icon: FaWarehouse, text: "Smart warehouse optimization" },
                  { icon: FaChartLine, text: "AI-powered demand forecasting" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-blue-100/80">
                      <item.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        id="contact"
        className="py-16 bg-gradient-to-b from-white via-blue to-sky-50"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 text-center">
          <h2 className="text-3xl font-bold text-blue-500">
            Ready to Optimize Your Supply Chain?
          </h2>
          <p
            className={cn("text-lg text-blue-500", fadeIn, "opacity-0")}
            style={{ animationDelay: "0.2s" }}
          >
            Speak with our supply chain experts to see how we can transform your
            operations.
          </p>

          <Card
            className={cn(
              "w-full p-6 md:p-8 hover:shadow-xl transition-all border border-blue-200/50 bg-white/90 backdrop-blur-sm",
              scaleUp,
              "opacity-0"
            )}
            style={{ animationDelay: "0.4s" }}
          >
            <form className="flex flex-col gap-5">
              <div className="space-y-2 text-left">
                <Label htmlFor="name" className="text-gray-700">
                  Your Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="border-blue-200 bg-white"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-gray-700">
                  Work Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@company.com"
                  className="border-blue-200 bg-white"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="company" className="text-gray-700">
                  Company Name
                </Label>
                <Input
                  id="company"
                  placeholder="Acme Logistics Inc."
                  className="border-blue-200 bg-white"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="message" className="text-gray-700">
                  How can we help you?
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your supply chain challenges..."
                  rows={4}
                  className="border-blue-200 bg-white"
                />
              </div>
              <Button
                type="button"
                size="lg"
                className="w-full group bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  const name = (
                    document.getElementById("name") as HTMLInputElement
                  )?.value;
                  const email = (
                    document.getElementById("email") as HTMLInputElement
                  )?.value;
                  const company = (
                    document.getElementById("company") as HTMLInputElement
                  )?.value;
                  const message = (
                    document.getElementById("message") as HTMLTextAreaElement
                  )?.value;

                  const mailto = `mailto:yahiahu24@gmail.com?subject=Contact from ${name} at ${company}&body=Name: ${name}%0D%0AEmail: ${email}%0D%0ACompany: ${company}%0D%0AMessage:%0D%0A${message}`;
                  window.location.href = mailto;
                }}
              >
                Get in Touch
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <Footer />

      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes float-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(37, 99, 235, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
          }
        }
        @keyframes truck-movement {
          0% {
            transform: translateX(-10px);
          }
          100% {
            transform: translateX(10px);
          }
        }
        @keyframes plane-animation {
          0% {
            transform: translateX(0vw) translateY(20px) rotate(0deg);
            opacity: 0;
          }
          10% {
            transform: translateX(10vw) translateY(-100px) rotate(-20deg);
            opacity: 0.6;
          }
          20% {
            transform: translateX(20vw) translateY(-170px) rotate(-30deg);
            opacity: 0.8;
          }
          40% {
            transform: translateX(40vw) translateY(-210px) rotate(-5deg);
            opacity: 1;
          }
          60% {
            transform: translateX(60vw) translateY(-210px) rotate(5deg);
            opacity: 1;
          }
          80% {
            transform: translateX(80vw) translateY(-170px) rotate(30deg);
            opacity: 0.8;
          }
          90% {
            transform: translateX(90vw) translateY(-100px) rotate(20deg);
            opacity: 0.6;
          }
          100% {
            transform: translateX(100vw) translateY(20px) rotate(10deg);
            opacity: 0;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }
        .animate-float-up {
          animation: float-up 0.8s ease-out forwards;
        }
        .animate-scale-up {
          animation: scale-up 0.8s ease-out forwards;
        }
        .animate-pulse-glow {
          animation: pulse-glow 1.5s infinite;
        }
        @keyframes truck-drive {
          0% {
            transform: translateX(-10%);
            opacity: 0;
          }
          50% {
            transform: translateX(50vw);
            opacity: 1;
          }
          100% {
            transform: translateX(100vw);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
