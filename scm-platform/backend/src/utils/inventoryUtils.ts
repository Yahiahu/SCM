export const calculateReorderPoint = (
  dailyDemand: number,
  leadTimeDays: number,
  safetyStock: number
) => dailyDemand * leadTimeDays + safetyStock;
