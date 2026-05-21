import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const RSVP_URL = "https://functions.poehali.dev/e1549638-af55-45e7-b65d-bccaecfbc611";

const DRINK_OPTIONS = [
  { value: "wine", label: "Вино", icon: "Wine" },
  { value: "champagne", label: "Шампанское", icon: "Sparkles" },
  { value: "strong", label: "Крепкое", icon: "Beer" },
  { value: "non-alcoholic", label: "Безалкогольное", icon: "CupSoda" },
];

const RsvpSection = () => {
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
    cannot_attend: false,
  });

  const sendCannotAttend = async () => {
    if (!survey.first_name.trim() || !survey.last_name.trim()) return;
    setRsvpLoading(true);
    try {
      const res = await fetch(RSVP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...survey, cannot_attend: true, guests_count: 0 }),
      });
      if (res.ok) {
        setSurvey({ ...survey, cannot_attend: true });
        setRsvpSent(true);
      }
    } finally {
      setRsvpLoading(false);
    }
  };

  return (
    <>
      <section id="rsvp" className="py-24 md:py-32" style={{ backgroundColor: "hsl(var(--wedding-cream))" }}>
        <div className="max-w-lg mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">Ждём вас</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-4" style={{ color: "hsl(var(--wedding-dark))" }}>
            Подтвердите участие
          </h2>
          <div className="wedding-divider mb-8" />
          <p className="text-muted-foreground font-light mb-4">
            Пожалуйста, сообщите нам о вашем присутствии до 26 июля 2026
          </p>

          <div className="rounded-xl px-5 py-4 mb-6 text-sm" style={{ backgroundColor: "hsl(var(--wedding-dark))", color: "hsl(var(--wedding-cream))" }}>
            <p className="font-medium tracking-wide mb-1">Важно — заполняет каждый гость отдельно</p>
            <p className="font-light opacity-80 text-xs leading-relaxed">
              Форму должен пройти каждый приглашённый лично, даже если вы приедете вместе. Это поможет нам точно подготовиться к празднику.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 rounded-xl border px-5 py-4 mb-8 text-sm font-light" style={{ backgroundColor: "white", borderColor: "hsla(var(--wedding-gold), 0.4)" }}>
            <Icon name="Phone" size={16} style={{ color: "hsl(var(--wedding-gold))" }} />
            <span style={{ color: "hsl(var(--wedding-dark))" }}>
              По всем вопросам — свадебный организатор{" "}
              <a href="tel:+79214021208" className="font-medium hover:underline" style={{ color: "hsl(var(--wedding-dark))" }}>
                Алина +7-921-402-12-08
              </a>
            </span>
          </div>

          {!rsvpSent ? (
            <div className="text-left bg-white rounded-2xl border p-6 md:p-8 shadow-sm" style={{ borderColor: "hsla(var(--wedding-gold), 0.2)" }}>
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

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={sendCannotAttend}
                        disabled={rsvpLoading || !survey.first_name.trim() || !survey.last_name.trim()}
                        className="w-full text-sm font-light text-muted-foreground hover:text-destructive transition-colors py-3 border border-dashed rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Icon name="X" size={14} />
                        К сожалению, не смогу приехать
                      </button>
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
          ) : survey.cannot_attend ? (
            <div className="py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6" style={{ backgroundColor: "hsl(var(--wedding-sand))", color: "hsl(var(--wedding-dark))" }}>
                <Icon name="Heart" size={28} />
              </div>
              <h3 className="font-serif text-2xl mb-2" style={{ color: "hsl(var(--wedding-dark))" }}></h3>
              <p className="text-muted-foreground font-light max-w-sm mx-auto mb-8">Понимаем, очень жаль, конечно, что не получится увидеться в такой день. Но спасибо что предупредил(а) 🤍 Будем скучать!</p>
              <a
                href="SURVEY_LINK_HERE"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-xl border-2 px-6 py-5 transition-all hover:opacity-80 active:scale-95 max-w-sm mx-auto"
                style={{ borderColor: "hsl(var(--wedding-gold))", backgroundColor: "white" }}
              >
                <div className="text-left">
                  <p className="font-medium text-sm mb-1" style={{ color: "hsl(var(--wedding-dark))" }}>Пройдите небольшой опрос</p>
                  <p className="text-xs font-light text-muted-foreground">Это займёт 1–2 минуты и очень поможет нам</p>
                </div>
                <Icon name="ExternalLink" size={18} style={{ color: "hsl(var(--wedding-gold))", flexShrink: 0 }} />
              </a>
            </div>
          ) : (
            <div className="py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6" style={{ backgroundColor: "hsl(var(--wedding-sage))", color: "white" }}>
                <Icon name="Check" size={28} />
              </div>
              <h3 className="font-serif text-2xl mb-2" style={{ color: "hsl(var(--wedding-dark))" }}>
                Спасибо, {survey.first_name}!
              </h3>
              <p className="text-muted-foreground font-light mb-10">Мы с нетерпением ждём встречи с вами</p>

              <div className="text-left rounded-lg border p-6 space-y-4" style={{ backgroundColor: "hsl(var(--wedding-cream))" }}>
                <p className="font-light leading-relaxed" style={{ color: "hsl(var(--wedding-dark))" }}>
                  Дорогие друзья и близкие 🤍
                </p>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Пожалуйста, не дарите нам цветы — к сожалению, после торжества у нас не будет возможности забрать их домой, и мы переживаем, что они не успеют нас порадовать 🌷
                </p>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Если захотите поздравить нас дополнительно, будем благодарны за подарок в конверте — он поможет исполнить наши общие мечты ✨
                </p>
              </div>

              <a
                href="SURVEY_LINK_HERE"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-between gap-4 rounded-xl border-2 px-6 py-5 transition-all hover:opacity-80 active:scale-95"
                style={{ borderColor: "hsl(var(--wedding-gold))", backgroundColor: "white" }}
              >
                <div className="text-left">
                  <p className="font-medium text-sm mb-1" style={{ color: "hsl(var(--wedding-dark))" }}>Пройдите небольшой опрос</p>
                  <p className="text-xs font-light text-muted-foreground">Это займёт 1–2 минуты и очень поможет нам</p>
                </div>
                <Icon name="ExternalLink" size={18} style={{ color: "hsl(var(--wedding-gold))", flexShrink: 0 }} />
              </a>

              <div className="mt-6 rounded-lg border p-5 text-center" style={{ backgroundColor: "hsl(var(--wedding-cream))" }}>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  По всем вопросам Вам поможет наш свадебный организатор{" "}
                  <span style={{ color: "hsl(var(--wedding-dark))" }} className="font-medium">Алина</span>
                  {" "}тел.{" "}
                  <a href="tel:+79214021208" className="font-medium hover:opacity-70 transition-opacity" style={{ color: "hsl(var(--wedding-dark))" }}>
                    +7 921 402-12-08
                  </a>
                </p>
              </div>
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
    </>
  );
};

export default RsvpSection;