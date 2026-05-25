
import { StationStatus } from '../types';

/**
 * Simulates the Cloud Function logic to determine station status based on weight/fill level.
 * 
 * New Rules:
 * - Green: >= 70%
 * - Yellow: 20% - 70%
 * - Red: < 20% (Critical)
 */
export const calculateStatus = (fillLevel: number): StationStatus => {
  if (fillLevel >= 70) return StationStatus.GREEN;
  if (fillLevel >= 20) return StationStatus.YELLOW;
  return StationStatus.RED;
};

/**
 * Returns the color code for Tailwind based on status (Dark Mode Optimized)
 */
export const getStatusColor = (status: StationStatus): string => {
  switch (status) {
    case StationStatus.GREEN:
      return 'text-emerald-400 bg-emerald-900/30 border-emerald-800 shadow-[0_0_10px_rgba(52,211,153,0.2)]';
    case StationStatus.YELLOW:
      return 'text-yellow-400 bg-yellow-900/30 border-yellow-800';
    case StationStatus.RED:
      return 'text-red-400 bg-red-900/30 border-red-800 shadow-[0_0_10px_rgba(248,113,113,0.2)]';
    default:
      return 'text-gray-400 bg-gray-800 border-gray-700';
  }
};

export const getFillColor = (fillLevel: number): string => {
    if (fillLevel >= 70) return 'bg-emerald-500 shadow-[0_0_10px_#10b981]';
    if (fillLevel >= 20) return 'bg-yellow-500';
    return 'bg-red-500 shadow-[0_0_10px_#ef4444]';
};
