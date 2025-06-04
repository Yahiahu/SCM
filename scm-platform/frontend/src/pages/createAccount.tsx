import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaStar,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaArrowRight,
  FaWarehouse,
  FaTruck,
} from "react-icons/fa";

const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

const TestimonialCard = () => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.5 }}
    className="max-w-md"
  >
    <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/50 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="w-4 h-4 text-amber-400" />
          ))}
        </div>
      </div>
      <p className="text-gray-800 font-semibold mb-2">LinkedIn User</p>
      <p className="text-gray-600 leading-relaxed">
        "This is the best thing I've ever used for managing inventory and supply
        chains! Game-changing platform."
      </p>
    </div>
  </motion.div>
);

type InputFieldProps = {
  icon: React.ComponentType<{ className?: string }>;
  type?: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
  togglePassword?: () => void;
  isPassword?: boolean;
};

const InputField = ({
  icon: Icon,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  showPassword,
  togglePassword,
  isPassword = false,
}: InputFieldProps) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-sky-500 transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <input
      type={isPassword ? (showPassword ? "text" : "password") : type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-12 pr-12 py-4 bg-white/80 border border-sky-200/70 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/70 backdrop-blur-sm transition-all"
    />
    {isPassword && (
      <button
        type="button"
        onClick={togglePassword}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
      >
        {showPassword ? (
          <FaEyeSlash className="w-5 h-5" />
        ) : (
          <FaEye className="w-5 h-5" />
        )}
      </button>
    )}
  </div>
);

type ToastProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastProps) => (
  <motion.div
    initial={{ opacity: 0, y: -50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -50, scale: 0.9 }}
    className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl backdrop-blur-xl border max-w-sm ${
      type === "success"
        ? "bg-emerald-50/95 border-emerald-200/50 text-emerald-700"
        : "bg-red-50/95 border-red-200/50 text-red-700"
    }`}
  >
    <div className="flex items-center justify-between">
      <p className="font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-800"
      >
        ×
      </button>
    </div>
  </motion.div>
);

export default function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    organization_id: 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  type ToastState = {
    message: string;
    type: "success" | "error";
  } | null;

  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type }); // ✅ now TypeScript knows this is allowed
    setTimeout(() => setToast(null), 4000);
  };


  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);

    if (form.password !== form.confirmPassword) {
      showToast("Passwords do not match", "error");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          phone: form.phone,
          password_hash: form.password,
          role: "user",
          organization_id: form.organization_id,
        }),
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        const errorText = contentType?.includes("application/json")
          ? (await res.json()).message
          : await res.text();
        throw new Error(errorText || "Unknown error");
      }

      showToast("Account created successfully!", "success");

      setTimeout(() => {
        console.log("Redirecting to login...");
      }, 1500);
    }  catch (err) {
  const error = err as Error;
  showToast(error.message || "Failed to create account", "error");
  } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 container mx-auto px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Side - Brand & Testimonial */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-lg">
                  <FaWarehouse className="w-8 h-8 text-white" />
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-sky-500 shadow-lg">
                  <FaTruck className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-7xl font-bold leading-tight text-gray-800"
              >
                Inventory{" "}
                <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 bg-clip-text text-transparent">
                  &
                </span>{" "}
                <span className="block">Supply Chain</span>
                <span className="bg-gradient-to-r from-blue-500 to-sky-500 bg-clip-text text-transparent">
                  Management
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 leading-relaxed max-w-lg"
              >
                Transform your business operations with our cutting-edge
                inventory and supply chain management platform.
              </motion.p>
            </div>

            <TestimonialCard />
          </motion.div>

          {/* Right Side - Sign Up Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-lg mx-auto lg:mx-0"
          >
            <div className="p-4 rounded-3xl bg-white/80 backdrop-blur-xl border border-sky-200/50 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
                  Create Account{" "}
                  <span className="bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
                    !
                  </span>
                </h2>
                <p className="text-gray-600 mb-4">
                  Join thousands of businesses already transforming their
                  operations
                </p>
                <a
                  href="/login"
                  className="text-sky-500 font-semibold hover:text-sky-600 transition-colors"
                >
                  Already have an account? Login →
                </a>
              </div>

              <div className="space-y-6">
                <InputField
                  icon={FaUser}
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                />

                <InputField
                  icon={FaEnvelope}
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                />

                <InputField
                  icon={FaPhone}
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                />

                <InputField
                  icon={FaLock}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  isPassword={true}
                  showPassword={showPassword}
                  togglePassword={() => setShowPassword(!showPassword)}
                />

                <InputField
                  icon={FaLock}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  isPassword={true}
                  showPassword={showPassword}
                />

                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all text-white ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-sky-500 to-blue-500 hover:shadow-lg hover:shadow-sky-400/25"
                  }`}
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Create Account
                      <FaArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                By creating an account, you agree to our{" "}
                <a
                  href="#"
                  className="text-sky-500 hover:text-sky-600 transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-sky-500 hover:text-sky-600 transition-colors"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
