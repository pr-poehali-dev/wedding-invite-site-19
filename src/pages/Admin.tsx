import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import AdminLoginForm from "./admin/AdminLoginForm";
import GuestCard from "./admin/GuestCard";
import { EditGuestDialog, DeleteConfirmDialog } from "./admin/GuestDialogs";
import { Guest, RSVP_URL } from "./admin/types";

const Admin = () => {
  const [isAuthed, setIsAuthed] = useState(false);

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

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setIsAuthed(false);
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
    return <AdminLoginForm onSuccess={() => setIsAuthed(true)} />;
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
              <GuestCard
                key={guest.id}
                guest={guest}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}
      </main>

      <EditGuestDialog
        editGuest={editGuest}
        editForm={editForm}
        saving={saving}
        onClose={() => setEditGuest(null)}
        onChange={setEditForm}
        onSave={handleSave}
      />

      <DeleteConfirmDialog
        deleteId={deleteId}
        deleting={deleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Admin;
