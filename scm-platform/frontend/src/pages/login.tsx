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

const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-pink-500/20 to-red-500/20 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl"></div>
  </div>
);

const TestimonialCard = () => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.5 }}
    className="max-w-md"
  >
    <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="w-4 h-4 text-yellow-400" />
          ))}
        </div>
      </div>
      <p className="text-white font-semibold mb-2">LinkedIn User</p>
      <p className="text-gray-300 leading-relaxed">
        "This is the best thing I've ever used for managing inventory and supply
        chains! Game-changing platform."
      </p>
    </div>
  </motion.div>
);

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
}) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <input
      type={isPassword ? (showPassword ? "text" : "password") : type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all"
    />
    {isPassword && (
      <button
        type="button"
        onClick={togglePassword}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -50, scale: 0.9 }}
    className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl backdrop-blur-xl border max-w-sm ${
      type === "success"
        ? "bg-green-500/20 border-green-500/30 text-green-200"
        : "bg-red-500/20 border-red-500/30 text-red-200"
    }`}
  >
    <div className="flex items-center justify-between">
      <p className="font-medium">{message}</p>
      <button onClick={onClose} className="ml-4 text-gray-400 hover:text-white">
        ×
      </button>
    </div>
  </motion.div>
);

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/users");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const users = await res.json();
      const match = users.find(
        (u) => u.username === form.username && u.password_hash === form.password
      );

      if (!match) {
        throw new Error("Invalid username or password");
      }

      // Store user data (you might want to use a proper auth system)
      // localStorage.setItem("user", JSON.stringify(match));

      showToast("Login successful!", "success");

      // Simulate navigation delay
      setTimeout(() => {
        // router.push("/product");
        console.log("Redirecting to dashboard...");
      }, 1500);
    } catch (err) {
      showToast(err.message || "Login failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Simulate Google sign-in
    showToast("Google sign-in would be implemented here", "success");
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <BlurredBackground />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 container mx-auto px-6 py-20">
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
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <FaWarehouse className="w-8 h-8 text-white" />
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <FaTruck className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-7xl font-bold leading-tight"
              >
                Inventory{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  &
                </span>{" "}
                <span className="block">Supply Chain</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Management
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 leading-relaxed max-w-lg"
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
            className="max-w-lg mx-auto lg:mx-0"
          >
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Welcome Back{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    !
                  </span>
                </h2>
                <p className="text-gray-300 mb-6">
                  Sign in to access your inventory management dashboard
                </p>

                {/* Google Sign-in Button */}
                <motion.button
                  type="button"
                  onClick={handleGoogleSignIn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-6 mb-6 rounded-xl font-semibold bg-white text-gray-800 hover:bg-gray-100 transition-all flex items-center justify-center gap-3 border border-gray-300"
                >
                  <FaGoogle className="w-5 h-5 text-red-500" />
                  Sign in with Google
                </motion.button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-black text-gray-400">or</span>
                  </div>
                </div>

                <a
                  href="/createAccount"
                  className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
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
                  <label className="flex items-center text-gray-300">
                    <input
                      type="checkbox"
                      className="mr-2 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50"
                    />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
                    isLoading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25"
                  }`}
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Sign In
                      <FaArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-400">
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
