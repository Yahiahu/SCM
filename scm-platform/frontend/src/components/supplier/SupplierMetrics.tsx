interface SupplierMetricsProps {
  totalSuppliers: number;
  preferredSuppliers: number;
  avgRating: string;
  avgOnTimeRate: string;
}

export const SupplierMetrics = ({
  totalSuppliers,
  preferredSuppliers,
  avgRating,
  avgOnTimeRate,
}: SupplierMetricsProps) => {
  const metrics = [
    {
      label: "Total Suppliers",
      value: totalSuppliers,
      change: "5%",
      direction: "up",
    },
    {
      label: "Preferred",
      value: preferredSuppliers,
      change: "12%",
      direction: "up",
    },
    {
      label: "Avg. Rating",
      value: avgRating,
      change: "2%",
      direction: "down",
    },
    {
      label: "Avg. On-Time Rate",
      value: `${avgOnTimeRate}%`,
      change: "3%",
      direction: "up",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-sky-100 bg-white shadow-sm px-5 py-4"
        >
          <div className="text-sm text-gray-500">{metric.label}</div>
          <div className="text-2xl font-semibold text-gray-800">
            {metric.value}
          </div>
          <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <span
              className={`${
                metric.direction === "up" ? "text-green-500" : "text-red-500"
              } font-medium`}
            >
              {metric.direction === "up" ? "▲" : "▼"} {metric.change}
            </span>
            <span>from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};
