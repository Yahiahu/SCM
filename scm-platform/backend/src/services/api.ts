// src/services/api.ts
import { PurchaseOrder, Supplier, User, POItem } from "../interfaces";

const API_BASE_URL = "http://localhost:5001/api";

export const fetchPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const response = await fetch(`${API_BASE_URL}/purchaseorder`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data; // Backend should return PurchaseOrder objects as per interface
};

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  const response = await fetch(`${API_BASE_URL}/supplier`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchPOItemsByPOId = async (poId: number): Promise<POItem[]> => {
  const response = await fetch(`${API_BASE_URL}/poitem?poId=${poId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const createPurchaseOrder = async (
  poData: any
): Promise<PurchaseOrder> => {
  const response = await fetch(`${API_BASE_URL}/purchaseorder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(poData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const deletePurchaseOrder = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/purchaseorder/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return;
};

export const updatePurchaseOrder = async (
  id: number,
  updateData: Partial<PurchaseOrder>
): Promise<PurchaseOrder> => {
  const response = await fetch(`${API_BASE_URL}/purchaseorder/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
