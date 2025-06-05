import * as Dialog from "@radix-ui/react-dialog";
import { FiX } from "react-icons/fi"; // For the close button

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any; // Consider creating a specific type for formData
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export const AddItemModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onInputChange,
}: AddItemModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-sky-950/20 backdrop-blur-sm z-50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white/95 backdrop-blur-xl p-8 shadow-2xl shadow-sky-500/20 focus:outline-none z-50 data-[state=open]:animate-contentShow border border-sky-200/50">
          <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent mb-6 border-b border-sky-200/50 pb-4">
            Add New Logistics Item
          </Dialog.Title>

          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
              {/* Item Type */}
              <div className="space-y-2">
                <label
                  htmlFor="type"
                  className="text-sm font-medium text-sky-700 block"
                >
                  Item Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData?.type || ""}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-sky-200/50 rounded-xl bg-sky-50/50 text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-all duration-200"
                  required
                >
                  <option value="">Select an Item Type</option>
                  <option value="order">Purchase Order</option>
                  <option value="shipment">Shipment</option>
                </select>
              </div>

              {/* Other form fields would go here, following the same pattern */}
              {/* Example:
              <div className="space-y-2">
                <label htmlFor="itemName" className="text-sm font-medium text-sky-700 block">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  value={formData?.itemName || ""}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-sky-200/50 rounded-xl bg-sky-50/50 text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-all duration-200"
                  required
                />
              </div>
              */}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-sky-200/50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-sky-200/50 rounded-xl text-sky-700 font-medium hover:bg-sky-50/50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl font-medium shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-blue-700 transition-all duration-300"
              >
                Add Item
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-sky-100/50 transition-colors text-sky-600"
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
