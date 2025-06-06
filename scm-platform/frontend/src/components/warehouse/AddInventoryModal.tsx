"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { WarehouseLocation } from "./types";
import { cn } from "@/lib/utils";

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  components: any[];
  locations: WarehouseLocation[];
}

export const AddInventoryModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  handleSubmit,
  components,
  locations,
}: AddInventoryModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-gray-900">
            Add Inventory Item
          </Dialog.Title>
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Component
              </label>
              <select
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                value={formData.componentId}
                onChange={(e) =>
                  setFormData({ ...formData, componentId: e.target.value })
                }
                required
              >
                <option value="">Select component</option>
                {components.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.num} - {c.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warehouse Location
              </label>
              <select
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                value={formData.warehouseId}
                onChange={(e) =>
                  setFormData({ ...formData, warehouseId: e.target.value })
                }
                required
              >
                <option value="">Select warehouse</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.location})
                  </option>
                ))}
              </select>
            </div>

            {["currentQty", "incomingQty", "outgoingQty"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.replace("Qty", " Qty")}
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  required
                />
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
