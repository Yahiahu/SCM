"use client";

import { useState, useEffect } from "react";
import type { Component, SortByOption } from "../components/componentPage/types";
import { useRouter } from "next/navigation";
import { useComponents } from "../components/componentPage/hooks/useComponents";
import { ComponentsTable } from "../components/componentPage/ComponentTable";
import { InventorySidebar } from "../components/componentPage/InventorySidebar";
import { SearchFilterBar } from "../components/componentPage/SearchFilterBar";
import { ComponentFormModal } from "../components/componentPage/ComponentsFormModal"; // Assuming this modal is already Tailwind/Radix friendly
import Navbar from "../components/navbar"; // Assuming this Navbar is already Tailwind friendly
import Footer from "../components/footer"; // Assuming this Footer is already Tailwind friendly
import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion"; // For animations if desired, similar to AboutUsPage

// Re-using the BlurredBackground component from your AboutUsPage
const BlurredBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 to-blue-300/30 blur-3xl"></div>
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300/25 to-sky-300/25 blur-3xl"></div>
    <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300/30 to-sky-300/30 blur-3xl"></div>
    <div className="absolute -bottom-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/25 blur-3xl"></div>
  </div>
);

export default function ComponentsPage() {
  const router = useRouter();
  // We'll manage modal state manually as useDisclosure is Chakra-specific
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortByOption>("name"); // Use the imported SortByOption type
  const [currentComponent, setCurrentComponent] = useState<Component | null>(
    null
  );

  const { components, isLoading, deleteComponent, fetchComponents } =
    useComponents();
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);

  // Simple toast notification replacement (you might want a dedicated library like react-hot-toast)
  const showToast = (title: string, description: string, status: "info" | "success" | "error") => {
    alert(`${title}: ${description} (Status: ${status})`); // Basic alert for demonstration
    // For a real app, integrate a dedicated toast library (e.g., react-hot-toast)
  };

  // Filter and sort components
  useEffect(() => {
    let result = [...components];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (comp) =>
          comp.num.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (comp.supplier &&
            comp.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") return a.num.localeCompare(b.num);
      if (sortBy === "type") return (a.type || "").localeCompare(b.type || "");
      if (sortBy === "quantity") return b.currentQty - a.currentQty;
      if (sortBy === "status")
        return (a.status || "").localeCompare(b.status || "");
      return 0;
    });

    setFilteredComponents(result);
  }, [searchTerm, sortBy, components]);

  const handleEdit = (component: Component) => {
    setCurrentComponent(component);
    setIsModalOpen(true);
  };

  const handleAddComponent = () => {
    setCurrentComponent(null); // Clear any existing component data
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentComponent(null); // Clear current component when modal closes
    fetchComponents(); // Re-fetch components to update the list
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this component?")) {
      await deleteComponent(id);
      showToast("Component Deleted", "The component has been removed.", "success");
    }
  };

  const handleExport = () => {
    // Convert components to CSV
    const headers = [
      "Part Number",
      "Description",
      "Type",
      "Quantity",
      "Status",
      "Supplier",
      "Last Updated",
    ];

    const csvRows = [
      headers.join(","),
      ...filteredComponents.map((comp) =>
        [
          comp.num,
          `"${comp.description.replace(/"/g, '""')}"`,
          comp.type,
          comp.currentQty,
          comp.status,
          comp.supplier,
          comp.lastUpdated,
        ].join(",")
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "components_inventory.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast("Export Complete", "Components exported to CSV.", "success");
  };

  const handlePrint = () => {
    window.print();
    showToast("Printing...", "Preparing page for printing.", "info");
  };

  const handlePrintLabels = () => {
    showToast(
      "Print Labels",
      "Preparing labels for printing...",
      "info"
    );
  };

  const handleGenerateReport = () => {
    const reportContent = `
      Inventory Report - ${new Date().toLocaleDateString()}
      ====================================
      Total Components: ${components.length}
      In Stock: ${components.filter((c) => c.status === "In Stock").length}
      Low Stock: ${components.filter((c) => c.status === "Low Stock").length}
      Out of Stock: ${
        components.filter((c) => c.status === "Out of Stock").length
      }

      Low Stock Items:
      ${components
        .filter((c) => c.status === "Low Stock")
        .map((c) => `- ${c.num}: ${c.description} (${c.currentQty} remaining)`)
        .join("\n      ")}
    `;

    showToast(
      "Report Generated",
      "The inventory report has been prepared.",
      "success"
    );

    // Print the report
    const printWindow = window.open("", "_blank");
    printWindow?.document.write(`<pre>${reportContent}</pre>`);
    printWindow?.document.close();
    printWindow?.focus();
    setTimeout(() => {
      printWindow?.print();
    }, 500);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.xlsx";

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        showToast(
          "Import Started",
          `Processing ${file.name}`,
          "info"
        );

        setTimeout(() => {
          showToast(
            "Import Complete",
            "Components imported successfully",
            "success"
          );
          fetchComponents(); // Re-fetch components after import
        }, 2000);
      }
    };

    input.click();
  };

  const handleViewSupplier = () => {
    router.push("/supplier");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 relative overflow-hidden">
      <BlurredBackground />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <Navbar isLoggedIn={true} />

      <main className="flex-1 pt-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto py-2">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Inventory Management
            </h1>
            <motion.button
              onClick={handleAddComponent}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-full font-medium shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Add New Component
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <SearchFilterBar
                searchTerm={searchTerm}
                sortBy={sortBy}
                onSearchChange={setSearchTerm}
                onSortChange={setSortBy}
                onExport={handleExport}
                onPrint={handlePrint}
              />
              <ComponentsTable
                components={filteredComponents}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
            <div className="lg:col-span-1">
              <InventorySidebar
                components={components} // Pass all components for summary counts
                onAddComponent={handleAddComponent}
                onImport={handleImport}
                onPrintLabels={handlePrintLabels}
                onViewSuppliers={handleViewSupplier}
                onGenerateReport={handleGenerateReport}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {isModalOpen && (
        <ComponentFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          currentComponent={currentComponent} onSuccess={function (): void {
            throw new Error("Function not implemented.");
          } }        />
      )}
    </div>
  );
}