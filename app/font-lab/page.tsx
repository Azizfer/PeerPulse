import "@fontsource/poppins/600.css"
import "@fontsource/poppins/700.css"
import "@fontsource/poppins/800.css"
import "@fontsource-variable/figtree"
import "@fontsource-variable/outfit"
import "@fontsource-variable/manrope"
import "@fontsource-variable/nunito"
import "@fontsource-variable/plus-jakarta-sans"

import Link from "next/link"

const CANDIDATES = [
  { name: "Poppins", stack: "Poppins, sans-serif", note: "Default right now — rounded, geometric, friendly" },
  { name: "Figtree", stack: "Figtree, sans-serif", note: "Geometric-humanist, a bit more editorial" },
  { name: "Outfit", stack: "Outfit, sans-serif", note: "Tight geometric, close to the Gilroy look" },
  { name: "Manrope", stack: "Manrope, sans-serif", note: "Semi-geometric, calmer and wider" },
  { name: "Nunito", stack: "Nunito, sans-serif", note: "Rounded terminals, softest of the six" },
  { name: "Plus Jakarta Sans", stack: '"Plus Jakarta Sans Variable", sans-serif', note: "What the site used before" },
]

export const metadata = {
  title: "Wordmark font lab · PeerPulse",
}

export default function FontLab() {
  return (
    <main className="min-h-screen bg-paper px-5 py-12 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <p className="eyebrow">Temporary page</p>
        <h1 className="mt-3 font-display text-h3 font-extrabold text-ink">
          Pick the PeerPulse wordmark font
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
          I can&apos;t read Flow Club&apos;s CSS from here, so this is the fastest way to
          match it: open{" "}
          <a
            href="https://www.flow.club/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-pulse-dark underline decoration-pulse/40 underline-offset-4"
          >
            flow.club
          </a>{" "}
          in another tab, compare the wordmark, and tell me the name. It&apos;s a one-line
          change after that.
        </p>

        <div className="mt-10 space-y-6">
          {CANDIDATES.map((f, i) => (
            <div
              key={f.name}
              className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft"
            >
              <div className="flex items-center justify-between gap-4 border-b border-line bg-surface-sunken/60 px-6 py-3">
                <div>
                  <span className="font-display text-[15px] font-bold text-ink">
                    {i + 1}. {f.name}
                  </span>
                  <span className="ml-3 text-[13px] text-ink-mute">{f.note}</span>
                </div>
              </div>

              {/* Light background */}
              <div className="px-6 py-7">
                <div className="flex flex-wrap items-end gap-x-10 gap-y-6">
                  {[22, 32, 44].map((px) => (
                    <span
                      key={px}
                      style={{ fontFamily: f.stack, fontSize: px, fontWeight: 700 }}
                      className="leading-none tracking-[-0.04em] text-ink"
                    >
                      PeerPulse
                    </span>
                  ))}
                </div>
                <p
                  style={{ fontFamily: f.stack, fontWeight: 700 }}
                  className="mt-6 text-[26px] leading-[1.05] tracking-[-0.035em] text-ink"
                >
                  Fight procrastination. Get your work done.
                </p>
              </div>

              {/* Dark background — the footer wordmark */}
              <div className="bg-ink px-6 py-7">
                <div className="flex flex-wrap items-end gap-x-10 gap-y-6">
                  {[22, 32, 44].map((px) => (
                    <span
                      key={px}
                      style={{ fontFamily: f.stack, fontSize: px, fontWeight: 700 }}
                      className="leading-none tracking-[-0.04em] text-white"
                    >
                      PeerPulse
                    </span>
                  ))}
                </div>
                <p
                  style={{ fontFamily: f.stack, fontWeight: 700 }}
                  className="mt-6 text-[26px] leading-[1.05] tracking-[-0.035em] text-white"
                >
                  Fight procrastination. Get your work done.
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-line bg-surface p-6">
          <h2 className="font-display text-[17px] font-bold text-ink">
            Want it lowercase instead?
          </h2>
          <div className="mt-4 flex flex-wrap items-end gap-x-10 gap-y-5">
            {CANDIDATES.slice(0, 3).map((f) => (
              <div key={f.name}>
                <span
                  style={{ fontFamily: f.stack, fontSize: 34, fontWeight: 700 }}
                  className="leading-none tracking-[-0.03em] text-ink"
                >
                  peerpulse
                </span>
                <span className="ml-3 text-[12px] uppercase tracking-[0.12em] text-ink-faint">
                  {f.name}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[13.5px] leading-relaxed text-ink-mute">
            Flow Club&apos;s own wordmark is lowercase — say the word and I&apos;ll switch
            PeerPulse to all-lowercase too.
          </p>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex text-[14px] font-medium text-pulse-dark hover:underline"
        >
          ← Back to the site
        </Link>
      </div>
    </main>
  )
}
