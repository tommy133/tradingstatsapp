export function getRevenueColorClass(revenue: number): string {
  return revenue > 0 ? 'text-green' : 'text-red';
}
