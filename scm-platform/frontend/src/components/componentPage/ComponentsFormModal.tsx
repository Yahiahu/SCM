import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Component } from "./types";

interface ComponentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentComponent: Component | null;
  onSuccess: () => void;
}

export const ComponentFormModal = ({
  isOpen,
  onClose,
  currentComponent,
  onSuccess,
}: ComponentFormModalProps) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    num: "",
    description: "",
    notes: "",
    supplierPartNumber: "",
    supplierId: 1,
  });

  useEffect(() => {
    if (currentComponent) {
      setFormData({
        num: currentComponent.num,
        description: currentComponent.description,
        notes: currentComponent.notes || "",
        supplierPartNumber: currentComponent.supplierPartNumber,
        supplierId: currentComponent.supplierId,
      });
    } else {
      setFormData({
        num: "",
        description: "",
        notes: "",
        supplierPartNumber: "",
        supplierId: 1,
      });
    }
  }, [currentComponent]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = currentComponent
        ? `/api/component/${currentComponent.id}`
        : "/api/component";
      const method = currentComponent ? "PUT" : "POST";

      const payload = {
        num: formData.num,
        description: formData.description,
        notes: formData.notes,
        supplier_part_number: formData.supplierPartNumber,
        supplier_id: Number(formData.supplierId),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();

      onSuccess();
      toast({
        title: "Success",
        description: currentComponent
          ? "Component updated successfully"
          : "Component added successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: currentComponent
          ? "Failed to update component"
          : "Failed to add component",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {currentComponent ? "Edit Component" : "Add New Component"}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Part Number
              </label>
              <input
                className="w-full border rounded-lg p-2"
                name="num"
                value={formData.num}
                onChange={handleInputChange}
                placeholder="e.g., CMP-001-RES"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <input
                className="w-full border rounded-lg p-2"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Resistor 10k Ohm 1/4W"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Supplier Part Number
              </label>
              <input
                className="w-full border rounded-lg p-2"
                name="supplierPartNumber"
                value={formData.supplierPartNumber}
                onChange={handleInputChange}
                placeholder="e.g., ALPHA-RES-10K"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Supplier</label>
              <select
                className="w-full border rounded-lg p-2"
                name="supplierId"
                value={formData.supplierId}
                onChange={handleInputChange}
              >
                <option value={1}>Alpha Components</option>
                <option value={2}>Beta Electronics</option>
                <option value={3}>Gamma Mechanical</option>
                <option value={4}>Delta Materials</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                className="w-full border rounded-lg p-2"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600"
              >
                {currentComponent ? "Update Component" : "Save Component"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
