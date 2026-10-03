import {
  ArrowDownToLine,
  ArrowUpRight,
  Bell,
  Check,
  CircleDollarSign,
  Copy,
  Cpu,
  ExternalLink,
  Gift,
  HelpCircle,
  KeyRound,
  Landmark,
  LogOut,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const WALLET_ADDRESS = "0x8a24…4e91";

function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{children}</span>;
}

function Intro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mb-8 max-w-2xl md:mb-10">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-4 text-3xl font-semibold sm:text-4xl md:text-[44px]">{title}</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{copy}</p>
    </div>
  );
}

/* ---------------- Connect wallet ---------------- */

const wallets = [
  { name: "MetaMask", note: "Browser extension", tag: "Popular" },
  { name: "Coinbase Wallet", note: "Mobile & extension", tag: "Base native" },
  { name: "Phantom", note: "Multi-chain wallet", tag: "" },
  { name: "WalletConnect", note: "Scan with any mobile wallet", tag: "" },
];

export function ConnectWalletDialog({ open, onOpenChange, onConnected }: { open: boolean; onOpenChange: (v: boolean) => void; onConnected: (wallet: string) => void }) {
  const [pending, setPending] = useState<string | null>(null);
  const connect = (name: string) => {
    setPending(name);
    window.setTimeout(() => {
      setPending(null);
      onConnected(name);
    }, 900);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-popover">
        <DialogHeader>
          <DialogTitle>Connect a wallet</DialogTitle>
          <DialogDescription>Choose a wallet to fund vaults and receive payouts on Base.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {wallets.map((w) => (
            <button
              key={w.name}
              disabled={!!pending}
              onClick={() => connect(w.name)}
              className="flex w-full items-center gap-3 rounded-md border border-border bg-background/40 p-3 text-left transition-colors hover:border-primary/50 disabled:opacity-60"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary"><Wallet className="size-5 text-success" /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{w.name}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{w.note}</span>
              </span>
              {pending === w.name ? (
                <span className="font-mono text-[10px] text-success">Connecting…</span>
              ) : w.tag ? (
                <span className="rounded-full border border-success/25 bg-success/10 px-2 py-0.5 text-[9px] text-success">{w.tag}</span>
              ) : null}
            </button>
          ))}
        </div>
        <p className="flex items-center gap-2 text-[10px] text-muted-foreground"><ShieldCheck className="size-3" /> Preview only — no real wallet is accessed.</p>
      </DialogContent>
    </Dialog>
  );
}

export function WalletChip({ wallet, onDisconnect, onNotice }: { wallet: string; onDisconnect: () => void; onNotice: (m: string) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex h-9 items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 font-mono text-[11px] text-success">
          <i className="size-1.5 rounded-full bg-success" />
          <span className="hidden sm:inline">{WALLET_ADDRESS}</span>
          <Wallet className="size-3.5 sm:hidden" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 border-border bg-popover">
        <Eyebrow>Connected via {wallet}</Eyebrow>
        <p className="mt-2 font-mono text-base">{WALLET_ADDRESS}</p>
        <div className="mt-3 flex gap-2">
          <span className="rounded-full border border-digital/30 bg-digital/10 px-2 py-0.5 text-[10px] text-digital">● Base</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">1,240.16 USDC</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" onClick={() => onNotice("Wallet address copied")}><Copy />Copy</Button>
          <Button size="sm" variant="outline" onClick={() => onNotice("Switched network to Ethereum")}>Switch net</Button>
        </div>
        <Button size="sm" variant="ghost" className="mt-2 w-full text-destructive" onClick={onDisconnect}><LogOut />Disconnect</Button>
      </PopoverContent>
    </Popover>
  );
}

/* ---------------- Notifications ---------------- */

const initialNotes = [
  { id: 1, title: "Daily Treasury yield credited", meta: "+$4.22 · 2h ago", icon: CircleDollarSign, unread: true },
  { id: 2, title: "Compute epoch payout received", meta: "+$18.40 · Yesterday", icon: Cpu, unread: true },
  { id: 3, title: "New login from Lagos, NG", meta: "Security · 2 days ago", icon: KeyRound, unread: true },
  { id: 4, title: "DePIN vaults coming soon", meta: "Product · Last week", icon: Sparkles, unread: false },
];

export function NotificationsPopover() {
  const [notes, setNotes] = useState(initialNotes);
  const unread = notes.filter((n) => n.unread).length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative shrink-0 rounded-full border-border bg-card" aria-label="Notifications">
          <Bell className="size-4" />
          {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-success text-[9px] font-semibold text-primary-foreground">{unread}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(20rem,calc(100vw-2rem))] border-border bg-popover p-0">
        <div className="flex items-center justify-between border-b border-border p-4">
          <p className="text-sm font-semibold">Notifications</p>
          <button className="text-[11px] text-success disabled:text-muted-foreground" disabled={!unread} onClick={() => setNotes(notes.map((n) => ({ ...n, unread: false })))}>Mark all as read</button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notes.map(({ id, title, meta, icon: Icon, unread: u }) => (
            <button key={id} onClick={() => setNotes(notes.map((n) => (n.id === id ? { ...n, unread: false } : n)))} className="flex w-full items-start gap-3 border-b border-border p-4 text-left last:border-0 hover:bg-secondary/40">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary"><Icon className="size-4 text-muted-foreground" /></span>
              <span className="min-w-0 flex-1"><span className="block text-xs font-medium">{title}</span><span className="mt-1 block text-[10px] text-muted-foreground">{meta}</span></span>
              {u && <i className="mt-1.5 size-2 shrink-0 rounded-full bg-success" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ---------------- Profile ---------------- */

export function ProfileSheet({ open, onOpenChange, wallet, onConnect, onDisconnect, onInvite, onNotice }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  wallet: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onInvite: () => void;
  onNotice: (m: string) => void;
}) {
  const [prefs, setPrefs] = useState({ yield: true, rebalance: true, security: true });
  const toggle = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-border bg-popover sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle className="sr-only">Your profile</SheetTitle>
          <SheetDescription className="sr-only">Account details, security and preferences</SheetDescription>
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-full border border-border bg-secondary text-lg font-semibold">AK</span>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">Alexandre Kim</p>
              <p className="truncate text-xs text-muted-foreground">alex.kim@depvest.io · Joined Sep 2025</p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-success/25 bg-success/10 px-2 py-0.5 text-[10px] text-success"><ShieldCheck className="size-3" />KYC Level 2 verified</span>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <section className="rounded-md border border-border bg-background/40 p-4">
            <Eyebrow>Account overview</Eyebrow>
            <dl className="mt-3 space-y-2 text-xs">
              <Row k="Portfolio value" v="$12,450.80" />
              <Row k="Membership" v="Gold Investor · Tier 2" />
              <Row k="Fees" v="0% deposit / withdraw" />
              <Row k="Referral code" v={<button className="inline-flex items-center gap-1 font-mono text-success" onClick={() => onNotice("Referral code copied")}>AK-8492 <Copy className="size-3" /></button>} />
            </dl>
          </section>

          <section className="rounded-md border border-border bg-background/40 p-4">
            <Eyebrow>Security & wallet</Eyebrow>
            <dl className="mt-3 space-y-2 text-xs">
              <Row k="Primary wallet" v={wallet ? <span className="font-mono">{WALLET_ADDRESS}</span> : <button className="text-success" onClick={onConnect}>Connect wallet</button>} />
              <Row k="Two-factor auth" v={<span className="text-success">Enabled</span>} />
              <Row k="Custody" v="Regulated custodian" />
            </dl>
          </section>

          <section className="rounded-md border border-border bg-background/40 p-4">
            <Eyebrow>Preferences</Eyebrow>
            <div className="mt-3 space-y-3 text-xs">
              <Pref label="Daily yield notifications" checked={prefs.yield} onChange={() => toggle("yield")} />
              <Pref label="Auto-rebalance alerts" checked={prefs.rebalance} onChange={() => toggle("rebalance")} />
              <Pref label="Security alerts" checked={prefs.security} onChange={() => toggle("security")} />
            </div>
          </section>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={onInvite}><UserPlus />Invite friends</Button>
            <Button variant="outline" onClick={() => onNotice("Tax report CSV prepared")}><ArrowDownToLine />Export CSV</Button>
          </div>
          {wallet && <Button variant="ghost" className="w-full text-destructive" onClick={onDisconnect}><LogOut />Disconnect wallet</Button>}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Row({ k, v }: { k: string; v: ReactNode }) {
  return <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>;
}
function Pref({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return <label className="flex items-center justify-between gap-3"><span>{label}</span><Switch checked={checked} onCheckedChange={onChange} /></label>;
}

/* ---------------- Receipt ---------------- */

export type Receipt = { title: string; value: string; meta: string } | null;

export function ReceiptDialog({ receipt, onClose, onNotice }: { receipt: Receipt; onClose: () => void; onNotice: (m: string) => void }) {
  return (
    <Dialog open={!!receipt} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md border-border bg-popover">
        <DialogHeader>
          <DialogTitle>Transaction receipt</DialogTitle>
          <DialogDescription>{receipt?.title}</DialogDescription>
        </DialogHeader>
        {receipt && (
          <div className="space-y-4">
            <p className="font-mono text-3xl text-success">{receipt.value}</p>
            <dl className="space-y-2 rounded-md border border-border bg-background/40 p-4 text-xs">
              <Row k="Status" v={<span className="text-success">● Confirmed</span>} />
              <Row k="Details" v={<span className="max-w-[60%] text-[11px]">{receipt.meta}</span>} />
              <Row k="Network" v="Base" />
              <Row k="Confirmations" v="128" />
              <Row k="Tx hash" v={<span className="font-mono">0x9f3c…e21a</span>} />
            </dl>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => onNotice("Receipt copied")}><Copy />Copy</Button>
              <Button variant="outline" onClick={() => onNotice("Block explorer preview opened")}><ExternalLink />Explorer</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Invite friends ---------------- */

const friends = [
  { name: "Tunde A.", status: "Depositing", earned: "$48.20" },
  { name: "Maya R.", status: "Depositing", earned: "$36.10" },
  { name: "Chen L.", status: "Depositing", earned: "$31.75" },
  { name: "Sofia P.", status: "Depositing", earned: "$26.45" },
  { name: "Ifeoma O.", status: "Invited", earned: "—" },
  { name: "Daniel K.", status: "Invited", earned: "—" },
];

export function InviteFriends({ onNotice }: { onNotice: (m: string) => void }) {
  const [showQr, setShowQr] = useState(false);
  const link = "depvest.io/join/AK-8492";
  return (
    <section>
      <Intro eyebrow="Invite Friends" title="Grow together, earn together." copy="Share your link. When friends deposit, you earn a share of their daily yield — they get a welcome boost too." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Gift />} label="Rewards earned" value="$142.50" />
        <Stat icon={<Users />} label="Friends invited" value="6" />
        <Stat icon={<Check />} label="Active depositors" value="4" />
        <Stat icon={<Sparkles />} label="Current tier" value="Tier 2 · 10%" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[14px] border border-border bg-card p-5 md:p-6">
          <Eyebrow>Your invite link</Eyebrow>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
            <div className="flex h-11 min-w-0 items-center rounded-md border border-input bg-background px-3 font-mono text-sm"><span className="truncate">{link}</span></div>
            <Button className="h-11" onClick={() => onNotice("Invite link copied")}><Copy />Copy</Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowQr(!showQr)}><QrCode />{showQr ? "Hide QR" : "Show QR"}</Button>
            <Button variant="outline" size="sm" onClick={() => onNotice("Shared to WhatsApp")}>WhatsApp</Button>
            <Button variant="outline" size="sm" onClick={() => onNotice("Shared to X")}>X / Twitter</Button>
            <Button variant="outline" size="sm" onClick={() => onNotice("Email invite drafted")}>Email</Button>
          </div>
          {showQr && (
            <div className="mt-5 grid place-items-center rounded-md border border-border bg-background/40 p-6">
              <div className="grid size-40 grid-cols-8 gap-0.5 rounded-md bg-foreground p-2">
                {Array.from({ length: 64 }).map((_, i) => <span key={i} className={cn("rounded-[1px]", (i * 7 + (i % 5) * 3) % 3 === 0 ? "bg-background" : "bg-foreground")} />)}
              </div>
              <p className="mt-3 font-mono text-[10px] text-muted-foreground">Code AK-8492</p>
            </div>
          )}

          <div className="mt-8">
            <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Progress to Tier 3 (15%)</span><span className="font-mono">4 / 10 active</span></div>
            <div className="mt-2 h-2 rounded-full bg-secondary"><div className="h-full w-[40%] rounded-full bg-primary" /></div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[["Tier 1", "5%", "1+ friend"], ["Tier 2", "10%", "3+ friends"], ["Tier 3", "15%", "10+ friends"]].map(([t, p, r], i) => (
                <div key={t} className={cn("rounded-md border p-3", i === 1 ? "border-success/40 bg-success/10" : "border-border bg-background/30")}>
                  <p className="text-[10px] text-muted-foreground">{t}</p>
                  <p className={cn("mt-1 font-mono text-lg", i === 1 && "text-success")}>{p}</p>
                  <p className="mt-1 text-[9px] text-muted-foreground">{r}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[14px] border border-border bg-card">
          <div className="border-b border-border p-5"><p className="text-sm font-semibold">Your friends</p><p className="mt-1 text-[10px] text-muted-foreground">Rewards paid daily at 00:00 UTC</p></div>
          {friends.map((f) => (
            <div key={f.name} className="flex items-center gap-3 border-b border-border px-5 py-3 last:border-0">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-[10px] font-semibold">{f.name.slice(0, 2).toUpperCase()}</span>
              <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{f.name}</p><p className={cn("text-[10px]", f.status === "Depositing" ? "text-success" : "text-muted-foreground")}>{f.status}</p></div>
              <span className="font-mono text-xs">{f.earned}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="rounded-[14px] border border-border bg-card p-5"><span className="vault-icon accent-cash">{icon}</span><p className="mt-5 text-xs text-muted-foreground">{label}</p><p className="mt-1 font-mono text-xl">{value}</p></div>;
}

/* ---------------- How it works ---------------- */

const steps = [
  { icon: Wallet, title: "Connect & deposit", copy: "Connect a wallet or bank and fund with USDC on Base. Zero deposit fees, credited in minutes." },
  { icon: Landmark, title: "Automatic vault routing", copy: "Your money is split across US Treasuries, AI compute contracts, blue-chip staking, and optional tasks." },
  { icon: CircleDollarSign, title: "Daily yield, compounded", copy: "Earnings are credited every day at 00:00 UTC and can auto-compound back into each vault." },
  { icon: ArrowUpRight, title: "Withdraw anytime", copy: "Cash stays liquid 24/7. Compute and staking follow simple, visible unlock terms." },
];

export function HowItWorks({ onStart }: { onStart: () => void }) {
  const [active, setActive] = useState(0);
  return (
    <section>
      <Intro eyebrow="How It Works" title="Four steps to a diversified portfolio." copy="DepVest does the heavy lifting — spreading every dollar across real-world yield sources and paying you daily." />
      <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map(({ icon: Icon, title, copy }, i) => (
          <li key={title}>
            <button onClick={() => setActive(i)} className={cn("h-full w-full rounded-[14px] border bg-card p-5 text-left transition-colors md:p-6", active === i ? "border-success/50 shadow-glow" : "border-border hover:border-muted-foreground/40")}>
              <div className="flex items-center justify-between"><span className="vault-icon accent-cash"><Icon className="size-5" /></span><span className="font-mono text-xs text-muted-foreground">0{i + 1}</span></div>
              <h2 className="mt-6 text-base font-semibold">{title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{copy}</p>
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-6 grid gap-4 rounded-[14px] border border-border bg-card p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
        <div>
          <Eyebrow>Example · $1,000 deposit</Eyebrow>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[["Cash", "$350", "5.20%"], ["Compute", "$400", "9.40%"], ["Staking", "$200", "6.80%"], ["Blended", "$73/yr", "7.31%"]].map(([k, v, r]) => (
              <div key={k} className="rounded-md border border-border bg-background/40 p-3"><p className="text-[10px] text-muted-foreground">{k}</p><p className="mt-1 font-mono text-sm">{v}</p><p className="text-[10px] text-success">{r}</p></div>
            ))}
          </div>
        </div>
        <Button className="rounded-full" onClick={onStart}><Zap />Start investing</Button>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

const faqs = [
  { q: "How are yields generated?", a: "Cash earns from short-term US Treasury bills, compute earns from contracted enterprise GPU rentals, and digital assets earn from audited staking validators. Task work pays per verified task." },
  { q: "Are my funds protected?", a: "Cash is held in USDC at regulated custodians, compute contracts are insured, and DepVest uses no leverage. Smart contracts are independently audited." },
  { q: "Are there lockup periods?", a: "The cash vault is liquid 24/7. Compute runs in 30-day epochs that auto-renew, and staking has a 7-day unstake window." },
  { q: "When are yields paid?", a: "Every day at 00:00 UTC. You can turn auto-compound on or off for each vault." },
  { q: "How do Active Earn tasks pay?", a: "Each verified task pays $0.25–$0.45 directly into your wallet balance — no capital needed." },
  { q: "How does the referral bonus work?", a: "You earn 5–15% of your invited friends' daily yield depending on your tier, paid daily for as long as they stay invested." },
  { q: "Are there any fees?", a: "Deposits and withdrawals are free. A small performance fee is already reflected in the APY shown." },
];

export function FAQ({ onContact }: { onContact: () => void }) {
  const [q, setQ] = useState("");
  const list = faqs.filter((f) => (f.q + f.a).toLowerCase().includes(q.toLowerCase()));
  return (
    <section>
      <Intro eyebrow="Questions & Answers" title="Everything you need to know." copy="Quick answers about yields, safety, withdrawals, and rewards." />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-4 flex items-center gap-3 rounded-md border border-border bg-card px-4"><Search className="size-4 shrink-0 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions" className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></div>
          <Accordion type="single" collapsible className="rounded-[14px] border border-border bg-card px-5">
            {list.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-border">
                <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                <AccordionContent className="text-xs leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
            {list.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">No matching questions.</p>}
          </Accordion>
        </div>
        <aside className="h-fit rounded-[14px] border border-border bg-card p-6">
          <span className="vault-icon accent-digital"><HelpCircle className="size-5" /></span>
          <p className="mt-5 text-sm font-semibold">Still have questions?</p>
          <p className="mt-2 text-xs text-muted-foreground">Our support team replies within a few hours, every day.</p>
          <Button className="mt-5 w-full rounded-full" onClick={onContact}>Contact support</Button>
        </aside>
      </div>
    </section>
  );
}
