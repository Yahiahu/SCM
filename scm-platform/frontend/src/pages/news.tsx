import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Globe,
  TrendingUp,
  AlertTriangle,
  Clock,
  ExternalLink,
  Bookmark,
  Share2,
  Bell,
  MapPin,
  DollarSign,
  Truck,
  Factory,
  Loader2,
  Calendar,
  Tag,
  ChevronRight,
  Eye,
  ArrowUpRight,
  Zap,
  Users,
  BarChart3,
} from "lucide-react";

const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-400/20 to-blue-400/20 blur-3xl animate-pulse"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-400/15 to-sky-400/15 blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/20 to-sky-400/20 blur-3xl animate-pulse delay-500"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-400/15 to-cyan-400/15 blur-3xl animate-pulse delay-1500"></div>
  </div>
);

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className = "",
  hover = true,
}) => (
  <div
    className={`
      backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl 
      ${
        hover
          ? "hover:bg-white/15 hover:border-white/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
          : ""
      }
      ${className}
    `}
  >
    {children}
  </div>
);

interface ModernButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
}) => {
  const baseClasses =
    "font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2";
  const variants = {
    primary:
      "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/40 hover:scale-105",
    secondary:
      "bg-white/20 backdrop-blur-sm border border-white/30 text-gray-700 hover:bg-white/30 hover:border-white/50",
    ghost: "hover:bg-white/10 text-gray-600 hover:text-gray-800",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  change: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trend: "up" | "down" | "neutral" | string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
}) => (
  <GlassmorphicCard className="p-6 group">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-xl bg-gradient-to-r from-sky-500/20 to-blue-500/20 group-hover:from-sky-500/30 group-hover:to-blue-500/30 transition-all duration-300">
        <Icon className="h-6 w-6 text-sky-600" />
      </div>
      <div
        className={`text-sm font-semibold px-3 py-1 rounded-full ${
          trend === "up"
            ? "bg-green-100 text-green-700"
            : trend === "down"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {change}
      </div>
    </div>
    <div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-600 font-medium">{title}</p>
    </div>
  </GlassmorphicCard>
);

interface NewsCardProps {
  article: {
    category: string;
    urgency: string;
    [key: string]: any;
  };
  onBookmark: () => void;
  onShare: () => void;
  onRead: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  article,
  onBookmark,
  onShare,
  onRead,
}) => {
  const getCategoryIcon = (category: string) => {
    const icons: {
      [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    } = {
      Tariffs: DollarSign,
      Trade: Globe,
      Regional: MapPin,
      Shipping: Truck,
      Manufacturing: Factory,
      Economic: TrendingUp,
    };
    return icons[category] || Globe;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-red-500/20 text-red-700 border-red-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "Low":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };

  const Icon = getCategoryIcon(article.category);

  return (
    <GlassmorphicCard className="group overflow-hidden relative">
      {/* Urgency indicator */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${
          article.urgency === "High"
            ? "bg-gradient-to-r from-red-500 to-red-600"
            : article.urgency === "Medium"
            ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
            : "bg-gradient-to-r from-green-500 to-green-600"
        }`}
      ></div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-sky-500/20 to-blue-500/20">
              <Icon className="h-4 w-4 text-sky-600" />
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 border border-white/20">
                {article.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(
                  article.urgency
                )}`}
              >
                {article.urgency}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <Bookmark
              className={`h-4 w-4 ${
                article.isBookmarked
                  ? "fill-sky-500 text-sky-500"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-sky-700 transition-colors">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {article.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags
            .slice(0, 3)
            .map(
              (
                tag:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Promise<React.AwaitedReactNode>
                  | null
                  | undefined,
                index: React.Key | null | undefined
              ) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-medium border border-sky-200"
                >
                  {tag}
                </span>
              )
            )}
          {article.tags.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              +{article.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{article.region}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{article.readTime} min</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{Math.floor(Math.random() * 1000) + 100}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{article.source}</span>
            <span className="mx-2">•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Share2 className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={onRead}
              className="p-2 rounded-lg hover:bg-sky-100 transition-colors group"
            >
              <ArrowUpRight className="h-4 w-4 text-sky-600 group-hover:scale-110 transition-transforms" />
            </button>
          </div>
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default function ModernNewsPage() {
  type Article = {
    id: string;
    title: string;
    summary: string;
    category: string;
    region: string;
    source: string;
    publishedAt: string;
    readTime: number;
    tags: string[];
    urgency: string;
    isBookmarked: boolean;
    [key: string]: any;
  };

  const [newsArticles, setNewsArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockNews = [
        {
          id: "1",
          title:
            "New US-China Tariff Reductions Announced for Electronics Sector",
          summary:
            "The Biden administration announced a 15% reduction in tariffs on electronic components, effective January 2025, potentially saving importers billions in costs.",
          category: "Tariffs",
          region: "North America",
          source: "Trade Weekly",
          publishedAt: "2025-01-15T10:30:00Z",
          readTime: 3,
          tags: ["Electronics", "US-China", "Cost Reduction"],
          urgency: "High",
          isBookmarked: false,
        },
        {
          id: "2",
          title: "European Union Introduces New Carbon Border Adjustments",
          summary:
            "Starting February 2025, the EU will implement carbon border adjustments affecting steel, cement, and aluminum imports, impacting global supply chains.",
          category: "Trade",
          region: "Europe",
          source: "EU Trade Monitor",
          publishedAt: "2025-01-14T14:20:00Z",
          readTime: 5,
          tags: ["Carbon Tax", "Steel", "Cement", "Aluminum"],
          urgency: "High",
          isBookmarked: true,
        },
        {
          id: "3",
          title: "Southeast Asia Manufacturing Hub Expansion Continues",
          summary:
            "Vietnam and Thailand see 25% increase in foreign manufacturing investments as companies diversify supply chains away from traditional centers.",
          category: "Manufacturing",
          region: "Asia-Pacific",
          source: "Manufacturing Today",
          publishedAt: "2025-01-13T09:15:00Z",
          readTime: 4,
          tags: ["Vietnam", "Thailand", "Diversification"],
          urgency: "Medium",
          isBookmarked: false,
        },
        {
          id: "4",
          title: "Port Congestion Eases in Los Angeles and Long Beach",
          summary:
            "Container processing times improve by 40% following infrastructure investments and new automation systems at major West Coast ports.",
          category: "Shipping",
          region: "North America",
          source: "Port Authority News",
          publishedAt: "2025-01-12T16:45:00Z",
          readTime: 2,
          tags: ["Ports", "Automation", "Efficiency"],
          urgency: "Medium",
          isBookmarked: false,
        },
        {
          id: "5",
          title: "Mexico Emerges as Key Nearshoring Destination",
          summary:
            "Mexican manufacturing exports to US reach record highs as companies capitalize on USMCA benefits and proximity advantages.",
          category: "Regional",
          region: "North America",
          source: "Americas Trade Report",
          publishedAt: "2025-01-11T11:30:00Z",
          readTime: 6,
          tags: ["Mexico", "Nearshoring", "USMCA"],
          urgency: "Medium",
          isBookmarked: true,
        },
        {
          id: "6",
          title: "Global Semiconductor Shortage Shows Signs of Recovery",
          summary:
            "Chip availability improves by 30% as new fabrication facilities come online in Taiwan and South Korea, though automotive sector still faces constraints.",
          category: "Manufacturing",
          region: "Asia-Pacific",
          source: "Tech Supply Chain",
          publishedAt: "2025-01-10T13:20:00Z",
          readTime: 4,
          tags: ["Semiconductors", "Taiwan", "South Korea", "Automotive"],
          urgency: "High",
          isBookmarked: false,
        },
      ];

      setNewsArticles(mockNews as typeof newsArticles);
      setFilteredArticles(mockNews as typeof newsArticles);
      setIsLoading(false);
    };

    fetchNews();
  }, []);

  // Filter articles
  useEffect(() => {
    let result = [...newsArticles];

    if (searchTerm) {
      result = result.filter(
        (article: { title: string; summary: string; tags: string[] }) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter(
        (article: any) => article.category === categoryFilter
      );
    }

    if (regionFilter !== "all") {
      result = result.filter((article: any) => article.region === regionFilter);
    }

    if (urgencyFilter !== "all") {
      result = result.filter(
        (article: any) => article.urgency === urgencyFilter
      );
    }

    result.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    setFilteredArticles(result);
  }, [searchTerm, categoryFilter, regionFilter, urgencyFilter, newsArticles]);

  const handleBookmark = (articleId: string) => {
    setNewsArticles((prev: Article[]) =>
      prev.map((article: Article) =>
        article.id === articleId
          ? { ...article, isBookmarked: !article.isBookmarked }
          : article
      )
    );
  };

  const handleShare = (article: Article) => {
    // Mock share functionality
    console.log("Sharing:", article.title);
  };

  const handleReadArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const newsStats = [
    {
      title: "Total Articles",
      value: newsArticles.length,
      change: "+3 today",
      trend: "up",
      icon: Globe,
    },
    {
      title: "High Priority",
      value: newsArticles.filter((a) => a.urgency === "High").length,
      change: "+1 today",
      trend: "up",
      icon: AlertTriangle,
    },
    {
      title: "Bookmarked",
      value: newsArticles.filter((a) => a.isBookmarked).length,
      change: "No change",
      trend: "neutral",
      icon: Bookmark,
    },
    {
      title: "This Week",
      value: newsArticles.filter((a: any) => {
        const articleDate = new Date(a.publishedAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return articleDate > weekAgo;
      }).length,
      change: "+5 this week",
      trend: "up",
      icon: Calendar,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      <BlurredBackground />

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse"></div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg shadow-sky-500/25">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Supply Chain News
                  </h1>
                  <p className="text-xl text-gray-600 mt-2 font-medium">
                    Real-time insights for global trade professionals
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ModernButton variant="secondary" size="md">
                <Filter className="w-5 h-5" />
                Advanced Filters
              </ModernButton>
              <ModernButton variant="primary" size="md">
                <Bell className="w-5 h-5" />
                Set Alerts
                <Zap className="w-4 h-4" />
              </ModernButton>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="relative z-10 px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <GlassmorphicCard className="p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search news, topics, or regions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-700 placeholder-gray-500 font-medium"
                />
              </div>

              <div className="flex gap-4">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-700 font-medium"
                >
                  <option value="all">All Categories</option>
                  <option value="Tariffs">Tariffs</option>
                  <option value="Trade">Trade</option>
                  <option value="Regional">Regional</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Economic">Economic</option>
                </select>

                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-700 font-medium"
                >
                  <option value="all">All Regions</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia-Pacific">Asia-Pacific</option>
                </select>

                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-700 font-medium"
                >
                  <option value="all">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </div>

      {/* News Grid */}
      <div className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-sky-200 rounded-full animate-spin border-t-sky-600"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-sky-400"></div>
                </div>
                <p className="text-gray-600 font-medium">
                  Loading latest news...
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article: Article, index: number) => (
                <div
                  key={article.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <NewsCard
                    article={article}
                    onBookmark={() => handleBookmark(article.id)}
                    onShare={() => handleShare(article)}
                    onRead={() => handleReadArticle(article)}
                  />
                </div>
              ))}
            </div>
          )}

          {filteredArticles.length === 0 && !isLoading && (
            <div className="text-center py-24">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 p-6 rounded-full bg-gray-100">
                  <Search className="w-full h-full text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
              <ModernButton
                variant="secondary"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setRegionFilter("all");
                  setUrgencyFilter("all");
                }}
              >
                Clear Filters
              </ModernButton>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassmorphicCard className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  {selectedArticle.title}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <ExternalLink className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {selectedArticle.summary}
              </p>
              <div className="text-center">
                <ModernButton
                  variant="primary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close Article
                </ModernButton>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
