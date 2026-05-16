import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: any) {
  if (!date) return 'Unknown Date';
  
  // Handle Firestore Timestamp
  const dateObj = date.toDate ? date.toDate() : new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(dateObj);
}
