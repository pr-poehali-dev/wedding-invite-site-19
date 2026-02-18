export const RSVP_URL =
  "https://functions.poehali.dev/31b8454d-9cf0-44ef-bccc-adab5d9505d2";
export const AUTH_URL =
  "https://functions.poehali.dev/076c0e5f-9c6c-44c5-9376-fdd07aa33707";

export const DRINK_LABELS: Record<string, string> = {
  wine: "Вино",
  champagne: "Шампанское",
  strong: "Крепкое",
  "non-alcoholic": "Безалкогольное",
};

export const DRINK_OPTIONS = [
  { value: "wine", label: "Вино" },
  { value: "champagne", label: "Шампанское" },
  { value: "strong", label: "Крепкое" },
  { value: "non-alcoholic", label: "Безалкогольное" },
];

export interface Guest {
  id: number;
  first_name: string;
  last_name: string;
  guests_count: number;
  wishes: string;
  created_at: string;
  has_plus_one: boolean;
  plus_one_name: string;
  allergies: string;
  drink_preference: string;
  need_transfer: boolean;
}
