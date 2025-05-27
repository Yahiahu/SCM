// material-ui
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// third-party
import { NumericFormat } from "react-number-format";

// project imports
import Dot from "./Dot";

type Order = "asc" | "desc";

interface HeadCell {
  id: keyof RowData;
  align: "left" | "right" | "center";
  disablePadding: boolean;
  label: string;
}

interface RowData {
  tracking_no: number;
  name: string;
  fat: number;
  carbs: number;
  protein: number;
}

const headCells: HeadCell[] = [
  {
    id: "tracking_no",
    align: "left",
    disablePadding: false,
    label: "Tracking No.",
  },
  { id: "name", align: "left", disablePadding: true, label: "Product Name" },
  { id: "fat", align: "right", disablePadding: false, label: "Total Order" },
  { id: "carbs", align: "left", disablePadding: false, label: "Status" },
  {
    id: "protein",
    align: "right",
    disablePadding: false,
    label: "Total Amount",
  },
];

function createData(
  tracking_no: number,
  name: string,
  fat: number,
  carbs: number,
  protein: number
): RowData {
  return { tracking_no, name, fat, carbs, protein };
}

const rows: RowData[] = [
  createData(84564564, "Camera Lens", 40, 2, 40570),
  createData(98764564, "Laptop", 300, 0, 180139),
  createData(98756325, "Mobile", 355, 1, 90989),
  createData(98652366, "Handset", 50, 1, 10239),
  createData(13286564, "Computer Accessories", 100, 1, 83348),
  createData(86739658, "TV", 99, 0, 410780),
  createData(13256498, "Keyboard", 125, 2, 70999),
  createData(98753263, "Mouse", 89, 2, 10570),
  createData(98753275, "Desktop", 185, 1, 98063),
  createData(98753291, "Chair", 100, 0, 14001),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<Key extends keyof any>(order: Order, orderBy: Key) {
  return order === "desc"
    ? (a: { [key in Key]: number }, b: { [key in Key]: number }) =>
        descendingComparator(a, b, orderBy)
    : (a: { [key in Key]: number }, b: { [key in Key]: number }) =>
        -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
): T[] {
  const stabilized = array.map((el, index) => [el, index] as const);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({
  order,
  orderBy,
}: {
  order: Order;
  orderBy: keyof RowData;
}) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function OrderStatus({ status }: { status: number }) {
  let color: string;
  let title: string;

  switch (status) {
    case 0:
      color = "warning";
      title = "Pending";
      break;
    case 1:
      color = "success";
      title = "Approved";
      break;
    case 2:
      color = "error";
      title = "Rejected";
      break;
    default:
      color = "primary";
      title = "None";
  }

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable() {
  const order: Order = "asc";
  const orderBy: keyof RowData = "tracking_no";

  return (
    <Box>
      <TableContainer
        sx={{
          width: "100%",
          overflowX: "auto",
          position: "relative",
          display: "block",
          maxWidth: "100%",
          "& td, & th": { whiteSpace: "nowrap" },
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map(
              (row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    key={row.tracking_no}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Link color="secondary">{row.tracking_no}</Link>
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell>
                      <OrderStatus status={row.carbs} />
                    </TableCell>
                    <TableCell align="right">
                      <NumericFormat
                        value={row.protein}
                        displayType="text"
                        thousandSeparator
                        prefix="$"
                      />
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
