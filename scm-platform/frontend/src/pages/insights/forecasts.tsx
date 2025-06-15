import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Brain,
  Zap,
  TrendingUp,
  Lightbulb,
  Search,
  Download,
  MoreVertical,
  Eye,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

interface Anomaly {
  id: number;
  detectedAt: string;
  entityType: string;
  entityId: number;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "New" | "Investigating" | "Resolved" | "Ignored";
  detectedByModel: string;
}

interface Forecast {
  id: number;
  forecastDate: string;
  itemType: string;
  itemId: number;
  itemName: string;
  predictedValue: number;
  unit: string;
  confidenceIntervalLow?: number;
  confidenceIntervalHigh?: number;
  historicalData: { date: string; value: number }[];
  forecastModel: string;
}

interface Suggestion {
  id: number;
  generatedAt: string;
  suggestionType: string;
  description: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  priority: "Low" | "Medium" | "High";
  status: "New" | "Reviewed" | "Implemented" | "Dismissed";
  generatedByModel: string;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#8A2BE2",
  "#8DD1E1",
  "#C70039",
];

const AiInsightsPage: React.FC = () => {
  const router = useRouter();
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const [anomalySearchTerm, setAnomalySearchTerm] = useState<string>("");
  const [anomalySeverityFilter, setAnomalySeverityFilter] =
    useState<string>("All");

  const [suggestionSearchTerm, setSuggestionSearchTerm] = useState<string>("");
  const [suggestionPriorityFilter, setSuggestionPriorityFilter] =
    useState<string>("All");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from actual endpoints
  const fetchAnomalies = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/anomalies`);
      if (!response.ok) throw new Error("Failed to fetch anomalies");
      const data = await response.json();
      setAnomalies(data);
    } catch (err) {
      console.error("Error fetching anomalies:", err);
      setError("Failed to load anomaly data");
    }
  };

  const fetchForecasts = async () => {
    try {
      // Using riskpredictions endpoint for forecast data
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/riskpredictions`);
      if (!response.ok) throw new Error("Failed to fetch forecasts");
      const data = await response.json();

      // Transform risk prediction data to forecast format
      const transformed = data.map((prediction: any) => ({
        id: prediction.id,
        forecastDate: prediction.predictionDate,
        itemType: prediction.itemType,
        itemId: prediction.itemId,
        itemName: prediction.itemName,
        predictedValue: prediction.predictedValue,
        unit: prediction.unit || "units",
        confidenceIntervalLow: prediction.confidenceRange?.low,
        confidenceIntervalHigh: prediction.confidenceRange?.high,
        historicalData: prediction.historicalData || [],
        forecastModel: prediction.modelName || "RiskPredictionModel",
      }));

      setForecasts(transformed);
    } catch (err) {
      console.error("Error fetching forecasts:", err);
      setError("Failed to load forecast data");
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/aisuggestion`);
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setError("Failed to load suggestion data");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchAnomalies(),
          fetchForecasts(),
          fetchSuggestions(),
        ]);
      } catch (err) {
        setError("Failed to load some data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getSeverityDisplay = (severity: Anomaly["severity"]) => {
    switch (severity) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSuggestionPriorityDisplay = (priority: Suggestion["priority"]) => {
    switch (priority) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAnomalies = anomalies.filter((anomaly) => {
    const matchesSeverity =
      anomalySeverityFilter === "All" ||
      anomaly.severity === anomalySeverityFilter;
    const matchesSearch =
      anomalySearchTerm === "" ||
      anomaly.description
        .toLowerCase()
        .includes(anomalySearchTerm.toLowerCase()) ||
      anomaly.entityType
        .toLowerCase()
        .includes(anomalySearchTerm.toLowerCase()) ||
      anomaly.detectedByModel
        .toLowerCase()
        .includes(anomalySearchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const filteredSuggestions = suggestions.filter((suggestion) => {
    const matchesPriority =
      suggestionPriorityFilter === "All" ||
      suggestion.priority === suggestionPriorityFilter;
    const matchesSearch =
      suggestionSearchTerm === "" ||
      suggestion.description
        .toLowerCase()
        .includes(suggestionSearchTerm.toLowerCase()) ||
      suggestion.suggestionType
        .toLowerCase()
        .includes(suggestionSearchTerm.toLowerCase()) ||
      suggestion.generatedByModel
        .toLowerCase()
        .includes(suggestionSearchTerm.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const aiStats = {
    totalAnomalies: anomalies.length,
    criticalAnomalies: anomalies.filter((a) => a.severity === "Critical")
      .length,
    openSuggestions: suggestions.filter((s) => s.status === "New").length,
    totalForecasts: forecasts.length,
    recentForecastDate:
      forecasts.length > 0 ? forecasts[0].forecastDate : "N/A",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn={true} />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn={true} />
        <div className="flex justify-center items-center h-96">
          <div className="text-red-500 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.2)_1px,transparent_1px)] bg-[size:50px_50px] z-0"></div>

      <Navbar isLoggedIn={true} />

      <div className="p-8 pt-20 relative z-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
              <p className="text-gray-600 mt-1">
                Leverage artificial intelligence for anomaly detection,
                forecasting, and actionable suggestions
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export AI Report
              </button>
              <button
                onClick={() => {
                  Promise.all([
                    fetchAnomalies(),
                    fetchForecasts(),
                    fetchSuggestions(),
                  ]);
                }}
                className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
              >
                <Brain className="h-4 w-4 mr-2" />
                Refresh Data
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
                  Total Anomalies Detected
                </p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {aiStats.totalAnomalies}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-sky-50">
                <Zap className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Critical Anomalies
                </p>
                <p className="text-2xl font-semibold text-red-600 mt-1">
                  {aiStats.criticalAnomalies}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Open Suggestions
                </p>
                <p className="text-2xl font-semibold text-yellow-600 mt-1">
                  {aiStats.openSuggestions}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <Lightbulb className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Active Forecasts
                </p>
                <p className="text-2xl font-semibold text-green-600 mt-1">
                  {aiStats.totalForecasts}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Anomaly Detection Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-sky-600" /> Anomaly Detection
            </h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search anomalies..."
                  value={anomalySearchTerm}
                  onChange={(e) => setAnomalySearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                />
              </div>
              <select
                value={anomalySeverityFilter}
                onChange={(e) => setAnomalySeverityFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
              >
                <option value="All">All Severity</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detected At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detected By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-gray-200">
                {filteredAnomalies.map((anomaly) => (
                  <tr key={anomaly.id} className="hover:bg-gray-50/70">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{anomaly.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(anomaly.detectedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {anomaly.entityType} ({anomaly.entityId})
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 line-clamp-1">
                      {anomaly.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityDisplay(
                          anomaly.severity
                        )}`}
                      >
                        {anomaly.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {anomaly.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {anomaly.detectedByModel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          router.push(`/ai-insights/anomalies/${anomaly.id}`)
                        }
                        className="text-sky-600 hover:text-sky-800 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forecasting Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
            <TrendingUp className="h-5 w-5 mr-2 text-sky-600" /> Forecasting
          </h3>
          {forecasts.map((forecast) => (
            <div
              key={forecast.id}
              className="mb-6 p-4 bg-gray-50/70 rounded-lg"
            >
              <p className="text-md font-semibold text-gray-900 mb-2">
                {forecast.itemName} ({forecast.itemType} ID: {forecast.itemId})
                - Forecast for{" "}
                {new Date(forecast.forecastDate).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span className="mr-4">
                  Predicted Value:{" "}
                  <span className="font-medium text-gray-900">
                    {forecast.predictedValue} {forecast.unit}
                  </span>
                </span>
                {forecast.confidenceIntervalLow &&
                  forecast.confidenceIntervalHigh && (
                    <span>
                      Confidence: ({forecast.confidenceIntervalLow} -{" "}
                      {forecast.confidenceIntervalHigh}) {forecast.unit}
                    </span>
                  )}
              </div>
              {forecast.historicalData?.length > 0 && (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        ...forecast.historicalData,
                        {
                          date: forecast.forecastDate,
                          value: forecast.predictedValue,
                        },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0ea5e9"
                        name="Value"
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8B5CF6"
                        name="Forecast"
                        dot={{ r: 6 }}
                        activeDot={{ r: 8 }}
                        data={[
                          {
                            date: forecast.forecastDate,
                            value: forecast.predictedValue,
                          },
                        ]}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              <button
                onClick={() =>
                  router.push(`/ai-insights/forecasts/${forecast.id}`)
                }
                className="mt-4 inline-flex items-center px-3 py-1.5 border border-sky-300 rounded-lg text-sm font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors"
              >
                View Details <Eye className="h-4 w-4 ml-2" />
              </button>
            </div>
          ))}
          {forecasts.length === 0 && (
            <p className="text-gray-500">No forecasts available.</p>
          )}
        </div>

        {/* AI Suggestions Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-sky-600" /> AI Suggestions
            </h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search suggestions..."
                  value={suggestionSearchTerm}
                  onChange={(e) => setSuggestionSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                />
              </div>
              <select
                value={suggestionPriorityFilter}
                onChange={(e) => setSuggestionPriorityFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
              >
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-gray-200">
                {filteredSuggestions.map((suggestion) => (
                  <tr key={suggestion.id} className="hover:bg-gray-50/70">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{suggestion.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(suggestion.generatedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {suggestion.suggestionType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 line-clamp-1">
                      {suggestion.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSuggestionPriorityDisplay(
                          suggestion.priority
                        )}`}
                      >
                        {suggestion.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {suggestion.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          router.push(
                            `/ai-insights/suggestions/${suggestion.id}`
                          )
                        }
                        className="text-sky-600 hover:text-sky-800 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent AI Activity */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent AI Activity
          </h3>
          <div className="space-y-3">
            {anomalies.slice(0, 1).map((anomaly) => (
              <div
                key={anomaly.id}
                className="flex items-start p-3 bg-sky-50/70 rounded-lg"
              >
                <div className="bg-sky-100 p-2 rounded-full mr-3">
                  <Zap className="h-4 w-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {anomaly.severity} anomaly detected: {anomaly.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(anomaly.detectedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {suggestions.slice(0, 1).map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex items-start p-3 bg-sky-50/70 rounded-lg"
              >
                <div className="bg-sky-100 p-2 rounded-full mr-3">
                  <Lightbulb className="h-4 w-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {suggestion.priority} priority suggestion:{" "}
                    {suggestion.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(suggestion.generatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {forecasts.slice(0, 1).map((forecast) => (
              <div
                key={forecast.id}
                className="flex items-start p-3 bg-sky-50/70 rounded-lg"
              >
                <div className="bg-sky-100 p-2 rounded-full mr-3">
                  <TrendingUp className="h-4 w-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Forecast updated for {forecast.itemName} (
                    {forecast.forecastDate})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Predicted value: {forecast.predictedValue} {forecast.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AiInsightsPage;
