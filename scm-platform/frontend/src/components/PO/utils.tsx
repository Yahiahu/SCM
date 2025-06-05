import {
  PurchaseOrder,
  BackendPurchaseOrder,
  BackendSupplier,
  BackendUser,
  BackendPOItem,
} from "./types";
import { fetchPOItemsByPOId } from "../../services/api";
import { Icon } from "@chakra-ui/react";
import { FiCheck, FiDollarSign, FiFileText, FiShoppingCart, FiTruck, FiX } from "react-icons/fi";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Draft":
      return "gray";
    case "Submitted":
      return "blue";
    case "Approved":
      return "teal";
    case "Ordered":
      return "orange";
    case "Delivered":
      return "green";
    case "Paid":
      return "purple";
    case "Cancelled":
      return "red";
    default:
      return "gray";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Draft":
      return <Icon as={FiFileText} />;
    case "Submitted":
    case "Approved":
      return <Icon as={FiCheck} />;
    case "Ordered":
      return <Icon as={FiShoppingCart} />;
    case "Delivered":
      return <Icon as={FiTruck} />;
    case "Paid":
      return <Icon as={FiDollarSign} />;
    case "Cancelled":
      return <Icon as={FiX} />;
    default:
      return null;
  }
};

export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "Fully Paid":
      return "green";
    case "Partially Paid":
      return "orange";
    case "Unpaid":
      return "red";
    default:
      return "gray";
  }
};

export const mapBackendPOToUIPO = async (
  po: BackendPurchaseOrder,
  fetchedSuppliers: BackendSupplier[],
  fetchedUsers: BackendUser[]
): Promise<PurchaseOrder> => {
  const supplier = fetchedSuppliers.find((s) => s.id === po.supplierId);
  const createdByUser = fetchedUsers.find((u) => u.id === po.createdById);
  const poItems = await fetchPOItemsByPOId(po.id);

const mappedItems = poItems.map((item) => ({
  id: item.id,
  component: {
    id: item.component?.id || 0,
    name: item.component?.description || "Unknown Component",
  },
  quantity: item.ordered_qty,
  unitPrice: item.unit_cost,
  total: item.ordered_qty * item.unit_cost,
}));


  const totalAmount = mappedItems.reduce((sum, item) => sum + item.total, 0);

  let uiStatus: PurchaseOrder["status"];
  let paymentStatus: PurchaseOrder["paymentStatus"] = "Unpaid";

  if (po.status === "Received") {
    uiStatus = "Delivered";
    paymentStatus = "Fully Paid";
  } else if (po.status === "Ordered") {
    uiStatus = "Ordered";
    paymentStatus = "Unpaid";
  } else if (po.status === "Approved") {
    uiStatus = "Approved";
  } else if (po.status === "Draft") {
    uiStatus = "Draft";
  } else if (po.status === "Cancelled") {
    uiStatus = "Cancelled";
  } else {
    uiStatus = "Submitted";
  }

  return {
    id: po.id,
    poNumber: `PO-${po.id.toString().padStart(3, "0")}`,
    vendor: {
      id: supplier?.id || 0,
      name: supplier?.name || "Unknown Supplier",
      contact: supplier?.contact_email || "N/A",
      rating: supplier?.rating || 0,
    },
    items: mappedItems,
    totalAmount,
    dateCreated: po.date_created,
    dateDue: po.date_expected,
    status: uiStatus,
    paymentStatus,
    assignedTo: createdByUser?.username || "N/A",
    notes: po.notes || "",
  };
};
