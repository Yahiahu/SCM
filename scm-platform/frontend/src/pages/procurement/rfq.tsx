"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";
import { useToast } from "@/components/ui/use-toast";
import {
  FileText,
  Filter,
  Search,
  Plus,
  Download,
  Mail,
  MoreVertical,
  Eye,
  Edit,
  Send,
  CheckCircle,
  Hourglass,
  XCircle,
  AlertCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import {
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
} from "recharts";

// Reuse background effect
const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

interface RequestForQuotation {
  id: number;
  rfqNumber: string;
  title: string;
  status:
    | "Draft"
    | "Sent"
    | "AwaitingQuotes"
    | "QuotesReceived"
    | "Awarded"
    | "Closed"
    | "Cancelled";
  dueDate: string;
  supplierCount: number;
  quotesReceivedCount: number;
  createdAt: string;
  lastUpdated: string;
  awardStatus?: "Awarded" | "NotAwarded" | null;
  totalEstimatedCost?: number;
}

interface RfqStats {
  totalRfqs: number;
  draftRfqs: number;
  sentRfqs: number;
  awaitingQuotesRfqs: number;
  quotesReceivedRfqs: number;
  awardedRfqs: number;
  closedRfqs: number;
  cancelledRfqs: number;
}

interface RfqActivity {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  rfqId?: number;
  rfqNumber?: string;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#8A2BE2",
  "#83A6ED",
  "#8DD1E1",
];

const RfqPage: React.FC = () => {
  const router = useRouter();
  const  toast  = useToast();
  const [rfqs, setRfqs] = useState<RequestForQuotation[]>([]);
  const [rfqStats, setRfqStats] = useState<RfqStats>({
    totalRfqs: 0,
    draftRfqs: 0,
    sentRfqs: 0,
    awaitingQuotesRfqs: 0,
    quotesReceivedRfqs: 0,
    awardedRfqs: 0,
    closedRfqs: 0,
    cancelledRfqs: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RfqActivity[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<keyof RequestForQuotation>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

  const rfqsRes = await fetch("/api/rfqs");

  if (!rfqsRes.ok) {
    throw new Error("Failed to fetch RFQs");
  }

  const rfqsData = await rfqsRes.json();
  
  // Generate stats on the client
const statsData = {
  totalRfqs: rfqsData.length,
  draftRfqs: rfqsData.filter((r: { status: string; }) => r.status === "Draft").length,
  sentRfqs: rfqsData.filter((r: { status: string; }) => r.status === "Sent").length,
  awaitingQuotesRfqs: rfqsData.filter((r: { status: string; }) => r.status === "AwaitingQuotes").length,
  quotesReceivedRfqs: rfqsData.filter((r: { status: string; }) => r.status === "QuotesReceived").length,
  awardedRfqs: rfqsData.filter((r: { status: string; }) => r.status === "Awarded").length,
  closedRfqs: rfqsData.filter((r: { status: string; }) => r.status === "Closed").length,
  cancelledRfqs: rfqsData.filter((r: { status: string; }) => r.status === "Cancelled").length,
};


  // Simulate recent activity from RFQs
  const activityData = rfqsData
    .slice()
    .sort(
      (a: { created_at: string }, b: { created_at: string }) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5)
    .map((rfq: { created_at: string; items: any[]; supplier: { name: string } }) => ({
      date: rfq.created_at,
      description: `RFQ for ${rfq.items
        .map((i) => i.component.num)
        .join(", ")} to ${rfq.supplier.name}`,
    }));

  // ✅ Set state
  setRfqs(rfqsData);
  setRfqStats(statsData);
  setRecentActivity(activityData);
  setLoading(false);
} catch (err: any) {
  setError(`Failed to fetch data: ${err.message}`);
  toast({
    title: "Error",
    description: `Failed to fetch data: ${err.message}`,
    variant: "destructive",
  });
  console.error("Error fetching data:", err);
  setLoading(false);
}
}


  const getStatusDisplay = (status: RequestForQuotation["status"]) => {
    switch (status) {
      case "Draft":
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <FileText className="h-3 w-3" />,
        };
      case "Sent":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <Send className="h-3 w-3" />,
        };
      case "AwaitingQuotes":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Hourglass className="h-3 w-3" />,
        };
      case "QuotesReceived":
        return {
          color: "bg-purple-100 text-purple-800",
          icon: <DollarSign className="h-3 w-3" />,
        };
      case "Awarded":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-3 w-3" />,
        };
      case "Closed":
        return {
          color: "bg-gray-200 text-gray-800",
          icon: <XCircle className="h-3 w-3" />,
        };
      case "Cancelled":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="h-3 w-3" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="h-3 w-3" />,
        };
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "creation":
        return <Plus className="h-4 w-4 text-sky-600" />;
      case "quote":
        return <DollarSign className="h-4 w-4 text-sky-600" />;
      case "award":
        return <CheckCircle className="h-4 w-4 text-sky-600" />;
      case "update":
        return <Edit className="h-4 w-4 text-sky-600" />;
      default:
        return <FileText className="h-4 w-4 text-sky-600" />;
    }
  };

  const handleSort = (field: keyof RequestForQuotation) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);

    const sortedRfqs = [...rfqs].sort((a, b) => {
      const aValue = a[field] as any;
      const bValue = b[field] as any;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return newSortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return newSortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
    setRfqs(sortedRfqs);
  };

  const filteredRfqs = rfqs.filter((rfq) => {
    const matchesStatus = statusFilter === "All" || rfq.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      rfq.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const rfqStatusData = [
    { name: "Draft", value: rfqStats.draftRfqs },
    { name: "Sent", value: rfqStats.sentRfqs },
    { name: "Awaiting Quotes", value: rfqStats.awaitingQuotesRfqs },
    { name: "Quotes Received", value: rfqStats.quotesReceivedRfqs },
    { name: "Awarded", value: rfqStats.awardedRfqs },
    { name: "Closed", value: rfqStats.closedRfqs },
    { name: "Cancelled", value: rfqStats.cancelledRfqs },
  ];

  const totalSent =
    rfqStats.sentRfqs +
    rfqStats.awaitingQuotesRfqs +
    rfqStats.quotesReceivedRfqs +
    rfqStats.awardedRfqs +
    rfqStats.closedRfqs;
  const totalQuotesReceived =
    rfqStats.quotesReceivedRfqs + rfqStats.awardedRfqs + rfqStats.closedRfqs;
  const responseRateData = [
    { name: "Quotes Received", value: totalQuotesReceived },
    {
      name: "Awaiting/Sent",
      value:
        totalSent - totalQuotesReceived < 0
          ? 0
          : totalSent - totalQuotesReceived,
    },
  ];

  const handleRfqClick = (id: number) => {
    router.push(`/rfqs/${id}`);
  };

  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-800 text-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-800 text-lg">
        <div className="text-red-500 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.2)_1px,transparent_1px)] bg-[size:50px_50px] z-0"></div>

      <Navbar isLoggedIn={true} />
      <Sidebar visible={sidebarVisible} setVisible={setSidebarVisible} />

      <main
        className={`transition-all duration-300 pt-20 relative z-10 ${
          sidebarVisible ? "ml-[180px]" : "ml-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Requests for Quotation (RFQs)
                </h1>
                <p className="text-gray-600 mt-1">
                  Streamline your sourcing process and manage supplier bids
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </button>
                <button
                  onClick={() => router.push("/rfqs/new")}
                  className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New RFQ
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total RFQs
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {rfqStats.totalRfqs}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-sky-50">
                  <FileText className="h-6 w-6 text-sky-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Awaiting Quotes
                  </p>
                  <p className="text-2xl font-semibold text-yellow-600 mt-1">
                    {rfqStats.awaitingQuotesRfqs + rfqStats.sentRfqs}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50">
                  <Hourglass className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Quotes Received
                  </p>
                  <p className="text-2xl font-semibold text-purple-600 mt-1">
                    {rfqStats.quotesReceivedRfqs}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Awarded RFQs
                  </p>
                  <p className="text-2xl font-semibold text-green-600 mt-1">
                    {rfqStats.awardedRfqs}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reminders
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Review Quotes
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Calendar className="h-4 w-4 mr-2" />
                  Set Due Dates
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by RFQ # or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
              >
                <option value="All">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="AwaitingQuotes">Awaiting Quotes</option>
                <option value="QuotesReceived">Quotes Received</option>
                <option value="Awarded">Awarded</option>
                <option value="Closed">Closed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* RFQs Table */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/70">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("rfqNumber")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>RFQ #</span>
                        {sortField === "rfqNumber" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Suppliers Invited
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quotes Received
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200">
                  {filteredRfqs.map((rfq) => {
                    const statusDisplay = getStatusDisplay(rfq.status);
                    return (
                      <tr
                        key={rfq.id}
                        className="hover:bg-gray-50/70 cursor-pointer transition-colors"
                        onClick={() => handleRfqClick(rfq.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {rfq.rfqNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 line-clamp-1">
                            {rfq.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`}
                          >
                            {statusDisplay.icon}
                            <span>{rfq.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(rfq.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {rfq.supplierCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {rfq.quotesReceivedCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(rfq.lastUpdated).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRfqClick(rfq.id);
                              }}
                              className="text-sky-600 hover:text-sky-800 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Footer */}
          <div className="mb-6 flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing {filteredRfqs.length} of {rfqs.length} RFQs
            </div>
            <div className="flex items-center space-x-4">
              <span>
                Draft: {rfqStats.draftRfqs} | Awaiting Quotes:{" "}
                {rfqStats.awaitingQuotesRfqs} | Awarded: {rfqStats.awardedRfqs}
              </span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* RFQ Status Distribution Pie Chart */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                RFQ Status Distribution
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rfqStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {rfqStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-rfq-status-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RFQ Response Rate Bar Chart */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                RFQ Response Rate
              </h3>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={responseRateData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      <Cell key={`cell-response-0`} fill={COLORS[1]} />
                      <Cell key={`cell-response-1`} fill={COLORS[3]} />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent RFQ Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start p-3 bg-sky-50/70 rounded-lg"
                >
                  <div className="bg-sky-100 p-2 rounded-full mr-3">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
  };
export default RfqPage;
