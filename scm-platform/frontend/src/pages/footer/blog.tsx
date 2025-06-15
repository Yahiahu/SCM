import React, { useState } from "react";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Clock,
  User,
  ArrowRight,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";

// Define types for our blog post and author
interface Author {
  name: string;
  avatar: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: Author;
  readTime: string;
  comments: number;
  featured?: boolean;
}

// Blog Post Card Component with proper TypeScript typing
interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <article
      className={`group cursor-pointer ${
        featured ? "col-span-2 row-span-2" : ""
      }`}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
        <div className="relative overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              featured ? "h-64" : "h-48"
            }`}
          />
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              {post.category}
            </span>
          </div>
          <div className="absolute top-4 right-4 space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLiked(!liked);
              }}
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                liked
                  ? "bg-red-500 text-white"
                  : "bg-white/80 text-gray-600 hover:bg-white"
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setBookmarked(!bookmarked);
              }}
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                bookmarked
                  ? "bg-blue-500 text-white"
                  : "bg-white/80 text-gray-600 hover:bg-white"
              }`}
            >
              <Bookmark
                className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`}
              />
            </button>
          </div>
        </div>
        <div className="p-6">
          <h3
            className={`font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-sky-600 transition-colors ${
              featured ? "text-2xl" : "text-lg"
            }`}
          >
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {post.author.name}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {post.readTime}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-500">
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{post.comments}</span>
              </div>
              <button className="hover:text-sky-600 transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

// Main Blog Page Component
const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Technology",
    "Design",
    "Lifestyle",
    "Business",
    "Travel",
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Future of Web Development: What's Coming Next",
      excerpt:
        "Exploring the latest trends and technologies that will shape the future of web development, from AI integration to quantum computing.",
      image:
        "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop",
      category: "Technology",
      author: {
        name: "Sarah Chen",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b3c2?w=32&h=32&fit=crop&crop=face",
      },
      readTime: "8 min read",
      comments: 24,
      featured: true,
    },
    {
      id: 2,
      title: "Mastering Modern Design Systems",
      excerpt:
        "A comprehensive guide to building scalable and maintainable design systems for modern applications.",
      image:
        "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=600&h=400&fit=crop",
      category: "Design",
      author: {
        name: "Alex Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      },
      readTime: "6 min read",
      comments: 18,
    },
    {
      id: 3,
      title: "The Art of Minimalist Living",
      excerpt:
        "Discover how embracing minimalism can transform your life and bring more focus to what truly matters.",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      category: "Lifestyle",
      author: {
        name: "Emma Wilson",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
      },
      readTime: "5 min read",
      comments: 31,
    },
    {
      id: 4,
      title: "Building Sustainable Business Models",
      excerpt:
        "Learn how to create business models that are both profitable and environmentally responsible.",
      image:
        "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=600&h=400&fit=crop",
      category: "Business",
      author: {
        name: "David Kim",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      },
      readTime: "7 min read",
      comments: 12,
    },
    {
      id: 5,
      title: "Hidden Gems: Off the Beaten Path Destinations",
      excerpt:
        "Explore breathtaking destinations that most travelers haven't discovered yet.",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      category: "Travel",
      author: {
        name: "Maya Patel",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face",
      },
      readTime: "9 min read",
      comments: 27,
    },
  ];

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <Navbar isLoggedIn={true} />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Discover
              <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent block">
                Amazing Stories
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Explore thought-provoking articles, insights, and stories from
              leading voices across technology, design, and lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Start Reading
              </button>
              <button className="border-2 border-sky-600 text-sky-600 px-8 py-3 rounded-full font-medium hover:bg-sky-600 hover:text-white transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} featured={index === 0} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="group bg-gradient-to-r from-sky-600 to-blue-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Load More Articles
              <ArrowRight className="inline-block ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="text-sky-100 mb-8 text-lg">
            Get the latest articles and insights delivered straight to your
            inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full border-0 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-sky-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
