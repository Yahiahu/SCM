"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Using sonner for toasts
import * as Papa from "papaparse";
import { Supplier } from "../components/supplier/types";
import { calculateMetrics } from "../components/supplier/utils";
import { SupplierMetrics } from "../components/supplier/SupplierMetrics";
import { SearchFilterBar } from "../components/supplier/SearchFilterBar";
import { SupplierTable } from "../components/supplier/SupplierTable";
import { PerformanceCard } from "../components/supplier/PerformanceCard";
import { QuickActionsCard } from "../components/supplier/QuickActionsCard";
import { AddSupplierModal } from "../components/supplier/AddSupplierModal";
import { EditSupplierModal } from "../components/supplier/EditSupplierModal";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { FiPlus } from "react-icons/fi";
import * as Dialog from "@radix-ui/react-dialog"; // Radix UI Dialog for modals
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"; // Radix UI Dropdown Menu

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "name" | "rating" | "ontime" | "status" | "last_order"
  >("name");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    contact_email: "",
    phone: "",
    location: "",
    rating: 4,
    preferred: false,
  });

  // Fetch suppliers from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/supplier`);
        if (!response.ok) {
          throw new Error("Failed to load suppliers");
        }
        const data = await response.json();

        const enhancedSuppliers = data.map((supplier: any) => ({
          ...supplier,
          status: supplier.preferred ? "Active" : "Inactive",
          components_supplied: Math.floor(Math.random() * 50) + 5,
          last_order_date: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
        }));

        setSuppliers(enhancedSuppliers);
        setFilteredSuppliers(enhancedSuppliers);
      } catch (error) {
        toast.error("Failed to load suppliers", {
          description: "There was an error fetching supplier data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Filter and sort suppliers
  useEffect(() => {
    let result = [...suppliers];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.contact_email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          supplier.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "ontime")
        return b.historical_ontime_rate - a.historical_ontime_rate;
      if (sortBy === "status") return a.status.localeCompare(b.status);
      if (sortBy === "last_order") {
        return (
          new Date(b.last_order_date || 0).getTime() -
          new Date(a.last_order_date || 0).getTime()
        );
      }
      return 0;
    });

    setFilteredSuppliers(result);
  }, [searchTerm, sortBy, suppliers]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/supplier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add supplier");
      }

      const newSupplier = await response.json();

      const enhancedSupplier = {
        ...newSupplier,
        status: newSupplier.preferred ? "Active" : "Inactive",
        components_supplied: 0,
        last_order_date: "Never",
      };

      setSuppliers((prev) => [...prev, enhancedSupplier]);
      setFormData({
        name: "",
        contact_email: "",
        phone: "",
        location: "",
        rating: 4,
        preferred: false,
      });
      setIsAddModalOpen(false);

      toast.success("Supplier added successfully", {
        description: `${newSupplier.name} has been added.`,
      });
    } catch (error) {
      toast.error("Failed to add supplier", {
        description: "There was an error adding the supplier.",
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier) return;

    try {
      const response = await fetch(`/api/supplier/${editingSupplier.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingSupplier,
          preferred: editingSupplier.preferred,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update supplier");
      }

      const updatedSupplier = await response.json();

      setSuppliers((prev) =>
        prev.map((supplier) =>
          supplier.id === updatedSupplier.id
            ? {
                ...updatedSupplier,
                status: updatedSupplier.preferred ? "Active" : "Inactive",
                components_supplied: supplier.components_supplied,
                last_order_date: supplier.last_order_date,
              }
            : supplier
        )
      );

      setIsEditModalOpen(false);
      setEditingSupplier(null);

      toast.success("Supplier updated successfully", {
        description: `${updatedSupplier.name} has been updated.`,
      });
    } catch (error) {
      toast.error("Failed to update supplier", {
        description: "There was an error updating the supplier.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/supplier/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete supplier");
      }

      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));

      toast.success("Supplier deleted successfully", {
        description: "The supplier has been removed.",
      });
    } catch (error) {
      toast.error("Failed to delete supplier", {
        description: "There was an error deleting the supplier.",
      });
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (supplierId: string) => {
    router.push(`/suppliers/${supplierId}`);
  };

  const handleCreatePO = () => {
    router.push("/purchaseOrder");
  };

  const handleShippingUpdates = () => {
    router.push("/shipping");
  };

  const exportToCSV = () => {
    const csvData = filteredSuppliers.map((supplier) => ({
      Name: supplier.name,
      Email: supplier.contact_email,
      Phone: supplier.phone,
      Location: supplier.location,
      Rating: supplier.rating,
      "On-Time Rate": supplier.historical_ontime_rate,
      "Avg Unit Cost": supplier.avg_unit_cost,
      "Last Response Time": supplier.last_response_time,
      Status: supplier.status,
      "Components Supplied": supplier.components_supplied,
      "Last Order Date": supplier.last_order_date,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "suppliers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info("Exporting data to CSV...", {
      description: "Your supplier data is being downloaded.",
    });
  };

  const handlePrint = () => {
    window.print();
    toast.info("Preparing to print...", {
      description: "Please use your browser's print function.",
    });
  };

  const generatePerformanceReport = () => {
    const reportData = {
      totalSuppliers: suppliers.length,
      preferredSuppliers: suppliers.filter((s) => s.preferred).length,
      avgRating: (
        suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length
      ).toFixed(1),
      avgOnTimeRate: (
        (suppliers.reduce((sum, s) => sum + s.historical_ontime_rate, 0) /
          suppliers.length) *
        100
      ).toFixed(1),
      avgResponseTime: (
        suppliers.reduce((sum, s) => sum + s.last_response_time, 0) /
        suppliers.length
      ).toFixed(1),
      suppliers: filteredSuppliers.map((supplier) => ({
        name: supplier.name,
        rating: supplier.rating,
        onTimeRate: supplier.historical_ontime_rate,
        status: supplier.status,
      })),
    };

    const reportContent = `
      Supplier Performance Report
      ==========================
      
      Summary:
      - Total Suppliers: ${reportData.totalSuppliers}
      - Preferred Suppliers: ${reportData.preferredSuppliers}
      - Average Rating: ${reportData.avgRating}/5
      - Average On-Time Rate: ${reportData.avgOnTimeRate}%
      - Average Response Time: ${reportData.avgResponseTime} hours
      
      Supplier Details:
      ${reportData.suppliers
        .map(
          (supplier) => `
      ${supplier.name}
      - Rating: ${supplier.rating}/5
      - On-Time Rate: ${(supplier.onTimeRate * 100).toFixed(1)}%
      - Status: ${supplier.status}
      `
        )
        .join("\n")}
    `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "supplier_performance_report.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info("Generating performance report...", {
      description: "Your report is being downloaded as a text file.",
    });
  };

  const handleImportSuppliers = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results: { data: any[] }) => {
        const importedSuppliers = results.data.map((row: any) => ({
          name: row.Name || row.name || "",
          contact_email: row.Email || row.email || "",
          phone: row.Phone || row.phone || "",
          location: row.Location || row.location || "",
          rating: parseFloat(row.Rating || row.rating || "4"),
          historical_ontime_rate: parseFloat(
            row["On-Time Rate"] || row.ontime_rate || "0.9"
          ),
          avg_unit_cost: parseFloat(
            row["Avg Unit Cost"] || row.avg_cost || "10.0"
          ),
          last_response_time: parseFloat(
            row["Last Response Time"] || row.response_time || "24"
          ),
          preferred: row.Preferred
            ? row.Preferred.toLowerCase() === "true"
            : false,
        }));

        importedSuppliers.forEach(async (supplier: any) => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/supplier`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(supplier),
            });

            if (!response.ok) {
              throw new Error("Failed to import supplier");
            }

            const newSupplier = await response.json();

            setSuppliers((prev) => [
              ...prev,
              {
                ...newSupplier,
                status: newSupplier.preferred ? "Active" : "Inactive",
                components_supplied: 0,
                last_order_date: "Never",
              },
            ]);
          } catch (error) {
            console.error("Error importing supplier:", error);
            toast.error("Error importing a supplier", {
              description: `Failed to import: ${supplier.name || "Unknown"}`,
            });
          }
        });

        toast.success("Import Successful", {
          description: `${importedSuppliers.length} suppliers imported.`,
        });
      },
      error: () => {
        toast.error("Import Error", {
          description: "Failed to parse CSV file. Please check the format.",
        });
      },
    });
  };

  const metrics = calculateMetrics(suppliers);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={true} />

      <main className="flex-1 pt-20 px-6 bg-gray-50">
        <div className="flex flex-col gap-6">
          <SupplierMetrics
            totalSuppliers={metrics.totalSuppliers}
            preferredSuppliers={metrics.preferredSuppliers}
            avgRating={metrics.avgRating}
            avgOnTimeRate={metrics.avgOnTimeRate}
          />

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-3 overflow-x-auto lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                  Supplier Management
                </h1>

                {/* Radix UI Dropdown Menu for Add Supplier and Import */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
                      <FiPlus className="mr-2" />
                      Add New
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="bg-white rounded-md shadow-lg p-1 z-50">
                      <DropdownMenu.Item
                        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
                        onSelect={() => setIsAddModalOpen(true)}
                      >
                        Add New Supplier
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
                        onSelect={handleImportSuppliers}
                      >
                        Import Suppliers (CSV)
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>

              <SearchFilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onExport={exportToCSV}
                onPrint={handlePrint}
                onAddSupplier={() => setIsAddModalOpen(true)} // This can be removed or kept depending on desired UX (dropdown now handles add)
              />

              <SupplierTable
                              suppliers={filteredSuppliers}
                              isLoading={isLoading}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              onViewDetails={handleViewDetails}
                              onCreatePO={handleCreatePO} isMobile={false}              />
            </div>

            <div className="flex-1 lg:w-1/4 min-w-[300px]">
              <PerformanceCard
                avgOnTimeRate={metrics.avgOnTimeRate}
                avgResponseTime={metrics.avgResponseTime}
                onGenerateReport={generatePerformanceReport}
              />

              <QuickActionsCard
                onAddSupplier={() => setIsAddModalOpen(true)} // This can also be removed or kept
                onCreatePO={handleCreatePO}
                onImportSuppliers={handleImportSuppliers}
                onViewShipping={handleShippingUpdates}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Radix UI Dialog for Add Supplier */}
      <Dialog.Root open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0 z-50" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50">
            <AddSupplierModal
                          onClose={() => setIsAddModalOpen(false)}
                          formData={formData}
                          onFormChange={handleInputChange}
                          onCheckboxChange={handleCheckboxChange}
                          onSubmit={handleSubmit} isOpen={false}            />
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 inline-flex h-6 w-6 appearance-none items-center justify-center rounded-full hover:bg-gray-200 focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                X
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Radix UI Dialog for Edit Supplier */}
      <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0 z-50" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50">
            <EditSupplierModal
                          onClose={() => setIsEditModalOpen(false)}
                          supplier={editingSupplier}
                          onSupplierChange={setEditingSupplier}
                          onSubmit={handleEditSubmit} isOpen={false}            />
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 inline-flex h-6 w-6 appearance-none items-center justify-center rounded-full hover:bg-gray-200 focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                X
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv,.xlsx,.xls"
        style={{ display: "none" }}
      />
    </div>
  );
}
