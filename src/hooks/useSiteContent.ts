import { useState, useEffect } from "react";

const SITE_CONTENT_URL = "https://functions.poehali.dev/aa7689e8-e235-4932-842e-47585105b6ca";

export interface SiteContent {
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  wedding_date_label: string;
  about_text: string;
  about_section_label: string;
  about_section_title: string;
  venue_address: string;
  venue_name: string;
  dresscode: string;
  dresscode_hint: string;
  dresscode_colors: string;
  rsvp_deadline: string;
  rsvp_section_title: string;
  rsvp_important_note: string;
  rsvp_confirm_text: string;
  no_flowers_text: string;
  no_flowers_extra: string;
  organizer_name: string;
  organizer_phone: string;
  ceremony_time_label: string;
  hero_tagline: string;
  schedule: string;
  hero_video_url: string;
  hero_image_url: string;
  couple_image_url: string;
  child_groom_url: string;
  child_bride_url: string;
  adult_groom_url: string;
  adult_bride_url: string;
  venue_image_url: string;
  [key: string]: string;
}

export const DEFAULT_CONTENT: SiteContent = {
  groom_name: "Ванюшка",
  bride_name: "Настюшка",
  wedding_date: "2026-08-26T15:00:00",
  wedding_date_label: "26 августа 2026",
  about_text: "Дорогие друзья и родные! Мы рады сообщить вам о самом важном дне в нашей жизни. Будем счастливы разделить этот прекрасный момент с каждым из вас.",
  about_section_label: "Наша история",
  about_section_title: "О событии",
  venue_address: "Ленинградская область, Ломоносовский район, деревня Таменгонт, Центральная улица, 39Б",
  venue_name: "Таменгонт",
  dresscode: "коктейльный / кэжуал",
  dresscode_hint: "Мужчинам: тёмный низ и светлая рубашка или поло",
  dresscode_colors: "#3FA38D,#FFF990,#89D5DB,#3295F7,#4D3407",
  rsvp_deadline: "26 июля 2026",
  rsvp_section_title: "Подтвердите участие",
  rsvp_important_note: "Форму должен пройти каждый приглашённый лично, даже если вы приедете вместе. Это поможет нам точно подготовиться к празднику.",
  rsvp_confirm_text: "Мы с нетерпением ждём встречи с вами",
  no_flowers_text: "Пожалуйста, не дарите нам цветы — к сожалению, после торжества у нас не будет возможности забрать их домой, и мы переживаем, что они не успеют нас порадовать 🌷",
  no_flowers_extra: "Если захотите поздравить нас дополнительно, будем благодарны за подарок в конверте — он поможет исполнить наши общие мечты ✨",
  organizer_name: "Алина",
  organizer_phone: "+7-921-402-12-08",
  ceremony_time_label: "Начало церемонии в 15:00",
  hero_tagline: "Приглашение на свадьбу",
  schedule: '[{"time":"14:00","title":"Сбор гостей + фуршет","desc":"Встреча гостей, лёгкие закуски и шампанское","icon":"Users"},{"time":"15:00","title":"Выездная церемония","desc":"Торжественная регистрация брака","icon":"Heart"},{"time":"16:00","title":"Банкет","desc":"Праздничный ужин и веселье","icon":"Utensils"}]',
  hero_video_url: "https://cdn.poehali.dev/projects/5a3fdc4a-192c-44f8-bed7-676fcfabf9f6/bucket/150c7e2f-b584-4ca7-bc74-28dc2b73222c.MOV",
  hero_image_url: "https://cdn.poehali.dev/projects/5a3fdc4a-192c-44f8-bed7-676fcfabf9f6/files/7f7bcfe9-3e73-409e-986b-21f9bcfd686e.jpg",
  couple_image_url: "https://cdn.poehali.dev/projects/5a3fdc4a-192c-44f8-bed7-676fcfabf9f6/bucket/dcdaf83e-eeb9-4317-80a0-7ddc7fe2cd61.jpg",
  child_groom_url: "https://cdn.poehali.dev/files/2cf75f75-f8e9-47cf-8784-c0c9b56811c3.png",
  child_bride_url: "https://cdn.poehali.dev/files/51566e37-37ec-41b5-b1fd-0c72fa3228c0.png",
  adult_groom_url: "https://cdn.poehali.dev/files/953a90cf-1d75-4cc6-ae10-6a2d045940d8.png",
  adult_bride_url: "https://cdn.poehali.dev/files/0601fa4b-c3a9-4d70-86fb-d81539a302b4.png",
  venue_image_url: "https://cdn.poehali.dev/projects/5a3fdc4a-192c-44f8-bed7-676fcfabf9f6/bucket/f5dce4bd-5b74-4d52-ab29-50b7b81d7fe3.jpg",
};

let cachedContent: SiteContent | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000;

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(cachedContent ?? DEFAULT_CONTENT);
  const [loading, setLoading] = useState(!cachedContent);

  useEffect(() => {
    if (cachedContent && Date.now() - cacheTime < CACHE_TTL) {
      setContent(cachedContent);
      setLoading(false);
      return;
    }
    fetch(SITE_CONTENT_URL)
      .then((r) => r.json())
      .then((data) => {
        if (data.content) {
          const merged = { ...DEFAULT_CONTENT, ...data.content };
          cachedContent = merged;
          cacheTime = Date.now();
          setContent(merged);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { content, loading };
}

export async function saveSiteContent(updates: Partial<SiteContent>, token: string): Promise<boolean> {
  const res = await fetch(SITE_CONTENT_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Admin-Token": token },
    body: JSON.stringify({ updates }),
  });
  if (res.ok) {
    cachedContent = null;
  }
  return res.ok;
}

export async function uploadFile(file: File, token: string): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      const res = await fetch(SITE_CONTENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify({ file: base64, filename: file.name }),
      });
      if (res.ok) {
        const data = await res.json();
        resolve(data.url ?? null);
      } else {
        resolve(null);
      }
    };
    reader.readAsDataURL(file);
  });
}
