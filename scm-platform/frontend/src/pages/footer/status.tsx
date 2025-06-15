import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Activity,
  Zap,
  Globe,
  Database,
  Shield,
} from "lucide-react";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";

const StatusPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [uptimePercentage, setUptimePercentage] = useState(99.98);
  const [hasMounted, setHasMounted] = useState(false); // ✅ new state

  useEffect(() => {
    setHasMounted(true); // ✅ set after mount
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const services = [
    {
      name: "API Gateway",
      status: "operational",
      icon: <Globe className="w-5 h-5" />,
      responseTime: "127ms",
      uptime: "99.99%",
    },
    {
      name: "Database",
      status: "operational",
      icon: <Database className="w-5 h-5" />,
      responseTime: "43ms",
      uptime: "99.98%",
    },
    {
      name: "Authentication",
      status: "operational",
      icon: <Shield className="w-5 h-5" />,
      responseTime: "89ms",
      uptime: "100%",
    },
    {
      name: "File Storage",
      status: "degraded",
      icon: <Activity className="w-5 h-5" />,
      responseTime: "234ms",
      uptime: "99.95%",
    },
    {
      name: "CDN",
      status: "operational",
      icon: <Zap className="w-5 h-5" />,
      responseTime: "56ms",
      uptime: "99.97%",
    },
  ];

  const incidents = [
    {
      id: 1,
      title: "File Storage Performance Degradation",
      status: "investigating",
      time: "2 hours ago",
      description:
        "We are currently investigating slower than normal response times for file upload operations.",
    },
    {
      id: 2,
      title: "Scheduled Maintenance - Database Cluster",
      status: "completed",
      time: "1 day ago",
      description:
        "Completed routine maintenance on our primary database cluster. All services are now fully operational.",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600 bg-green-100";
      case "degraded":
        return "text-yellow-600 bg-yellow-100";
      case "outage":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "degraded":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "outage":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const overallStatus = services.every((s) => s.status === "operational")
    ? "operational"
    : services.some((s) => s.status === "outage")
    ? "outage"
    : "degraded";

  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar isLoggedIn={true} />

      <main className="max-w-7xl mx-auto px-6 py-8 pt-20">
        {/* Overall Status Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                System Status
              </h1>
              <p className="text-gray-600">
                Real-time monitoring of all TSX services
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">
                Current Time (UTC)
              </div>
              {hasMounted && (
                <div className="text-lg font-mono text-gray-900">
                  {currentTime.toUTCString()}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {getStatusIcon(overallStatus)}
            <div>
              <div className="text-2xl font-semibold text-gray-900 capitalize">
                {overallStatus === "operational"
                  ? "All Systems Operational"
                  : overallStatus === "degraded"
                  ? "Partial System Outage"
                  : "System Outage"}
              </div>
              <div className="text-gray-600">
                Overall uptime:{" "}
                <span className="font-semibold text-blue-600">
                  {uptimePercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {service.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {service.name}
                  </h3>
                </div>
                {getStatusIcon(service.status)}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      service.status
                    )}`}
                  >
                    {service.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium text-gray-900">
                    {service.responseTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Uptime (30d)</span>
                  <span className="text-sm font-medium text-green-600">
                    {service.uptime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                99.98%
              </div>
              <div className="text-sm text-gray-600">30-day Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">127ms</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-sm text-gray-600">Active Incidents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2.1M</div>
              <div className="text-sm text-gray-600">Requests/Hour</div>
            </div>
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Incidents
          </h2>
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="border-l-4 border-blue-200 pl-4 py-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {incident.title}
                  </h3>
                  <span className="text-sm text-gray-500">{incident.time}</span>
                </div>
                <div className="flex items-center space-x-3 mb-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      incident.status === "investigating"
                        ? "text-yellow-600 bg-yellow-100"
                        : incident.status === "completed"
                        ? "text-green-600 bg-green-100"
                        : "text-gray-600 bg-gray-100"
                    }`}
                  >
                    {incident.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{incident.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StatusPage;
