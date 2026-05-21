import Icon from "@/components/ui/icon";
import { useSiteContent } from "@/hooks/useSiteContent";

interface ScheduleItem {
  time: string;
  title: string;
  desc: string;
  icon: string;
}

const InfoSection = () => {
  const { content } = useSiteContent();

  let schedule: ScheduleItem[] = [];
  try {
    schedule = JSON.parse(content.schedule);
  } catch {
    schedule = [];
  }

  const dresscodeColors = content.dresscode_colors.split(",").map((c) => c.trim()).filter(Boolean);

  const mapQuery = encodeURIComponent(content.venue_address);

  return (
    <>
      <section id="schedule" className="py-24 md:py-32" style={{ backgroundColor: "hsl(var(--wedding-cream))" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">Программа дня</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-4" style={{ color: "hsl(var(--wedding-dark))" }}>
            Расписание
          </h2>
          <div className="wedding-divider mb-16" />

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block" style={{ backgroundColor: "hsl(var(--wedding-sand))" }} />
            <div className="space-y-12">
              {schedule.map((item, i) => (
                <div key={i} className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <span className="font-serif text-3xl font-light" style={{ color: "hsl(var(--wedding-gold))" }}>
                      {item.time}
                    </span>
                  </div>
                  <div className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center bg-background border-2" style={{ borderColor: "hsl(var(--wedding-gold))" }}>
                    <Icon name={item.icon} size={20} className="text-muted-foreground" />
                  </div>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                    <h3 className="font-serif text-xl mb-1" style={{ color: "hsl(var(--wedding-dark))" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="venue" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">Где нас найти</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-4" style={{ color: "hsl(var(--wedding-dark))" }}>
              Место и время
            </h2>
            <div className="wedding-divider mb-8" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img src={content.venue_image_url} alt="Venue" className="w-full aspect-[4/3] object-cover" />
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="MapPin" size={20} className="text-muted-foreground" />
                  <h3 className="font-serif text-xl" style={{ color: "hsl(var(--wedding-dark))" }}>Адрес</h3>
                </div>
                <p className="text-muted-foreground font-light ml-8">
                  {content.venue_address}
                </p>
              </div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Calendar" size={20} className="text-muted-foreground" />
                  <h3 className="font-serif text-xl" style={{ color: "hsl(var(--wedding-dark))" }}>Дата</h3>
                </div>
                <p className="text-muted-foreground font-light ml-8">
                  {content.wedding_date_label}<br />
                  Начало церемонии в 15:00
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Shirt" size={20} className="text-muted-foreground" />
                  <h3 className="font-serif text-xl" style={{ color: "hsl(var(--wedding-dark))" }}>Дресс-код</h3>
                </div>
                <p className="text-muted-foreground font-light ml-8 mb-1">
                  {content.dresscode}
                </p>
                <p className="text-muted-foreground font-light ml-8 text-sm mb-3">
                  Мужчинам: тёмный низ и светлая рубашка или поло
                </p>
                {dresscodeColors.length > 0 && (
                  <div className="flex items-center gap-3 ml-8">
                    {dresscodeColors.map((color) => (
                      <div
                        key={color}
                        className="w-8 h-8 rounded-full border border-border/50 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="map" className="py-24 md:py-32" style={{ backgroundColor: "hsl(var(--wedding-cream))" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">Как добраться</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-4" style={{ color: "hsl(var(--wedding-dark))" }}>
              Карта
            </h2>
            <div className="wedding-divider mb-8" />
          </div>

          <div className="overflow-hidden rounded-lg shadow-sm border border-border/50">
            <iframe
              src={`https://yandex.ru/map-widget/v1/?text=${mapQuery}&z=16&l=map`}
              width="100%"
              height="450"
              frameBorder="0"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              title={`Карта — ${content.venue_name}`}
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground font-light mb-4">
              {content.venue_address}
            </p>
            <a
              href={`https://yandex.ru/maps/?text=${mapQuery}&z=16`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm tracking-widest uppercase font-light hover:opacity-60 transition-opacity"
              style={{ color: "hsl(var(--wedding-dark))" }}
            >
              <Icon name="Navigation" size={16} />
              Построить маршрут
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default InfoSection;
