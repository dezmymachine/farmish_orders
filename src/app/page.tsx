import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ClipboardList, PackageCheck, SearchCheck, Truck, Wheat } from "lucide-react"
import Navbar from "@/components/Navbar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const trustItems = [
  { title: "Local sourcing", text: "Produce sourced from trusted Ghanaian farms.", icon: SearchCheck },
  { title: "Quote before payment", text: "Review the full quote before you commit.", icon: ClipboardList },
  { title: "Fresh produce", text: "Vegetables, grains, spices, tubers, oils and more.", icon: Wheat },
  { title: "Bulk orders supported", text: "Built for homes, restaurants, caterers and vendors.", icon: PackageCheck },
]

const steps = [
  ["1", "Tell us what you need", "Choose produce, quantities, custom items and delivery notes."],
  ["2", "We review availability", "Farmish checks source location, availability and transport."],
  ["3", "Receive a clear quote", "Get item prices, service fee, transport and notes in one place."],
  ["4", "Confirm and receive", "Approve the quote and track your order through delivery."],
]

const categories = [
  ["Vegetables", "Tomatoes, onions, okro, garden eggs"],
  ["Grains & Cereals", "Maize, tombrown and staple grains"],
  ["Tubers & Roots", "Cassava, cassava dough and local staples"],
  ["Spices & Herbs", "Ginger, garlic, local spices, waakye leaves"],
  ["Fruits", "Plantain, watermelon and seasonal produce"],
  ["Oils & Condiments", "Palm oil, soya sauce and kitchen essentials"],
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-ink)]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden px-5 py-10 md:px-8 md:py-20">
          <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="max-w-2xl">
              <h1 className="text-[42px] font-bold leading-[1.05] tracking-tight text-[var(--color-deep-leaf)] sm:text-5xl lg:text-[64px]">
                Fresh produce sourcing made simple
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-muted-leaf)] sm:text-lg">
                Order vegetables, grains, spices, and other farm produce directly from trusted Ghanaian farms. Submit your request, receive a clear quote, and confirm when you are ready.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/order" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-farm-green)] px-6 text-sm font-semibold text-white shadow-[var(--shadow-md)] transition-all hover:bg-[var(--color-deep-leaf)] focus-visible:ring-4 focus-visible:ring-ring/15">
                  Place an order <ArrowRight size={17} />
                </Link>
                <a href="#how-it-works" className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--color-field-border)] bg-white px-6 text-sm font-semibold text-[var(--color-farm-green)] transition-all hover:bg-[var(--color-fresh-mist)] focus-visible:ring-4 focus-visible:ring-ring/15">
                  How it works
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[28px] border border-[var(--color-field-border)] bg-[var(--color-fresh-mist)] shadow-[var(--shadow-lg)]">
                <Image
                  src="/group_farmers.jpg"
                  alt="Ghanaian farmers with fresh produce"
                  width={720}
                  height={620}
                  priority
                  className="h-[360px] w-full object-cover object-center sm:h-[460px]"
                />
              </div>
              <div className="absolute -bottom-5 left-5 right-5 rounded-[24px] border border-[var(--color-field-border)] bg-white/95 p-4 shadow-[var(--shadow-md)] backdrop-blur sm:left-auto sm:w-80">
                <p className="text-xs font-bold uppercase tracking-tight text-[var(--color-muted-leaf)]">Current request</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span>Tomatoes</span><span className="font-semibold">25 kg</span></div>
                  <div className="flex justify-between"><span>Plantain</span><span className="font-semibold">10 bunches</span></div>
                  <div className="flex justify-between"><span>Ginger</span><span className="font-semibold">5 kg</span></div>
                </div>
                <div className="mt-4 rounded-2xl bg-[var(--color-harvest-cream)] px-3 py-2 text-sm font-medium text-[var(--color-soil-brown)]">
                  Farmish reviews availability and sends a quote.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--color-field-border)] bg-white px-5 py-10 md:px-8" aria-label="Trust indicators">
          <div className="mx-auto grid max-w-[1180px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-[20px] border border-[var(--color-field-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
                <Icon className="mb-4 text-[var(--color-farm-green)]" size={24} />
                <h2 className="text-base font-semibold text-[var(--color-deep-leaf)]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted-leaf)]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="bg-[var(--color-fresh-mist)] px-5 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-[1180px]">
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-tight text-[var(--color-farm-green)]">How it works</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-deep-leaf)] md:text-4xl">A request-and-quote flow built for real produce sourcing.</h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {steps.map(([number, title, text]) => (
                <div key={number} className="rounded-[24px] border border-[var(--color-field-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-farm-green)] text-sm font-bold text-white">{number}</span>
                  <h3 className="mt-5 text-lg font-semibold text-[var(--color-deep-leaf)]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted-leaf)]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="produce" className="px-5 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-[1180px]">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-tight text-[var(--color-farm-green)]">Produce categories</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-deep-leaf)] md:text-4xl">Order staples, fresh produce and custom items.</h2>
              </div>
              <Link href="/order" className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-field-border)] bg-white px-5 text-sm font-semibold text-[var(--color-farm-green)] transition-all hover:bg-[var(--color-fresh-mist)] focus-visible:ring-4 focus-visible:ring-ring/15">
                View produce list
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(([title, text]) => (
                <div key={title} className="rounded-[20px] border border-[var(--color-field-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-fresh-mist)] text-[var(--color-farm-green)]">
                    <Wheat size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-deep-leaf)]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted-leaf)]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-white px-5 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--color-deep-leaf)] md:text-4xl">Frequently asked questions</h2>
            <Accordion className="mt-8" defaultValue={["pricing"]}>
              {[
                ["pricing", "Why are there no prices on the order form?", "Farmish reviews availability, source location and delivery requirements before sending a clear quote."],
                ["payment", "When do I pay?", "You receive and review the quote first. No payment is taken inside the request form."],
                ["custom", "Can I request items that are not listed?", "Yes. Use the custom item option in the order form and include the quantity and unit you need."],
              ].map(([value, question, answer]) => (
                <AccordionItem key={value} value={value}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="px-5 py-14 md:px-8 md:py-20">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-6 rounded-[28px] bg-[var(--color-farm-green)] p-7 text-white shadow-[var(--shadow-lg)] md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Ready to source produce?</h2>
              <p className="mt-2 max-w-xl text-white/80">Submit your request today and Farmish will prepare a clear quote for review.</p>
            </div>
            <Link href="/order" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[var(--color-farm-green)] transition-all hover:bg-[var(--color-fresh-mist)] focus-visible:ring-4 focus-visible:ring-white/30">
              Place an order <Truck size={17} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
