import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

const RSVP_URL = "https://functions.poehali.dev/31b8454d-9cf0-44ef-bccc-adab5d9505d2";

const DRINK_LABELS: Record<string, string> = {
  wine: "Вино",
  champagne: "Шампанское",
  strong: "Крепкое",
  "non-alcoholic": "Безалкогольное",
};

interface Guest {
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

const Admin = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(RSVP_URL)
      .then((r) => r.json())
      .then((data) => setGuests(data.guests || []))
      .finally(() => setLoading(false));
  }, []);

  const totalPeople = guests.reduce((sum, g) => sum + g.guests_count + (g.has_plus_one ? 1 : 0), 0);
  const needTransfer = guests.filter((g) => g.need_transfer).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div>
            <a href="/" className="text-xs tracking-widest uppercase text-muted-foreground hover:opacity-60 transition-opacity">
              ← На сайт
            </a>
            <h1 className="font-serif text-3xl mt-2" style={{ color: "hsl(var(--wedding-dark))" }}>
              Список гостей
            </h1>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <span className="font-serif text-3xl font-light" style={{ color: "hsl(var(--wedding-dark))" }}>
                {guests.length}
              </span>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">ответов</p>
            </div>
            <div>
              <span className="font-serif text-3xl font-light" style={{ color: "hsl(var(--wedding-gold))" }}>
                {totalPeople}
              </span>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">гостей</p>
            </div>
            <div>
              <span className="font-serif text-3xl font-light" style={{ color: "hsl(var(--wedding-sage))" }}>
                {needTransfer}
              </span>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">трансфер</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-20">
            <Icon name="Loader2" size={28} className="animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground font-light mt-4">Загрузка...</p>
          </div>
        ) : guests.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="Users" size={40} className="mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground font-light">Пока никто не подтвердил участие</p>
          </div>
        ) : (
          <div className="space-y-4">
            {guests.map((guest) => (
              <div
                key={guest.id}
                className="border rounded-lg p-5"
                style={{ backgroundColor: "hsl(var(--wedding-cream))" }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg" style={{ color: "hsl(var(--wedding-dark))" }}>
                      {guest.first_name} {guest.last_name}
                    </h3>
                    {guest.has_plus_one && guest.plus_one_name && (
                      <p className="text-sm text-muted-foreground font-light mt-1">
                        <Icon name="Heart" size={12} className="inline mr-1" />
                        +1: {guest.plus_one_name}
                      </p>
                    )}
                    {guest.wishes && (
                      <p className="text-sm text-muted-foreground font-light mt-1 italic">«{guest.wishes}»</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background">
                      <Icon name="Users" size={12} /> {guest.guests_count}
                    </span>
                    {guest.drink_preference && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background">
                        <Icon name="Wine" size={12} /> {DRINK_LABELS[guest.drink_preference] || guest.drink_preference}
                      </span>
                    )}
                    {guest.allergies && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background">
                        <Icon name="AlertTriangle" size={12} /> {guest.allergies}
                      </span>
                    )}
                    {guest.need_transfer && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background">
                        <Icon name="Car" size={12} /> Трансфер
                      </span>
                    )}
                    <span className="font-light">
                      {new Date(guest.created_at).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;