import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  User,
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
  HelpCircle,
  Landmark,
  Layers3,
  LockKeyhole,
  Menu,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  UserPlus,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import {
  ConnectWalletDialog,
  InviteFriends,
  NotificationsPopover,
  ProfileSheet,
  ReceiptDialog,
  WalletChip,
  WALLET_ADDRESS,
  type Receipt,
} from "@/components/depvest/extras";
import { CalculatorDialog, exportLedgerCsv, RebalanceDialog, TaskDialog, TransferDialog, VaultDetailDialog, type Alloc, type Flow } from "@/components/depvest/flows";
import { About, AdminTerms, FAQ, HowItWorks, Rules, Support } from "@/components/depvest/pages";
import { EMPTY_TERMS, pct, rewardRange, type Terms } from "@/components/depvest/terms";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

type View = "Portfolio" | "Invest" | "Active Earn" | "Wallet & Ledger" | "Invite Friends" | "How It Works" | "Q&A" | "About" | "Rules" | "Support" | "Admin";
type Accent = "cash" | "cloud" | "digital" | "task";

const navItems: Array<{ label: View; icon: typeof BarChart3; short: string }> = [
  { label: "Portfolio", short: "Portfolio", icon: BarChart3 },
  { label: "Invest", short: "Invest", icon: Coins },
  { label: "Active Earn", short: "Earn", icon: Zap },
  { label: "Wallet & Ledger", short: "Wallet", icon: WalletCards },
];

const moreItems: Array<{ label: View; icon: typeof BarChart3; copy: string }> = [
  { label: "Invite Friends", icon: UserPlus, copy: "Share DepVest with friends" },
  { label: "How It Works", icon: Sparkles, copy: "From deposit to diversified yield" },
  { label: "Q&A", icon: HelpCircle, copy: "Answers from the official terms" },
  { label: "About", icon: Layers3, copy: "What DepVest is and how it works" },
  { label: "Rules", icon: ShieldCheck, copy: "Policies, fees and risk disclosure" },
  { label: "Support", icon: LockKeyhole, copy: "Live chat, email, Telegram, Discord" },
  { label: "Admin", icon: Database, copy: "Upload official product terms" },
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
    balance: "$0.00",
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
    balance: "$0.00",
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
    balance: "$0.00",
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
    balance: "$0.00",
    allocation: "5%",
    terms: "No capital • Active work",
    action: "Start Earning",
    accent: "task",
    icon: Zap,
    auto: false,
  },
];

const activity: Array<{ title: string; value: string; meta: string; accent: Accent; icon: typeof Zap }> = [];

function DepVestApp() {
  const [view, setView] = useState<View>("Portfolio");
  const [notice, setNotice] = useState("");
  const [flow, setFlow] = useState<Flow>(null);
  const [cash, setCash] = useState(0);
  const [earned, setEarned] = useState(0);
  const [tasksDone, setTasksDone] = useState(0);
  const [alloc, setAlloc] = useState<Alloc>({ Cash: 0, Cloud: 0, Digital: 0, Task: 0 })
  const [terms, setTerms] = useState<Terms>(EMPTY_TERMS);
  const [ledger, setLedger] = useState<typeof activity>([]);
  const [wallet, setWallet] = useState<string | null>(null);
  const [connectOpen, setConnectOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [receipt, setReceipt] = useState<Receipt>(null);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };
  const go = (v: View) => {
    setView(v);
    setMoreOpen(false);
    setProfileOpen(false);
    window.scrollTo({ top: 0 });
  };
  const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const stamp = () => new Date().toUTCString().slice(5, 22) + " UTC";
  const addEntry = (title: string, value: string, meta: string, accent: Accent, icon: typeof Zap) => setLedger((l) => [{ title, value, meta, accent, icon }, ...l]);
  const allRows = () => [...ledger, ...activity];
  const setAction = (a: string) => {
    if (a === "Deposit" || a === "Deposit funds") return setFlow({ kind: "deposit" });
    if (a === "Withdraw funds") return setFlow({ kind: "withdraw" });
    if (a === "Rebalance") return setFlow({ kind: "rebalance" });
    if (a === "Calculator") { return setFlow({ kind: "calculator" }); }
    if (a === "Waitlist") return showNotice("Waitlist joined — DePIN vaults coming soon");
    if (a === "Quick Earn") { showNotice("Quick Earn queue opened"); return go("Active Earn"); }
    if (a === "Export ledger") { exportLedgerCsv(allRows()); return showNotice("Ledger exported as CSV"); }
    if (a.startsWith("Task|")) { const [, title, reward] = a.split("|"); return setFlow({ kind: "task", title: title ?? "Task", reward: Number(reward) }); }
    if (a.startsWith("Invest in ")) return setFlow({ kind: "vault", name: a.slice(10) });
    if (a.startsWith("Start Earning")) return go("Active Earn");
    const name = a.split(": ")[1];
    setFlow(name ? { kind: "deposit", vault: name } : { kind: "deposit" });
  };
  const disconnect = () => { setWallet(null); setProfileOpen(false); showNotice("Wallet disconnected"); };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary/30">
      <Header
        onMore={() => setMoreOpen(true)}
        view={view}
        onView={go}
        wallet={wallet}
        onConnect={() => setConnectOpen(true)}
        onDisconnect={disconnect}
        onProfile={() => setProfileOpen(true)}
        onNotice={showNotice}
      />
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-[calc(8rem+env(safe-area-inset-bottom,0px))] pt-6 sm:px-6 sm:pb-[calc(9rem+env(safe-area-inset-bottom,0px))] md:pt-8 lg:px-8 lg:pb-20">
        {view === "Portfolio" && <Portfolio terms={terms} onAction={setAction} onNotice={showNotice} onView={go} alloc={alloc} total={cash} rows={allRows()} />}
        {view === "Invest" && <Invest onAction={setAction} terms={terms} />}
        {view === "Active Earn" && <ActiveEarn terms={terms} onAction={setAction} earned={earned} done={tasksDone} />}
        {view === "Wallet & Ledger" && <WalletLedger rows={allRows()} cash={cash} earned={earned} onAction={setAction} onReceipt={setReceipt} wallet={wallet} onConnect={() => setConnectOpen(true)} />}
        {view === "Invite Friends" && <InviteFriends onNotice={showNotice} />}
        {view === "How It Works" && <HowItWorks terms={terms} onStart={() => go("Invest")} />}
        {view === "Q&A" && <FAQ terms={terms} onSupport={() => go("Support")} />}
        {view === "About" && <About />}
        {view === "Rules" && <Rules terms={terms} />}
        {view === "Support" && <Support onNotice={showNotice} onFaq={() => go("Q&A")} />}
        {view === "Admin" && <AdminTerms terms={terms} onApply={setTerms} onNotice={showNotice} />}
      </main>
      <MobileNav view={view} onView={go} onMore={() => setMoreOpen(true)} onAction={() => setAction("Deposit")} />
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-[18px] border-border bg-popover">
          <SheetHeader className="text-left"><SheetTitle>More</SheetTitle><SheetDescription>Learn, share, and get help.</SheetDescription></SheetHeader>
          <div className="mt-4 grid gap-2 pb-4">
            {moreItems.map(({ label, icon: Icon, copy }) => (
              <button key={label} onClick={() => go(label)} className={cn("flex items-center gap-3 rounded-md border p-3 text-left", view === label ? "border-success/40 bg-success/10" : "border-border bg-background/40")}>
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary"><Icon className="size-4" /></span>
                <span className="min-w-0"><span className="block text-sm font-medium">{label}</span><span className="block truncate text-[11px] text-muted-foreground">{copy}</span></span>
                <ChevronRight className="ml-auto size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      {notice && (
        <div className="fixed bottom-[calc(7.5rem+env(safe-area-inset-bottom,0px))] left-1/2 z-[60] flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 rounded-md border border-success/25 bg-popover px-4 py-3 text-sm shadow-panel lg:bottom-5">
          <Check className="size-4 shrink-0 text-success" /> <span className="truncate">{notice}</span>
        </div>
      )}
      <TransferDialog flow={flow} cash={cash} terms={terms} onClose={() => setFlow(null)} onNotice={showNotice}
        onDeposit={(n, net) => { setFlow(null); setCash((c) => c + n); addEntry("USDC deposit", `+${fmt(n)}`, `${net} network • ${stamp()}`, "cash", Plus); showNotice(`Deposited ${fmt(n)} USDC on ${net}`); }}
        onWithdraw={(n, net) => { setFlow(null); setCash((c) => c - n); addEntry("USDC withdrawal", `-${fmt(n)}`, `${net} network • ${stamp()}`, "digital", ArrowDownToLine); showNotice(`Withdrawal of ${fmt(n)} sent — instant USDC`); }} />
      <RebalanceDialog open={flow?.kind === "rebalance"} alloc={alloc} rebalanceFee={terms.fees.rebalance} onClose={() => setFlow(null)} onSave={(a) => { setAlloc(a); setFlow(null); addEntry("Portfolio rebalanced", "$0.00", `Target mix updated • ${stamp()}`, "cloud", RefreshCw); showNotice("Target mix saved"); }} />
      <CalculatorDialog open={flow?.kind === "calculator"} alloc={alloc} terms={terms} onClose={() => setFlow(null)} onInvest={() => setFlow({ kind: "deposit" })} />
      <TaskDialog flow={flow} onClose={() => setFlow(null)} onComplete={(title, reward) => { setFlow(null); setCash((c) => c + reward); setEarned((e) => e + reward); setTasksDone((t) => t + 1); addEntry("AI micro-task verified", `+${fmt(reward)}`, `${title} • ${stamp()}`, "task", Zap); showNotice(`Task payout: +${fmt(reward)} USDC`); }} />
      <VaultDetailDialog vault={flow?.kind === "vault" ? (vaults.map((v) => withTerms(v, terms, alloc)).find((v) => v.name === flow.name) ?? null) : null} onClose={() => setFlow(null)} onNotice={showNotice} onDeposit={(name) => setFlow({ kind: "deposit", vault: name })} />
      <ConnectWalletDialog open={connectOpen} onOpenChange={setConnectOpen} onConnected={(w) => { setWallet(w); setConnectOpen(false); showNotice(`${w} connected`); }} />
      <ProfileSheet
        open={profileOpen}
        onOpenChange={setProfileOpen}
        wallet={wallet}
        onConnect={() => { setProfileOpen(false); setConnectOpen(true); }}
        onDisconnect={disconnect}
        onInvite={() => go("Invite Friends")}
        onNotice={showNotice}
      />
      <ReceiptDialog receipt={receipt} onClose={() => setReceipt(null)} onNotice={showNotice} />
    </div>
  );
}

function Header({ view, onView, wallet, onConnect, onDisconnect, onProfile, onNotice, onMore }: {
  onMore: () => void;
  view: View;
  onView: (view: View) => void;
  wallet: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onProfile: () => void;
  onNotice: (m: string) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:px-8">
        <button className="flex min-w-0 shrink-0 items-center gap-3" onClick={() => onView("Portfolio")} aria-label="Open portfolio">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground shadow-glow"><Layers3 className="size-5" /></span>
          <span className="text-base font-semibold">DepVest</span>
          <span className="hidden rounded border border-border px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-muted-foreground 2xl:inline">Multi-Asset Hub</span>
        </button>
        <nav className="hidden rounded-full border border-border bg-card p-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => <NavButton key={item.label} item={item} active={view === item.label} onClick={() => onView(item.label)} />)}
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1 xl:flex">
            {moreItems.map((m) => <button key={m.label} onClick={() => onView(m.label)} className={cn("rounded-full px-3 py-2 text-xs transition-colors", view === m.label ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>{m.label}</button>)}
          </div>
          {wallet ? (
            <WalletChip wallet={wallet} onDisconnect={onDisconnect} onNotice={onNotice} />
          ) : (
            <Button onClick={onConnect} className="h-9 shrink-0 rounded-full bg-success px-3 text-primary-foreground hover:bg-success/90 sm:px-4">
              <WalletCards /><span className="hidden sm:inline">Connect Wallet</span><span className="sm:hidden">Connect</span>
            </Button>
          )}
          <NotificationsPopover />
          <button onClick={onProfile} aria-label="Open profile" className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-secondary text-xs font-semibold transition-colors hover:border-success/50"><User className="size-4" /></button>
        </div>
      </div>
    </header>
  );
}

function MobileNav({ view, onView, onMore }: { view: View; onView: (v: View) => void; onMore: () => void; onAction?: () => void }) {
  const Tab = ({ label, short, Icon, active, onClick }: { label: string; short: string; Icon: typeof Menu; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} aria-label={label} aria-current={active ? "page" : undefined} className="group flex h-full min-w-0 flex-1 items-center justify-center px-0.5">
      <span className={cn("flex h-[52px] w-full max-w-[68px] flex-col items-center justify-center gap-1 rounded-2xl border text-[10px] font-medium transition-all duration-200", active ? "border-success/35 bg-success/15 text-success shadow-glow" : "border-transparent text-foreground/85 group-hover:bg-secondary/60 group-hover:text-foreground group-active:scale-95")}>
        <Icon className={cn("size-5 transition-transform", active && "scale-110")} />
        <span className={cn("truncate", active && "font-semibold")}>{short}</span>
      </span>
    </button>
  );
  const moreActive = moreItems.some((m) => m.label === view);
  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] z-40 mx-auto w-[calc(100%-1.5rem)] max-w-md lg:hidden">
      <div className="flex h-[68px] items-stretch rounded-3xl border border-border bg-card px-1 drop-shadow-[0_12px_30px_rgba(0,0,0,0.55)]">
        {navItems.map((item) => <Tab key={item.label} label={item.label} short={item.short} Icon={item.icon} active={view === item.label} onClick={() => onView(item.label)} />)}
        <Tab label="More" short="More" Icon={Menu} active={moreActive} onClick={onMore} />
      </div>
    </nav>
  );
}

function NavButton({ item, active, onClick }: { item: (typeof navItems)[number]; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return <button onClick={onClick} className={cn("flex h-8 items-center gap-2 rounded-full px-4 text-xs transition-colors", active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}><Icon className="size-3.5" />{item.label}</button>;
}

function Portfolio({ terms, onAction, onNotice, onView, alloc, total, rows }: { onAction: (value: string) => void; onNotice: (value: string) => void; onView: (v: View) => void; alloc: Alloc; total: number; rows: typeof activity; terms: Terms }) {
  return (
    <>
      <PortfolioSummary onAction={onAction} alloc={alloc} total={total} />
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {moreItems.map(({ label, icon: Icon, copy }) => (
          <button key={label} onClick={() => onView(label)} className="flex items-center gap-3 rounded-[14px] border border-border bg-card p-4 text-left transition-colors hover:border-success/40">
            <span className="vault-icon accent-cash shrink-0"><Icon className="size-4" /></span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{label}</span><span className="block truncate text-[11px] text-muted-foreground">{copy}</span></span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section>
          <SectionLabel title="Asset Vaults" right={`4 vaults · ${usd(total)} total`} />
          <div className="space-y-4">{vaults.map((vault) => <VaultCard key={vault.name} vault={withTerms(vault, terms, alloc)} onAction={onAction} onNotice={onNotice} />)}</div>
          <div className="mt-4 flex items-center gap-3 rounded-md border border-dashed border-border bg-card/40 p-4 text-xs text-muted-foreground">
            <Sparkles className="size-4 shrink-0" /><span className="min-w-0">Add a new vault? Explore private credit & DePIN coming soon.</span>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => onAction("Waitlist")}>Join waitlist</Button>
          </div>
        </section>
        <aside className="space-y-4 lg:sticky lg:top-24">
          <Performance onAction={onAction} rows={rows} />
          <div className="flex items-start gap-3 rounded-md border border-border bg-card p-5">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary"><ShieldCheck className="size-4 text-muted-foreground" /></span>
            <div><p className="text-xs font-medium">Institutional-grade custody</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Custody and audit details will be published with the official product terms.</p></div>
          </div>
        </aside>
      </div>
    </>
  );
}

function PortfolioSummary({ onAction, alloc, total }: { onAction: (value: string) => void; alloc: Alloc; total: number }) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-border bg-card shadow-panel">
      <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_250px]">
        <div>
          <div className="flex flex-wrap items-center gap-3"><Label>Portfolio Value</Label></div>
          <div className="mt-2 flex flex-wrap items-baseline gap-4"><h1 className="font-mono text-4xl font-medium md:text-[44px]">{usd(total)}</h1></div>
          <div className="mt-10 grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-3 flex justify-between"><Label>Asset Allocation</Label><span className="font-mono text-[10px] text-muted-foreground">{Object.values(alloc).some(Boolean) ? "Target mix" : "Not allocated yet — use Rebalance"}</span></div>
              <AllocationBar alloc={alloc} />
              <div className="mt-3 flex flex-wrap gap-2"><Legend accent="cash" label="Cash" value={`${alloc.Cash}%`} /><Legend accent="cloud" label="Cloud" value={`${alloc.Cloud}%`} /><Legend accent="digital" label="Digital" value={`${alloc.Digital}%`} /><Legend accent="task" label="Task" value={`${alloc.Task}%`} /></div>
            </div>
            <div className="flex items-center gap-8">
              <div style={ringStyle(alloc)} className="grid size-[132px] shrink-0 place-items-center rounded-full"><div className="grid size-[92px] place-items-center rounded-full bg-card text-center"><div><Label>Allocation</Label><p className="mt-1 text-lg font-semibold">4 ASSETS</p></div></div></div>
              <div className="hidden grid-cols-2 gap-x-6 gap-y-3 text-xs xl:grid"><span className="text-muted-foreground">Cash</span><b>{alloc.Cash}%</b><span className="text-muted-foreground">Cloud</span><b>{alloc.Cloud}%</b><span className="text-muted-foreground">Digital</span><b>{alloc.Digital}%</b><span className="text-muted-foreground">Task</span><b>{alloc.Task}%</b></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col">
          <Button className="shrink-0 justify-center rounded-full bg-foreground text-background hover:bg-foreground/90" onClick={() => onAction("Deposit funds")}><Plus />Deposit</Button>
          <Button variant="outline" className="shrink-0 justify-center rounded-full" onClick={() => onAction("Withdraw funds")}><ArrowDownToLine />Withdraw</Button>
          <Button variant="outline" className="shrink-0 justify-center rounded-full" onClick={() => onAction("Rebalance")}><RefreshCw />Rebalance</Button>
          <Button className="shrink-0 justify-center rounded-full border border-success/25 bg-success/15 text-success hover:bg-success/20" onClick={() => onAction("Quick Earn")}><Zap />Quick Earn</Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border px-6 py-4 text-[10px] text-muted-foreground md:px-8"><span>◉ Rates shown only once verified</span><span>◉ 4 vaults</span></div>
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
        <div className="grid grid-cols-2 gap-2 sm:ml-auto sm:flex"><Button variant="outline" size="sm" className="rounded-full" onClick={() => onAction(`Invest in ${vault.name}`)}>Details <ChevronRight /></Button><Button size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90" onClick={() => onAction(`${vault.action}: ${vault.name}`)}><span className="truncate">{vault.action}</span> <ArrowUpRight /></Button></div>
      </div>
      <div className="mt-4 h-0.5 overflow-hidden rounded-full bg-secondary"><span className={cn("block h-full", `bar-${vault.accent}`)} style={{ width: vault.allocation }} /></div>
    </article>
  );
}

function Performance({ onAction, rows }: { onAction: (v: string) => void; rows: typeof activity }) {
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
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1"><Metric label="Total Gain" value="$0.00" note="No history yet" /><Metric label="APY Weighted" value="—" note="Needs verified rates" /><Metric label="Projected 1Y" value="$0.00" note="Deposit to start" /></div>
      <button onClick={() => onAction("Calculator")} className="mt-4 flex w-full items-center gap-3 rounded-md border border-success/25 bg-success/10 p-3 text-left"><Sparkles className="size-4 shrink-0 text-success" /><span className="min-w-0 flex-1 text-[11px]"><b className="block font-mono text-[9px] tracking-[0.16em] text-muted-foreground">SIMULATOR</b>Project returns once rates are verified</span><span className="shrink-0 text-[11px] text-success">Open calculator</span></button>
      <div className="my-6 border-t border-border" />
      <SectionLabel title="Recent Activity Feed" right={`${rows.length} items`} />
      <div className="space-y-2">{rows.length === 0 && <p className="rounded-md border border-dashed border-border p-4 text-center text-[11px] text-muted-foreground">No activity yet. Your deposits, payouts and tasks will appear here.</p>}{rows.slice(0, 5).map((item, i) => { const Icon = item.icon; return <div key={item.title + i} className="flex items-center gap-3 rounded-md border border-border bg-background/30 p-3"><span className={cn("vault-icon size-8", `accent-${item.accent}`)}><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-[11px] font-medium">{item.title} <span className="font-mono text-success">{item.value}</span></p><p className="mt-1 truncate text-[9px] text-muted-foreground">{item.meta}</p></div><Check className="size-3 text-muted-foreground" /></div>; })}</div>
      <div className="mt-5 flex justify-between border-t border-border pt-4 font-mono text-[9px] text-muted-foreground"><span>On-chain audit</span><span className="text-success">● Live</span></div>
    </section>
  );
}

function Invest({ onAction, terms }: { onAction: (value: string) => void; terms: Terms }) {
  const [query, setQuery] = useState("");
  const visible = vaults.map((v) => withTerms(v, terms)).filter((vault) => vault.name.toLowerCase().includes(query.toLowerCase()));
  return <section><PageIntro eyebrow="Vault Marketplace" title="Put every dollar to work." copy="Compare verified yield strategies across cash, compute, and digital assets." /><div className="mb-6 flex items-center gap-3 rounded-md border border-border bg-card px-4"><Search className="size-4 text-muted-foreground"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search vaults" className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></div><div className="grid gap-4 md:grid-cols-2">{visible.map((vault) => <article key={vault.name} className="rounded-[14px] border border-border bg-card p-6"><div className="flex justify-between"><span className={cn("vault-icon", `accent-${vault.accent}`)}><vault.icon className="size-5" /></span><Badge accent={vault.accent}>{vault.risk}</Badge></div><h2 className="mt-6 text-lg font-semibold">{vault.name}</h2><p className="mt-2 text-xs text-muted-foreground">{vault.detail}</p><p className="mt-7 font-mono text-3xl">{vault.rate} <span className="text-xs text-muted-foreground">{vault.rateLabel}</span></p><div className="mt-6 flex items-center justify-between border-t border-border pt-5"><span className="text-[10px] text-muted-foreground">{vault.terms}</span><Button size="sm" className="rounded-full" onClick={() => onAction(`Invest in ${vault.name}`)}>Explore <ArrowUpRight /></Button></div></article>)}</div></section>;
}

function ActiveEarn({ onAction, earned, done, terms }: { onAction: (value: string) => void; earned: number; done: number; terms: Terms }) {
  const r = terms.taskReward;
  const tasks = [{ title: "Validate product labels", time: "~3 min", icon: Bot }, { title: "Review AI summary", time: "~4 min", icon: Sparkles }, { title: "Classify satellite tiles", time: "~2 min", icon: Layers3 }].map((t) => ({ ...t, reward: r ? `$${r.min.toFixed(2)}` : "Unconfigured" }));
  return <section><PageIntro eyebrow="Active Earn" title="Earn in the moments between." copy={`Zero capital risk · ${rewardRange(r)} per verified task · Payout in USDC`} /><div className="grid gap-5 lg:grid-cols-[1fr_320px]"><div className="space-y-3">{tasks.map(({ title, reward, time, icon: Icon }) => <article key={title} className="flex flex-wrap items-center gap-3 rounded-[14px] border border-border bg-card p-4 sm:flex-nowrap sm:gap-4 sm:p-5"><span className="vault-icon accent-task shrink-0"><Icon className="size-5" /></span><div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">{title}</h2><p className="mt-1 text-[10px] text-muted-foreground">Open queue · {time}</p></div><strong className="font-mono text-success">{reward}</strong><Button size="sm" className="rounded-full" disabled={!r} onClick={() => onAction(`Task|${title}|${reward.slice(1)}`)}>Start task <ChevronRight /></Button></article>)}</div><div className="rounded-[14px] border border-border bg-card p-6"><Label>Today</Label><p className="mt-3 font-mono text-4xl">${earned.toFixed(2)}</p><p className="mt-2 text-xs text-success">{done} tasks completed</p><div className="mt-8 space-y-3"><ProgressRow label="Daily goal" value={`${Math.min(100, done * 10)}%`} /></div></div></div></section>;
}

function WalletLedger({ rows, cash, earned, onAction, onReceipt, wallet, onConnect }: { rows: typeof activity; cash: number; earned: number; onAction: (value: string) => void; onReceipt: (r: Receipt) => void; wallet: string | null; onConnect: () => void }) {
  return <section><PageIntro eyebrow="Wallet & Ledger" title="Every movement, accounted for." copy="Review balances, yields, and verified portfolio transactions in one place." />
    <div className="mb-5 flex flex-col gap-3 rounded-[14px] border border-border bg-card p-5 sm:flex-row sm:items-center">
      <span className="vault-icon accent-cash shrink-0"><WalletCards className="size-5" /></span>
      <div className="min-w-0 flex-1">{wallet ? <><p className="text-sm font-semibold">{wallet} connected</p><p className="mt-1 font-mono text-[11px] text-muted-foreground">{WALLET_ADDRESS} · Base network</p></> : <><p className="text-sm font-semibold">No wallet connected</p><p className="mt-1 text-[11px] text-muted-foreground">Connect a wallet to deposit and receive payouts.</p></>}</div>
      <div className="grid grid-cols-2 gap-2 sm:flex">{wallet ? <><Button className="rounded-full" onClick={() => onAction("Deposit funds")}><Plus />Deposit</Button><Button variant="outline" className="rounded-full" onClick={() => onAction("Withdraw funds")}><ArrowDownToLine />Withdraw</Button></> : <Button className="col-span-2 rounded-full bg-success text-primary-foreground hover:bg-success/90" onClick={onConnect}><WalletCards />Connect Wallet</Button>}</div>
    </div>
    <div className="grid gap-4 sm:grid-cols-3 sm:gap-5"><WalletStat label="Available cash" value={`$${cash.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={<WalletCards />} /><WalletStat label="Pending yield" value="—" note="Accrues once funds are allocated to a vault with a verified rate" icon={<Activity />} /><WalletStat label="Total earned" value={`$${earned.toFixed(2)}`} icon={<BarChart3 />} /></div><div className="mt-6 rounded-[14px] border border-border bg-card"><div className="flex items-center justify-between gap-3 border-b border-border p-5"><div className="min-w-0"><h2 className="text-sm font-semibold">Transaction ledger</h2><p className="mt-1 text-[10px] text-muted-foreground">Tap an entry to view its receipt</p></div><Button size="sm" variant="outline" className="shrink-0 rounded-full" onClick={() => onAction("Export ledger")}>Export</Button></div>{rows.length === 0 && <p className="p-8 text-center text-xs text-muted-foreground">No transactions yet. Make a deposit to get started.</p>}{rows.map((item, i) => <button key={item.title + i} onClick={() => onReceipt(item)} className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4 text-left last:border-0 hover:bg-secondary/30 sm:gap-4"><span className={cn("vault-icon size-8", `accent-${item.accent}`)}><item.icon className="size-4" /></span><div className="min-w-0"><p className="truncate text-xs font-medium">{item.title}</p><p className="mt-1 truncate text-[9px] text-muted-foreground">{item.meta}</p></div><span className={cn("font-mono text-xs", item.value.startsWith("-") ? "text-muted-foreground" : "text-success")}>{item.value}</span></button>)}</div></section>;
}

function AllocationBar({ alloc }: { alloc: Alloc }) { return <div className="flex h-2 gap-1 overflow-hidden rounded-full bg-secondary p-0.5"><span className="bar-cash rounded-full" style={{ width: `${alloc.Cash}%` }}/><span className="bar-cloud rounded-full" style={{ width: `${alloc.Cloud}%` }}/><span className="bar-digital rounded-full" style={{ width: `${alloc.Digital}%` }}/><span className="bar-task rounded-full" style={{ width: `${alloc.Task}%` }}/></div>; }
function Label({ children }: { children: ReactNode }) { return <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{children}</span>; }
function Badge({ children, accent }: { children: ReactNode; accent: Accent }) { return <span className={cn("rounded-full border px-2 py-1 text-[9px]", `badge-${accent}`)}>{children}</span>; }
function Legend({ accent, label, value }: { accent: Accent; label: string; value: string }) { return <span className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-[10px]"><i className={cn("size-2 rounded-full", `bar-${accent}`)} />{label}<b className="font-mono text-muted-foreground">{value}</b></span>; }
function SectionLabel({ title, right }: { title: string; right: string }) { return <div className="mb-4 flex items-center justify-between"><Label>{title}</Label><span className="font-mono text-[9px] text-muted-foreground">{right}</span></div>; }
function Metric({ label, value, note, success }: { label: string; value: string; note: string; success?: boolean }) { return <div className="rounded-md border border-border bg-secondary/50 p-3"><Label>{label}</Label><p className={cn("mt-2 font-mono text-xs font-semibold", success && "text-success")}>{value}</p><p className={cn("mt-1 text-[9px] text-muted-foreground", success && note.startsWith("+") && "text-success")}>{note}</p></div>; }
function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) { return <div className="mb-8 max-w-2xl md:mb-10"><Label>{eyebrow}</Label><h1 className="mt-4 text-3xl font-semibold sm:text-4xl md:text-[44px]">{title}</h1><p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{copy}</p></div>; }
function ProgressRow({ label, value }: { label: string; value: string }) { return <div><div className="flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className="font-mono">{value}</span></div><div className="mt-2 h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: value }} /></div></div>; }
function WalletStat({ label, value, icon, note }: { label: string; value: string; icon: ReactNode; note?: string }) { return <div className="rounded-[14px] border border-border bg-card p-6"><span className="vault-icon accent-cash">{icon}</span><p className="mt-6 text-xs text-muted-foreground">{label}</p><p className="mt-2 font-mono text-2xl">{value}</p>{note && <p className="mt-1 text-[10px] text-muted-foreground">{note}</p>}</div>; }
const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function withTerms<T extends (typeof vaults)[number]>(v: T, terms: Terms, alloc?: Alloc): T {
  const key = v.accent === "cash" ? "Cash" : v.accent === "cloud" ? "Cloud" : v.accent === "digital" ? "Digital" : null;
  const rate = key ? pct(terms.apy[key]) : rewardRange(terms.taskReward);
  const a = alloc ? alloc[key ?? "Task"] : 0;
  return { ...v, rate, allocation: `${a}%` };
}
function ringStyle(a: Alloc) {
  const c = a.Cash, d = c + a.Cloud, e = d + a.Digital;
  if (e + a.Task === 0) return { background: "var(--secondary)" };
  return { background: `conic-gradient(var(--success) 0 ${c}%, var(--cloud) ${c}% ${d}%, var(--digital) ${d}% ${e}%, var(--task) ${e}% 100%)` };
}
