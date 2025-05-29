export interface FerryItem {
  id: number;
  operator: string;
  departure_port: string;
  arrival_port: string;
  departure_time: string;
  arrival_time?: string;
  price: string;
  duration: string;
  vessel_name?: string;
  status: "on-time" | "delayed" | "cancelled" | "scheduled";
  direction: string;
  schedule_date: string;
  logo_url: string;
}
