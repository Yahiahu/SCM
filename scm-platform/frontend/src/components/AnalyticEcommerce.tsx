import { Chip, Stack, Typography, Box, SxProps, Theme } from "@mui/material";
import RiseOutlined from "@ant-design/icons/RiseOutlined";
import FallOutlined from "@ant-design/icons/FallOutlined";
import MainCard from "components/MainCard";

type AnalyticEcommerceProps = {
  color?:
    | "primary"
    | "secondary"
    | "default"
    | "success"
    | "error"
    | "info"
    | "warning";
  title: string;
  count: string;
  percentage?: number;
  isLoss?: boolean;
  extra: string;
};

const iconStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "inherit",
  marginLeft: 0,
  marginRight: 0,
};

export default function AnalyticEcommerce({
  color = "primary",
  title,
  count,
  percentage,
  isLoss = false,
  extra,
}: AnalyticEcommerceProps) {
  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h4" color="inherit">
            {count}
          </Typography>
          {percentage !== undefined && (
            <Chip
              variant="outlined"
              color={color}
              icon={
                isLoss ? (
                  <FallOutlined style={iconStyle} />
                ) : (
                  <RiseOutlined style={iconStyle} />
                )
              }
              label={`${percentage}%`}
              sx={{ pl: 1 }}
              size="small"
            />
          )}
        </Box>
      </Stack>
      <Box sx={{ pt: 2.25 }}>
        <Typography variant="caption" color="text.secondary">
          You made an extra{" "}
          <Typography
            component="span"
            variant="caption"
            sx={{ color: `${color}.main`, fontWeight: 500 }}
          >
            {extra}
          </Typography>{" "}
          this year
        </Typography>
      </Box>
    </MainCard>
  );
}
