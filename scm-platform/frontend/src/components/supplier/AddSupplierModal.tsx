"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    name: string;
    contact_email: string;
    phone: string;
    location: string;
    rating: number;
    preferred: boolean;
  };
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddSupplierModal = ({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onCheckboxChange,
  onSubmit,
}: AddSupplierModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl p-6 border border-sky-100">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-800">
              Add New Supplier
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {[
              {
                label: "Supplier Name",
                name: "name",
                type: "text",
                placeholder: "e.g., Alpha Components",
              },
              {
                label: "Contact Email",
                name: "contact_email",
                type: "email",
                placeholder: "e.g., contact@supplier.com",
              },
              {
                label: "Phone Number",
                name: "phone",
                type: "text",
                placeholder: "e.g., +1 (555) 123-4567",
              },
              {
                label: "Location",
                name: "location",
                type: "text",
                placeholder: "e.g., Shenzhen, China",
              },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  name={name}
                  type={type}
                  value={(formData as any)[name]}
                  onChange={onFormChange}
                  placeholder={placeholder}
                  required
                  className="w-full rounded-md border border-gray-300 bg-sky-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Rating
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={onFormChange}
                className="w-full rounded-md border border-gray-300 bg-sky-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                {[5, 4, 3, 2, 1].map((val) => (
                  <option key={val} value={val}>
                    {val} -{" "}
                    {
                      ["Poor", "Below Average", "Average", "Good", "Excellent"][
                        5 - val
                      ]
                    }
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="preferred"
                checked={formData.preferred}
                onChange={onCheckboxChange}
                className="h-4 w-4 text-sky-600 border-gray-300 focus:ring-sky-500"
              />
              <label htmlFor="preferred" className="text-sm text-gray-700">
                Preferred Supplier?
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700"
              >
                Add Supplier
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
