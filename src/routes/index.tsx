import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  Check,
  ChevronRight,
  CircleDollarSign,
  Cloud,
  Coins,
  Cpu,
  Database,
  Landmark,
  Layers3,
  LockKeyhole,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DepVest — Multi-Asset Hub" },
      {
        name: "description",
        content: "Track diversified yield vaults, portfolio performance, and activity in DepVest.",
      },
      { property: "og:title", content: "DepVest — Multi-Asset Hub" },
      {
        property: "og:description",
        content: "A unified portfolio workspace for cash, compute, digital assets, and active earnings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DepVestApp,
});

type View = "Portfolio" | "Invest" | "Active Earn" | "Wallet & Ledger";
type Accent = "cash" | "cloud" | "digital" | "task";

const navItems: Array<{ label: View; icon: typeof BarChart3; mobile: string }> = [
  { label: "Portfolio", mobile: "Portfolio (Overview)", icon: BarChart3 },
  { label: "Invest", mobile: "Invest (Vaults)", icon: Coins },
  { label: "Active Earn", mobile: "Active Earn", icon: Zap },
  { label: "Wallet & Ledger", mobile: "Wallet & Ledger", icon: WalletCards },
];

const vaults: Array<{
  name: string;
  rate: string;
  rateLabel: string;
  risk: string;
  detail: string;
  balance: string;
  allocation: string;
  terms: string;
  action: string;
  accent: Accent;
  icon: typeof Landmark;
  auto: boolean;
}> = [
  {
    name: "US Treasury Cash",
    rate: "5.20%",
    rateLabel: "APY",
    risk: "Ultra-Low",
    detail: "Short-term US T-bills & cash reserves in USDC",
    balance: "$4,357.78",
    allocation: "35%",
    terms: "No lock • Instant liquidity",
    action: "Add Funds",
    accent: "cash",
    icon: Landmark,
    auto: true,
  },
  {
    name: "AI Cloud Compute",
    rate: "9.40%",
    rateLabel: "APY",
    risk: "Moderate",
    detail: "Contracted enterprise GPU/CPU rental revenues",
    balance: "$4,980.32",
    allocation: "40%",
    terms: "30D epoch • Auto-renew",
    action: "Top Up Compute",
    accent: "cloud",
    icon: Cpu,
    auto: true,
  },
  {
    name: "Blue-Chip Index",
    rate: "6.80%",
    rateLabel: "APY",
    risk: "Balanced",
    detail: "Staking yields on top blue-chip assets (ETH / SOL)",
    balance: "$2,490.16",
    allocation: "20%",
    terms: "Flexible • 7D unstake",
    action: "Stake More",
    accent: "digital",
    icon: Database,
    auto: true,
  },
  {
    name: "AI Task Work",
    rate: "$0.25 – $0.45",
    rateLabel: "/ task",
    risk: "Zero Risk",
    detail: "Direct micro-payouts for dataset validation",
    balance: "$622.54",
    allocation: "5%",
    terms: "No capital • Active work",
    action: "Start Earning",
    accent: "task",
    icon: Zap,
    auto: false,
  },
];

const activity = [
  { title: "Daily Treasury yield credited", value: "+$4.22", meta: "US T-Bill auto-compound • Today 00:03 UTC", accent: "cash" as Accent, icon: CircleDollarSign },
  { title: "AI micro-task verified", value: "+$0.35", meta: "Dataset validation #4821 • Today 09:14 UTC", accent: "task" as Accent, icon: Zap },
  { title: "Cloud compute epoch payout", value: "+$18.40", meta: "GPU Cluster 03 • 30D epoch • Yesterday 22:00 UTC", accent: "cloud" as Accent, icon: Cpu },
];

function DepVestApp() {
  const [view, setView] = useState<View>("Portfolio");
  const [notice, setNotice] = useState("");
  const [action, setAction] = useState<string | null>(null);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Header view={view} onView={setView} />
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        {view === "Portfolio" && <Portfolio onAction={setAction} onNotice={showNotice} />}
        {view === "Invest" && <Invest onAction={setAction} />}
        {view === "Active Earn" && <ActiveEarn onNotice={showNotice} />}
        {view === "Wallet & Ledger" && <WalletLedger onAction={setAction} />}
      </main>
      {notice && (
        <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-md border border-success/25 bg-popover px-4 py-3 text-sm shadow-panel">
          <Check className="size-4 text-success" /> {notice}
        </div>
      )}
      {action && <ActionModal title={action} onClose={() => setAction(null)} onDone={(msg) => { setAction(null); showNotice(msg); }} />}
    </div>
  );
}

function Header({ view, onView }: { view: View; onView: (view: View) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-5 px-4 sm:px-6 lg:px-8">
        <button className="flex shrink-0 items-center gap-3" onClick={() => onView("Portfolio")} aria-label="Open portfolio">
          <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground shadow-glow"><Layers3 className="size-5" /></span>
          <span className="text-base font-semibold">DepVest</span>
          <span className="hidden rounded border border-border px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">Multi-Asset Hub</span>
        </button>
        <nav className="hidden rounded-full border border-border bg-card p-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => <NavButton key={item.label} item={item} active={view === item.label} onClick={() => onView(item.label)} />)}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 font-mono text-[10px] text-muted-foreground sm:flex"><i className="size-1.5 animate-pulse rounded-full bg-success" /> Live yields</span>
          <Button variant="outline" size="icon" className="rounded-full border-border bg-card" aria-label="Notifications"><Bell className="size-4" /></Button>
          <span className="grid size-9 place-items-center rounded-full border border-border bg-secondary text-xs font-semibold">AK</span>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto border-t border-border/70 px-3 py-2 lg:hidden" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <Button key={item.label} variant={view === item.label ? "default" : "outline"} className="shrink-0 rounded-full" onClick={() => onView(item.label)}>
            {item.mobile}
          </Button>
        ))}
      </nav>
    </header>
  );
}

function NavButton({ item, active, onClick }: { item: (typeof navItems)[number]; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return <button onClick={onClick} className={cn("flex h-8 items-center gap-2 rounded-full px-4 text-xs transition-colors", active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}><Icon className="size-3.5" />{item.label}</button>;
}

function Portfolio({ onAction, onNotice }: { onAction: (value: string) => void; onNotice: (value: string) => void }) {
  return (
    <>
      <PortfolioSummary onAction={onAction} onNotice={onNotice} />
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section>
          <SectionLabel title="Asset Vaults" right="4 active · $ 12,450.80 TVL" />
          <div className="space-y-4">{vaults.map((vault) => <VaultCard key={vault.name} vault={vault} onAction={onAction} onNotice={onNotice} />)}</div>
          <div className="mt-4 flex items-center gap-3 rounded-md border border-dashed border-border bg-card/40 p-4 text-xs text-muted-foreground">
            <Sparkles className="size-4" /><span>Add a new vault? Explore private credit & DePIN coming soon.</span>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => onNotice("You joined the early access list")}>Join waitlist</Button>
          </div>
        </section>
        <aside className="space-y-4 lg:sticky lg:top-24">
          <Performance />
          <div className="flex items-start gap-3 rounded-md border border-border bg-card p-5">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary"><ShieldCheck className="size-4 text-muted-foreground" /></span>
            <div><p className="text-xs font-medium">Institutional-grade custody</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Cash held in USDC at regulated custodians • Compute contracts insured • Staking via audited validators. No leverage.</p></div>
          </div>
        </aside>
      </div>
    </>
  );
}

function PortfolioSummary({ onAction, onNotice }: { onAction: (value: string) => void; onNotice: (value: string) => void }) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-border bg-card shadow-panel">
      <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_250px]">
        <div>
          <div className="flex flex-wrap items-center gap-3"><Label>Portfolio Value</Label><Badge accent="cash">● Verified on-chain</Badge></div>
          <div className="mt-2 flex flex-wrap items-baseline gap-4"><h1 className="font-mono text-4xl font-medium md:text-[44px]">$12,450.80</h1><span className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs text-success">↗ ▲ +$318.40 (+2.62%) this month</span></div>
          <div className="mt-10 grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-3 flex justify-between"><Label>Asset Allocation</Label><span className="font-mono text-[10px] text-muted-foreground">Rebalanced 2h ago</span></div>
              <AllocationBar />
              <div className="mt-3 flex flex-wrap gap-2"><Legend accent="cash" label="Cash" value="35%" /><Legend accent="cloud" label="Cloud" value="40%" /><Legend accent="digital" label="Digital" value="20%" /><Legend accent="task" label="Task" value="5%" /></div>
            </div>
            <div className="flex items-center gap-8">
              <div className="allocation-ring grid size-[132px] shrink-0 place-items-center rounded-full"><div className="grid size-[92px] place-items-center rounded-full bg-card text-center"><div><Label>Allocation</Label><p className="mt-1 text-lg font-semibold">4 ASSETS</p></div></div></div>
              <div className="hidden grid-cols-2 gap-x-6 gap-y-3 text-xs xl:grid"><span className="text-muted-foreground">Cash</span><b>35%</b><span className="text-muted-foreground">Cloud</span><b>40%</b><span className="text-muted-foreground">Digital</span><b>20%</b><span className="text-muted-foreground">Task</span><b>5%</b></div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto lg:flex-col">
          <Button className="shrink-0 justify-center rounded-full bg-foreground text-background hover:bg-foreground/90" onClick={() => onAction("Deposit funds")}><Plus />Deposit</Button>
          <Button variant="outline" className="shrink-0 justify-center rounded-full" onClick={() => onAction("Withdraw funds")}><ArrowDownToLine />Withdraw</Button>
          <Button variant="outline" className="shrink-0 justify-center rounded-full" onClick={() => onNotice("Portfolio rebalanced to your target allocation")}><RefreshCw />Rebalance</Button>
          <Button className="shrink-0 justify-center rounded-full border border-success/25 bg-success/15 text-success hover:bg-success/20" onClick={() => onNotice("Quick Earn is ready to explore")}><Zap />Quick Earn</Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border px-6 py-4 text-[10px] text-muted-foreground md:px-8"><span>◉ SIPC insured cash · Audit proof</span><span>◉ Yields credited daily 00:00 UTC</span><span>◉ 4 vaults · Auto-compound on</span></div>
    </section>
  );
}

function VaultCard({ vault, onAction, onNotice }: { vault: (typeof vaults)[number]; onAction: (value: string) => void; onNotice: (value: string) => void }) {
  const [auto, setAuto] = useState(vault.auto);
  const Icon = vault.icon;
  return (
    <article className="group rounded-[14px] border border-border bg-card p-5 shadow-card transition-transform hover:-translate-y-px">
      <div className="flex items-start gap-4">
        <span className={cn("vault-icon", `accent-${vault.accent}`)}><Icon className="size-5" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold">{vault.name}</h3><Badge accent={vault.accent}>● {vault.rate} <span className="text-muted-foreground">{vault.rateLabel}</span></Badge></div>
          <div className="mt-2 flex flex-wrap items-center gap-2"><Badge accent={vault.accent}>{vault.risk}</Badge><span className="text-[10px] text-muted-foreground">{vault.detail}</span></div>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-[10px] text-muted-foreground"><span className="hidden sm:inline">Auto-comp</span><button aria-label={`Toggle auto-compound for ${vault.name}`} aria-pressed={auto} onClick={() => { setAuto(!auto); onNotice(`Auto-compound ${auto ? "paused" : "enabled"} for ${vault.name}`); }} className={cn("relative h-5 w-9 rounded-full transition-colors", auto ? "bg-success" : "bg-secondary")}><span className={cn("absolute top-0.5 size-4 rounded-full bg-foreground transition-all", auto ? "left-[18px]" : "left-0.5")} /></button></label>
      </div>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div><Label>Balance</Label><div className="mt-1 flex items-baseline gap-2"><strong className="font-mono text-[22px]">{vault.balance}</strong><span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[9px] text-muted-foreground">{vault.allocation}</span></div><p className="mt-2 text-[10px] text-muted-foreground">◉ {vault.terms}</p></div>
        <div className="ml-auto flex gap-2"><Button variant="outline" size="sm" className="rounded-full" onClick={() => onNotice(`${vault.name} rebalance preview opened`)}>Rebalance <ChevronRight /></Button><Button size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90" onClick={() => onAction(`${vault.action}: ${vault.name}`)}>{vault.action} <ArrowUpRight /></Button></div>
      </div>
      <div className="mt-4 h-0.5 overflow-hidden rounded-full bg-secondary"><span className={cn("block h-full", `bar-${vault.accent}`)} style={{ width: vault.allocation }} /></div>
    </article>
  );
}

function Performance() {
  const [range, setRange] = useState("1M");
  return (
    <section className="rounded-[14px] border border-border bg-card p-5 shadow-card md:p-6">
      <SectionLabel title="Performance & Activity" right={`${range} view`} />
      <div className="inline-flex rounded-full border border-border bg-background/40 p-1">{["1W", "1M", "3M", "1Y", "ALL"].map((item) => <button key={item} onClick={() => setRange(item)} className={cn("grid h-7 min-w-9 place-items-center rounded-full px-2 font-mono text-[9px]", range === item ? "bg-foreground text-background" : "text-muted-foreground")}>{item}</button>)}</div>
      <div className="mt-6 h-[220px] w-full text-success">
        <svg viewBox="0 0 520 220" className="h-full w-full" preserveAspectRatio="none" aria-label="Portfolio performance chart">
          <defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".25"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs>
          <path d="M14 182 C60 140 88 148 126 130 S180 95 224 91 S275 87 310 68 S370 53 404 52 L404 192 L14 192 Z" fill="url(#chart-fill)" />
          <path d="M14 182 C60 140 88 148 126 130 S180 95 224 91 S275 87 310 68 S370 53 404 52" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M404 52 C448 43 474 35 508 28" fill="none" stroke="currentColor" strokeOpacity=".65" strokeWidth="2" strokeDasharray="6 5" />
        </svg>
      </div>
      <div className="flex justify-between font-mono text-[9px] text-muted-foreground"><span>Oct 24</span><span className="flex gap-4"><i className="text-success">— Actual</i><i>— Projected</i></span><span>Now</span></div>
      <div className="mt-5 grid grid-cols-3 gap-2"><Metric label="Total Gain" value="+$318.40" note="+2.62% this month" success /><Metric label="APY Weighted" value="7.31%" note="Blended yield" /><Metric label="Projected 1Y" value="$14,420.00" note="+15.8%" success /></div>
      <div className="my-6 border-t border-border" />
      <SectionLabel title="Recent Activity Feed" right="View all" />
      <div className="space-y-2">{activity.map((item) => { const Icon = item.icon; return <div key={item.title} className="flex items-center gap-3 rounded-md border border-border bg-background/30 p-3"><span className={cn("vault-icon size-8", `accent-${item.accent}`)}><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-[11px] font-medium">{item.title} <span className="font-mono text-success">{item.value}</span></p><p className="mt-1 truncate text-[9px] text-muted-foreground">{item.meta}</p></div><Check className="size-3 text-muted-foreground" /></div>; })}</div>
      <div className="mt-5 flex justify-between border-t border-border pt-4 font-mono text-[9px] text-muted-foreground"><span>On-chain audit • tx: 0x9f…e21a</span><span className="text-success">● Live</span></div>
    </section>
  );
}

function Invest({ onAction }: { onAction: (value: string) => void }) {
  const [query, setQuery] = useState("");
  const visible = vaults.filter((vault) => vault.name.toLowerCase().includes(query.toLowerCase()));
  return <section><PageIntro eyebrow="Vault Marketplace" title="Put every dollar to work." copy="Compare verified yield strategies across cash, compute, and digital assets." /><div className="mb-6 flex items-center gap-3 rounded-md border border-border bg-card px-4"><Search className="size-4 text-muted-foreground"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search vaults" className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></div><div className="grid gap-4 md:grid-cols-2">{visible.map((vault) => <article key={vault.name} className="rounded-[14px] border border-border bg-card p-6"><div className="flex justify-between"><span className={cn("vault-icon", `accent-${vault.accent}`)}><vault.icon className="size-5" /></span><Badge accent={vault.accent}>{vault.risk}</Badge></div><h2 className="mt-6 text-lg font-semibold">{vault.name}</h2><p className="mt-2 text-xs text-muted-foreground">{vault.detail}</p><p className="mt-7 font-mono text-3xl">{vault.rate} <span className="text-xs text-muted-foreground">{vault.rateLabel}</span></p><div className="mt-6 flex items-center justify-between border-t border-border pt-5"><span className="text-[10px] text-muted-foreground">{vault.terms}</span><Button size="sm" className="rounded-full" onClick={() => onAction(`Invest in ${vault.name}`)}>Explore <ArrowUpRight /></Button></div></article>)}</div></section>;
}

function ActiveEarn({ onNotice }: { onNotice: (value: string) => void }) {
  const tasks = [{ title: "Validate product labels", reward: "$0.38", time: "~3 min", icon: Bot }, { title: "Review AI summary", reward: "$0.45", time: "~4 min", icon: Sparkles }, { title: "Classify satellite tiles", reward: "$0.29", time: "~2 min", icon: Layers3 }];
  return <section><PageIntro eyebrow="Active Earn" title="Earn in the moments between." copy="Complete verified data tasks and receive direct micro-payouts to your wallet." /><div className="grid gap-5 lg:grid-cols-[1fr_320px]"><div className="space-y-3">{tasks.map(({ title, reward, time, icon: Icon }) => <article key={title} className="flex items-center gap-4 rounded-[14px] border border-border bg-card p-5"><span className="vault-icon accent-task"><Icon className="size-5" /></span><div className="flex-1"><h2 className="text-sm font-semibold">{title}</h2><p className="mt-1 text-[10px] text-muted-foreground">Open queue · {time}</p></div><strong className="font-mono text-success">{reward}</strong><Button size="sm" className="rounded-full" onClick={() => onNotice(`${title} started`)}>Start <ChevronRight /></Button></article>)}</div><div className="rounded-[14px] border border-border bg-card p-6"><Label>Today</Label><p className="mt-3 font-mono text-4xl">$6.82</p><p className="mt-2 text-xs text-success">18 tasks completed</p><div className="mt-8 space-y-3"><ProgressRow label="Daily goal" value="68%" /><ProgressRow label="Accuracy" value="98%" /><ProgressRow label="Approval rate" value="100%" /></div></div></div></section>;
}

function WalletLedger({ onAction }: { onAction: (value: string) => void }) {
  return <section><PageIntro eyebrow="Wallet & Ledger" title="Every movement, accounted for." copy="Review balances, yields, and verified portfolio transactions in one place." /><div className="grid gap-5 md:grid-cols-3"><WalletStat label="Available cash" value="$1,240.16" icon={<WalletCards />} /><WalletStat label="Pending yield" value="$22.97" icon={<Activity />} /><WalletStat label="Total earned" value="$1,086.42" icon={<BarChart3 />} /></div><div className="mt-6 rounded-[14px] border border-border bg-card"><div className="flex items-center justify-between border-b border-border p-5"><div><h2 className="text-sm font-semibold">Transaction ledger</h2><p className="mt-1 text-[10px] text-muted-foreground">Most recent verified entries</p></div><Button size="sm" variant="outline" className="rounded-full" onClick={() => onAction("Export ledger")}>Export</Button></div>{activity.concat([{ title: "Portfolio deposit", value: "+$500.00", meta: "Bank transfer • Oct 22 16:42 UTC", accent: "digital" as Accent, icon: ArrowDownToLine }]).map((item) => <div key={item.title} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-border px-5 py-4 last:border-0"><span className={cn("vault-icon size-8", `accent-${item.accent}`)}><item.icon className="size-4" /></span><div><p className="text-xs font-medium">{item.title}</p><p className="mt-1 text-[9px] text-muted-foreground">{item.meta}</p></div><span className="font-mono text-xs text-success">{item.value}</span></div>)}</div></section>;
}

function ActionModal({ title, onClose, onDone }: { title: string; onClose: () => void; onDone: (value: string) => void }) {
  const [amount, setAmount] = useState("500");
  return <div className="fixed inset-0 z-50 grid place-items-center bg-overlay p-4" role="dialog" aria-modal="true" aria-label={title}><div className="w-full max-w-md rounded-[14px] border border-border bg-popover p-6 shadow-panel"><div className="flex items-center justify-between"><div><Label>Secure transaction</Label><h2 className="mt-2 text-xl font-semibold">{title}</h2></div><Button variant="ghost" size="icon" onClick={onClose} aria-label="Close"><X /></Button></div><label className="mt-8 block"><span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Amount (USD)</span><div className="mt-2 flex items-center rounded-md border border-input bg-background px-4"><span className="text-muted-foreground">$</span><input autoFocus value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} className="h-12 w-full bg-transparent px-2 font-mono text-lg outline-none" /></div></label><div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground"><LockKeyhole className="size-3" /> Preview only — no funds will move</div><div className="mt-8 flex justify-end gap-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onDone(`${title} preview created for $${amount || "0"}`)}>Continue <ArrowUpRight /></Button></div></div></div>;
}

function AllocationBar() { return <div className="flex h-2 gap-1 overflow-hidden rounded-full bg-secondary p-0.5"><span className="bar-cash w-[35%] rounded-full"/><span className="bar-cloud w-[40%] rounded-full"/><span className="bar-digital w-[20%] rounded-full"/><span className="bar-task w-[5%] rounded-full"/></div>; }
function Label({ children }: { children: ReactNode }) { return <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{children}</span>; }
function Badge({ children, accent }: { children: ReactNode; accent: Accent }) { return <span className={cn("rounded-full border px-2 py-1 text-[9px]", `badge-${accent}`)}>{children}</span>; }
function Legend({ accent, label, value }: { accent: Accent; label: string; value: string }) { return <span className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-[10px]"><i className={cn("size-2 rounded-full", `bar-${accent}`)} />{label}<b className="font-mono text-muted-foreground">{value}</b></span>; }
function SectionLabel({ title, right }: { title: string; right: string }) { return <div className="mb-4 flex items-center justify-between"><Label>{title}</Label><span className="font-mono text-[9px] text-muted-foreground">{right}</span></div>; }
function Metric({ label, value, note, success }: { label: string; value: string; note: string; success?: boolean }) { return <div className="rounded-md border border-border bg-secondary/50 p-3"><Label>{label}</Label><p className={cn("mt-2 font-mono text-xs font-semibold", success && "text-success")}>{value}</p><p className={cn("mt-1 text-[9px] text-muted-foreground", success && note.startsWith("+") && "text-success")}>{note}</p></div>; }
function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) { return <div className="mb-10 max-w-2xl"><Label>{eyebrow}</Label><h1 className="mt-4 text-4xl font-semibold md:text-[44px]">{title}</h1><p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{copy}</p></div>; }
function ProgressRow({ label, value }: { label: string; value: string }) { return <div><div className="flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className="font-mono">{value}</span></div><div className="mt-2 h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: value }} /></div></div>; }
function WalletStat({ label, value, icon }: { label: string; value: string; icon: ReactNode }) { return <div className="rounded-[14px] border border-border bg-card p-6"><span className="vault-icon accent-cash">{icon}</span><p className="mt-6 text-xs text-muted-foreground">{label}</p><p className="mt-2 font-mono text-2xl">{value}</p></div>; }