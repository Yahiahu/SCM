"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FiSettings,
  FiBell,
  FiClock,
  FiCalendar,
  FiGlobe,
  FiDatabase,
  FiLayers,
  FiCheck,
  FiX,
  FiChevronDown, // For Radix Select dropdown icon
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import * as Select from "@radix-ui/react-select";
import * as Switch from "@radix-ui/react-switch"; // Radix Switch
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Toast Component (re-used from previous redesigns)
interface ToastProps {
  message: string;
  type: "success" | "error";
  show: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-24 right-6 z-50 max-w-sm"
        >
          <div
            className={`
            backdrop-blur-xl border rounded-2xl shadow-xl p-4 flex items-center gap-3
            ${
              type === "success"
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
                : "bg-red-50/90 border-red-200 text-red-800"
            }
          `}
          >
            <div
              className={`p-2 rounded-full ${
                type === "success" ? "bg-emerald-100" : "bg-red-100"
              }`}
            >
              {type === "success" ? (
                <FiCheck className="w-5 h-5 text-emerald-600" />
              ) : (
                <FiX className="w-5 h-5 text-red-600" />
              )}
            </div>
            <span className="font-medium flex-1">{message}</span>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Re-using the BlurredBackground component for consistent design
const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

// Custom hook for toast (replicates Chakra's useToast)
const useCustomToast = () => {
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showToast = (options: {
    title: string;
    description: string;
    status: "success" | "error" | "info" | "warning";
    duration?: number;
    isClosable?: boolean;
  }) => {
    setToastState({
      show: true,
      message: options.description,
      type: options.status === "success" ? "success" : "error", // Simplified for now
    });
  };

  const hideToast = () => {
    setToastState((prev) => ({ ...prev, show: false }));
  };

  return { showToast, toastState, hideToast };
};

export default function SettingsPage() {
  const { showToast, toastState, hideToast } = useCustomToast();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    language: "en-US",
    dataRefreshRate: 30,
    enableAnalytics: true,
  });

  const handleSettingChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveSettings = () => {
    showToast({
      title: "Settings saved",
      description: "Your preferences have been updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Helper component for Select.Item with icon (Radix)
  // This is defined inside the component to ensure FiCheck is available
  const SelectItem = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof Select.Item>
  >(({ children, ...props }, forwardedRef) => {
    return (
      <Select.Item
        {...props}
        ref={forwardedRef}
        className="relative flex items-center px-4 py-2 rounded-md text-gray-800 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none data-[state=checked]:text-blue-600 data-[state=checked]:font-semibold cursor-pointer"
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-1.5 inline-flex items-center justify-center">
          <FiCheck className="w-4 h-4" />
        </Select.ItemIndicator>
      </Select.Item>
    );
  });
  SelectItem.displayName = "SelectItem";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <Navbar isLoggedIn={true} />

      <main className="flex-1 pt-20 px-4 relative z-10">
        <div className="flex flex-col gap-8 max-w-7xl mx-auto py-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <FiSettings className="w-10 h-10 text-sky-500" />
            <h1 className="text-4xl font-bold text-gray-800">Settings</h1>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - General Settings */}
            <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                General Settings
              </h2>
              <div className="space-y-6">
                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <div className="flex items-center gap-3">
                    <FiGlobe className="text-gray-500 w-5 h-5" />
                    <Select.Root
                      value={settings.language}
                      onValueChange={(value) =>
                        handleSettingChange("language", value)
                      }
                    >
                      <Select.Trigger className="flex justify-between items-center w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 data-[placeholder]:text-gray-500">
                        <Select.Value aria-label={settings.language} />
                        <Select.Icon className="text-gray-700">
                          <FiChevronDown />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                          <Select.Viewport className="p-1">
                            <SelectItem value="en-US">English (US)</SelectItem>
                            <SelectItem value="es-ES">Spanish</SelectItem>
                            <SelectItem value="fr-FR">French</SelectItem>
                            <SelectItem value="de-DE">German</SelectItem>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <div className="flex items-center gap-3">
                    <FiClock className="text-gray-500 w-5 h-5" />
                    <Select.Root
                      value={settings.timezone}
                      onValueChange={(value) =>
                        handleSettingChange("timezone", value)
                      }
                    >
                      <Select.Trigger className="flex justify-between items-center w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 data-[placeholder]:text-gray-500">
                        <Select.Value aria-label={settings.timezone} />
                        <Select.Icon className="text-gray-700">
                          <FiChevronDown />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                          <Select.Viewport className="p-1">
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="EST">
                              Eastern Time (EST)
                            </SelectItem>
                            <SelectItem value="PST">
                              Pacific Time (PST)
                            </SelectItem>
                            <SelectItem value="CET">
                              Central European Time (CET)
                            </SelectItem>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                </div>

                {/* Date Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Format
                  </label>
                  <div className="flex items-center gap-3">
                    <FiCalendar className="text-gray-500 w-5 h-5" />
                    <Select.Root
                      value={settings.dateFormat}
                      onValueChange={(value) =>
                        handleSettingChange("dateFormat", value)
                      }
                    >
                      <Select.Trigger className="flex justify-between items-center w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 data-[placeholder]:text-gray-500">
                        <Select.Value aria-label={settings.dateFormat} />
                        <Select.Icon className="text-gray-700">
                          <FiChevronDown />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                          <Select.Viewport className="p-1">
                            <SelectItem value="MM/DD/YYYY">
                              MM/DD/YYYY
                            </SelectItem>
                            <SelectItem value="DD/MM/YYYY">
                              DD/MM/YYYY
                            </SelectItem>
                            <SelectItem value="YYYY-MM-DD">
                              YYYY-MM-DD
                            </SelectItem>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiLayers className="text-gray-500 w-5 h-5" />
                    <div>
                      <label
                        htmlFor="dark-mode"
                        className="text-sm font-medium text-gray-700"
                      >
                        Dark Mode
                      </label>
                      <p className="text-sm text-gray-500">
                        Switch between light and dark theme
                      </p>
                    </div>
                  </div>
                  <Switch.Root
                    checked={settings.darkMode}
                    onCheckedChange={(checked) =>
                      handleSettingChange("darkMode", checked)
                    }
                    className="w-[42px] h-[25px] bg-gray-200 rounded-full relative data-[state=checked]:bg-sky-500 outline-none cursor-default transition-colors duration-200"
                    id="dark-mode"
                  >
                    <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-black/20 transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                  </Switch.Root>
                </div>
              </div>
            </div>

            {/* Data Settings Card */}
            <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Data & Refresh
              </h2>
              <div className="space-y-6">
                {/* Data Refresh Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Refresh Rate (seconds)
                  </label>
                  <div className="flex items-center gap-3">
                    <FiDatabase className="text-gray-500 w-5 h-5" />
                    <Select.Root
                      value={String(settings.dataRefreshRate)} // Radix Select expects string value
                      onValueChange={(value) =>
                        handleSettingChange("dataRefreshRate", parseInt(value))
                      }
                    >
                      <Select.Trigger className="flex justify-between items-center w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 data-[placeholder]:text-gray-500">
                        <Select.Value
                          aria-label={String(settings.dataRefreshRate)}
                        />
                        <Select.Icon className="text-gray-700">
                          <FiChevronDown />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                          <Select.Viewport className="p-1">
                            <SelectItem value="15">15 seconds</SelectItem>
                            <SelectItem value="30">30 seconds</SelectItem>
                            <SelectItem value="60">1 minute</SelectItem>
                            <SelectItem value="300">5 minutes</SelectItem>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                </div>

                {/* Enable Analytics */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiLayers className="text-gray-500 w-5 h-5" />
                    <div>
                      <label
                        htmlFor="enable-analytics"
                        className="text-sm font-medium text-gray-700"
                      >
                        Enable Analytics
                      </label>
                      <p className="text-sm text-gray-500">
                        Share usage data to help improve the platform
                      </p>
                    </div>
                  </div>
                  <Switch.Root
                    checked={settings.enableAnalytics}
                    onCheckedChange={(checked) =>
                      handleSettingChange("enableAnalytics", checked)
                    }
                    className="w-[42px] h-[25px] bg-gray-200 rounded-full relative data-[state=checked]:bg-sky-500 outline-none cursor-default transition-colors duration-200"
                    id="enable-analytics"
                  >
                    <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-black/20 transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                  </Switch.Root>
                </div>
              </div>
            </div>

            {/* Right Column - Notification Settings */}
            <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Notification Preferences
              </h2>
              <div className="space-y-6">
                {/* Enable Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiBell className="text-gray-500 w-5 h-5" />
                    <div>
                      <label
                        htmlFor="enable-notifications"
                        className="text-sm font-medium text-gray-700"
                      >
                        Enable Notifications
                      </label>
                      <p className="text-sm text-gray-500">
                        Receive system and alert notifications
                      </p>
                    </div>
                  </div>
                  <Switch.Root
                    checked={settings.notifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("notifications", checked)
                    }
                    className="w-[42px] h-[25px] bg-gray-200 rounded-full relative data-[state=checked]:bg-sky-500 outline-none cursor-default transition-colors duration-200"
                    id="enable-notifications"
                  >
                    <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-black/20 transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                  </Switch.Root>
                </div>

                {settings.notifications && (
                  <>
                    <div className="border-t border-gray-100 my-4"></div>{" "}
                    {/* Divider */}
                    {/* Email Notifications */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Notifications
                      </label>
                      <Select.Root defaultValue="all">
                        <Select.Trigger className="flex justify-between items-center w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 data-[placeholder]:text-gray-500">
                          <Select.Value aria-label="Email Notifications" />
                          <Select.Icon className="text-gray-700">
                            <FiChevronDown />
                          </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                            <Select.Viewport className="p-1">
                              <SelectItem value="all">
                                All notifications
                              </SelectItem>
                              <SelectItem value="important">
                                Only important alerts
                              </SelectItem>
                              <SelectItem value="none">
                                No email notifications
                              </SelectItem>
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </div>
                    {/* In-App Notifications */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        In-App Notifications
                      </label>
                      <Select.Root defaultValue="all">
                        <Select.Trigger className="flex justify-between items-center w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 data-[placeholder]:text-gray-500">
                          <Select.Value aria-label="In-App Notifications" />
                          <Select.Icon className="text-gray-700">
                            <FiChevronDown />
                          </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                            <Select.Viewport className="p-1">
                              <SelectItem value="all">
                                All notifications
                              </SelectItem>
                              <SelectItem value="important">
                                Only important alerts
                              </SelectItem>
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </div>
                    {/* Mobile Push Notifications */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Push Notifications
                      </label>
                      <Select.Root defaultValue="important">
                        <Select.Trigger className="flex justify-between items-center w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 data-[placeholder]:text-gray-500">
                          <Select.Value aria-label="Mobile Push Notifications" />
                          <Select.Icon className="text-gray-700">
                            <FiChevronDown />
                          </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                            <Select.Viewport className="p-1">
                              <SelectItem value="important">
                                Only important alerts
                              </SelectItem>
                              <SelectItem value="critical">
                                Only critical alerts
                              </SelectItem>
                              <SelectItem value="none">
                                No push notifications
                              </SelectItem>
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* System Status Card */}
            <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                System Status
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-700">API Status</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-700">Database Status</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    Connected
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-700">Last Sync</span>
                  <span className="text-lg text-gray-700">2 minutes ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-700">Version</span>
                  <span className="text-lg text-gray-700">v2.4.1</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              className="lg:col-span-2 w-full py-4 rounded-xl font-semibold bg-blue-500 text-white shadow-lg hover:bg-sky-600 transition-colors duration-200"
              onClick={saveSettings}
            >
              Save All Settings
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Toast */}
      <Toast {...toastState} onClose={hideToast} />
    </div>
  );
}
