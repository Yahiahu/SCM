"use client";

import React, { useState, useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react"; // Using lucide-react for icons, a common choice with Tailwind
import { BackendSupplier, BackendUser, PurchaseOrder } from "./types"; // Assuming these types are correctly defined

// We'll bring in our existing UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // For the Notes field
import { useToast } from "@/components/ui/use-toast"; // Assuming you have a Shadcn/ui toast setup

interface CreatePOModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: BackendSupplier[];
  users: BackendUser[];
  onCreatePO: (newPO: PurchaseOrder) => void;
}

export default function CreatePOModal({
  isOpen,
  onClose,
  suppliers,
  users,
  onCreatePO,
}: CreatePOModalProps) {
  const [formData, setFormData] = useState({
    supplierId: "",
    date_expected: "",
    createdById: "",
    notes: "",
    status: "Draft" as const,
    poItems: [] as {
      componentId: number;
      ordered_qty: number;
      unit_cost: number;
    }[],
  });
  const toast = useToast(); // Destructure toast from useToast hook

  // Reset form data when the modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        supplierId: "",
        date_expected: "",
        createdById: "",
        notes: "",
        status: "Draft",
        poItems: [],
      });
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.supplierId ||
      !formData.date_expected ||
      !formData.createdById
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "default",
      });
      return;
    }

    try {
      const newPO: PurchaseOrder = {
        id: Math.floor(Math.random() * 1000000), // Larger random ID
        poNumber: `PO-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`, // 4-digit PO number
        vendor: {
          id: parseInt(formData.supplierId),
          name:
            suppliers.find((s) => s.id === parseInt(formData.supplierId))
              ?.name || "Unknown",
          contact:
            suppliers.find((s) => s.id === parseInt(formData.supplierId))
              ?.contact_email || "N/A",
          rating:
            suppliers.find((s) => s.id === parseInt(formData.supplierId))
              ?.rating || 0,
        },
        items: formData.poItems.map((item, index) => ({
          id: index + 1, // or some other logic to generate ID
          component: { id: item.componentId, name: "Placeholder Component" }, // Replace with real lookup if available
          quantity: item.ordered_qty,
          unitPrice: item.unit_cost,
          total: item.ordered_qty * item.unit_cost,
        })),
        // Use actual poItems from state
        totalAmount: formData.poItems.reduce(
          (sum, item) => sum + item.ordered_qty * item.unit_cost,
          0
        ), // Calculate total
        dateCreated: new Date().toISOString(),
        dateDue: formData.date_expected,
        status: formData.status,
        paymentStatus: "Unpaid",
        assignedTo:
          users.find((u) => u.id === parseInt(formData.createdById))
            ?.username || "N/A",
        notes: formData.notes,
      };

      onCreatePO(newPO);
      onClose();

      toast({
        title: "PO Created Successfully!",
        description: `Purchase Order ${newPO.poNumber} has been created.`,
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to create PO:", err);
      toast({
        title: "Error Creating PO",
        description:
          "Failed to create purchase order. Please check your inputs and try again.",
        variant: "default",
      });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-2xl focus:outline-none data-[state=open]:animate-contentShow sm:p-8">
          <Dialog.Title className="mb-4 text-2xl font-bold text-blue-700">
            Create New Purchase Order
          </Dialog.Title>
          <Dialog.Description className="mb-6 text-sm text-gray-600">
            Fill in the details below to create a new purchase order.
          </Dialog.Description>

          <form onSubmit={handleCreatePO}>
            <div className="grid grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6">
              {/* Vendor Select */}
              <div className="col-span-1">
                <Label
                  htmlFor="supplierId"
                  className="mb-2 block text-gray-700"
                >
                  Vendor <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <select
                    id="supplierId"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleInputChange}
                    className="block w-full appearance-none rounded-md border border-blue-200 bg-white py-2 pl-3 pr-8 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="" disabled>
                      Select vendor
                    </option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name} ({supplier.rating}★)
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Status Select */}
              <div className="col-span-1">
                <Label htmlFor="status" className="mb-2 block text-gray-700">
                  Status <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="block w-full appearance-none rounded-md border border-blue-200 bg-white py-2 pl-3 pr-8 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Approved">Approved</option>
                    <option value="Ordered">Ordered</option>
                    <option value="Received">Received</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Due Date Input */}
              <div className="col-span-1">
                <Label
                  htmlFor="date_expected"
                  className="mb-2 block text-gray-700"
                >
                  Due Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date_expected"
                  name="date_expected"
                  type="date"
                  value={formData.date_expected}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-blue-200 bg-white py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* Assigned To Select */}
              <div className="col-span-1">
                <Label
                  htmlFor="createdById"
                  className="mb-2 block text-gray-700"
                >
                  Assigned To <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <select
                    id="createdById"
                    name="createdById"
                    value={formData.createdById}
                    onChange={handleInputChange}
                    className="block w-full appearance-none rounded-md border border-blue-200 bg-white py-2 pl-3 pr-8 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="" disabled>
                      Select team member
                    </option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Notes Textarea */}
              <div className="col-span-full">
                <Label htmlFor="notes" className="mb-2 block text-gray-700">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional notes for the PO..."
                  rows={3}
                  className="block w-full rounded-md border border-blue-200 bg-white py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-2 text-lg font-semibold text-blue-700">
                PO Items (Manual for now)
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                For a complete solution, you'd implement a way to dynamically
                add/remove PO items here.
              </p>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Create PO
              </Button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
