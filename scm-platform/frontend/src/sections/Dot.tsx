import { SxProps, Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import getColors from "../utils/getColors";

interface DotProps {
  color?: string;
  size?: number;
  variant?: "filled" | "outlined";
  sx?: SxProps<Theme>;
}

export default function Dot({
  color = "primary",
  size = 8,
  variant = "filled",
  sx = {},
}: DotProps) {
  const theme = useTheme();
  const colors = getColors(theme, color);
  const { main } = colors;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        ...(variant === "outlined"
          ? { border: `1px solid ${main}` }
          : { bgcolor: main }),
        ...sx,
      }}
    />
  );
}
