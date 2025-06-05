import { useState, useEffect } from "react";
import { Component } from "../types";
import { getSupplierName, getComponentType, getStatus } from "../utils";
import { useToast } from "../../ui/use-toast"; // You must create this hook or utility

export const useComponents = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const fetchComponents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/component");
      if (!response.ok) throw new Error("Failed to load components");
      const data = await response.json();

      const enhancedComponents = data.map((comp: any) => ({
        ...comp,
        currentQty: comp.warehouse_inventories?.[0]?.current_qty || 0,
        type: getComponentType(comp.description),
        supplier: getSupplierName(comp.supplierId),
        lastUpdated: new Date().toISOString().split("T")[0],
        status: getStatus(comp.warehouse_inventories?.[0]?.current_qty || 0),
      }));

      setComponents(enhancedComponents);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load components",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComponent = async (id: string) => {
    try {
      const response = await fetch(`/api/component/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete component");
      setComponents((prev) => prev.filter((comp) => comp.id !== id));
      toast({
        title: "Deleted",
        description: "Component deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete component",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  return { components, isLoading, deleteComponent, fetchComponents };
};
