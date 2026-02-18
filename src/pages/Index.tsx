import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/5a3fdc4a-192c-44f8-bed7-676fcfabf9f6/files/7f7bcfe9-3e73-409e-986b-21f9bcfd686e.jpg";
const COUPLE_IMAGE = "https://cdn.poehali.dev/projects/5a3fdc4a-192c-44f8-bed7-676fcfabf9f6/bucket/37a538de-c152-4e90-9f03-e0d84772c62c.jpg";
const CHILD_VANYA = "https://cdn.poehali.dev/files/2cf75f75-f8e9-47cf-8784-c0c9b56811c3.png";
const CHILD_NASTYA = "https://cdn.poehali.dev/files/51566e37-37ec-41b5-b1fd-0c72fa3228c0.png";
const ADULT_VANYA = "https://cdn.poehali.dev/files/953a90cf-1d75-4cc6-ae10-6a2d045940d8.png";
const ADULT_NASTYA = "https://cdn.poehali.dev/files/0601fa4b-c3a9-4d70-86fb-d81539a302b4.png";
const VENUE_IMAGE = "https://cdn.poehali.dev/projects/5a3fdc4a-192c-44f8-bed7-676fcfabf9f6/files/9406c677-886e-4ff2-89e1-6cfa6268690b.jpg";


const schedule = [
  { time: "10:00", title: "Церемония", desc: "Торжественная регистрация брака", icon: "Heart" },
  { time: "11:00", title: "Прогулка", desc: "Фотографирование в Санкт-Петербурге", icon: "Camera" },
  { time: "16:00", title: "Фуршет", desc: "Лёгкие закуски и шампанское", icon: "Wine" },
];

const RSVP_URL = "https://functions.poehali.dev/31b8454d-9cf0-44ef-bccc-adab5d9505d2";

const DRINK_OPTIONS = [
  { value: "wine", label: "Вино", icon: "Wine" },
  { value: "champagne", label: "Шампанское", icon: "Sparkles" },
  { value: "strong", label: "Крепкое", icon: "Beer" },
  { value: "non-alcoholic", label: "Безалкогольное", icon: "CupSoda" },
];

const Index = () => {
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [survey, setSurvey] = useState({
    first_name: "",
    last_name: "",
    guests_count: 1,
    has_plus_one: false,
    plus_one_name: "",
    allergies: "",
    drink_preference: "",
    need_transfer: false,
    wishes: "",
  });

  const targetDate = new Date("2026-08-26T10:00:00");
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-screen bg-background">
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

      <section id="rsvp" className="py-24 md:py-32">
        <div className="max-w-lg mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">Ждём вас</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-4" style={{ color: "hsl(var(--wedding-dark))" }}>
            Подтвердите участие
          </h2>
          <div className="wedding-divider mb-8" />
          <p className="text-muted-foreground font-light mb-10">
            Пожалуйста, сообщите нам о вашем присутствии до 26 апреля 2026
          </p>

          {!rsvpSent ? (
            <div className="text-left">
              <div className="flex justify-center gap-2 mb-10">
                {[0, 1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: s <= step ? 40 : 24,
                      backgroundColor: s <= step ? "hsl(var(--wedding-gold))" : "hsl(var(--border))",
                    }}
                  />
                ))}
              </div>

              <div className="min-h-[320px]">
                {step === 0 && (
                  <div className="space-y-4 animate-fade-in">
                    <p className="font-serif text-xl text-center mb-6" style={{ color: "hsl(var(--wedding-dark))" }}>Как вас зовут?</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Имя</label>
                        <Input
                          placeholder="Ваше имя"
                          value={survey.first_name}
                          onChange={(e) => setSurvey({ ...survey, first_name: e.target.value })}
                          className="bg-background border-border/60 font-light"
                        />
                      </div>
                      <div>
                        <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Фамилия</label>
                        <Input
                          placeholder="Ваша фамилия"
                          value={survey.last_name}
                          onChange={(e) => setSurvey({ ...survey, last_name: e.target.value })}
                          className="bg-background border-border/60 font-light"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Количество гостей</label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={survey.guests_count}
                        onChange={(e) => setSurvey({ ...survey, guests_count: Number(e.target.value) })}
                        className="bg-background border-border/60 font-light"
                      />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <p className="font-serif text-xl text-center mb-6" style={{ color: "hsl(var(--wedding-dark))" }}>Будете с парой?</p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { val: true, label: "Да, с +1", icon: "Heart" },
                        { val: false, label: "Нет, один/одна", icon: "User" },
                      ].map((opt) => (
                        <button
                          key={String(opt.val)}
                          type="button"
                          onClick={() => setSurvey({ ...survey, has_plus_one: opt.val, plus_one_name: opt.val ? survey.plus_one_name : "" })}
                          className="p-6 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-3"
                          style={{
                            borderColor: survey.has_plus_one === opt.val ? "hsl(var(--wedding-gold))" : "hsl(var(--border))",
                            backgroundColor: survey.has_plus_one === opt.val ? "hsl(var(--wedding-cream))" : "transparent",
                          }}
                        >
                          <Icon name={opt.icon} size={28} className="text-muted-foreground" />
                          <span className="text-sm font-light">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                    {survey.has_plus_one && (
                      <div className="animate-fade-in">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Имя вашей пары</label>
                        <Input
                          placeholder="Имя спутника/спутницы"
                          value={survey.plus_one_name}
                          onChange={(e) => setSurvey({ ...survey, plus_one_name: e.target.value })}
                          className="bg-background border-border/60 font-light"
                        />
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <p className="font-serif text-xl text-center mb-6" style={{ color: "hsl(var(--wedding-dark))" }}>Что будете пить?</p>
                    <div className="grid grid-cols-2 gap-3">
                      {DRINK_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSurvey({ ...survey, drink_preference: opt.value })}
                          className="p-5 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-3"
                          style={{
                            borderColor: survey.drink_preference === opt.value ? "hsl(var(--wedding-gold))" : "hsl(var(--border))",
                            backgroundColor: survey.drink_preference === opt.value ? "hsl(var(--wedding-cream))" : "transparent",
                          }}
                        >
                          <Icon name={opt.icon} size={24} className="text-muted-foreground" />
                          <span className="text-sm font-light">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                    <div>
                      <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Аллергии / предпочтения в еде</label>
                      <Input
                        placeholder="Например: без глютена, вегетарианец..."
                        value={survey.allergies}
                        onChange={(e) => setSurvey({ ...survey, allergies: e.target.value })}
                        className="bg-background border-border/60 font-light"
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <p className="font-serif text-xl text-center mb-6" style={{ color: "hsl(var(--wedding-dark))" }}>Последние штрихи</p>
                    <div>
                      <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Нужен ли трансфер?</p>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { val: true, label: "Да, нужен", icon: "Car" },
                          { val: false, label: "Нет, доберусь", icon: "Footprints" },
                        ].map((opt) => (
                          <button
                            key={String(opt.val)}
                            type="button"
                            onClick={() => setSurvey({ ...survey, need_transfer: opt.val })}
                            className="p-5 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-3"
                            style={{
                              borderColor: survey.need_transfer === opt.val ? "hsl(var(--wedding-gold))" : "hsl(var(--border))",
                              backgroundColor: survey.need_transfer === opt.val ? "hsl(var(--wedding-cream))" : "transparent",
                            }}
                          >
                            <Icon name={opt.icon} size={24} className="text-muted-foreground" />
                            <span className="text-sm font-light">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Пожелания</label>
                      <Textarea
                        placeholder="Что-нибудь ещё..."
                        value={survey.wishes}
                        onChange={(e) => setSurvey({ ...survey, wishes: e.target.value })}
                        className="bg-background border-border/60 font-light min-h-[100px]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 py-6 tracking-[0.2em] uppercase text-sm font-light"
                  >
                    Назад
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      if (step === 0 && (!survey.first_name.trim() || !survey.last_name.trim())) return;
                      setStep(step + 1);
                    }}
                    disabled={step === 0 && (!survey.first_name.trim() || !survey.last_name.trim())}
                    className="flex-1 py-6 tracking-[0.2em] uppercase text-sm font-light"
                    style={{ backgroundColor: "hsl(var(--wedding-dark))", color: "hsl(var(--wedding-cream))" }}
                  >
                    Далее
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={rsvpLoading}
                    onClick={async () => {
                      setRsvpLoading(true);
                      try {
                        const res = await fetch(RSVP_URL, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(survey),
                        });
                        if (res.ok) setRsvpSent(true);
                      } finally {
                        setRsvpLoading(false);
                      }
                    }}
                    className="flex-1 py-6 tracking-[0.2em] uppercase text-sm font-light"
                    style={{ backgroundColor: "hsl(var(--wedding-dark))", color: "hsl(var(--wedding-cream))" }}
                  >
                    {rsvpLoading ? "Отправка..." : "Отправить"}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6" style={{ backgroundColor: "hsl(var(--wedding-sage))", color: "white" }}>
                <Icon name="Check" size={28} />
              </div>
              <h3 className="font-serif text-2xl mb-2" style={{ color: "hsl(var(--wedding-dark))" }}>
                Спасибо, {survey.first_name}!
              </h3>
              <p className="text-muted-foreground font-light">Мы с нетерпением ждём встречи с вами</p>
            </div>
          )}
        </div>
      </section>

      <footer className="py-12 text-center border-t" style={{ backgroundColor: "hsl(var(--wedding-cream))" }}>
        <p className="font-serif text-3xl mb-2" style={{ color: "hsl(var(--wedding-dark))" }}>В & Н</p>
        <p className="text-sm text-muted-foreground font-light tracking-widest">26 . 08 . 2026</p>
        <div className="flex justify-center gap-4 mt-6">
          <a href="#" className="text-muted-foreground hover:opacity-60 transition-opacity">
            <Icon name="Instagram" size={18} />
          </a>
          <a href="#" className="text-muted-foreground hover:opacity-60 transition-opacity">
            <Icon name="Send" size={18} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;