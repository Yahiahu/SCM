import React, { useState, useEffect } from "react";
import {
  DollarSign,
  ReceiptText,
  CreditCard,
  Plus,
  Download,
  Search,
  Filter,
  Eye,
  Edit,
  Mail,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  Clock,
  Users,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Bell,
  Settings,
  RefreshCw,
  FileText,
  Wallet,
  Target,
  Activity,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import axios from "axios";

// Reuse background effect
const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

interface Invoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  status:
    | "Draft"
    | "Sent"
    | "Paid"
    | "Partially Paid"
    | "Overdue"
    | "Cancelled";
  currency: string;
}

interface Payment {
  id: number;
  paymentId: string;
  invoiceId?: number;
  invoiceNumber?: string;
  paymentDate: string;
  amount: number;
  type: "Incoming" | "Outgoing";
  method: "Bank Transfer" | "Credit Card" | "Cheque" | "Cash";
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  description: string;
  currency: string;
}

interface FinancialSummary {
  totalOutstandingInvoices: number;
  totalRevenueYTD: number;
  totalExpensesYTD: number;
  currentCashBalance: number;
  overdueInvoicesCount: number;
  averagePaymentDays: number;
}

interface CashFlowData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

const COLORS = {
  primary: "#0ea5e9",
  primaryLight: "#38bdf8",
  primaryDark: "#0284c7",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#6366f1",
  purple: "#8b5cf6",
  emerald: "#059669",
  rose: "#e11d48",
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.success,
  COLORS.warning,
  COLORS.info,
  COLORS.purple,
  COLORS.danger,
  COLORS.emerald,
  COLORS.rose,
];

const FinanceAndInvoicingPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [financialSummary, setFinancialSummary] =
    useState<FinancialSummary | null>(null);
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([]);
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState<string>("");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string>("All");
  const [paymentSearchTerm, setPaymentSearchTerm] = useState<string>("");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "invoices" | "payments"
  >("overview");

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [
          invoicesResponse,
          paymentsResponse,
          summaryResponse,
          cashflowResponse,
        ] = await Promise.all([
          axios.get("/api/invoices"),
          axios.get("/api/payments"),
          axios.get("/api/finance/summary"),
          axios.get("/api/finance/cash-flow"),
        ]);

        setInvoices(invoicesResponse.data);
        setPayments(paymentsResponse.data);
        setFinancialSummary(summaryResponse.data);
        setCashFlowData(cashflowResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string, type: "invoice" | "payment") => {
    if (type === "invoice") {
      switch (status) {
        case "Paid":
          return "bg-emerald-100 text-emerald-700 border-emerald-200";
        case "Sent":
          return "bg-blue-100 text-blue-700 border-blue-200";
        case "Overdue":
          return "bg-red-100 text-red-700 border-red-200";
        case "Partially Paid":
          return "bg-amber-100 text-amber-700 border-amber-200";
        case "Draft":
          return "bg-gray-100 text-gray-700 border-gray-200";
        case "Cancelled":
          return "bg-slate-100 text-slate-700 border-slate-200";
        default:
          return "bg-gray-100 text-gray-700 border-gray-200";
      }
    } else {
      switch (status) {
        case "Completed":
          return "bg-emerald-100 text-emerald-700 border-emerald-200";
        case "Pending":
          return "bg-amber-100 text-amber-700 border-amber-200";
        case "Failed":
          return "bg-red-100 text-red-700 border-red-200";
        case "Refunded":
          return "bg-purple-100 text-purple-700 border-purple-200";
        default:
          return "bg-gray-100 text-gray-700 border-gray-200";
      }
    }
  };

  // Filtered Invoices based on search and status
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber
        .toLowerCase()
        .includes(invoiceSearchTerm.toLowerCase()) ||
      invoice.customerName
        .toLowerCase()
        .includes(invoiceSearchTerm.toLowerCase());
    const matchesStatus =
      invoiceStatusFilter === "All" || invoice.status === invoiceStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Payments based on search and type
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.paymentId
        .toLowerCase()
        .includes(paymentSearchTerm.toLowerCase()) ||
      (payment.invoiceNumber &&
        payment.invoiceNumber
          .toLowerCase()
          .includes(paymentSearchTerm.toLowerCase())) ||
      payment.description
        .toLowerCase()
        .includes(paymentSearchTerm.toLowerCase());
    const matchesType =
      paymentTypeFilter === "All" || payment.type === paymentTypeFilter;
    return matchesSearch && matchesType;
  });

  const invoiceStatusData = [
    {
      name: "Paid",
      value: invoices.filter((inv) => inv.status === "Paid").length,
      color: COLORS.success,
    },
    {
      name: "Sent",
      value: invoices.filter((inv) => inv.status === "Sent").length,
      color: COLORS.primary,
    },
    {
      name: "Overdue",
      value: invoices.filter((inv) => inv.status === "Overdue").length,
      color: COLORS.danger,
    },
    {
      name: "Partially Paid",
      value: invoices.filter((inv) => inv.status === "Partially Paid").length,
      color: COLORS.warning,
    },
    {
      name: "Draft",
      value: invoices.filter((inv) => inv.status === "Draft").length,
      color: COLORS.info,
    },
    {
      name: "Cancelled",
      value: invoices.filter((inv) => inv.status === "Cancelled").length,
      color: COLORS.rose,
    },
  ].filter((data) => data.value > 0); // Only show statuses that have invoices

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">
            Loading your financial data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      <BlurredBackground />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.2)_1px,transparent_1px)] bg-[size:50px_50px] z-0"></div>

      <Navbar isLoggedIn={true} />

      <div className="px-6 py-6 relative z-10 flex-grow">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Cash Balance Card */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50 hover:shadow-lg transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-emerald-600 text-sm font-medium">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>+12.5% MoM</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 mb-1">
                {financialSummary
                  ? formatCurrency(financialSummary.currentCashBalance)
                  : "-"}
              </p>
              <p className="text-slate-500 text-sm">Cash Balance</p>
            </div>
          </div>

          {/* YTD Revenue Card */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50 hover:shadow-lg transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-emerald-600 text-sm font-medium">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>+8.2% YoY</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 mb-1">
                {financialSummary
                  ? formatCurrency(financialSummary.totalRevenueYTD)
                  : "-"}
              </p>
              <p className="text-slate-500 text-sm">YTD Revenue</p>
            </div>
          </div>

          {/* Outstanding Invoices Card */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50 hover:shadow-lg transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl">
                <ReceiptText className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-red-600 text-sm font-medium">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>
                  {financialSummary?.overdueInvoicesCount || 0} Overdue
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 mb-1">
                {financialSummary
                  ? formatCurrency(financialSummary.totalOutstandingInvoices)
                  : "-"}
              </p>
              <p className="text-slate-500 text-sm">Outstanding Invoices</p>
            </div>
          </div>

          {/* Payment Cycle Card */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50 hover:shadow-lg transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>-3 days</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 mb-1">
                {financialSummary?.averagePaymentDays || 0}
              </p>
              <p className="text-slate-500 text-sm">Avg Payment Days</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white/50 backdrop-blur-sm p-1 rounded-2xl inline-flex">
            {[
              { id: "overview", label: "Overview", icon: PieChart },
              { id: "invoices", label: "Invoices", icon: ReceiptText },
              { id: "payments", label: "Payments", icon: CreditCard },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === id
                    ? "bg-white/70 backdrop-blur-sm text-blue-600 shadow-md"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cash Flow Chart */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800">
                  Cash Flow Trend
                </h3>
                <div className="flex items-center text-sm text-blue-600 font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+15% QoQ</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlowData}>
                    <defs>
                      <linearGradient
                        id="incomeGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.success}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.success}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="expenseGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.danger}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.danger}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis
                      stroke="#64748b"
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `$${value.toLocaleString()}`,
                        "",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke={COLORS.success}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#incomeGradient)"
                      name="Income"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke={COLORS.danger}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#expenseGradient)"
                      name="Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Invoice Status Distribution */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800">
                  Invoice Status
                </h3>
                <div className="flex items-center text-sm text-blue-600 font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+8% YoY</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={invoiceStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {invoiceStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {invoiceStatusData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-slate-600">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "invoices" && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 overflow-hidden">
            {/* Invoice Header */}
            <div className="p-6 border-b border-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  Invoice Management
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={invoiceSearchTerm}
                      onChange={(e) => setInvoiceSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                  </div>
                  <select
                    value={invoiceStatusFilter}
                    onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                    className="border border-slate-200/50 rounded-xl px-3 py-2 text-sm bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Status</option>
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Paid">Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Invoice Table */}
            <div className="overflow-x-auto">
              {filteredInvoices.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50">
                    {filteredInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-slate-900">
                            {invoice.invoiceNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-slate-900">
                            {invoice.customerName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-slate-900 font-semibold">
                            {formatCurrency(
                              invoice.totalAmount,
                              invoice.currency
                            )}
                          </div>
                          {invoice.balanceDue > 0 && (
                            <div className="text-xs text-red-600">
                              {formatCurrency(
                                invoice.balanceDue,
                                invoice.currency
                              )}{" "}
                              due
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              invoice.status,
                              "invoice"
                            )}`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50/50 rounded">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50/50 rounded">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50/50 rounded">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center text-slate-500">
                  No invoices found matching your criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 overflow-hidden">
            {/* Payment Header */}
            <div className="p-6 border-b border-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  Payment Tracking
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search payments..."
                      value={paymentSearchTerm}
                      onChange={(e) => setPaymentSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                  </div>
                  <select
                    value={paymentTypeFilter}
                    onChange={(e) => setPaymentTypeFilter(e.target.value)}
                    className="border border-slate-200/50 rounded-xl px-3 py-2 text-sm bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Types</option>
                    <option value="Incoming">Incoming</option>
                    <option value="Outgoing">Outgoing</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Table */}
            <div className="overflow-x-auto">
              {filteredPayments.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Payment ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50">
                    {filteredPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-slate-900">
                            {payment.paymentId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-slate-900">
                            {payment.invoiceNumber || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                          {formatDateTime(payment.paymentDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-slate-900 font-semibold">
                            {formatCurrency(payment.amount, payment.currency)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${
                              payment.type === "Incoming"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-red-100 text-red-700 border-red-200"
                            }`}
                          >
                            {payment.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              payment.status,
                              "payment"
                            )}`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                          {payment.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center text-slate-500">
                  No payments found matching your criteria.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FinanceAndInvoicingPage;
