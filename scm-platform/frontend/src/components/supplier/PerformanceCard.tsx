"use client";

interface PerformanceCardProps {
  avgOnTimeRate: string;
  avgResponseTime: string;
  onGenerateReport: () => void;
}

export const PerformanceCard = ({
  avgOnTimeRate,
  avgResponseTime,
  onGenerateReport,
}: PerformanceCardProps) => {
  const onTimeValue = parseFloat(avgOnTimeRate);
  const responsePercent = 100 - (parseFloat(avgResponseTime) / 72) * 100;

  return (
    <div className="rounded-xl bg-white border border-sky-100 shadow-sm p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Supplier Performance
      </h2>

      <div className="space-y-5">
        <div>
          <p className="text-sm text-gray-600 mb-2">Avg. On-Time Rate</p>
          <div className="w-full h-3 bg-sky-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${onTimeValue}%` }}
            />
          </div>
          <p className="text-right text-xs text-gray-500 mt-1">
            {onTimeValue}%
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Avg. Response Time</p>
          <div className="w-full h-3 bg-sky-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${responsePercent}%` }}
            />
          </div>
          <p className="text-right text-xs text-gray-500 mt-1">
            {avgResponseTime} hours
          </p>
        </div>
      </div>

      <div>
        <button
          onClick={onGenerateReport}
          className="w-full py-2 mt-2 rounded-md bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition"
        >
          Supplier Performance Report
        </button>
      </div>
    </div>
  );
};
