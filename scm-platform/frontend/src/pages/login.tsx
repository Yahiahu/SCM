import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaStar,
  FaUser,
  FaLock,
  FaArrowRight,
  FaWarehouse,
  FaTruck,
  FaGoogle,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

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

interface InputFieldProps {
  icon: React.ElementType;
  type?: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
  togglePassword?: () => void;
  isPassword?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  type = "text",
  name,
  placeholder = "",
  value,
  onChange,
  showPassword = false,
  togglePassword,
  isPassword = false,
}) => (
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

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => (
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

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  type ToastType = "success" | "error";

  interface ToastState {
    message: string;
    type: ToastType;
  }

  const [toast, setToast] = useState<ToastState | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      showToast("Google sign-in failed. Please try again.", "error");
    }
  }, [error]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginSuccess(false);

    const res = await signIn("credentials", {
      redirect: false,
      username: form.username,
      password: form.password,
    });

    if (res?.ok) {
      showToast("Login successful!", "success");
      setLoginSuccess(true);
      setTimeout(() => router.push("/product"), 1000);
    } else {
      showToast("Invalid username or password", "error");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/product" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(140,165,233,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.2)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Side - Brand & Testimonial */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block space-y-12"
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

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-lg -mt-10 mx-auto lg:mx-0 w-full"
          >
            <div className="px-6 py-6 sm:py-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-sky-200/50 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
                  Welcome Back{" "}
                  <span className="bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
                    !
                  </span>
                </h2>
                <p className="text-gray-600 mb-6">
                  Sign in to access your inventory management dashboard
                </p>

                {/* Google Sign-in Button */}
                <motion.button
                  type="button"
                  onClick={handleGoogleSignIn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-6 mb-6 rounded-xl font-semibold bg-white text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 border border-gray-300 shadow-sm"
                >
                  <FaGoogle className="w-5 h-5 text-red-500" />
                  Sign in with Google
                </motion.button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-sky-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <a
                  href="/createAccount"
                  className="text-sky-500 font-semibold hover:text-sky-600 transition-colors"
                >
                  Don't have an account? Create one →
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
                  icon={FaLock}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  isPassword={true}
                  showPassword={showPassword}
                  togglePassword={() => setShowPassword(!showPassword)}
                />

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-gray-600">
                    <input
                      type="checkbox"
                      className="mr-2 rounded border-sky-300 bg-white text-sky-500 focus:ring-sky-400/50"
                    />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="text-sky-500 hover:text-sky-600 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>

                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className={`relative overflow-hidden w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all text-white ${
                    isLoading
                      ? "bg-sky-500 cursor-wait"
                      : "bg-gradient-to-r from-sky-500 to-blue-500 hover:shadow-lg hover:shadow-sky-400/25"
                  }`}
                >
                  {/* Animated shimmer/progress bar */}
                  {isLoading && (
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: loginSuccess ? "100%" : "70%" }}
                      transition={{
                        duration: loginSuccess ? 0.4 : 1.2,
                        ease: "easeInOut",
                        ...(loginSuccess
                          ? {}
                          : { repeat: Infinity, repeatType: "mirror" }),
                      }}
                      className="absolute left-0 top-0 h-full bg-blue-700/70"
                    />
                  )}

                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? (
                      <>Signing in...</>
                    ) : (
                      <>
                        Sign In
                        <FaArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </motion.button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                Secure login protected by industry-standard encryption
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
