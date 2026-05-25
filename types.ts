
export enum StationStatus {
  GREEN = 'Green', // >= 70%
  YELLOW = 'Yellow', // 20% - 70%
  RED = 'Red', // < 20%
}

export enum AnimalType {
  CAT = 'Cat',
  DOG = 'Dog',
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Station {
  id: string;
  name: string;
  city: string; 
  location: GeoPoint;
  address_full: string;
  fillLevel: number;
  type: AnimalType;
  lastUpdated: string;
  status: StationStatus;
  iot_metadata?: {
    battery: number;
    temperature: number;
    signal_strength: number;
  }
}

export interface User {
  id: string;
  displayName: string;
  email?: string;
  points: number;
  location: GeoPoint;
  role?: 'admin' | 'user';
  status?: 'active' | 'suspended';
  createdAt?: string;
  achievements?: string[];
  totalFeedings?: number;
  transportation?: 'walk' | 'car';
}

export interface Veterinarian {
  id: string;
  name: string;
  city: string;
  district: string;
  address_full: string;
  location: GeoPoint;
  type: string;
}

export interface AppNotification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'emergency';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface FeedingRecord {
  id: string;
  stationId: string;
  userId: string;
  amount_gr: number;
  timestamp: string;
  photoUrl?: string;
}

export interface HealthRecord {
  id: string;
  petName: string;
  petType: AnimalType;
  type: 'Vaccine' | 'Checkup' | 'Surgery';
  date: string;
  notes: string;
  vetId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export type Tab = 'home' | 'map' | 'list' | 'notifications' | 'profile' | 'ads' | 'vaccine' | 'happyEndings' | 'vetMap' | 'leaderboard' | 'virtualVet' | 'docs' | 'admin';
