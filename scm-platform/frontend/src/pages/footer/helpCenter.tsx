import React, { useState, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Users,
  Zap,
  Shield,
  Settings,
  Coffee,
  Heart,
  Star,
  ChevronUp,
  ArrowRight,
  ExternalLink,
  Video,
  FileText,
  Headphones,
  LucideIcon,
} from "lucide-react";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";

// Search Component
const HelpSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions] = useState([
    "How to create an account",
    "Reset password",
    "Billing and payments",
    "Privacy settings",
    "Upload images",
  ]);

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for help articles, guides, or FAQs..."
          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-lg"
        />
      </div>

      {searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-sky-100 z-10">
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
            {suggestions
              .filter((s) =>
                s.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((suggestion, index) => (
                <button
                  key={index}
                  className="block w-full text-left px-3 py-2 hover:bg-sky-50 rounded-lg transition-colors text-gray-700"
                  onClick={() => setSearchQuery(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Category Card Component
interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  articleCount: number;
  color?: "blue" | "green" | "purple" | "orange";
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon: Icon,
  title,
  description,
  articleCount,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    purple: "from-purple-500 to-indigo-500",
    orange: "from-orange-500 to-red-500",
  };

  return (
    <div className="group cursor-pointer">
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-sky-100">
        <div
          className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-600 font-medium">
            {articleCount} articles
          </span>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};

// FAQ Component
interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="border border-sky-100 rounded-lg">
      <button
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-sky-50 transition-colors rounded-lg"
        onClick={onToggle}
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-blue-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

// Popular Article Component
interface PopularArticleProps {
  title: string;
  category: string;
  readTime: string;
  helpful: number;
}

const PopularArticle: React.FC<PopularArticleProps> = ({
  title,
  category,
  readTime,
  helpful,
}) => {
  return (
    <div className="flex items-center space-x-4 p-4 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <FileText className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 mb-1">{title}</h4>
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          <span>{category}</span>
          <span>•</span>
          <span>{readTime}</span>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Heart className="h-3 w-3 text-red-500" />
            <span>{helpful}% helpful</span>
          </div>
        </div>
      </div>
      <ExternalLink className="h-4 w-4 text-gray-400" />
    </div>
  );
};

// Main Help Center Component
const HelpCenter = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const categories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics and set up your account",
      articleCount: 12,
      color: "blue" as const,
    },
    {
      icon: Settings,
      title: "Account Settings",
      description: "Manage your profile, privacy, and preferences",
      articleCount: 8,
      color: "green" as const,
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Stay safe and protect your data",
      articleCount: 6,
      color: "purple" as const,
    },
    {
      icon: Zap,
      title: "Troubleshooting",
      description: "Fix common issues and problems",
      articleCount: 15,
      color: "orange" as const,
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with other users and share",
      articleCount: 9,
      color: "blue" as const,
    },
    {
      icon: Coffee,
      title: "Tips & Tricks",
      description: "Advanced features and productivity hacks",
      articleCount: 11,
      color: "green" as const,
    },
  ];

  const faqs = [
    {
      question: "How do I create a new blog post?",
      answer:
        "To create a new blog post, navigate to your dashboard and click the 'Create New Post' button. You can then use our rich text editor to write your content, add images, and format your post. Don't forget to add tags and categories to help readers find your content.",
    },
    {
      question: "Can I customize my blog's appearance?",
      answer:
        "Yes! BlogSpace offers extensive customization options. You can choose from various themes, customize colors, fonts, and layouts. Premium users get access to advanced customization tools and custom CSS options.",
    },
    {
      question: "How do I manage my subscribers and notifications?",
      answer:
        "Go to Settings > Notifications to manage your subscriber list and notification preferences. You can see who's subscribed to your blog, send newsletters, and customize what notifications you receive.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Yes, we have mobile apps for both iOS and Android. You can write, edit, and publish posts on the go, respond to comments, and track your blog's performance from your mobile device.",
    },
    {
      question: "How do I upgrade to a premium plan?",
      answer:
        "Visit your Account Settings and click on 'Upgrade Plan.' You'll see our available premium options with detailed feature comparisons. Premium plans include advanced analytics, custom domains, and priority support.",
    },
  ];

  const popularArticles = [
    {
      title: "Complete Guide to SEO Optimization",
      category: "Getting Started",
      readTime: "10 min read",
      helpful: 94,
    },
    {
      title: "How to Enable Two-Factor Authentication",
      category: "Security",
      readTime: "3 min read",
      helpful: 98,
    },
    {
      title: "Setting Up Custom Domains",
      category: "Account Settings",
      readTime: "5 min read",
      helpful: 89,
    },
    {
      title: "Troubleshooting Image Upload Issues",
      category: "Troubleshooting",
      readTime: "4 min read",
      helpful: 92,
    },
    {
      title: "Building Your Community",
      category: "Community",
      readTime: "8 min read",
      helpful: 87,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <Navbar isLoggedIn={true} />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Help
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent block">
                Center
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Find answers, get support, and learn how to make the most of
              BlogSpace.
            </p>
          </div>

          <HelpSearch />

          <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>24/7 Support Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <Headphones className="h-4 w-4" />
              <span>Live Chat Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-sky-100 hover:bg-blue-50">
              <Video className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Video Tutorials</span>
            </button>
            <button className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-sky-100 hover:bg-blue-50">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Live Chat</span>
            </button>
            <button className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-sky-100 hover:bg-blue-50">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Community Forum</span>
            </button>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-gray-600 text-lg">
              Find the help you need organized by topic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                icon={category.icon}
                title={category.title}
                description={category.description}
                articleCount={category.articleCount}
                color={category.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles & FAQ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Popular Articles */}
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-sky-100">
                <div className="flex items-center space-x-3 mb-6">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Popular Articles
                  </h3>
                </div>
                <div className="space-y-2">
                  {popularArticles.map((article, index) => (
                    <PopularArticle
                      key={index}
                      title={article.title}
                      category={article.category}
                      readTime={article.readTime}
                      helpful={article.helpful}
                    />
                  ))}
                </div>
                <button className="w-full mt-6 py-3 text-blue-600 font-medium hover:bg-sky-50 rounded-lg transition-colors">
                  View All Articles
                </button>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-sky-100">
                <div className="flex items-center space-x-3 mb-6">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Frequently Asked Questions
                  </h3>
                </div>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <FAQItem
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openFAQ === index}
                      onToggle={() =>
                        setOpenFAQ(openFAQ === index ? null : index)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Our support team is here to help you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Start Live Chat</span>
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center space-x-2">
              <Headphones className="h-5 w-5" />
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HelpCenter;
