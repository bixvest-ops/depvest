import { useState, type ReactNode } from "react";
import {
  AlertTriangle, ArrowDownToLine, BookOpen, Building2, Check, Clock, FileText, HelpCircle, LifeBuoy, Mail,
  MessageCircle, MessagesSquare, Scale, Search, Send, ShieldCheck, Sparkles, Upload, WalletCards, Zap,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pct, rewardRange, UNCONFIGURED, type Terms } from "./terms";

const Eyebrow = ({ children }: { children: ReactNode }) => <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{children}</span>;
function Intro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <div className="mb-8 max-w-2xl md:mb-10"><Eyebrow>{eyebrow}</Eyebrow><h1 className="mt-4 text-3xl font-semibold sm:text-4xl md:text-[44px]">{title}</h1><p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{copy}</p></div>;
}
const Card = ({ children, className }: { children: ReactNode; className?: string }) => <div className={cn("rounded-[14px] border border-border bg-card p-5 md:p-6", className)}>{children}</div>;
export function Unconfigured({ label = UNCONFIGURED }: { label?: string }) {
  return <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-muted-foreground/40 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground"><AlertTriangle className="size-2.5" />{label}</span>;
}
const Val = ({ v }: { v: string | null }) => (v ? <span>{v}</span> : <Unconfigured />);

/* ---------------- How It Works ---------------- */
const steps = [
  { icon: WalletCards, title: "Connect & fund", copy: "The intended product flow is to connect a self-custody wallet and deposit USDC. This preview simulates the steps locally; it does not connect to a wallet or move funds." },
  { icon: Scale, title: "Choose a target mix", copy: "Choose how a portfolio could be split between Treasury bills, compute, and digital-asset staking. Rebalance changes the target mix in this preview, not real holdings." },
  { icon: Building2, title: "Understand the sources", copy: "The strategies are designed around interest, hardware rental, or blockchain staking rewards. No live deployment, counterparties, or realized yields are verified by this demo." },
  { icon: ArrowDownToLine, title: "Track & withdraw", copy: "The ledger and settlement timers demonstrate how activity could appear. Actual availability, payout timing, and withdrawal terms would depend on a live product and its official terms." },
];
const yieldSources = [
  { title: "Treasury cash", label: "Interest on short-term government debt", copy: "In this strategy model, returns would come from interest paid on short-dated U.S. Treasury bills. Treasury securities are obligations of the U.S. government, but their value, access timing, and any fund or custody arrangement still carry risks. This preview does not hold Treasury bills." },
  { title: "AI cloud compute", label: "Fees for renting computing hardware", copy: "The proposed model earns revenue by financing or operating servers and renting computing capacity to customers. Rental income can fall if demand or prices drop, or hardware is idle, damaged, or costly to run. No servers or rental contracts are connected to this preview." },
  { title: "Blue-chip digital assets", label: "Protocol rewards and transaction fees", copy: "The proposed model would stake assets such as ETH or SOL. A network may distribute token rewards and transaction fees, but reward rates and token prices can change; technical, slashing, and unstaking risks can apply. This preview does not stake assets." },
  { title: "Active Earn", label: "Payment for completed microtasks", copy: "This is work, not an investment: a business would pay for accepted tasks such as reviewing or labeling data, and a platform could pay workers a share. Task availability, acceptance, and payment depend on actual contracts. No task marketplace is connected here." },
];
export function HowItWorks({ terms, onStart }: { terms: Terms; onStart: () => void }) {
  return (
    <section>
      <Intro eyebrow="How It Works" title="Where returns are intended to come from." copy="DepVest is designed as a digital asset manager: a target mix would spread capital across strategies that aim to earn interest, hardware-rental income, or staking rewards. Returns are not free or guaranteed. This app is a local preview only—no money is invested, and no live assets, contracts, or payouts are connected." />
      <Card className="mb-6 border-warning/30 bg-warning/5">
        <h2 className="text-sm font-semibold">What you are looking at</h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Balances, transfers, settlement timers, and strategy projections in this demo are simulated in your browser. They do not prove that assets are held, revenue has been earned, or withdrawals can be made. Rates are estimates, can change, and do not guarantee a return or protect your principal.</p>
      </Card>
      <h2 className="mb-3 text-base font-semibold">Four proposed sources of income</h2>
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {yieldSources.map((source) => <Card key={source.title} className="h-full"><Eyebrow>{source.label}</Eyebrow><h3 className="mt-2 text-sm font-semibold">{source.title}</h3><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{source.copy}</p></Card>)}
      </div>
      <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map(({ icon: Icon, title, copy }, i) => (
          <li key={title}><Card className="h-full"><div className="flex items-center justify-between"><span className="vault-icon accent-cash"><Icon className="size-5" /></span><span className="font-mono text-xs text-muted-foreground">0{i + 1}</span></div><h2 className="mt-6 text-base font-semibold">{title}</h2><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{copy}</p></Card></li>
        ))}
      </ol>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <Eyebrow>How the platform could earn</Eyebrow>
          <h2 className="mt-2 text-sm font-semibold">Fees tied to activity</h2>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
            <li><b className="text-foreground">Performance fee:</b> The stated model is 10% of positive yield; for $100 of eligible yield, an investor would keep $90 and the platform would receive $10. If there is no positive yield, this fee would be $0, subject to the actual fee terms.</li>
            <li><b className="text-foreground">Task marketplace:</b> A platform may retain a disclosed difference between what a client pays and what a worker receives. For example, $0.60 from a client and $0.40 to a worker leaves $0.20 before operating costs; these are illustrative numbers, not current contracts or task rates.</li>
            <li><b className="text-foreground">Express withdrawal:</b> The proposed fee schedule describes a 1.5% charge for express liquidity; standard timing and fees must be confirmed in official terms before use.</li>
          </ul>
        </Card>
        <Card>
          <Eyebrow>Why rebalance?</Eyebrow>
          <h2 className="mt-2 text-sm font-semibold">Balance different kinds of risk</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Treasury exposure, compute rental, and digital-asset staking have different sources of income and different risks. A target mix lets an investor choose the balance they want; it cannot remove risk or ensure a specific return.</p>
          <div className="mt-3 space-y-2 text-xs">
            <p className="rounded-md border border-border bg-background/40 p-3"><b>Illustrative conservative mix:</b> 75% Treasury · 15% compute · 10% digital assets.</p>
            <p className="rounded-md border border-border bg-background/40 p-3"><b>Illustrative balanced mix:</b> 40% Treasury · 35% compute · 25% digital assets.</p>
            <p className="text-[10px] text-muted-foreground">Examples only. A blended estimate depends on current, verified rates and fees; it is not a promise or forecast.</p>
          </div>
        </Card>
      </div>
      <Card className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div><Eyebrow>Rates currently configured in this preview</Eyebrow>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {([["Treasury cash", pct(terms.apy.Cash)], ["AI compute", pct(terms.apy.Cloud)], ["Blue-chip", pct(terms.apy.Digital)], ["Task reward", rewardRange(terms.taskReward)]] as const).map(([k, v]) => (
              <div key={k} className="rounded-md border border-border bg-background/40 p-3"><p className="text-[10px] text-muted-foreground">{k}</p><div className="mt-1 font-mono text-sm">{v === UNCONFIGURED ? <Unconfigured /> : v}</div></div>
            ))}
          </div>
        </div>
        <Button className="rounded-full" onClick={onStart}><Zap />Explore vaults</Button>
      </Card>
    </section>
  );
}

/* ---------------- Q&A ---------------- */
export function FAQ({ terms, onSupport }: { terms: Terms; onSupport: () => void }) {
  const [q, setQ] = useState("");
  const list = terms.faqs.filter((f) => (f.q + f.a).toLowerCase().includes(q.toLowerCase()));
  return (
    <section>
      <Intro eyebrow="Questions & Answers" title="Answers from the official terms." copy="Every answer here is taken from verified product documents. Until those are published, this page stays empty rather than guessing." />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          {terms.faqs.length === 0 ? (
            <Card className="text-center"><span className="mx-auto vault-icon accent-digital"><FileText className="size-5" /></span><p className="mt-4 text-sm font-semibold">Answers not configured yet</p><p className="mx-auto mt-2 max-w-sm text-xs text-muted-foreground">Official answers will appear once verified product terms are reviewed and applied by an admin.</p><div className="mt-3"><Unconfigured label="Awaiting verified terms" /></div></Card>
          ) : (<>
            <div className="mb-4 flex items-center gap-3 rounded-md border border-border bg-card px-4"><Search className="size-4 shrink-0 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions" className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></div>
            <Accordion type="single" collapsible className="rounded-[14px] border border-border bg-card px-5">
              {list.map((f) => <AccordionItem key={f.q} value={f.q} className="border-border"><AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger><AccordionContent className="text-xs leading-relaxed text-muted-foreground">{f.a}</AccordionContent></AccordionItem>)}
              {list.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">No matching questions.</p>}
            </Accordion>
          </>)}
        </div>
        <aside className="h-fit rounded-[14px] border border-border bg-card p-6"><span className="vault-icon accent-digital"><HelpCircle className="size-5" /></span><p className="mt-5 text-sm font-semibold">Still have questions?</p><p className="mt-2 text-xs text-muted-foreground">Reach the support team by chat, email or community channels.</p><Button className="mt-5 w-full rounded-full" onClick={onSupport}>Open Support</Button></aside>
      </div>
    </section>
  );
}

/* ---------------- About ---------------- */
export function About() {
  const pillars = [
    { icon: Building2, t: "Treasury-backed cash", c: "Short-duration government debt exposure held as dollar-denominated stable value." },
    { icon: Sparkles, t: "AI compute revenue", c: "Exposure to contracted GPU/CPU capacity rented to enterprise workloads." },
    { icon: ShieldCheck, t: "Blue-chip digital assets", c: "Staking participation in large, established proof-of-stake networks." },
    { icon: Zap, t: "Active earn", c: "Paid micro-tasks such as dataset validation — no capital required." },
  ];
  return (
    <section>
      <Intro eyebrow="About DepVest" title="One hub for real-world and on-chain yield." copy="DepVest brings several independent yield sources into a single dashboard, so investors can see, allocate and track their capital without juggling multiple platforms." />
      <div className="grid gap-4 md:grid-cols-2">{pillars.map(({ icon: Icon, t, c }) => <Card key={t}><span className="vault-icon accent-cash"><Icon className="size-5" /></span><h2 className="mt-5 text-base font-semibold">{t}</h2><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c}</p></Card>)}</div>
      <Card className="mt-6"><Eyebrow>Our principles</Eyebrow><ul className="mt-4 grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">{["Transparency — no figure is shown until it is verified.", "Self-custody first — you connect your own wallet.", "Clear risk — every vault states its risk and liquidity terms."].map((p) => <li key={p} className="flex gap-2"><Check className="size-3.5 shrink-0 text-success" />{p}</li>)}</ul></Card>
    </section>
  );
}

/* ---------------- Rules ---------------- */
export function Rules({ terms }: { terms: Terms }) {
  const sections = [
    { t: "Eligibility & verification", items: ["You must be of legal age in your jurisdiction.", "Identity verification may be required before deposits or withdrawals above set limits.", "Services are unavailable where prohibited by law."] },
    { t: "Deposits & withdrawals", items: ["Only USDC on supported networks is accepted.", "Sending unsupported assets or using the wrong network may result in permanent loss.", "Withdrawals go only to a valid wallet address you control."] },
    { t: "Allocation & rebalancing", items: ["Target mixes must total exactly 100%.", "Rebalances apply at the next settlement window.", "Vault-specific lockups or epochs apply as stated in the product terms."] },
    { t: "Active Earn conduct", items: ["One account per person; automated or duplicate submissions are prohibited.", "Rewards are paid only for tasks that pass verification.", "Fraudulent activity leads to forfeited rewards and account suspension."] },
  ];
  const fees: Array<[string, string | null]> = [["Deposit fee", terms.fees.deposit], ["Withdrawal fee", terms.fees.withdrawal], ["Performance fee", terms.fees.performance], ["Rebalance fee", terms.fees.rebalance]];
  return (
    <section>
      <Intro eyebrow="Rules & Policies" title="The rules that keep DepVest fair." copy="Please read these before investing. Official legal terms take precedence over this summary." />
      <div className="grid gap-4 md:grid-cols-2">{sections.map((s) => <Card key={s.t}><h2 className="text-sm font-semibold">{s.t}</h2><ul className="mt-3 space-y-2 text-xs text-muted-foreground">{s.items.map((i) => <li key={i} className="flex gap-2"><Check className="mt-0.5 size-3 shrink-0 text-success" />{i}</li>)}</ul></Card>)}</div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card><h2 className="text-sm font-semibold">Fee schedule</h2><div className="mt-3 divide-y divide-border text-xs">{fees.map(([k, v]) => <div key={k} className="flex items-center justify-between py-2.5"><span className="text-muted-foreground">{k}</span><Val v={v} /></div>)}</div></Card>
        <Card className="border-destructive/30"><h2 className="flex items-center gap-2 text-sm font-semibold"><AlertTriangle className="size-4 text-destructive" />Risk disclosure</h2><p className="mt-3 text-xs leading-relaxed text-muted-foreground">All investments carry risk, including loss of principal. Yields are variable and not guaranteed. Digital assets are volatile, smart contracts can fail, and past performance does not predict future results. Only invest what you can afford to lose.</p></Card>
      </div>
    </section>
  );
}

/* ---------------- Support ---------------- */
export function Support({ onNotice, onFaq }: { onNotice: (m: string) => void; onFaq: () => void }) {
  const channels = [
    { icon: MessageCircle, t: "Live Chat", c: "Talk to the support team in the app.", sla: "Contact details unconfigured", cta: "Start chat" },
    { icon: Mail, t: "Email", c: "For account, deposit and withdrawal cases.", sla: "Address unconfigured", cta: "Email support" },
    { icon: Send, t: "Telegram", c: "Official announcements and community help.", sla: "Link unconfigured", cta: "Open Telegram" },
    { icon: MessagesSquare, t: "Discord", c: "Community discussion and product updates.", sla: "Link unconfigured", cta: "Open Discord" },
  ];
  const links = ["How do deposits work?", "Withdrawal timing", "Fees & rates", "Account security"];
  return (
    <section>
      <Intro eyebrow="Support Team" title="We're here to help." copy="Choose the channel that suits you. Official DepVest staff will never ask for your seed phrase or private keys." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{channels.map(({ icon: Icon, t, c, sla, cta }) => (
        <Card key={t} className="flex flex-col"><span className="vault-icon accent-digital"><Icon className="size-5" /></span><h2 className="mt-5 text-sm font-semibold">{t}</h2><p className="mt-2 flex-1 text-xs text-muted-foreground">{c}</p><div className="mt-3"><Unconfigured label={sla} /></div><Button variant="outline" className="mt-4 rounded-full" onClick={() => onNotice(`${t} isn't set up yet`)}>{cta}</Button></Card>
      ))}</div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card><h2 className="flex items-center gap-2 text-sm font-semibold"><BookOpen className="size-4" />Quick answers</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{links.map((l) => <button key={l} onClick={onFaq} className="flex items-center justify-between rounded-md border border-border bg-background/40 p-3 text-left text-xs hover:border-success/40">{l}<HelpCircle className="size-3.5 text-muted-foreground" /></button>)}</div></Card>
        <Card><h2 className="flex items-center gap-2 text-sm font-semibold"><Clock className="size-4" />Response times</h2><p className="mt-3 text-xs text-muted-foreground">Service hours and response targets will be published here.</p><div className="mt-3"><Unconfigured label="Hours unconfigured" /></div><p className="mt-4 flex gap-2 text-[11px] text-muted-foreground"><LifeBuoy className="size-3.5 shrink-0 text-success" />Never share your seed phrase with anyone.</p></Card>
      </div>
    </section>
  );
}
