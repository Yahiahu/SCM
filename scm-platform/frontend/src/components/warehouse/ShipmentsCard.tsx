import { ArrowDown, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { IncomingShipment } from "./types";

interface ShipmentsCardProps {
  incoming: IncomingShipment[];
}

export const ShipmentsCard = ({ incoming }: ShipmentsCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Transit":
        return "bg-blue-100 text-blue-800";
      case "Delayed":
        return "bg-orange-100 text-orange-800";
      case "Arrived":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  function handleTrackShipment(trackingNumber: string, carrier: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-100 flex items-center justify-between rounded-t-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <ArrowDown className="text-blue-600 h-5 w-5" />
          <h2 className="text-md font-semibold text-gray-800">
            Incoming Shipments
          </h2>
        </div>
        <Badge className="bg-blue-200 text-blue-800 rounded-full px-2 py-0.5 text-sm">
          {incoming.length}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2 text-right">Qty</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {incoming.slice(0, 4).map((shipment) => (
              <tr key={shipment.id} className="border-b">
                <td className="px-4 py-2 whitespace-nowrap">
                  <div
                    title={`From: ${shipment.purchaseOrder.supplier.name}\nExpected: ${shipment.estimatedArrival}`}
                    className="truncate max-w-xs"
                  >
                    {shipment.component.description}
                  </div>
                </td>
                <td className="px-4 py-2 text-right">{shipment.qty}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                        shipment.status
                      )}`}
                    >
                      {shipment.status}
                    </span>
                    {shipment.trackingNumber && (
                      <button
                        onClick={() =>
                          handleTrackShipment(
                            shipment.trackingNumber,
                            shipment.carrier
                          )
                        }
                        className="hover:text-blue-600"
                        aria-label="Track shipment"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
      <CardFooter className="px-4 py-3">
        <Button variant="link">View All Shipments</Button>
      </CardFooter>
    </Card>
  );
};
