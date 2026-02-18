import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const RSVP_URL =
  "https://functions.poehali.dev/31b8454d-9cf0-44ef-bccc-adab5d9505d2";
const AUTH_URL =
  "https://functions.poehali.dev/076c0e5f-9c6c-44c5-9376-fdd07aa33707";

const DRINK_LABELS: Record<string, string> = {
  wine: "Вино",
  champagne: "Шампанское",
  strong: "Крепкое",
  "non-alcoholic": "Безалкогольное",
};

const DRINK_OPTIONS = [
  { value: "wine", label: "Вино" },
  { value: "champagne", label: "Шампанское" },
  { value: "strong", label: "Крепкое" },
  { value: "non-alcoholic", label: "Безалкогольное" },
];

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
  const [isAuthed, setIsAuthed] = useState(false);
  const [login, setLogin] = useState("admin");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editGuest, setEditGuest] = useState<Guest | null>(null);
  const [editForm, setEditForm] = useState<Partial<Guest>>({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      setIsAuthed(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("admin_token", data.token);
        setIsAuthed(true);
      } else {
        setAuthError(data.error || "Ошибка авторизации");
      }
    } catch {
      setAuthError("Ошибка соединения с сервером");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setIsAuthed(false);
    setPassword("");
  };

  const loadGuests = () => {
    setLoading(true);
    fetch(RSVP_URL)
      .then((r) => r.json())
      .then((data) => setGuests(data.guests || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthed) loadGuests();
  }, [isAuthed]);

  const handleEdit = (guest: Guest) => {
    setEditGuest(guest);
    setEditForm({ ...guest });
  };

  const handleSave = async () => {
    if (!editGuest || !editForm) return;
    setSaving(true);
    try {
      const res = await fetch(RSVP_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditGuest(null);
        loadGuests();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${RSVP_URL}?id=${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteId(null);
        loadGuests();
      }
    } finally {
      setDeleting(false);
    }
  };

  const totalPeople = guests.reduce(
    (sum, g) => sum + g.guests_count + (g.has_plus_one ? 1 : 0),
    0
  );
  const needTransfer = guests.filter((g) => g.need_transfer).length;

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm border rounded-lg p-8"
          style={{ backgroundColor: "hsl(var(--wedding-cream))" }}
        >
          <div className="text-center mb-6">
            <Icon
              name="Lock"
              size={32}
              className="mx-auto mb-3"
              style={{ color: "hsl(var(--wedding-gold))" }}
            />
            <h1
              className="font-serif text-2xl"
              style={{ color: "hsl(var(--wedding-dark))" }}
            >
              Вход в админку
            </h1>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1 block">
                Логин
              </label>
              <Input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="admin"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1 block">
                Пароль
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                autoFocus
              />
            </div>
            {authError && (
              <p className="text-sm text-destructive text-center">{authError}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={authLoading || !password}
              style={{
                backgroundColor: "hsl(var(--wedding-dark))",
                color: "hsl(var(--wedding-cream))",
              }}
            >
              {authLoading ? (
                <Icon name="Loader2" size={16} className="animate-spin mr-2" />
              ) : (
                <Icon name="LogIn" size={16} className="mr-2" />
              )}
              Войти
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div>
            <a
              href="/"
              className="text-xs tracking-widest uppercase text-muted-foreground hover:opacity-60 transition-opacity"
            >
              ← На сайт
            </a>
            <h1
              className="font-serif text-3xl mt-2"
              style={{ color: "hsl(var(--wedding-dark))" }}
            >
              Список гостей
            </h1>
          </div>
          <div className="flex items-center gap-6 text-center">
            <button
              onClick={handleLogout}
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-destructive transition-colors"
              title="Выйти"
            >
              <Icon name="LogOut" size={18} />
            </button>
            <div>
              <span
                className="font-serif text-3xl font-light"
                style={{ color: "hsl(var(--wedding-dark))" }}
              >
                {guests.length}
              </span>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">
                ответов
              </p>
            </div>
            <div>
              <span
                className="font-serif text-3xl font-light"
                style={{ color: "hsl(var(--wedding-gold))" }}
              >
                {totalPeople}
              </span>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">
                гостей
              </p>
            </div>
            <div>
              <span
                className="font-serif text-3xl font-light"
                style={{ color: "hsl(var(--wedding-sage))" }}
              >
                {needTransfer}
              </span>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">
                трансфер
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-20">
            <Icon
              name="Loader2"
              size={28}
              className="animate-spin mx-auto text-muted-foreground"
            />
            <p className="text-muted-foreground font-light mt-4">Загрузка...</p>
          </div>
        ) : guests.length === 0 ? (
          <div className="text-center py-20">
            <Icon
              name="Users"
              size={40}
              className="mx-auto text-muted-foreground/40 mb-4"
            />
            <p className="text-muted-foreground font-light">
              Пока никто не подтвердил участие
            </p>
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
                    <h3
                      className="font-serif text-lg"
                      style={{ color: "hsl(var(--wedding-dark))" }}
                    >
                      {guest.first_name} {guest.last_name}
                    </h3>
                    {guest.has_plus_one && guest.plus_one_name && (
                      <p className="text-sm text-muted-foreground font-light mt-1">
                        <Icon name="Heart" size={12} className="inline mr-1" />
                        +1: {guest.plus_one_name}
                      </p>
                    )}
                    {guest.wishes && (
                      <p className="text-sm text-muted-foreground font-light mt-1 italic">
                        «{guest.wishes}»
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background">
                      <Icon name="Users" size={12} /> {guest.guests_count}
                    </span>
                    {guest.drink_preference && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background">
                        <Icon name="Wine" size={12} />{" "}
                        {DRINK_LABELS[guest.drink_preference] ||
                          guest.drink_preference}
                      </span>
                    )}
                    {guest.allergies && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background">
                        <Icon name="AlertTriangle" size={12} />{" "}
                        {guest.allergies}
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
                    <button
                      onClick={() => handleEdit(guest)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background hover:bg-accent transition-colors cursor-pointer"
                      title="Редактировать"
                    >
                      <Icon name="Pencil" size={12} />
                    </button>
                    <button
                      onClick={() => setDeleteId(guest.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-colors cursor-pointer"
                      title="Удалить"
                    >
                      <Icon name="Trash2" size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={!!editGuest} onOpenChange={(o) => !o && setEditGuest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-light">
              Редактировать гостя
            </DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1 block">
                    Имя
                  </label>
                  <Input
                    value={editForm.first_name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, first_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1 block">
                    Фамилия
                  </label>
                  <Input
                    value={editForm.last_name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, last_name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1 block">
                  Кол-во гостей
                </label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={editForm.guests_count || 1}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      guests_count: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="edit-plus-one"
                  checked={editForm.has_plus_one || false}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      has_plus_one: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <label
                  htmlFor="edit-plus-one"
                  className="text-sm text-muted-foreground"
                >
                  С парой (+1)
                </label>
              </div>

              {editForm.has_plus_one && (
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1 block">
                    Имя пары
                  </label>
                  <Input
                    value={editForm.plus_one_name || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        plus_one_name: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1 block">
                  Напиток
                </label>
                <select
                  value={editForm.drink_preference || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      drink_preference: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Не выбрано</option>
                  {DRINK_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1 block">
                  Аллергии
                </label>
                <Input
                  value={editForm.allergies || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, allergies: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="edit-transfer"
                  checked={editForm.need_transfer || false}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      need_transfer: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <label
                  htmlFor="edit-transfer"
                  className="text-sm text-muted-foreground"
                >
                  Нужен трансфер
                </label>
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1 block">
                  Пожелания
                </label>
                <Textarea
                  value={editForm.wishes || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, wishes: e.target.value })
                  }
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditGuest(null)}
                >
                  Отмена
                </Button>
                <Button
                  className="flex-1"
                  disabled={saving}
                  onClick={handleSave}
                  style={{
                    backgroundColor: "hsl(var(--wedding-dark))",
                    color: "hsl(var(--wedding-cream))",
                  }}
                >
                  {saving ? "Сохранение..." : "Сохранить"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-light">
              Удалить гостя?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground font-light">
            Это действие нельзя отменить. Запись будет удалена из базы данных.
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteId(null)}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Удаление..." : "Удалить"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;