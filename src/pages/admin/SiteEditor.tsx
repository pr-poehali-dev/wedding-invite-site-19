import { useState, useEffect, useRef } from "react";
import { saveSiteContent, uploadFile, SiteContent, DEFAULT_CONTENT } from "@/hooks/useSiteContent";
import Icon from "@/components/ui/icon";

const SITE_CONTENT_URL = "https://functions.poehali.dev/aa7689e8-e235-4932-842e-47585105b6ca";

interface ScheduleItem {
  time: string;
  title: string;
  desc: string;
  icon: string;
}

interface SiteEditorProps {
  token: string;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">{children}</p>
);

const Field = ({
  label, value, onChange, multiline, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) => (
  <div>
    <Label>{label}</Label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
      />
    )}
  </div>
);

function ImageUploadField({
  label, value, onChange, token,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  token: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    const url = await uploadFile(file, token);
    setUploading(false);
    if (url) onChange(url);
  };

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2 items-start">
        {value && (
          <img src={value} alt="" className="w-16 h-16 object-cover rounded-md border border-border shrink-0" />
        )}
        <div className="flex-1 space-y-1.5">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors disabled:opacity-50"
          >
            {uploading
              ? <><Icon name="Loader2" size={12} className="animate-spin" /> Загружаю...</>
              : <><Icon name="Upload" size={12} /> Загрузить файл</>}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
}

type TabId = "main" | "texts" | "schedule" | "media" | "contacts";

export default function SiteEditor({ token }: SiteEditorProps) {
  const [form, setForm] = useState<SiteContent>(DEFAULT_CONTENT);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("main");

  useEffect(() => {
    fetch(SITE_CONTENT_URL)
      .then((r) => r.json())
      .then((data) => {
        if (data.content) {
          const merged = { ...DEFAULT_CONTENT, ...data.content };
          setForm(merged);
          try { setSchedule(JSON.parse(merged.schedule)); } catch { setSchedule([]); }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof SiteContent) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  const handleSave = async () => {
    setSaving(true);
    const updates = { ...form, schedule: JSON.stringify(schedule) };
    const ok = await saveSiteContent(updates, token);
    setSaving(false);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
  };

  const addScheduleItem = () =>
    setSchedule((s) => [...s, { time: "", title: "", desc: "", icon: "Star" }]);

  const removeScheduleItem = (i: number) =>
    setSchedule((s) => s.filter((_, idx) => idx !== i));

  const updateScheduleItem = (i: number, field: keyof ScheduleItem, val: string) =>
    setSchedule((s) => s.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)));

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "main", label: "Основное", icon: "Settings2" },
    { id: "texts", label: "Тексты", icon: "Type" },
    { id: "schedule", label: "Расписание", icon: "Clock" },
    { id: "media", label: "Фото и видео", icon: "Image" },
    { id: "contacts", label: "Контакты", icon: "Phone" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
        <Icon name="Loader2" size={18} className="animate-spin mr-2" /> Загрузка...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-widest uppercase transition-colors"
            style={
              activeTab === t.id
                ? { backgroundColor: "hsl(var(--wedding-dark))", color: "hsl(var(--wedding-cream))" }
                : { backgroundColor: "transparent", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))" }
            }
          >
            <Icon name={t.icon} size={13} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">

        {activeTab === "main" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Имя жениха" value={form.groom_name} onChange={set("groom_name")} placeholder="Ванюшка" />
              <Field label="Имя невесты" value={form.bride_name} onChange={set("bride_name")} placeholder="Настюшка" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Дата (отображаемая)" value={form.wedding_date_label} onChange={set("wedding_date_label")} placeholder="26 августа 2026" />
              <Field label="Дата (ISO, для таймера)" value={form.wedding_date} onChange={set("wedding_date")} placeholder="2026-08-26T15:00:00" />
            </div>
            <Field label="Надпись на главном экране (под датой)" value={form.hero_tagline} onChange={set("hero_tagline")} placeholder="Приглашение на свадьбу" />
            <Field label="Текст о событии" value={form.about_text} onChange={set("about_text")} multiline placeholder="Дорогие друзья..." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Название места" value={form.venue_name} onChange={set("venue_name")} placeholder="Таменгонт" />
              <Field label="Адрес" value={form.venue_address} onChange={set("venue_address")} placeholder="Ленинградская область..." />
            </div>
            <Field label="Время начала церемонии" value={form.ceremony_time_label} onChange={set("ceremony_time_label")} placeholder="Начало церемонии в 15:00" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Дресс-код" value={form.dresscode} onChange={set("dresscode")} placeholder="коктейльный / кэжуал" />
              <Field label="Подсказка по дресс-коду" value={form.dresscode_hint} onChange={set("dresscode_hint")} placeholder="Мужчинам: тёмный низ..." />
            </div>
            <div>
              <Label>Цвета дресс-кода (через запятую)</Label>
              <input
                type="text"
                value={form.dresscode_colors}
                onChange={(e) => set("dresscode_colors")(e.target.value)}
                placeholder="#3FA38D,#FFF990,..."
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <div className="flex gap-1 mt-2">
                {form.dresscode_colors.split(",").map((c, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-border"
                    style={{ backgroundColor: c.trim() }}
                    title={c.trim()}
                  />
                ))}
              </div>
            </div>
            <Field label="Дедлайн подтверждения (RSVP)" value={form.rsvp_deadline} onChange={set("rsvp_deadline")} placeholder="26 июля 2026" />
          </>
        )}

        {activeTab === "texts" && (
          <>
            <p className="text-xs text-muted-foreground pb-1 border-b border-border">Секция «О нас»</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Подзаголовок (маленький)" value={form.about_section_label} onChange={set("about_section_label")} placeholder="Наша история" />
              <Field label="Заголовок" value={form.about_section_title} onChange={set("about_section_title")} placeholder="О событии" />
            </div>

            <p className="text-xs text-muted-foreground pb-1 border-b border-border mt-2">Форма RSVP</p>
            <Field label="Заголовок формы RSVP" value={form.rsvp_section_title} onChange={set("rsvp_section_title")} placeholder="Подтвердите участие" />
            <Field label="Важная заметка (баннер в форме)" value={form.rsvp_important_note} onChange={set("rsvp_important_note")} multiline />
            <Field label="Текст после отправки формы" value={form.rsvp_confirm_text} onChange={set("rsvp_confirm_text")} placeholder="Мы с нетерпением ждём встречи с вами" />

            <p className="text-xs text-muted-foreground pb-1 border-b border-border mt-2">Благодарность после RSVP</p>
            <Field label="Просьба не дарить цветы" value={form.no_flowers_text} onChange={set("no_flowers_text")} multiline />
            <Field label="Дополнение (про конверт и т.д.)" value={form.no_flowers_extra} onChange={set("no_flowers_extra")} multiline />
          </>
        )}

        {activeTab === "schedule" && (
          <div className="space-y-4">
            {schedule.map((item, i) => (
              <div
                key={i}
                className="border border-border rounded-lg p-4 space-y-3"
                style={{ backgroundColor: "hsl(var(--wedding-cream))" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: "hsl(var(--wedding-dark))" }}>
                    Пункт {i + 1}
                  </span>
                  <button
                    onClick={() => removeScheduleItem(i)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Icon name="Trash2" size={15} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Время" value={item.time} onChange={(v) => updateScheduleItem(i, "time", v)} placeholder="14:00" />
                  <Field label="Иконка (lucide)" value={item.icon} onChange={(v) => updateScheduleItem(i, "icon", v)} placeholder="Users" />
                </div>
                <Field label="Название" value={item.title} onChange={(v) => updateScheduleItem(i, "title", v)} placeholder="Сбор гостей" />
                <Field label="Описание" value={item.desc} onChange={(v) => updateScheduleItem(i, "desc", v)} placeholder="Краткое описание" />
              </div>
            ))}
            <button
              onClick={addScheduleItem}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors w-full justify-center"
            >
              <Icon name="Plus" size={15} /> Добавить пункт
            </button>
          </div>
        )}

        {activeTab === "media" && (
          <div className="space-y-5">
            <p className="text-xs text-muted-foreground pb-1 border-b border-border">Главный экран</p>
            <ImageUploadField label="Постер / обложка видео" value={form.hero_image_url} onChange={set("hero_image_url")} token={token} />
            <div>
              <Label>Видео на главной (ссылка или загрузи)</Label>
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={form.hero_video_url}
                    onChange={(e) => set("hero_video_url")(e.target.value)}
                    placeholder="https://cdn..."
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <VideoUploadButton value={form.hero_video_url} onChange={set("hero_video_url")} token={token} />
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground pb-1 border-b border-border mt-2">Секция «О нас»</p>
            <ImageUploadField label="Фото пары" value={form.couple_image_url} onChange={set("couple_image_url")} token={token} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploadField label={`${form.groom_name} в детстве`} value={form.child_groom_url} onChange={set("child_groom_url")} token={token} />
              <ImageUploadField label={`${form.bride_name} в детстве`} value={form.child_bride_url} onChange={set("child_bride_url")} token={token} />
              <ImageUploadField label={`${form.groom_name} сейчас`} value={form.adult_groom_url} onChange={set("adult_groom_url")} token={token} />
              <ImageUploadField label={`${form.bride_name} сейчас`} value={form.adult_bride_url} onChange={set("adult_bride_url")} token={token} />
            </div>

            <p className="text-xs text-muted-foreground pb-1 border-b border-border mt-2">Место проведения</p>
            <ImageUploadField label="Фото площадки" value={form.venue_image_url} onChange={set("venue_image_url")} token={token} />
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Имя организатора" value={form.organizer_name} onChange={set("organizer_name")} placeholder="Алина" />
              <Field label="Телефон организатора" value={form.organizer_phone} onChange={set("organizer_phone")} placeholder="+7-921-402-12-08" />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-md text-sm tracking-widest uppercase transition-colors disabled:opacity-50"
          style={{ backgroundColor: "hsl(var(--wedding-dark))", color: "hsl(var(--wedding-cream))" }}
        >
          {saving
            ? <><Icon name="Loader2" size={15} className="animate-spin" /> Сохраняю...</>
            : <><Icon name="Save" size={15} /> Сохранить</>}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600">
            <Icon name="CheckCircle" size={15} /> Готово — изменения на сайте
          </span>
        )}
      </div>
    </div>
  );
}

function VideoUploadButton({ onChange, token }: { value: string; onChange: (v: string) => void; token: string }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    const url = await uploadFile(file, token);
    setUploading(false);
    if (url) onChange(url);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors disabled:opacity-50"
      >
        {uploading
          ? <><Icon name="Loader2" size={12} className="animate-spin" /> Загружаю...</>
          : <><Icon name="Upload" size={12} /> Загрузить видео</>}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </>
  );
}
