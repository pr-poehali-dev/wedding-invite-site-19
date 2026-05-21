import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";
import AdminLoginForm from "./admin/AdminLoginForm";
import GuestCard from "./admin/GuestCard";
import { EditGuestDialog, DeleteConfirmDialog } from "./admin/GuestDialogs";
import SiteEditor from "./admin/SiteEditor";
import { Guest, RSVP_URL } from "./admin/types";

const Admin = () => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<"admin" | "user">("admin");

  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editGuest, setEditGuest] = useState<Guest | null>(null);
  const [editForm, setEditForm] = useState<Partial<Guest>>({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [tab, setTab] = useState<"attending" | "declined">("attending");
  const [adminSection, setAdminSection] = useState<"guests" | "site">("guests");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    const savedRole = sessionStorage.getItem("admin_role") as "admin" | "user" | null;
    if (token && savedRole) {
      setRole(savedRole);
      setIsAuthed(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_role");
    setIsAuthed(false);
  };

  const loadGuests = (silent = false) => {
    if (!silent) setLoading(true);
    fetch(RSVP_URL)
      .then((r) => r.json())
      .then((data) => {
        setGuests(data.guests || []);
        setLastUpdated(new Date());
      })
      .finally(() => { if (!silent) setLoading(false); });
  };

  useEffect(() => {
    if (isAuthed) {
      loadGuests();
      intervalRef.current = setInterval(() => loadGuests(true), 15000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
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
      const res = await fetch(`${RSVP_URL}?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) { setDeleteId(null); loadGuests(); }
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    setDeletingAll(true);
    try {
      const res = await fetch(`${RSVP_URL}?all=true`, { method: "DELETE" });
      if (res.ok) { setDeleteAllConfirm(false); loadGuests(); }
    } finally {
      setDeletingAll(false);
    }
  };

  const attending = guests.filter((g) => !g.cannot_attend);
  const declined = guests.filter((g) => g.cannot_attend);
  const visibleGuests = tab === "attending" ? attending : declined;
  const totalPeople = attending.reduce((sum, g) => sum + g.guests_count + (g.has_plus_one ? 1 : 0), 0);
  const needTransfer = attending.filter((g) => g.need_transfer).length;

  const isAdmin = role === "admin";

  if (!isAuthed) {
    return (
      <AdminLoginForm
        onSuccess={(r) => {
          setRole(r);
          setIsAuthed(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div>
            <a href="/" className="text-xs tracking-widest uppercase text-muted-foreground hover:opacity-60 transition-opacity">
              ← На сайт
            </a>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setAdminSection("guests")}
                className="font-serif text-3xl transition-opacity"
                style={{ color: "hsl(var(--wedding-dark))", opacity: adminSection === "guests" ? 1 : 0.35 }}
              >
                Гости
              </button>
              {isAdmin && (
                <>
                  <span className="text-muted-foreground/40 font-serif text-3xl">/</span>
                  <button
                    onClick={() => setAdminSection("site")}
                    className="font-serif text-3xl transition-opacity"
                    style={{ color: "hsl(var(--wedding-dark))", opacity: adminSection === "site" ? 1 : 0.35 }}
                  >
                    Сайт
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-center">
            {lastUpdated && (
              <div className="text-center hidden sm:block">
                <Icon name="RefreshCw" size={14} className="mx-auto text-muted-foreground/50 mb-1" />
                <p className="text-muted-foreground/50" style={{ fontSize: "10px" }}>
                  {new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(lastUpdated)}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-destructive transition-colors"
              title="Выйти"
            >
              <Icon name="LogOut" size={18} />
            </button>
            <div>
              <span className="font-serif text-3xl font-light" style={{ color: "hsl(var(--wedding-dark))" }}>
                {attending.length}
              </span>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">придут</p>
            </div>
            <div>
              <span className="font-serif text-3xl font-light" style={{ color: "hsl(var(--destructive))" }}>
                {declined.length}
              </span>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">не смогут</p>
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
        {adminSection === "site" && isAdmin && (
          <SiteEditor token={sessionStorage.getItem("admin_token") ?? ""} />
        )}

        {adminSection === "guests" && (
          <>
            <div className="flex items-center justify-between mb-6 border-b pb-0">
              <div className="flex gap-2">
                <button
                  onClick={() => setTab("attending")}
                  className="px-4 py-3 text-sm tracking-widest uppercase font-light transition-colors relative"
                  style={{ color: tab === "attending" ? "hsl(var(--wedding-dark))" : "hsl(var(--muted-foreground))" }}
                >
                  Придут ({attending.length})
                  {tab === "attending" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "hsl(var(--wedding-gold))" }} />
                  )}
                </button>
                <button
                  onClick={() => setTab("declined")}
                  className="px-4 py-3 text-sm tracking-widest uppercase font-light transition-colors relative"
                  style={{ color: tab === "declined" ? "hsl(var(--wedding-dark))" : "hsl(var(--muted-foreground))" }}
                >
                  Не смогут ({declined.length})
                  {tab === "declined" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "hsl(var(--destructive))" }} />
                  )}
                </button>
              </div>

              {isAdmin && guests.length > 0 && (
                <button
                  onClick={() => setDeleteAllConfirm(true)}
                  className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-muted-foreground hover:text-destructive transition-colors pb-3"
                >
                  <Icon name="Trash2" size={13} />
                  Удалить всех
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-20">
                <Icon name="Loader2" size={28} className="animate-spin mx-auto text-muted-foreground" />
                <p className="text-muted-foreground font-light mt-4">Загрузка...</p>
              </div>
            ) : visibleGuests.length === 0 ? (
              <div className="text-center py-20">
                <Icon name={tab === "attending" ? "Users" : "UserX"} size={40} className="mx-auto text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground font-light">
                  {tab === "attending" ? "Пока никто не подтвердил участие" : "Никто не отказался — ура!"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleGuests.map((guest) => (
                  <GuestCard
                    key={guest.id}
                    guest={guest}
                    onEdit={isAdmin ? handleEdit : undefined}
                    onDelete={isAdmin ? (id) => setDeleteId(id) : undefined}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {isAdmin && (
        <>
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
        </>
      )}

      {deleteAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-background rounded-xl border p-6 max-w-sm w-full shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="AlertTriangle" size={22} className="text-destructive shrink-0" />
              <h2 className="font-serif text-xl" style={{ color: "hsl(var(--wedding-dark))" }}>
                Удалить всех гостей?
              </h2>
            </div>
            <p className="text-sm text-muted-foreground font-light mb-6">
              Все {guests.length} записей будут удалены из базы данных. Это действие нельзя отменить.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteAllConfirm(false)}
                className="flex-1 py-2.5 rounded-md border border-border text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deletingAll}
                className="flex-1 py-2.5 rounded-md text-sm tracking-widest uppercase text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: "hsl(var(--destructive))" }}
              >
                {deletingAll
                  ? <><Icon name="Loader2" size={14} className="animate-spin inline mr-1" /> Удаляю...</>
                  : "Удалить всех"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
