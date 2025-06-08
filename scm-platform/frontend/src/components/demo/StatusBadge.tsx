const StatusBadge = ({ status }: { status: string }) => {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "In Stock":
      case "Delivered":
      case "Secure":
        return "bg-green-100/80 text-green-800";
      case "Low Stock":
      case "In Transit":
        return "bg-blue-100/80 text-blue-800";
      case "Out of Stock":
      case "Delayed":
        return "bg-red-100/80 text-red-800";
      default:
        return "bg-gray-100/80 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium mb-1 ${getStatusClasses(
        status
      )}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
