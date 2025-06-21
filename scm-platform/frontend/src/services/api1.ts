// services/api.ts

import axios from "axios";
import {
  MonthlyStock as BackendMonthlyStock,
  ProductDemand as BackendProductDemand,
  ShippingInfo as BackendShippingInfo,
  PurchaseOrder as BackendPurchaseOrder,
  WarehouseInventory as BackendWarehouseInventory,
  Component as BackendComponent,
  Product as BackendProduct,
  BOM as BackendBOM,
} from "../../../backend/src/interfaces/index"; // Adjust path as needed
import { Supplier as BackendSupplier } from "../../../backend/src/interfaces"; // Adjust if needed

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ) + "/api";

// Helper for authenticated requests
const authAxios = axios.create({
  baseURL: API_BASE_URL,
});

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Assuming you store token in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchMonthlyStock = async (): Promise<BackendMonthlyStock[]> => {
  const response = await authAxios.get("/monthlystock");
  return response.data;
};

export const fetchProductDemand = async (): Promise<BackendProductDemand[]> => {
  const response = await authAxios.get("/product-demand");
  return response.data;
};

export const fetchShippingInfo = async (): Promise<BackendShippingInfo[]> => {
  const response = await authAxios.get("/shipping");
  return response.data;
};

export const fetchPurchaseOrders = async (): Promise<
  BackendPurchaseOrder[]
> => {
  const response = await authAxios.get("/purchaseorder");
  return response.data;
};

export const fetchWarehouseInventory = async (): Promise<
  BackendWarehouseInventory[]
> => {
  const response = await authAxios.get("/warehouseinventory");
  return response.data;
};

export const fetchComponents = async (): Promise<BackendComponent[]> => {
  const response = await authAxios.get("/components");
  return response.data;
};

export const fetchProducts = async (): Promise<BackendProduct[]> => {
  const response = await authAxios.get("/product");
  return response.data;
};

export const fetchBOMs = async (): Promise<BackendBOM[]> => {
  const response = await authAxios.get("/boms");
  return response.data;
};

// NEW: Fetch a single product by ID
export const fetchProduct = async (id: string): Promise<BackendProduct> => {
  const response = await authAxios.get(`/product/${id}`);
  return response.data;
};

// NEW: Fetch monthly stock for a specific product
export const fetchMonthlyStockByProduct = async (
  productId: string
): Promise<BackendMonthlyStock[]> => {
  const response = await authAxios.get(`/monthlystock?productId=${productId}`);
  return response.data;
};

// NEW: Fetch product demand for a specific product
export const fetchProductDemandByProduct = async (
  productId: string
): Promise<BackendProductDemand[]> => {
  const response = await authAxios.get(`/productdemand?productId=${productId}`);
  return response.data;
};

// NEW: Fetch warehouse inventory for a specific product
export const fetchWarehouseInventoryByProduct = async (
  productId: string
): Promise<BackendWarehouseInventory[]> => {
  const response = await authAxios.get(
    `/warehouseinventory?productId=${productId}`
  );
  return response.data;
};

// NEW: Fetch monthly stock for a specific component
export const fetchMonthlyStockByComponent = async (
  componentId: string
): Promise<BackendMonthlyStock[]> => {
  const response = await authAxios.get(
    `/monthlystock?componentId=${componentId}`
  );
  return response.data;
};

// NEW: Fetch component demand for a specific component
export const fetchComponentDemandByComponent = async (
  componentId: string
): Promise<BackendProductDemand[]> => {
  const response = await authAxios.get(
    `/componentdemand?componentId=${componentId}`
  );
  return response.data;
};

// NEW: Fetch warehouse inventory for a specific component
export const fetchWarehouseInventoryByComponent = async (
  componentId: string
): Promise<BackendWarehouseInventory[]> => {
  const response = await authAxios.get(
    `/warehouseinventory?componentId=${componentId}`
  );
  return response.data;
};

// NEW: Fetch a single component by ID
export const fetchComponent = async (id: string): Promise<BackendComponent> => {
  const response = await authAxios.get(`/component/${id}`);
  return response.data;
};

export const fetchSuppliers = async (): Promise<BackendSupplier[]> => {
  const response = await authAxios.get("/supplier");
  return response.data;
};

export const createSupplier = async (
  supplierData: Partial<BackendSupplier>
): Promise<BackendSupplier> => {
  const response = await authAxios.post("/supplier", supplierData);
  return response.data;
};

export const updateSupplier = async (
  id: string,
  updatedData: Partial<BackendSupplier>
): Promise<BackendSupplier> => {
  const response = await authAxios.put(`/supplier/${id}`, updatedData);
  return response.data;
};

export const deleteSupplier = async (id: string): Promise<void> => {
  await authAxios.delete(`/supplier/${id}`);
};

// NEW: Fetch a single supplier by ID
export const fetchSupplier = async (id: string): Promise<BackendSupplier> => {
  const response = await authAxios.get(`/supplier/${id}`);
  return response.data;
};

// NEW: Fetch supplier performance data
export const fetchSupplierPerformance = async (id: string): Promise<any> => {
  // Adjust the endpoint path and return type as needed.
  const response = await authAxios.get(`/supplier/${id}/performance`);
  return response.data;
};

// NEW: Fetch components for a specific supplier
export const fetchSupplierComponents = async (
  id: string
): Promise<BackendComponent[]> => {
  const response = await authAxios.get(`/supplier/${id}/components`);
  return response.data;
};

// NEW: Fetch purchase orders for a specific supplier
export const fetchSupplierPurchaseOrders = async (
  id: string
): Promise<BackendPurchaseOrder[]> => {
  const response = await authAxios.get(`/supplier/${id}/purchaseorders`);
  return response.data;
};

// NEW: Fetch a shipment by ID
export const fetchShipment = async (id: string): Promise<any> => {
  const response = await authAxios.get(`/shippinginfo/${id}`);
  return response.data;
};

// NEW: Fetch historical shipment data
export const fetchShipmentHistory = async (
  shipmentId: string
): Promise<any[]> => {
  const response = await authAxios.get(`/shippinginfo/${shipmentId}/history`);
  return response.data;
};

// NEW: Fetch events associated with a specific shipment
export const fetchShipmentEvents = async (
  shipmentId: string
): Promise<any[]> => {
  const response = await authAxios.get(`/shippinginfo/${shipmentId}/events`);
  return response.data;
};

// NEW: Fetch a single purchase order by ID
export const fetchPurchaseOrder = async (
  id: string
): Promise<BackendPurchaseOrder> => {
  const response = await authAxios.get(`/purchaseorder/${id}`);
  return response.data;
};

// NEW: Fetch activity log / events for a specific purchase order
export const fetchPOActivities = async (
  purchaseOrderId: string
): Promise<any[]> => {
  const response = await authAxios.get(
    `/purchaseorder/${purchaseOrderId}/activities`
  );
  return response.data;
};
