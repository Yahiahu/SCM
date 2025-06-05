// src/ui/use-toast.ts
import { toast } from "sonner"; // or your chosen toast lib

export const useToast = () => {
  return ({
    title,
    description,
    variant = "default",
  }: {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => {
    toast[variant === "destructive" ? "error" : "success"](title, {
      description,
    });
  };
};
