export type Database = {
  public: {
    Tables: {
      ferry_charters: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          hero_image_url: string;
          featured_image_url: string | null;
          fleet_description: string;
          services: string[];
          booking_url: string;
          contact_phone: string | null;
          contact_email: string | null;
        };
      };
    };
  };
};

export type FerryCharter =
  Database["public"]["Tables"]["ferry_charters"]["Row"];
