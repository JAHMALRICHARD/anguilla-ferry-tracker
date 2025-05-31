export type FerryStatus = "on-time" | "delayed" | "cancelled" | "scheduled";

export interface FerryItem {
  id: number | string;
  operator: string;
  departure_port: string;
  arrival_port: string;
  departure_time: string;
  arrival_time?: string;
  price: string;
  duration: string;
  vessel_name?: string | null;
  status: FerryStatus;
  direction: string;
  schedule_date: string;
  logo_url: string;
}
