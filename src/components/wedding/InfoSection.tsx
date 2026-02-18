import Icon from "@/components/ui/icon";

const VENUE_IMAGE = "https://cdn.poehali.dev/projects/5a3fdc4a-192c-44f8-bed7-676fcfabf9f6/files/9406c677-886e-4ff2-89e1-6cfa6268690b.jpg";

const schedule = [
  { time: "10:00", title: "Церемония", desc: "Торжественная регистрация брака", icon: "Heart" },
  { time: "11:00", title: "Прогулка", desc: "Фотографирование в Санкт-Петербурге", icon: "Camera" },
  { time: "16:00", title: "Фуршет", desc: "Лёгкие закуски и шампанское", icon: "Wine" },
];

const InfoSection = () => {
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
            <img src={VENUE_IMAGE} alt="Venue" className="w-full aspect-[4/3] object-cover" />
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="MapPin" size={20} className="text-muted-foreground" />
                  <h3 className="font-serif text-xl" style={{ color: "hsl(var(--wedding-dark))" }}>Адрес</h3>
                </div>
                <p className="text-muted-foreground font-light ml-8">
                  ЗАГС Фрунзенского района<br />
                  г. Санкт-Петербург, проспект Славы, д. 31
                </p>
              </div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Calendar" size={20} className="text-muted-foreground" />
                  <h3 className="font-serif text-xl" style={{ color: "hsl(var(--wedding-dark))" }}>Дата</h3>
                </div>
                <p className="text-muted-foreground font-light ml-8">
                  26 августа 2026, среда<br />
                  Начало церемонии в 10:00
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Shirt" size={20} className="text-muted-foreground" />
                  <h3 className="font-serif text-xl" style={{ color: "hsl(var(--wedding-dark))" }}>Дресс-код</h3>
                </div>
                <p className="text-muted-foreground font-light ml-8 mb-1">
                  Коктейльный / кэжуал
                </p>
                <p className="text-muted-foreground font-light ml-8 text-sm mb-3">
                  Мужчинам: тёмный низ и светлая рубашка или поло
                </p>
                <div className="flex items-center gap-3 ml-8">
                  {["#3FA38D", "#FFF990", "#89D5DB", "#3295F7", "#4D3407"].map((color) => (
                    <div
                      key={color}
                      className="w-8 h-8 rounded-full border border-border/50 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
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
              src="https://yandex.ru/map-widget/v1/?pt=30.386152,59.856966&z=16&l=map"
              width="100%"
              height="450"
              frameBorder="0"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              title="Карта — ЗАГС Фрунзенского района"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground font-light mb-4">
              ЗАГС Фрунзенского района — проспект Славы, д. 31
            </p>
            <a
              href="https://yandex.ru/maps/?pt=30.386152,59.856966&z=16&l=map"
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