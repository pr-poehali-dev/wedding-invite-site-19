import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

const RSVP_URL = "https://functions.poehali.dev/31b8454d-9cf0-44ef-bccc-adab5d9505d2";

interface Guest {
  id: number;
  first_name: string;
  last_name: string;
  guests_count: number;
  wishes: string;
  created_at: string;
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

  const totalPeople = guests.reduce((sum, g) => sum + g.guests_count, 0);

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
          <div className="flex gap-8 text-center">
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
                className="border rounded-lg p-5 flex flex-col md:flex-row md:items-center gap-4"
                style={{ backgroundColor: "hsl(var(--wedding-cream))" }}
              >
                <div className="flex-1">
                  <h3 className="font-serif text-lg" style={{ color: "hsl(var(--wedding-dark))" }}>
                    {guest.first_name} {guest.last_name}
                  </h3>
                  {guest.wishes && (
                    <p className="text-sm text-muted-foreground font-light mt-1">«{guest.wishes}»</p>
                  )}
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Icon name="Users" size={16} />
                    <span>{guest.guests_count}</span>
                  </div>
                  <span className="font-light">
                    {new Date(guest.created_at).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
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