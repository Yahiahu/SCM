import { useState } from "react";
import { Stack, Typography, Box, useTheme, alpha } from "@mui/material";
import { LineChart } from "@mui/x-charts";

const monthlyLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const monthlyData1 = [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35];
const weeklyData1 = [31, 40, 28, 51, 42, 109, 100];
const monthlyData2 = [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41];
const weeklyData2 = [11, 32, 45, 32, 34, 52, 41];

type LegendItem = {
  label: string;
  color: string;
  visible: boolean;
};

interface LegendProps {
  items: LegendItem[];
  onToggle: (label: string) => void;
}

function Legend({ items, onToggle }: LegendProps) {
  return (
    <Stack
      direction="row"
      sx={{
        gap: 2,
        alignItems: "center",
        justifyContent: "center",
        mt: 2.5,
        mb: 1.5,
      }}
    >
      {items.map((item) => (
        <Stack
          key={item.label}
          direction="row"
          sx={{ gap: 1.25, alignItems: "center", cursor: "pointer" }}
          onClick={() => onToggle(item.label)}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              bgcolor: item.visible ? item.color : "grey.500",
              borderRadius: "50%",
            }}
          />
          <Typography variant="body2" color="text.primary">
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

interface IncomeAreaChartProps {
  view: "monthly" | "weekly";
}

export default function IncomeAreaChart({ view }: IncomeAreaChartProps) {
  const theme = useTheme();

  const [visibility, setVisibility] = useState<Record<string, boolean>>({
    "Page views": true,
    Sessions: true,
  });

  const labels = view === "monthly" ? monthlyLabels : weeklyLabels;
  const data1 = view === "monthly" ? monthlyData1 : weeklyData1;
  const data2 = view === "monthly" ? monthlyData2 : weeklyData2;

  const toggleVisibility = (label: string) => {
    setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const visibleSeries = [
    {
      data: data1,
      label: "Page views",
      color: theme.palette.primary.main,
      visible: visibility["Page views"],
    },
    {
      data: data2,
      label: "Sessions",
      color: theme.palette.primary.dark,
      visible: visibility["Sessions"],
    },
  ];

  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };
  const lineColor = theme.palette.divider;

  const chartSeries = visibleSeries
    .filter((s) => s.visible)
    .map((s, idx) => ({
      type: "line" as const,
      data: s.data,
      label: s.label,
      showMark: false,
      area: true,
      id: `series-${idx}`,
      color: s.color,
    }));

  return (
    <>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="myGradient1" gradientTransform="rotate(90)">
            <stop
              offset="10%"
              stopColor={alpha(theme.palette.primary.main, 0.4)}
            />
            <stop
              offset="90%"
              stopColor={alpha(theme.palette.background.default, 0.4)}
            />
          </linearGradient>
          <linearGradient id="myGradient2" gradientTransform="rotate(90)">
            <stop
              offset="10%"
              stopColor={alpha(theme.palette.primary.dark, 0.4)}
            />
            <stop
              offset="90%"
              stopColor={alpha(theme.palette.background.default, 0.4)}
            />
          </linearGradient>
        </defs>
      </svg>

      {chartSeries.length > 0 && (
        <LineChart
          grid={{ horizontal: true }}
          xAxis={[
            {
              scaleType: "point",
              data: labels,
              disableLine: true,
              tickLabelStyle: axisFontStyle,
            },
          ]}
          yAxis={[
            {
              disableLine: true,
              disableTicks: true,
              tickLabelStyle: axisFontStyle,
            },
          ]}
          series={chartSeries}
          height={450}
          margin={{ top: 40, bottom: 20, right: 20 }}
          sx={{
            "& .MuiAreaElement-series-0": {
              fill: "url(#myGradient1)",
              opacity: 0.8,
            },
            "& .MuiAreaElement-series-1": {
              fill: "url(#myGradient2)",
              opacity: 0.8,
            },
            "& .MuiChartsAxis-directionX .MuiChartsAxis-tick": {
              stroke: lineColor,
            },
          }}
        />
      )}

      <Legend items={visibleSeries} onToggle={toggleVisibility} />
    </>
  );
}
