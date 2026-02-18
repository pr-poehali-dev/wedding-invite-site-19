import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AUTH_URL } from "./types";

interface AdminLoginFormProps {
  onSuccess: () => void;
}

const AdminLoginForm = ({ onSuccess }: AdminLoginFormProps) => {
  const [login, setLogin] = useState("admin");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

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
        onSuccess();
      } else {
        setAuthError(data.error || "Ошибка авторизации");
      }
    } catch {
      setAuthError("Ошибка соединения с сервером");
    } finally {
      setAuthLoading(false);
    }
  };

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
};

export default AdminLoginForm;
