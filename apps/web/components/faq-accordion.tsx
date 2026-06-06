"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is included in a Bay Suites stay?",
    answer:
      "Every residence is fully furnished and professionally prepared with linens, essential supplies, a complete kitchen, Wi-Fi, and responsive guest support."
  },
  {
    question: "Can I book for a month or longer?",
    answer:
      "Yes. Our search supports short and extended stays. Corporate and relocation guests can also request tailored billing, extensions, and multi-property accommodation."
  },
  {
    question: "How do you manage properties for owners?",
    answer:
      "We coordinate listing distribution, pricing, guest communication, screening, turnover, maintenance, inspections, and transparent owner reporting."
  },
  {
    question: "When is my reservation confirmed?",
    answer:
      "Your reservation is confirmed after checkout succeeds and you receive a Bay Suites confirmation number. The guest portal then keeps your stay details together."
  }
];

export function FAQAccordion() {
  const [active, setActive] = useState(0);

  return (
    <section className="section-pad bg-[#fbfaf7]">
      <div className="container-wide grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">Good to know</p>
          <h2 className="mt-5 max-w-md font-display text-5xl leading-none md:text-7xl">
            Clear answers before you arrive.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-ink/55">
            The practical details guests and owners ask about most, kept simple and easy to find.
          </p>
        </div>
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((faq, index) => {
            const open = active === index;
            return (
              <button
                key={faq.question}
                type="button"
                onClick={() => setActive(open ? -1 : index)}
                className="block w-full py-7 text-left"
                aria-expanded={open}
              >
                <span className="flex items-center gap-6">
                  <span className="text-[10px] font-bold text-champagne">0{index + 1}</span>
                  <strong className="flex-1 font-display text-2xl font-medium md:text-3xl">{faq.question}</strong>
                  <motion.span animate={{ rotate: open ? 45 : 0 }} className="grid h-10 w-10 place-items-center rounded-full border border-ink/15">
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </span>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-10 max-w-2xl overflow-hidden pr-14 pt-5 text-sm leading-7 text-ink/55"
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
