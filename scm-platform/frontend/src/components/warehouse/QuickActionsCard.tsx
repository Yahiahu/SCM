import {
  Package,
  ShoppingCart,
  Truck,
  ArrowUpRight,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const QuickActionsCard = () => (
  <Card className="w-full">
    <CardHeader className="bg-blue-100 flex items-center gap-2 rounded-t-xl">
      <Package className="text-blue-600" />
      <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-3 pt-5">
        <Button variant="secondary" className="flex items-center gap-2 text-sm">
          <ShoppingCart className="h-4 w-4" />
          Create PO
        </Button>
        <Button
          variant="secondary"
          className="flex items-center gap-2 text-sm text-orange-600 border-orange-200"
        >
          <Truck className="h-4 w-4" />
          Receive Shipment
        </Button>
        <Button
          variant="secondary"
          className="flex items-center gap-2 text-sm text-green-600 border-green-200"
        >
          <ArrowUpRight className="h-4 w-4" />
          Pick Items
        </Button>
        <Button
          variant="secondary"
          className="flex items-center gap-2 text-sm text-purple-600 border-purple-200"
        >
          <BarChart2 className="h-4 w-4" />
          Generate Report
        </Button>
      </div>
    </CardContent>
  </Card>
);
