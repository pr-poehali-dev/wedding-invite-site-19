import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/5a3fdc4a-192c-44f8-bed7-676fcfabf9f6/files/7f7bcfe9-3e73-409e-986b-21f9bcfd686e.jpg";
const COUPLE_IMAGE = "https://cdn.poehali.dev/projects/5a3fdc4a-192c-44f8-bed7-676fcfabf9f6/bucket/37a538de-c152-4e90-9f03-e0d84772c62c.jpg";
const CHILD_VANYA = "https://cdn.poehali.dev/files/2cf75f75-f8e9-47cf-8784-c0c9b56811c3.png";
const CHILD_NASTYA = "https://cdn.poehali.dev/files/51566e37-37ec-41b5-b1fd-0c72fa3228c0.png";
const ADULT_VANYA = "https://cdn.poehali.dev/files/953a90cf-1d75-4cc6-ae10-6a2d045940d8.png";
const ADULT_NASTYA = "https://cdn.poehali.dev/files/0601fa4b-c3a9-4d70-86fb-d81539a302b4.png";

const HeroSection = () => {
  const targetDate = new Date("2026-08-26T10:00:00");
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-serif text-xl tracking-wide" style={{ color: "hsl(var(--wedding-dark))" }}>
            В & Н
          </span>
          <div className="hidden md:flex gap-8 text-sm tracking-widest uppercase font-light">
            <a href="#about" className="hover:opacity-60 transition-opacity">О нас</a>
            <a href="#schedule" className="hover:opacity-60 transition-opacity">Расписание</a>
            <a href="#venue" className="hover:opacity-60 transition-opacity">Место</a>
            <a href="#map" className="hover:opacity-60 transition-opacity">Карта</a>
            <a href="#rsvp" className="hover:opacity-60 transition-opacity">RSVP</a>
          </div>
        </div>
      </nav>

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Wedding" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-6">
          <p className="text-sm tracking-[0.4em] uppercase font-sans font-light mb-6 opacity-0 animate-fade-in">
            Приглашение на свадьбу
          </p>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light mb-4 opacity-0 animate-fade-in animate-delay-200">
            Ванюшка
          </h1>
          <div className="flex items-center justify-center gap-6 mb-4 opacity-0 animate-fade-in animate-delay-300">
            <div className="w-16 h-px bg-white/50" />
            <span className="font-serif text-2xl italic">&</span>
            <div className="w-16 h-px bg-white/50" />
          </div>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light mb-8 opacity-0 animate-fade-in animate-delay-400">
            Настюшка
          </h1>
          <p className="text-lg tracking-[0.3em] uppercase font-light opacity-0 animate-fade-in animate-delay-500">
            26 августа 2026
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={24} className="text-white/70" />
        </div>
      </section>

      <section className="py-8 border-b" style={{ backgroundColor: "hsl(var(--wedding-cream))" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center px-6">
          {[
            { value: days, label: "дней" },
            { value: Math.floor((diff / (1000 * 60 * 60)) % 24), label: "часов" },
            { value: Math.floor((diff / (1000 * 60)) % 60), label: "минут" },
            { value: Math.floor((diff / 1000) % 60), label: "секунд" },
          ].map((item) => (
            <div key={item.label}>
              <span className="font-serif text-4xl md:text-5xl font-light" style={{ color: "hsl(var(--wedding-dark))" }}>
                {item.value}
              </span>
              <p className="text-xs tracking-[0.3em] uppercase mt-1 text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">Наша история</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-4" style={{ color: "hsl(var(--wedding-dark))" }}>
              О событии
            </h2>
            <div className="wedding-divider mb-8" />
            <p className="leading-relaxed text-muted-foreground font-light max-w-xl mx-auto">
              Дорогие друзья и родные! Мы рады сообщить вам о самом важном дне в нашей жизни.
              Будем счастливы разделить этот прекрасный момент с каждым из вас.
            </p>
          </div>

          <div className="space-y-20">
            <div className="grid grid-cols-2 gap-6 md:gap-10 max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img src={CHILD_VANYA} alt="Ванюшка в детстве" className="w-full aspect-square object-cover rounded-lg shadow-md" />
                  <div className="absolute -bottom-3 -right-3 w-14 h-14 border-2 rounded-lg" style={{ borderColor: "hsl(var(--wedding-gold))" }} />
                </div>
                <p className="font-serif text-lg text-muted-foreground italic">Ванюшка</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img src={CHILD_NASTYA} alt="Настюшка в детстве" className="w-full aspect-square object-cover rounded-lg shadow-md" />
                  <div className="absolute -bottom-3 -left-3 w-14 h-14 border-2 rounded-lg" style={{ borderColor: "hsl(var(--wedding-gold))" }} />
                </div>
                <p className="font-serif text-lg text-muted-foreground italic">Настюшка</p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-px h-12" style={{ backgroundColor: "hsl(var(--wedding-gold))" }} />
            </div>

            <div className="grid grid-cols-2 gap-6 md:gap-10 max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-4">
                <img src={ADULT_VANYA} alt="Ванюшка" className="w-full aspect-square object-cover rounded-lg shadow-md" />
                <p className="font-serif text-lg text-muted-foreground italic">Выросли</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <img src={ADULT_NASTYA} alt="Настюшка" className="w-full aspect-square object-cover rounded-lg shadow-md" />
                <p className="font-serif text-lg text-muted-foreground italic">И расцвели</p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-px h-12" style={{ backgroundColor: "hsl(var(--wedding-gold))" }} />
            </div>

            <div className="max-w-md mx-auto">
              <div className="relative">
                <img src={COUPLE_IMAGE} alt="Ванюшка и Настюшка" className="w-full aspect-[3/4] object-cover rounded-lg shadow-lg" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 border-2 rounded-lg" style={{ borderColor: "hsl(var(--wedding-gold))" }} />
                <div className="absolute -top-4 -right-4 w-20 h-20 border-2 rounded-lg" style={{ borderColor: "hsl(var(--wedding-gold))" }} />
              </div>
              <p className="font-serif text-xl italic text-center mt-6" style={{ color: "hsl(var(--wedding-dark))" }}>Нашли друг друга ♥</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;