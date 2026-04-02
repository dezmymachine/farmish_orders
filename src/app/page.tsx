// SETUP: Place the hero image at /public/group_farmers.jpg
// The image file has been provided by the client.

import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/Navbar"

export default function Home() {
  return (
    <div className="bg-[#F7F5F0]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-[48px] md:pt-[56px]">
        {/* Desktop: two-column 50/50 */}
        <div className="hidden md:grid grid-cols-[1fr_1fr]">
          {/* LEFT COLUMN — text */}
          <div className="min-h-[calc(100vh-56px)] bg-[#F7F5F0] flex flex-col justify-center px-16 py-20">
            {/* Top label */}
            <div className="flex items-center mb-6">
              <div className="border-l-2 border-[#2D5016] h-6 pl-3">
                <span className="font-heading font-semibold text-[13px] tracking-[0.2em] text-[#2D5016] uppercase">
                  FRESH FROM THE FARM
                </span>
              </div>
            </div>

            {/* Decorative horizontal rule */}
            <div className="w-full h-0.5 bg-[#D9D4C7] my-6"></div>

            {/* Main heading */}
            <h1 className="mb-6">
              <span
                className="font-heading font-bold uppercase block leading-[0.9] text-[#0F0F0F]"
                style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
              >
                ORDER FRESH
              </span>
              <span
                className="font-heading font-bold uppercase block leading-[0.9] text-[#0F0F0F]"
                style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
              >
                PRODUCE
              </span>
              <span
                className="font-heading font-bold uppercase block leading-[0.9] text-[#2D5016]"
                style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
              >
                DIRECTLY
              </span>
            </h1>

            {/* Body text */}
            <p className="text-[#5C5751] text-base leading-[1.7] max-w-[420px] mb-10 font-sans font-normal">
              We source the freshest vegetables, grains, spices, and more directly from Ghanaian farms.
              Place your order, we review it, and send you a quote — simple and transparent.
            </p>

            {/* CTA block */}
            <div>
              <Link
                href="/order"
                className="inline-block bg-[#0F0F0F] text-white font-heading font-bold text-[15px] tracking-widest uppercase px-8 py-4 border-2 border-[#0F0F0F] hover:bg-[#2D5016] hover:border-[#2D5016] transition-colors duration-150 rounded-none"
              >
                PLACE AN ORDER
              </Link>
              <p className="text-[#9C9690] text-[13px] mt-3 font-sans font-normal">
                Sign in or create a free account to get started
              </p>
            </div>

            {/* Trust strip */}
            <div className="flex items-center gap-6 mt-16">
              <div className="flex flex-col items-center">
                <span className="font-heading font-bold text-[28px] text-[#0F0F0F]">24+</span>
                <span className="font-heading font-medium text-[10px] tracking-[0.15em] text-[#9C9690] uppercase">
                  PRODUCT VARIETIES
                </span>
              </div>
              <div className="w-px h-8 bg-[#D9D4C7]"></div>
              <div className="flex flex-col items-center">
                <span className="font-heading font-bold text-[28px] text-[#0F0F0F]">48H</span>
                <span className="font-heading font-medium text-[10px] tracking-[0.15em] text-[#9C9690] uppercase">
                  QUOTE TURNAROUND
                </span>
              </div>
              <div className="w-px h-8 bg-[#D9D4C7]"></div>
              <div className="flex flex-col items-center">
                <span className="font-heading font-bold text-[28px] text-[#0F0F0F]">100%</span>
                <span className="font-heading font-medium text-[10px] tracking-[0.15em] text-[#9C9690] uppercase">
                  LOCAL SOURCING
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — image */}
          <div className="relative overflow-hidden min-h-[calc(100vh-56px)]">
            <Image
              src="/group_farmers.jpg"
              alt="Group of Ghanaian farmers with fresh produce"
              fill
              className="object-cover"
              style={{ objectPosition: "center top" }}
              priority
            />
            {/* Editorial border line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2D5016] z-10"></div>
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="md:hidden">
          {/* Image first */}
          <div className="relative w-full h-[55vw] min-h-[240px] overflow-hidden">
            <Image
              src="/group_farmers.jpg"
              alt="Group of Ghanaian farmers with fresh produce"
              fill
              className="object-cover"
              style={{ objectPosition: "center top" }}
              priority
            />
          </div>

          {/* Text content */}
          <div className="px-6 py-12 bg-[#F7F5F0]">
            {/* Top label */}
            <div className="flex items-center mb-6">
              <div className="border-l-2 border-[#2D5016] h-6 pl-3">
                <span className="font-heading font-semibold text-[13px] tracking-[0.2em] text-[#2D5016] uppercase">
                  FRESH FROM THE FARM
                </span>
              </div>
            </div>

            {/* Decorative horizontal rule */}
            <div className="w-full h-0.5 bg-[#D9D4C7] my-6"></div>

            {/* Main heading */}
            <h1 className="mb-6">
              <span className="font-heading font-bold text-[48px] uppercase block leading-[0.9] text-[#0F0F0F]">
                ORDER FRESH
              </span>
              <span className="font-heading font-bold text-[48px] uppercase block leading-[0.9] text-[#0F0F0F]">
                PRODUCE
              </span>
              <span className="font-heading font-bold text-[48px] uppercase block leading-[0.9] text-[#2D5016]">
                DIRECTLY
              </span>
            </h1>

            {/* Body text */}
            <p className="text-[#5C5751] text-base leading-[1.7] mb-10 font-sans font-normal">
              We source the freshest vegetables, grains, spices, and more directly from Ghanaian farms.
              Place your order, we review it, and send you a quote — simple and transparent.
            </p>

            {/* CTA block */}
            <div>
              <Link
                href="/order"
                className="block w-full text-center bg-[#0F0F0F] text-white font-heading font-bold text-[15px] tracking-widest uppercase px-8 py-4 border-2 border-[#0F0F0F] hover:bg-[#2D5016] hover:border-[#2D5016] transition-colors duration-150 rounded-none"
              >
                PLACE AN ORDER
              </Link>
              <p className="text-[#9C9690] text-[13px] mt-3 font-sans font-normal text-center">
                Sign in or create a free account to get started
              </p>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-4 mt-16 text-center">
              <div className="flex flex-col items-center">
                <span className="font-heading font-bold text-[24px] text-[#0F0F0F]">24+</span>
                <span className="font-heading font-medium text-[9px] tracking-[0.15em] text-[#9C9690] uppercase">
                  PRODUCT VARIETIES
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-heading font-bold text-[24px] text-[#0F0F0F]">48H</span>
                <span className="font-heading font-medium text-[9px] tracking-[0.15em] text-[#9C9690] uppercase">
                  QUOTE TURNAROUND
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-heading font-bold text-[24px] text-[#0F0F0F]">100%</span>
                <span className="font-heading font-medium text-[9px] tracking-[0.15em] text-[#9C9690] uppercase">
                  LOCAL SOURCING
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
