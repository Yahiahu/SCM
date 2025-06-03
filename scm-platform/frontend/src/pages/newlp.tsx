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

// Custom animations
const fadeIn = "animate-fade-in";
const slideInLeft = "animate-slide-in-left";
const slideInRight = "animate-slide-in-right";
const floatUp = "animate-float-up";
const scaleUp = "animate-scale-up";
const pulseGlow = "animate-pulse-glow";

const GradientTransition = ({ progress }: { progress: number }) => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        background: `linear-gradient(to bottom, 
          rgba(30, 58, 138, ${1 - progress}) 0%, 
          rgba(30, 58, 138, ${0.8 - progress * 0.8}) 20%, 
          rgba(255, 255, 255, ${progress}) 100%)`,
        mixBlendMode: "multiply",
      }}
    />
  );
};

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
          <FaPlane className="w-8 h-8 text-white/80" />
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
        "p-6 flex flex-col items-center text-center gap-4 transition-all hover:-translate-y-1 hover:shadow-lg relative border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
        isVisible ? animationClasses : "opacity-0",
        "hover:before:absolute hover:before:inset-0 hover:before:rounded-lg hover:before:bg-gradient-to-br hover:before:from-blue-500/10 hover:before:to-purple-500/10"
      )}
      style={{
        animationDelay: isVisible ? `${animationDelay}s` : "0s",
      }}
    >
      {badgeText && (
        <Badge className="absolute top-0 right-0 translate-x-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          {badgeText}
        </Badge>
      )}
      <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </Card>
  );
};

const SupplyChainNetwork = ({ scrollProgress }: { scrollProgress: number }) => {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const nodes = [
    { icon: FaBoxOpen, label: "Suppliers" },
    { icon: GiFactory, label: "Manufacturing" },
    { icon: FaWarehouse, label: "Warehousing" },
    { icon: FaTruck, label: "Distribution" },
    { icon: GiDeliveryDrone, label: "Last Mile" },
  ];

  // Calculate background color based on scroll progress
  const bgOpacity = 1 - Math.min(scrollProgress * 1.5, 1);
  const bgColor = `rgba(255, 255, 255, ${1 - bgOpacity})`;

  return (
    <div
      ref={ref}
      className={cn("py-16 relative", isVisible ? fadeIn : "opacity-0")}
      style={{
        backgroundColor: bgColor,
        background: `linear-gradient(to bottom, 
          rgba(30, 58, 138, ${bgOpacity * 0.8}), 
          rgba(255, 255, 255, ${1 - bgOpacity}))`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          End-to-End Supply Chain Visibility
        </h2>

        <div className="relative">
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20" />

          <div className="flex flex-col md:flex-row justify-between items-center relative">
            {nodes.map((node, index) => (
              <div
                key={node.label}
                className={cn(
                  "flex flex-col items-center p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all z-10 mb-8 md:mb-0",
                  isVisible ? floatUp : "opacity-0",
                  "border border-gray-200 dark:border-gray-700"
                )}
                style={{
                  animationDelay: isVisible ? `${0.2 * index}s` : "0s",
                }}
              >
                <div className="p-3 mb-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                  <node.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {node.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p
          className={cn(
            "mt-12 text-lg text-center max-w-3xl mx-auto text-gray-600 dark:text-gray-300",
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

const InventoryDashboardPreview = ({
  scrollProgress,
}: {
  scrollProgress: number;
}) => {
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

  // Calculate background color based on scroll progress
  const bgOpacity = 1 - Math.min(scrollProgress * 1.8, 1);
  const bgColor = `rgba(249, 250, 251, ${1 - bgOpacity})`;

  return (
    <div
      ref={ref}
      className={cn("py-16", isVisible ? fadeIn : "opacity-0")}
      style={{
        backgroundColor: bgColor,
        background: `linear-gradient(to bottom, 
          rgba(30, 58, 138, ${bgOpacity * 0.6}), 
          rgba(249, 250, 251, ${1 - bgOpacity}))`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Real-Time Inventory Management
          </h2>

          <Card className="p-6 w-full max-w-4xl mx-auto relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Current Inventory
              </h3>
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full">
                Live Updates
              </Badge>
            </div>

            <div className="flex flex-col gap-4">
              {inventoryItems.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md border-l-4 border-blue-500 relative transition-all hover:translate-x-1 hover:shadow-md",
                    isVisible ? fadeIn : "opacity-0"
                  )}
                  style={{
                    animationDelay: isVisible ? `${0.1 * index}s` : "0s",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {item.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
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
                  className="mt-6 w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  size="lg"
                >
                  View Full Dashboard <FaArrowRight className="ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-white">
                    Inventory Dashboard Preview
                  </DialogTitle>
                </DialogHeader>
                <div className="relative aspect-video rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="Inventory Dashboard"
                    className="object-cover w-full h-full"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline">Close</Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Request Demo
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

const SupplyChainMetrics = ({ scrollProgress }: { scrollProgress: number }) => {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const metrics = [
    { value: "98.7%", label: "Order Accuracy", icon: FaClipboardCheck },
    { value: "24h", label: "Avg. Delivery Time", icon: FaTruck },
    { value: "35%", label: "Cost Reduction", icon: FaChartLine },
    { value: "99.9%", label: "System Uptime", icon: FaShieldAlt },
  ];

  // Calculate background color based on scroll progress
  const bgOpacity = 1 - Math.min(scrollProgress * 2.2, 1);
  const bgColor = `rgba(239, 246, 255, ${1 - bgOpacity})`;

  return (
    <div
      ref={ref}
      className={cn("py-16", isVisible ? fadeIn : "opacity-0")}
      style={{
        backgroundColor: bgColor,
        background: `linear-gradient(to bottom, 
          rgba(30, 58, 138, ${bgOpacity * 0.4}), 
          rgba(239, 246, 255, ${1 - bgOpacity}))`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Proven Supply Chain Results
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            {metrics.map((metric, index) => (
              <Card
                key={metric.label}
                className={cn(
                  "p-6 flex flex-col items-center gap-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
                  isVisible ? floatUp : "opacity-0"
                )}
                style={{
                  animationDelay: isVisible ? `${0.2 * index}s` : "0s",
                }}
              >
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                  <metric.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {metric.value}
                </h3>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {metric.label}
                </p>
              </Card>
            ))}
          </div>

          <p
            className={cn(
              "text-sm text-center max-w-2xl mx-auto text-gray-500 dark:text-gray-400",
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
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate progress (0 to 1) based on scroll position
      const progress = Math.min(scrollY / (documentHeight - windowHeight), 1);
      setScrollProgress(progress);

      // Existing scroll handler for header
      setIsScrolled(scrollY > 50);
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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      {/* Gradient Transition Overlay */}
      <GradientTransition progress={scrollProgress} />

      {/* Fixed Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center transition-all duration-300",
          isScrolled
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800"
            : "bg-transparent"
        )}
      >
        <Link href="/" className="flex items-center hover:no-underline">
          <div className="w-8 h-8 mr-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <FaTruck className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Orontis
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-12">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-white hover:text-blue-600 dark:text-white dark:hover:text-blue-400 underline underline-offset-4 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("solutions")}
              className="text-sm font-medium text-white hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 underline underline-offset-4 transition-colors"
            >
              Solutions
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium text-white hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 underline underline-offset-4 transition-colors"
            >
              Contact
            </button>
          </nav>
          <Button
            onClick={() => router.push("/createAccount")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className={cn(
          "pt-32 pb-20 min-h-screen flex items-center justify-center text-center relative overflow-hidden",
          "bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white"
        )}
      >
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <PlaneAnimation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col gap-8">
            <h1
              className={cn(
                "text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-balance",
                floatUp,
                "opacity-0"
              )}
            >
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Transform Your Supply Chain
              </span>
              <br />
              <span className="text-blue-200">With Intelligent Automation</span>
            </h1>

            <p
              className={cn(
                "text-xl md:text-2xl max-w-3xl mx-auto text-blue-100",
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
                onClick={() => router.push("/product")}
                className="bg-white text-blue-600 hover:bg-blue-50 group"
                size="lg"
              >
                Get Started
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                className="border-white text-blue-600 hover:bg-white/10 hover:text-white"
                size="lg"
              >
                Explore Features
              </Button>
            </div>
          </div>
        </div>

        {/* Animated truck */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-16 h-16">
          <FaTruck
            className="w-full h-full text-white/80"
            style={{
              animation: "truck-movement 8s ease-in-out infinite alternate",
            }}
          />
        </div>
      </section>

      {/* Supply Chain Network */}
      <SupplyChainNetwork scrollProgress={scrollProgress} />

      {/* Inventory Dashboard Preview */}
      <InventoryDashboardPreview scrollProgress={scrollProgress} />

      {/* Key Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Supply Chain Solutions
          </h2>
          <p
            className={cn(
              "text-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-300",
              fadeIn,
              "opacity-0"
            )}
            style={{ animationDelay: "0.2s" }}
          >
            Comprehensive tools designed specifically for modern supply chain
            challenges.
          </p>

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
      </section>

      {/* Supply Chain Metrics */}
      <SupplyChainMetrics scrollProgress={scrollProgress} />

      {/* Problem/Solution Section */}
      <section id="solutions" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Supply Chain Pain Points We Solve
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
            <Card
              className={cn(
                "p-6 flex flex-col items-start gap-4 h-full text-left bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                slideInLeft,
                "opacity-0"
              )}
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card
              className={cn(
                "p-6 flex flex-col items-start gap-4 h-full text-left bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                slideInRight,
                "opacity-0"
              )}
              style={{ animationDelay: "0.4s" }}
            >
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                    <div className="p-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                      <item.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="contact" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ready to Optimize Your Supply Chain?
          </h2>
          <p
            className={cn(
              "text-lg text-gray-600 dark:text-gray-300",
              fadeIn,
              "opacity-0"
            )}
            style={{ animationDelay: "0.2s" }}
          >
            Speak with our supply chain experts to see how we can transform your
            operations.
          </p>

          <Card
            className={cn(
              "w-full p-6 md:p-8 hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
              scaleUp,
              "opacity-0"
            )}
            style={{ animationDelay: "0.4s" }}
          >
            <form className="flex flex-col gap-5">
              <div className="space-y-2 text-left">
                <Label
                  htmlFor="name"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Your Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Work Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@company.com"
                  className="border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label
                  htmlFor="company"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Company Name
                </Label>
                <Input
                  id="company"
                  placeholder="Acme Logistics Inc."
                  className="border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label
                  htmlFor="message"
                  className="text-gray-700 dark:text-gray-300"
                >
                  How can we help you?
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your supply chain challenges..."
                  rows={4}
                  className="border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Get in Touch
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0">
                <div className="w-8 h-8 mr-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <FaTruck className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Orontis
                </span>
              </div>

              <div className="flex gap-6">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("solutions")}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Solutions
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>

            <div className="border-t border-gray-300 dark:border-gray-700 w-full" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Orontis Supply Chain
                Solutions. All rights reserved.
              </p>

              <div className="flex gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <FaCloud className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>LinkedIn</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <FaTruck className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Twitter</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <FaWarehouse className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>GitHub</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </footer>

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
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(99, 102, 241, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
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
            transform: translateX(-100px) translateY(20px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          20% {
            transform: translateX(15vw) translateY(-100px) rotate(-10deg);
            opacity: 1;
          }
          80% {
            transform: translateX(85vw) translateY(-100px) rotate(10deg);
            opacity: 1;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(100vw) translateY(20px) rotate(0deg);
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
      `}</style>
    </div>
  );
}
