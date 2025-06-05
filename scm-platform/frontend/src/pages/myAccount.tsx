"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiLock,
  FiSave,
  FiX,
  FiShield,
  FiTruck,
  FiHome,
  FiBell,
  FiCheck,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Avatar from "@radix-ui/react-avatar"; // Radix Avatar
import { useRouter } from "next/router";
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

interface UserData {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  organization: {
    id: number;
    name: string;
    type: string;
  };
}

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

export default function MyAccountPage() {
  const router = useRouter(); // Keeping Next.js router
  const { showToast, toastState, hideToast } = useCustomToast(); // Using custom toast
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // For Radix Dialog

  // Mock user data fetch
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockUser: UserData = {
          id: 1,
          username: "supplychain_pro",
          email: "user@supplychain.com",
          phone: "+1 (555) 123-4567",
          role: "Supply Chain Manager",
          organization: {
            id: 101,
            name: "Global Logistics Inc.",
            type: "Logistics Provider",
          },
        };

        setUser(mockUser);
        setFormData({
          email: mockUser.email,
          phone: mockUser.phone || "",
        });
      } catch (error) {
        showToast({
          title: "Error",
          description: "Failed to load user data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []); // Removed `toast` from dependencies since it's a custom hook now

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    // In a real app, this would call an API to update the user
    if (user) {
      setUser({
        ...user,
        email: formData.email,
        phone: formData.phone,
      });
      showToast({
        title: "Profile updated",
        description: "Your changes have been saved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        email: user.email,
        phone: user.phone || "",
      });
    }
    setIsEditing(false);
  };

  const getRoleBadgeClasses = (role: string) => {
    let colorClass = "bg-gray-200 text-gray-800"; // Default
    switch (role.toLowerCase()) {
      case "admin":
        colorClass = "bg-red-100 text-red-700";
        break;
      case "supply chain manager":
        colorClass = "bg-blue-100 text-blue-700";
        break;
      case "logistics coordinator":
        colorClass = "bg-green-100 text-green-700";
        break;
      case "warehouse operator":
        colorClass = "bg-orange-100 text-orange-700";
        break;
      default:
        break;
    }
    return `px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <Navbar isLoggedIn={true} />

      <main className="flex-1 pt-20 px-4 relative z-10">
        <div className="flex flex-col gap-8 max-w-7xl mx-auto py-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-800">My Account</h1>
            <button
              onClick={handleEditToggle}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-sky-500 text-white shadow-lg hover:bg-sky-600 transition-colors duration-200"
            >
              <FiEdit2 className="w-5 h-5" />
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </button>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Profile Info */}
            <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Profile Information
              </h2>
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                    </div>
                  ))}
                </div>
              ) : user ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar.Root className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                      <Avatar.Fallback delayMs={600}>
                        <FiUser className="w-10 h-10" />
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <div>
                      <h3 className="text-xl font-semibold text-sky-800">
                        {user.username}
                      </h3>
                      <span className={getRoleBadgeClasses(user.role)}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 my-4"></div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-lg text-gray-700">
                          <FiMail className="text-gray-500 w-5 h-5" />
                          <span>{user.email}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-lg text-gray-700">
                          <FiPhone className="text-gray-500 w-5 h-5" />
                          <span>{user.phone || "Not provided"}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <FiX className="w-5 h-5" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-sky-500 text-white shadow hover:bg-sky-600 transition-colors duration-200"
                      >
                        <FiSave className="w-5 h-5" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No user data available</p>
              )}
            </div>

            {/* Organization Card */}
            {user && (
              <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Organization
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FiHome className="text-blue-500 w-6 h-6" />
                    <span className="text-lg font-medium text-gray-800">
                      {user.organization.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiTruck className="text-blue-500 w-6 h-6" />
                    <span className="text-lg text-gray-700">
                      {user.organization.type}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      router.push(`/organization/${user.organization.id}`)
                    }
                    className="mt-4 inline-flex items-center justify-center px-5 py-2 rounded-xl border border-blue-300 text-blue-700 font-semibold hover:bg-blue-50 transition-colors duration-200"
                  >
                    View Organization Details
                  </button>
                </div>
              </div>
            )}

            {/* Right Column - Security & Preferences */}
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
              {/* Security Card */}
              <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Security
                </h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <FiLock className="text-blue-500 w-6 h-6" />
                      <span className="text-lg text-gray-700">Password</span>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 rounded-xl border border-blue-300 text-blue-700 font-semibold hover:bg-blue-50 transition-colors duration-200"
                    >
                      Change Password
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <FiShield className="text-blue-500 w-6 h-6" />
                      <span className="text-lg text-gray-700">
                        Two-Factor Authentication
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                      Not Enabled
                    </span>
                  </div>
                </div>
              </div>

              {/* Preferences Card */}
              <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Preferences
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Dashboard View
                    </label>
                    <Select.Root defaultValue="shipping">
                      <Select.Trigger className="flex justify-between items-center w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 data-[placeholder]:text-gray-500">
                        <Select.Value aria-label="Default Dashboard View" />
                        <Select.Icon className="text-gray-700">
                          <FiChevronDown />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                          <Select.Viewport className="p-1">
                            <Select.Item
                              value="shipping"
                              className="relative flex items-center px-4 py-2 rounded-md text-gray-800 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none data-[state=checked]:text-blue-600 data-[state=checked]:font-semibold cursor-pointer"
                            >
                              <Select.ItemText>
                                Shipping Dashboard
                              </Select.ItemText>
                              <Select.ItemIndicator className="absolute left-1.5 inline-flex items-center justify-center">
                                <FiCheck className="w-4 h-4" />
                              </Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item
                              value="inventory"
                              className="relative flex items-center px-4 py-2 rounded-md text-gray-800 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none data-[state=checked]:text-blue-600 data-[state=checked]:font-semibold cursor-pointer"
                            >
                              <Select.ItemText>
                                Inventory Overview
                              </Select.ItemText>
                              <Select.ItemIndicator className="absolute left-1.5 inline-flex items-center justify-center">
                                <FiCheck className="w-4 h-4" />
                              </Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item
                              value="analytics"
                              className="relative flex items-center px-4 py-2 rounded-md text-gray-800 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none data-[state=checked]:text-blue-600 data-[state=checked]:font-semibold cursor-pointer"
                            >
                              <Select.ItemText>
                                Supply Chain Analytics
                              </Select.ItemText>
                              <Select.ItemIndicator className="absolute left-1.5 inline-flex items-center justify-center">
                                <FiCheck className="w-4 h-4" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notification Preferences
                    </label>
                    <Select.Root defaultValue="all">
                      <Select.Trigger className="flex justify-between items-center w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 data-[placeholder]:text-gray-500">
                        <Select.Value aria-label="Notification Preferences" />
                        <Select.Icon className="text-gray-700">
                          <FiChevronDown />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                          <Select.Viewport className="p-1">
                            <Select.Item
                              value="all"
                              className="relative flex items-center px-4 py-2 rounded-md text-gray-800 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none data-[state=checked]:text-blue-600 data-[state=checked]:font-semibold cursor-pointer"
                            >
                              <Select.ItemText>
                                All Notifications
                              </Select.ItemText>
                              <Select.ItemIndicator className="absolute left-1.5 inline-flex items-center justify-center">
                                <FiCheck className="w-4 h-4" />
                              </Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item
                              value="important"
                              className="relative flex items-center px-4 py-2 rounded-md text-gray-800 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none data-[state=checked]:text-blue-600 data-[state=checked]:font-semibold cursor-pointer"
                            >
                              <Select.ItemText>
                                Only Important Updates
                              </Select.ItemText>
                              <Select.ItemIndicator className="absolute left-1.5 inline-flex items-center justify-center">
                                <FiCheck className="w-4 h-4" />
                              </Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item
                              value="none"
                              className="relative flex items-center px-4 py-2 rounded-md text-gray-800 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none data-[state=checked]:text-blue-600 data-[state=checked]:font-semibold cursor-pointer"
                            >
                              <Select.ItemText>
                                No Notifications
                              </Select.ItemText>
                              <Select.ItemIndicator className="absolute left-1.5 inline-flex items-center justify-center">
                                <FiCheck className="w-4 h-4" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>

                  <button
                    onClick={() =>
                      showToast({
                        title: "Preferences Saved",
                        description: "Your preferences have been saved.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      })
                    }
                    className="mt-4 w-full py-3 rounded-xl font-semibold bg-sky-500 text-white shadow-lg hover:bg-sky-600 transition-colors duration-200"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>

              {/* Account Actions Card */}
              <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Account Actions
                </h2>
                <div className="space-y-4">
                  <button className="w-full py-3 rounded-xl border border-red-300 text-red-700 font-semibold hover:bg-red-50 transition-colors duration-200">
                    Deactivate Account
                  </button>
                  <p className="text-sm text-gray-500">
                    Deactivating your account will remove your access but
                    preserve your data for 30 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Change Password Modal (Radix Dialog) */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0 z-50" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-8 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-50">
            <Dialog.Title className="text-xl font-semibold text-gray-800 mb-6">
              Change Password
            </Dialog.Title>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  placeholder="Enter current password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirm-new-password"
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                className="px-4 py-2 rounded-xl font-semibold bg-sky-500 text-white shadow hover:bg-sky-600 transition-colors duration-200"
                onClick={() => {
                  showToast({
                    title: "Password Updated",
                    description: "Your password has been changed successfully.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                  setIsModalOpen(false);
                }}
              >
                Update Password
              </button>
            </div>
            <Dialog.Close asChild>
              <button
                className="text-gray-500 hover:bg-gray-100 absolute top-4 right-4 inline-flex h-8 w-8 appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <FiX />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Toast */}
      <Toast {...toastState} onClose={hideToast} />
    </div>
  );
}

// Helper component for Select.Item with icon (Radix)
interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof Select.Item> {
  children: React.ReactNode;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <Select.Item {...props} ref={forwardedRef}>
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator>
          <FiCheck />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);
SelectItem.displayName = "SelectItem";

// Just for the Chevron Down icon for Radix Select
const FiChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
