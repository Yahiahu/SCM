import { IconType } from "react-icons";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface StatsCardProps {
  title: string;
  value: number;
  icon: IconType;
  change: string;
  isPositive: boolean;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  isPositive,
}: StatsCardProps) {
  return (
    <div
      className={`p-6 rounded-xl border shadow-sm ${
        isPositive
          ? "bg-green-50 border-l-4 border-green-400 border-green-100"
          : "bg-red-50 border-l-4 border-red-400 border-red-100"
      }`}
    >
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <Icon className="w-6 h-6 text-cyan-500" />
      </div>

      <div className="text-2xl font-semibold text-gray-800 mt-2">{value}</div>

      <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
        {isPositive ? (
          <FaArrowUp className="text-green-500" />
        ) : (
          <FaArrowDown className="text-red-500" />
        )}
        <span className={isPositive ? "text-green-600" : "text-red-600"}>
          {change}
        </span>
      </div>
    </div>
  );
}
