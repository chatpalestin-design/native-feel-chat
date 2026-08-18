import { useEffect, useState } from "react";
import { Lock, User } from "lucide-react";
import { toast } from "sonner";

export function LoginSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [guest, setGuest] = useState(true);
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<"m" | "f">("m");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = window.setTimeout(() => setShown(true), 20);
      return () => window.clearTimeout(id);
    }
    setShown(false);
    const id = window.setTimeout(() => setMounted(false), 300);
    return () => window.clearTimeout(id);
  }, [open]);

  if (!mounted) return null;

  const enterAsGuest = () => {
    const name = nickname.trim();
    if (!name) {
      toast.error("الرجاء إدخال الأسم المستعار");
      return;
    }
    window.localStorage.setItem("chat-nickname", name);
    window.localStorage.setItem("chat-gender", gender);
    toast.success(`أهلاً ${name}`);
    onClose();
  };

  const soon = () => toast("هذه الميزة قريباً");

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="إغلاق"
        onClick={onClose}
        className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-2xl bg-card pb-8 transition-transform duration-300 ease-out ${
          shown ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-center py-2.5">
          <span className="h-1.5 w-11 rounded-full bg-muted-foreground/50" />
        </div>

        <div className="px-6">
          <h2 className="text-[30px] font-extrabold text-foreground">تسجيل الدخول</h2>

          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={guest}
              onClick={() => setGuest((v) => !v)}
              className={`relative h-8 w-[54px] shrink-0 rounded-full transition-colors ${
                guest ? "bg-login-blue" : "bg-secondary border border-border"
              }`}
            >
              <span
                className={`absolute top-1 size-6 rounded-full bg-card shadow transition-all ${
                  guest ? "left-1" : "left-[26px]"
                }`}
              />
            </button>
            <span className="text-[17px] font-bold text-foreground">دخول كزائر/ة</span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 shadow-[var(--shadow-card)]">
              <User className="size-6 shrink-0 fill-foreground text-foreground" />
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="الأسم المستعار"
                className="h-14 w-full bg-transparent text-[17px] text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            {guest ? (
              <div className="relative rounded-xl border border-border bg-card px-4 shadow-[var(--shadow-card)]">
                <span className="absolute -top-2.5 right-4 bg-card px-1 text-[13px] text-muted-foreground">
                  النوع
                </span>
                <div className="flex h-14 items-center gap-3">
                  <span className="w-7 shrink-0 text-2xl font-light text-foreground">
                    {gender === "m" ? "M" : "F"}
                  </span>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "m" | "f")}
                    className="h-full w-full appearance-none bg-transparent text-[17px] text-foreground outline-none"
                  >
                    <option value="m">ذكر</option>
                    <option value="f">أنثى</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 shadow-[var(--shadow-card)]">
                <Lock className="size-6 shrink-0 fill-foreground text-foreground" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="الرقم السري"
                  className="h-14 w-full bg-transparent text-[17px] text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={guest ? enterAsGuest : soon}
            className="mx-auto mt-4 block w-[72%] rounded-md bg-login-blue py-3 text-[19px] font-bold text-login-blue-foreground shadow-md active:opacity-90"
          >
            دخول
          </button>

          {!guest && (
            <div className="mt-8">
              <p className="text-[22px] font-extrabold text-foreground">نسيت كلمة السر؟</p>
              <button
                type="button"
                onClick={soon}
                className="mt-2 rounded-md bg-login-blue-soft px-3 py-2 text-[17px] font-bold text-login-blue"
              >
                استعادة كلمة السر
              </button>
            </div>
          )}

          <div className="mt-8">
            <p className="text-[22px] font-extrabold text-foreground">لا يوجد لديك عضوية؟</p>
            <button
              type="button"
              onClick={soon}
              className="mt-2 rounded-md bg-login-blue-soft px-3 py-2 text-[17px] font-bold text-login-blue"
            >
              إنشاء حساب مجاناً
            </button>
          </div>

          <p className="mt-8 text-center text-[15px] font-bold leading-7 text-foreground">
            الرجاء قراءة{" "}
            <button type="button" onClick={soon} className="text-login-blue">
              شروط الاستخدام
            </button>{" "}
            - و قراءة{" "}
            <button type="button" onClick={soon} className="text-login-blue">
              سياسة الخصوصية
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
