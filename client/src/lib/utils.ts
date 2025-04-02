import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Parse query string into an object of key-value pairs
export function parseQueryString(query: string): Record<string, string> {
  if (!query) return {};
  
  return query.split('&').reduce((acc, param) => {
    const [key, value] = param.split('=');
    if (key && value) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {} as Record<string, string>);
}

// Format timestamp to relative time (e.g. "2 hours ago")
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const timeStamp = typeof date === 'string' ? new Date(date) : date;
  
  const diffInSeconds = Math.floor((now.getTime() - timeStamp.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
}

// Format number with commas (e.g. 1000 -> "1,000")
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Get file type icon based on file extension
export function getFileTypeIcon(fileType: string): string {
  const type = fileType.toLowerCase();
  
  if (type === 'csv') return 'ri-file-list-3-line';
  if (type === 'json') return 'ri-file-code-line';
  if (['xls', 'xlsx', 'excel'].includes(type)) return 'ri-file-excel-2-line';
  if (['db', 'sql', 'mysql', 'postgresql'].includes(type)) return 'ri-database-2-line';
  
  return 'ri-file-line';
}

// Get chart icon based on chart type
export function getChartIcon(chartType: string): string {
  const type = chartType.toLowerCase();
  
  if (type.includes('bar')) return 'ri-bar-chart-line';
  if (type.includes('line')) return 'ri-line-chart-line';
  if (type.includes('pie')) return 'ri-pie-chart-line';
  if (type.includes('scatter')) return 'ri-bubble-chart-line';
  if (type.includes('area')) return 'ri-area-chart-line';
  
  return 'ri-bar-chart-grouped-line';
}
