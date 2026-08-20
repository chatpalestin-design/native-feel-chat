import { useState } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Image as ImageIcon,
  LifeBuoy,
  MessageSquare,
  Power,
  Settings,
  Shield,
  ShieldAlert,
  Smartphone,
  TrendingUp,
  UserRound,
} from "lucide-react";

function PanelShell({
  title,
  onBack,
  action,
  children,
}: {
  title: string;
  onBack: () => void;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-secondary lg:hidden">
      <header className="relative flex h-12 shrink-0 items-center justify-center border-b border-border bg-card px-3">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-3 flex items-center gap-0.5 text-[15px] font-bold text-brand-blue"
        >
          <ChevronLeft className="size-5" />
          عودة
        </button>
        <span className="text-[16px] font-bold text-foreground">{title}</span>
        {action && <span className="absolute right-3">{action}</span>}
      </header>
      <div className="flex-1 overflow-y-auto pb-4">{children}</div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24">
      <span className="flex size-32 items-center justify-center rounded-[42%_58%_46%_54%/54%_44%_56%_46%] bg-quote">
        <MessageSquare className="size-16 fill-muted-foreground/60 text-muted-foreground/60" />
      </span>
      <p className="text-[14px] text-muted-foreground">{label}</p>
    </div>
  );
}

export function PrivatePanel({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<"registered" | "spam">("registered");
  return (
    <PanelShell
      title="المحادثات الخاصة"
      onBack={onBack}
      action={<Settings className="size-5 text-muted-foreground" />}
    >
      <div className="bg-card px-3 pb-3">
        <h2 className="py-2 text-right text-[19px] font-extrabold text-foreground">
          المحادثات الخاصة
        </h2>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-secondary p-1">
          {(
            [
              { key: "registered", label: "الأعضاء المسجلين" },
              { key: "spam", label: "غير مرغوب فيه" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`h-8 rounded-md text-[13px] font-bold transition-colors ${
                tab === t.key
                  ? "border border-border bg-card text-foreground shadow-[var(--shadow-card)]"
                  : "text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <EmptyState label="لا يوجد رسائل خاصة بعد" />
    </PanelShell>
  );
}

export function NotificationsPanel({ onBack }: { onBack: () => void }) {
  return (
    <PanelShell title="الإشعارات" onBack={onBack}>
      <div className="flex flex-col items-center justify-center gap-6 py-24">
        <span className="flex size-32 items-center justify-center rounded-[42%_58%_46%_54%/54%_44%_56%_46%] bg-quote">
          <Bell className="size-16 fill-muted-foreground/60 text-muted-foreground/60" />
        </span>
        <p className="text-[14px] text-muted-foreground">لا توجد إشعارات بعد</p>
      </div>
    </PanelShell>
  );
}

type Row = { label: string; icon: typeof UserRound; tone: string };

const GROUP_1: Row[] = [
  { label: "حسابي", icon: UserRound, tone: "bg-brand-blue" },
  { label: "شراء رصيد", icon: CreditCard, tone: "bg-brand-blue" },
  { label: "ترقية حسابي", icon: TrendingUp, tone: "bg-brand-blue" },
];

const GROUP_2: Row[] = [
  { label: "تغيير الصورة", icon: ImageIcon, tone: "bg-[oklch(0.55_0.22_300)]" },
  { label: "قوائم الحظر", icon: ShieldAlert, tone: "bg-[oklch(0.6_0.22_20)]" },
  { label: "الاعدادات", icon: Settings, tone: "bg-brand-blue" },
  { label: "تطبيق دردشي", icon: Smartphone, tone: "bg-[oklch(0.68_0.19_47)]" },
];

const GROUP_3: Row[] = [
  { label: "قسم الشكاوي", icon: LifeBuoy, tone: "bg-muted-foreground" },
  { label: "الاتصال بالادارة", icon: MessageSquare, tone: "bg-muted-foreground" },
  { label: "سياسة الخصوصية", icon: Shield, tone: "bg-muted-foreground" },
  { label: "شروط الاستخدام", icon: FileText, tone: "bg-muted-foreground" },
];

function RowList({ rows, onPick }: { rows: Row[]; onPick: (label: string) => void }) {
  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-xl bg-card">
      {rows.map(({ label, icon: Icon, tone }, i) => (
        <button
          key={label}
          type="button"
          onClick={() => onPick(label)}
          className={`flex w-full items-center gap-3 px-3 py-3 text-right ${
            i > 0 ? "border-t border-border" : ""
          }`}
        >
          <span className={`flex size-7 shrink-0 items-center justify-center rounded-md ${tone}`}>
            <Icon className="size-4 text-primary-foreground" />
          </span>
          <span className="flex-1 truncate text-[15px] font-bold text-foreground">{label}</span>
          <ChevronLeft className="size-5 shrink-0 text-muted-foreground" />
        </button>
      ))}
    </div>
  );
}

export function MenuPanel({
  onBack,
  nickname,
  onLogout,
  onPick,
}: {
  onBack: () => void;
  nickname: string;
  onLogout: () => void;
  onPick: (label: string) => void;
}) {
  return (
    <PanelShell title="القائمة الرئيسية" onBack={onBack}>
      <div className="mx-3 mt-3 flex items-center gap-3 rounded-xl bg-card p-3">
        <span className="relative size-12 shrink-0 rounded-xl bg-[image:var(--gradient-brand)]">
          <span className="absolute bottom-0 left-0 size-3 rounded-full border-2 border-card bg-[oklch(0.72_0.19_150)]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] font-extrabold text-foreground">{nickname}</span>
          <span className="block text-[13px] text-muted-foreground">متصل</span>
        </span>
        <ChevronLeft className="size-5 text-muted-foreground" />
      </div>

      <div className="mx-3 mt-3 flex items-center justify-center rounded-xl bg-card px-3 py-3">
        <span className="text-[15px] font-bold text-foreground">
          رصيدك الحالي <span className="text-brand-blue">0</span>
        </span>
      </div>

      <RowList rows={GROUP_1} onPick={onPick} />
      <RowList rows={GROUP_2} onPick={onPick} />
      <RowList rows={GROUP_3} onPick={onPick} />

      <div className="mx-3 mt-3 overflow-hidden rounded-xl bg-card">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-3 py-3 text-right"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted-foreground">
            <Power className="size-4 text-primary-foreground" />
          </span>
          <span className="flex-1 text-[15px] font-bold text-foreground">الخروج</span>
          <ChevronLeft className="size-5 text-muted-foreground" />
        </button>
      </div>

      <footer className="mt-6 flex flex-col items-center gap-2 pb-6 text-center text-[12px] text-muted-foreground">
        <p>All rights reserved ©</p>
        <span className="flex size-10 items-center justify-center rounded-xl bg-[image:var(--gradient-brand)] text-[15px] font-black text-primary-foreground">
          د
        </span>
        <p>Powered by</p>
        <p>© 2012 - 2026 DRDCHATI™</p>
        <p>
          Version : Blueberry <span className="font-bold text-foreground">2.6.0626</span>
        </p>
      </footer>
      <ChevronRight className="hidden" />
    </PanelShell>
  );
}
