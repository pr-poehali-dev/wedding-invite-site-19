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
import { Guest, DRINK_OPTIONS } from "./types";

interface EditGuestDialogProps {
  editGuest: Guest | null;
  editForm: Partial<Guest>;
  saving: boolean;
  onClose: () => void;
  onChange: (form: Partial<Guest>) => void;
  onSave: () => void;
}

export const EditGuestDialog = ({
  editGuest,
  editForm,
  saving,
  onClose,
  onChange,
  onSave,
}: EditGuestDialogProps) => {
  return (
    <Dialog open={!!editGuest} onOpenChange={(o) => !o && onClose()}>
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
                    onChange({ ...editForm, first_name: e.target.value })
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
                    onChange({ ...editForm, last_name: e.target.value })
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
                min={1}
                value={editForm.guests_count || 1}
                onChange={(e) =>
                  onChange({
                    ...editForm,
                    guests_count: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={editForm.has_plus_one || false}
                onChange={(e) =>
                  onChange({ ...editForm, has_plus_one: e.target.checked })
                }
                className="rounded"
              />
              <label className="text-sm text-muted-foreground">+1</label>
              {editForm.has_plus_one && (
                <Input
                  value={editForm.plus_one_name || ""}
                  onChange={(e) =>
                    onChange({ ...editForm, plus_one_name: e.target.value })
                  }
                  placeholder="Имя"
                  className="flex-1"
                />
              )}
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1 block">
                Напиток
              </label>
              <select
                value={editForm.drink_preference || ""}
                onChange={(e) =>
                  onChange({ ...editForm, drink_preference: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              >
                <option value="">Не выбрано</option>
                {DRINK_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
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
                  onChange({ ...editForm, allergies: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={editForm.need_transfer || false}
                onChange={(e) =>
                  onChange({ ...editForm, need_transfer: e.target.checked })
                }
                className="rounded"
              />
              <label className="text-sm text-muted-foreground">
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
                  onChange({ ...editForm, wishes: e.target.value })
                }
                rows={2}
              />
            </div>
            <Button
              onClick={onSave}
              disabled={saving}
              className="w-full"
              style={{
                backgroundColor: "hsl(var(--wedding-dark))",
                color: "hsl(var(--wedding-cream))",
              }}
            >
              {saving ? (
                <Icon name="Loader2" size={16} className="animate-spin mr-2" />
              ) : (
                <Icon name="Check" size={16} className="mr-2" />
              )}
              Сохранить
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface DeleteConfirmDialogProps {
  deleteId: number | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmDialog = ({
  deleteId,
  deleting,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) => {
  return (
    <Dialog open={!!deleteId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-light">
            Удалить гостя?
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground font-light">
          Это действие нельзя отменить.
        </p>
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <Icon name="Loader2" size={16} className="animate-spin mr-2" />
            ) : (
              <Icon name="Trash2" size={16} className="mr-2" />
            )}
            Удалить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
