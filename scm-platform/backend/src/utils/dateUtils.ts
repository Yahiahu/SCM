export const formatDate = (date: Date) => date.toISOString().split("T")[0];
export const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
