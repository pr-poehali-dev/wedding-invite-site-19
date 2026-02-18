import Icon from "@/components/ui/icon";
import { Guest, DRINK_LABELS } from "./types";

interface GuestCardProps {
  guest: Guest;
  onEdit: (guest: Guest) => void;
  onDelete: (id: number) => void;
}

const GuestCard = ({ guest, onEdit, onDelete }: GuestCardProps) => {
  return (
    <div
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
              {DRINK_LABELS[guest.drink_preference] || guest.drink_preference}
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
          <button
            onClick={() => onEdit(guest)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background hover:bg-accent transition-colors cursor-pointer"
            title="Редактировать"
          >
            <Icon name="Pencil" size={12} />
          </button>
          <button
            onClick={() => onDelete(guest.id)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-colors cursor-pointer"
            title="Удалить"
          >
            <Icon name="Trash2" size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestCard;
