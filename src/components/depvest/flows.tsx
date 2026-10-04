import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, Check, Copy, LockKeyhole, QrCode, RefreshCw, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const DEPOSIT_ADDRESS = "0x8a24c9F31b07dE52a1C6f04B7e9D3a1f6b2c4e91";

export type Flow =
  | { kind: "deposit"; vault?: string }
  | { kind: "withdraw" }
  | { kind: "rebalance" }
  | { kind: "calculator" }
  | { kind: "task"; title: string; reward: number }
  | { kind: "vault"; name: string }
  | null;

export type VaultInfo = { name: string; rate: string; rateLabel: string; risk: string; detail: string; balance: string; terms: string; accent: string };

type Notice = (m: string) => void;
const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const Cap = ({ children }: { children: React.ReactNode }) => <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{children}</span>;
const Shell = ({ open, onClose, eyebrow, title, desc, children }: { open: boolean; onClose: () => void; eyebrow: string; title: string; desc: string; children: React.ReactNode }) => (
  <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-popover sm:max-w-md">
      <DialogHeader className="text-left"><Cap>{eyebrow}</Cap><DialogTitle className="text-xl">{title}</DialogTitle><DialogDescription>{desc}</DialogDescription></DialogHeader>
      {children}
    </DialogContent>
  </Dialog>
);
const Preview = () => <p className="flex items-center gap-2 text-[10px] text-muted-foreground"><LockKeyhole className="size-3" />Preview only — no real funds move</p>;

/* ---------------- Deposit / Withdraw ---------------- */
export function TransferDialog({ flow, cash, onClose, onDeposit, onWithdraw, onNotice }: { flow: Flow; cash: number; onClose: () => void; onDeposit: (n: number, net: string) => void; onWithdraw: (n: number, net: string) => void; onNotice: Notice }) {
  const isDeposit = flow?.kind === "deposit";
  const open = flow?.kind === "deposit" || flow?.kind === "withdraw";
  const [net, setNet] = useState("Base");
  const [amount, setAmount] = useState("1000");
  const [dest, setDest] = useState("");
  const [qr, setQr] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (open) { setAmount(isDeposit ? "1000" : "250"); setDest(""); setBusy(false); setQr(false); } }, [open, isDeposit]);
  const n = Number(amount) || 0;
  const fee = net === "Base" ? 0.12 : 2.4;
  const error = n <= 0 ? "Enter an amount" : n > 1_000_000 ? "Maximum is $1,000,000" : !isDeposit && n > cash ? `Only ${money(cash)} available` : !isDeposit && !/^0x[a-fA-F0-9]{40}$/.test(dest.trim()) ? "Enter a valid 0x wallet address (42 characters)" : "";
  const submit = () => { if (error) return; setBusy(true); window.setTimeout(() => { isDeposit ? onDeposit(n, net) : onWithdraw(n, net); }, 900); };
  const vault = flow?.kind === "deposit" ? flow.vault : undefined;
  return (
    <Shell open={open} onClose={onClose} eyebrow={isDeposit ? "Deposit · USDC" : "Withdraw · instant USDC"} title={isDeposit ? (vault ? `Add funds to ${vault}` : "Deposit funds") : "Withdraw funds"} desc={isDeposit ? "Send USDC to your DepVest address or pick an amount to simulate." : `Available cash: ${money(cash)}. Withdrawals settle in minutes.`}>
      <div className="space-y-5">
        <div><Cap>Network</Cap><div className="mt-2 grid grid-cols-2 gap-2">{["Base", "Ethereum"].map((x) => <button key={x} onClick={() => setNet(x)} className={cn("rounded-md border p-3 text-left text-sm", net === x ? "border-success/50 bg-success/10" : "border-border bg-background/40")}><b className="block">{x}</b><span className="text-[10px] text-muted-foreground">Fee ~{x === "Base" ? "$0.12" : "$2.40"} · {x === "Base" ? "~1 min" : "~5 min"}</span></button>)}</div></div>
        {isDeposit && <div className="rounded-md border border-border bg-background/40 p-3">
          <div className="flex items-center justify-between"><Cap>Your USDC address ({net})</Cap><button onClick={() => setQr(!qr)} className="flex items-center gap-1 text-[10px] text-success"><QrCode className="size-3" />{qr ? "Hide" : "Show"} QR</button></div>
          {qr && <div className="mx-auto my-3 grid size-36 grid-cols-12 gap-px rounded bg-foreground p-2">{Array.from({ length: 144 }, (_, i) => <span key={i} className={((i * 7919) % 13) % 3 === 0 || [0, 1, 12, 13, 10, 11, 22, 23, 120, 121, 132, 133].includes(i) ? "bg-background" : ""} />)}</div>}
          <div className="mt-2 flex items-center gap-2"><code className="min-w-0 flex-1 truncate font-mono text-[11px]">{DEPOSIT_ADDRESS}</code><Button size="sm" variant="outline" className="rounded-full" onClick={() => { navigator.clipboard?.writeText(DEPOSIT_ADDRESS).catch(() => {}); onNotice(`Deposit: USDC ${net} address copied`); }}><Copy />Copy</Button></div>
        </div>}
        <div><Cap>Amount (USDC)</Cap>
          <div className="mt-2 flex items-center rounded-md border border-input bg-background px-4"><span className="text-muted-foreground">$</span><input inputMode="decimal" maxLength={10} value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} className="h-12 w-full bg-transparent px-2 font-mono text-lg outline-none" /></div>
          <div className="mt-2 flex flex-wrap gap-2">{(isDeposit ? [250, 1000, 5000] : [100, 250, Math.floor(cash)]).map((p, i) => <button key={i} onClick={() => setAmount(String(p))} className="rounded-full bg-secondary px-3 py-1 font-mono text-[10px]">{!isDeposit && i === 2 ? "Max" : money(p)}</button>)}</div>
        </div>
        {!isDeposit && <div><Cap>Destination wallet</Cap><input value={dest} maxLength={42} onChange={(e) => setDest(e.target.value.trim())} placeholder="0x…" className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 font-mono text-xs outline-none" /><button onClick={() => setDest(DEPOSIT_ADDRESS)} className="mt-1 text-[10px] text-success">Use my connected wallet</button></div>}
        <div className="space-y-1 rounded-md bg-secondary/50 p-3 font-mono text-[11px]">
          <div className="flex justify-between"><span className="text-muted-foreground">Network fee</span><span>{money(fee)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">DepVest fee</span><span className="text-success">$0.00</span></div>
          <div className="flex justify-between border-t border-border pt-1"><span className="text-muted-foreground">{isDeposit ? "You'll receive" : "You'll get"}</span><b>{money(Math.max(0, n - (isDeposit ? 0 : fee)))}</b></div>
        </div>
        {error && n > 0 && <p className="text-[11px] text-destructive">{error}</p>}
        <Preview />
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!!error || busy} onClick={submit}>{busy ? "Processing…" : isDeposit ? "Confirm deposit" : "Withdraw now"}{!busy && (isDeposit ? <ArrowUpRight /> : <ArrowDownToLine />)}</Button></div>
      </div>
    </Shell>
  );
}

/* ---------------- Rebalance ---------------- */
export type Alloc = Record<"Cash" | "Cloud" | "Digital" | "Task", number>;
export function RebalanceDialog({ open, alloc, onClose, onSave }: { open: boolean; alloc: Alloc; onClose: () => void; onSave: (a: Alloc) => void }) {
  const [draft, setDraft] = useState(alloc);
  useEffect(() => { if (open) setDraft(alloc); }, [open, alloc]);
  const total = Object.values(draft).reduce((a, b) => a + b, 0);
  const colors: Record<keyof Alloc, string> = { Cash: "bar-cash", Cloud: "bar-cloud", Digital: "bar-digital", Task: "bar-task" };
  return (
    <Shell open={open} onClose={onClose} eyebrow="Rebalance portfolio" title="Set your target mix" desc="Drag sliders — total must equal 100%. Changes apply next epoch.">
      <div className="space-y-5">
        <div className="flex h-2 gap-0.5 overflow-hidden rounded-full bg-secondary">{(Object.keys(draft) as (keyof Alloc)[]).map((k) => <span key={k} className={colors[k]} style={{ width: `${draft[k]}%` }} />)}</div>
        {(Object.keys(draft) as (keyof Alloc)[]).map((k) => (
          <div key={k}><div className="mb-2 flex justify-between text-xs"><span className="flex items-center gap-2"><i className={cn("size-2 rounded-full", colors[k])} />{k}</span><b className="font-mono">{draft[k]}%</b></div>
            <Slider aria-label={`${k} allocation`} value={[draft[k]]} max={100} step={1} onValueChange={([v]) => setDraft({ ...draft, [k]: v ?? 0 })} /></div>
        ))}
        <div className={cn("flex items-center justify-between rounded-md border p-3 text-sm", total === 100 ? "border-success/40 bg-success/10 text-success" : "border-destructive/40 bg-destructive/10 text-destructive")}>
          <span>Total</span><b className="font-mono">{total}%{total !== 100 && ` (${total > 100 ? "-" : "+"}${Math.abs(100 - total)}% needed)`}</b>
        </div>
        <p className="text-[10px] text-muted-foreground">No fees for rebalance • Auto-compound preserved • Settlement ~2h</p>
        <div className="flex justify-between gap-2"><Button variant="ghost" onClick={() => setDraft(alloc)}>Reset</Button><div className="flex gap-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={total !== 100} onClick={() => onSave(draft)}><RefreshCw />Apply</Button></div></div>
      </div>
    </Shell>
  );
}

/* ---------------- Calculator ---------------- */
const RATES = [{ k: "Cash", r: 5.2 }, { k: "Cloud", r: 9.4 }, { k: "Digital", r: 6.8 }, { k: "Task", r: 0 }] as const;
export function CalculatorDialog({ open, alloc, onClose, onInvest }: { open: boolean; alloc: Alloc; onClose: () => void; onInvest: (n: number) => void }) {
  const [amt, setAmt] = useState(1000);
  useEffect(() => { if (open) setAmt(1000); }, [open]);
  const blended = useMemo(() => RATES.reduce((s, x) => s + (alloc[x.k] / 100) * x.r, 0), [alloc]);
  const at = (years: number) => amt * Math.pow(1 + blended / 100 / 365, 365 * years);
  return (
    <Shell open={open} onClose={onClose} eyebrow="Simulator" title="Yield calculator" desc={`Based on your current mix at ${blended.toFixed(2)}% blended APY.`}>
      <div className="space-y-5">
        <div><div className="flex items-baseline justify-between"><Cap>Starting amount</Cap><b className="font-mono text-2xl">{money(amt)}</b></div><Slider className="mt-3" aria-label="Amount" value={[amt]} min={500} max={50000} step={500} onValueChange={([v]) => setAmt(v ?? 500)} />
          <div className="mt-2 flex gap-2">{[1000, 5000, 10000, 25000].map((p) => <button key={p} onClick={() => setAmt(p)} className={cn("rounded-full px-3 py-1 font-mono text-[10px]", amt === p ? "bg-foreground text-background" : "bg-secondary")}>{money(p).replace(".00", "")}</button>)}</div></div>
        <div className="grid grid-cols-3 gap-2">{[["Daily", amt * blended / 100 / 365], ["Monthly", at(1 / 12) - amt], ["Yearly", at(1) - amt]].map(([l, v]) => <div key={l as string} className="rounded-md border border-border bg-secondary/50 p-3"><Cap>{l}</Cap><p className="mt-2 font-mono text-sm text-success">+{money(v as number)}</p></div>)}</div>
        <div className="rounded-md border border-success/25 bg-success/10 p-4 text-sm"><p>{money(amt)} → <b className="font-mono">{money(at(1))}</b> in 12 months</p><p className="mt-1 text-xs text-muted-foreground">3 years with auto-compound: <b className="font-mono text-foreground">{money(at(3))}</b></p></div>
        <div className="space-y-1">{RATES.map((x) => <div key={x.k} className="flex justify-between text-[11px]"><span className="text-muted-foreground">{x.k} · {alloc[x.k]}% @ {x.r}%</span><span className="font-mono">{money(amt * alloc[x.k] / 100)}</span></div>)}</div>
        <p className="text-[10px] text-muted-foreground">Estimates only. Rates change and are not guaranteed.</p>
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={onClose}>Close</Button><Button onClick={() => onInvest(amt)}>Invest {money(amt).replace(".00", "")}<ArrowUpRight /></Button></div>
      </div>
    </Shell>
  );
}

/* ---------------- Task ---------------- */
export function TaskDialog({ flow, onClose, onComplete }: { flow: Flow; onClose: () => void; onComplete: (title: string, reward: number) => void }) {
  const open = flow?.kind === "task";
  const items = ["Organic oat milk 1L", "Wireless earbuds case", "Ceramic coffee mug", "Running shoe, size 42"];
  const labels = ["Grocery", "Electronics", "Home", "Apparel"];
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => { if (open) { setStep(0); setPicked(null); } }, [open]);
  if (!open) return <Shell open={false} onClose={onClose} eyebrow="" title="" desc="">{null}</Shell>;
  const done = step >= items.length;
  return (
    <Shell open onClose={onClose} eyebrow="AI Task Work" title={flow.title} desc={`Zero capital risk · ${money(flow.reward)} on verification · paid in USDC`}>
      {!done ? <div className="space-y-4">
        <div className="flex justify-between text-[11px] text-muted-foreground"><span>Item {step + 1} of {items.length}</span><span>{Math.round((step / items.length) * 100)}%</span></div>
        <div className="h-1 overflow-hidden rounded-full bg-secondary"><span className="block h-full bg-success transition-all" style={{ width: `${(step / items.length) * 100}%` }} /></div>
        <div className="rounded-md border border-border bg-background/40 p-6 text-center"><Sparkles className="mx-auto size-5 text-success" /><p className="mt-3 text-sm font-medium">“{items[step]}”</p><p className="mt-1 text-[11px] text-muted-foreground">Pick the correct category</p></div>
        <div className="grid grid-cols-2 gap-2">{labels.map((l) => <button key={l} onClick={() => setPicked(l)} className={cn("rounded-md border p-3 text-sm", picked === l ? "border-success/50 bg-success/10" : "border-border")}>{l}</button>)}</div>
        <Button className="w-full" disabled={!picked} onClick={() => { setStep(step + 1); setPicked(null); }}>{step === items.length - 1 ? "Submit for verification" : "Next"}</Button>
      </div> : <div className="space-y-4 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success"><Check className="size-6" /></span>
        <p className="text-lg font-semibold">Task verified</p><p className="font-mono text-3xl text-success">+{money(flow.reward)}</p>
        <p className="text-xs text-muted-foreground">Payout sent to your Available Cash balance.</p>
        <Button className="w-full" onClick={() => onComplete(flow.title, flow.reward)}><Zap />Collect payout</Button>
      </div>}
    </Shell>
  );
}

/* ---------------- Vault deep-dive ---------------- */
export function VaultDetailDialog({ vault, onClose, onDeposit, onNotice }: { vault: VaultInfo | null; onClose: () => void; onDeposit: (name: string) => void; onNotice: Notice }) {
  const bars = [62, 70, 66, 74, 71, 78, 82, 76, 85, 88, 84, 90];
  return (
    <Shell open={!!vault} onClose={onClose} eyebrow="Vault deep-dive" title={vault?.name ?? ""} desc={vault?.detail ?? ""}>
      {vault && <div className="space-y-5">
        <div className="grid grid-cols-3 gap-2">{[["Rate", `${vault.rate}`], ["Risk", vault.risk], ["Your balance", vault.balance]].map(([l, v]) => <div key={l} className="rounded-md border border-border bg-secondary/50 p-3"><Cap>{l}</Cap><p className="mt-2 truncate font-mono text-xs font-semibold">{v}</p></div>)}</div>
        <div><div className="mb-2 flex justify-between"><Cap>12-month yield history</Cap><span className="font-mono text-[10px] text-success">+ trending</span></div><div className="flex h-20 items-end gap-1">{bars.map((b, i) => <span key={i} className={cn("flex-1 rounded-t", `bar-${vault.accent}`)} style={{ height: `${b}%` }} />)}</div></div>
        <div><div className="mb-1 flex justify-between text-[11px]"><span className="text-muted-foreground">Utilization</span><b className="font-mono">68%</b></div><div className="h-1.5 rounded-full bg-secondary"><span className="block h-full w-[68%] rounded-full bg-success" /></div></div>
        <ul className="space-y-2 text-[11px] text-muted-foreground">
          <li className="flex gap-2"><ShieldCheck className="size-3.5 shrink-0 text-success" />Institutional-grade custody · audited smart contracts</li>
          <li className="flex gap-2"><LockKeyhole className="size-3.5 shrink-0" />Terms: {vault.terms}</li>
          <li className="flex gap-2"><Check className="size-3.5 shrink-0" />On-chain audit • tx: 0x9f…e21a</li>
        </ul>
        <div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => onNotice("Audit report opened (preview)")}>View audit</Button><Button onClick={() => onDeposit(vault.name)}>Add funds<ArrowUpRight /></Button></div>
      </div>}
    </Shell>
  );
}

/* ---------------- CSV ---------------- */
export function exportLedgerCsv(rows: Array<{ title: string; value: string; meta: string }>) {
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const csv = ["Description,Amount,Details", ...rows.map((r) => [r.title, r.value, r.meta].map(esc).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url; a.download = "depvest-transactions.csv"; a.click();
  URL.revokeObjectURL(url);
}
