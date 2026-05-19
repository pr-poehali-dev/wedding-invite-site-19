export const RSVP_URL =
  "https://functions.poehali.dev/e1549638-af55-45e7-b65d-bccaecfbc611";
export const AUTH_URL =
  "https://functions.poehali.dev/2dd1535d-e621-47fe-a7e5-93dc191c122a";

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