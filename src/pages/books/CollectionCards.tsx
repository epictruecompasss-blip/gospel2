import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { collections } from './assets';

const editionOrder = ['adult', 'teen', 'kids'] as const;
const editionLabels: Record<string, string> = {
  adult: 'Adult',
  teen: 'Teen',
  kids: 'Kids',
};

export default function CollectionCards() {
  return (
    <section id="collections" className="relative py-16 sm:py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <p className="font-cinzel text-gold-300 tracking-[0.25em] text-sm mb-3">SECTION 02</p>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white">
            Explore Every Collection
          </h2>
          <p className="mt-4 text-lg text-[#D0D3D8] max-w-2xl mx-auto leading-[1.6]">
            Three series through Scripture. Each one a doorway into the one story that changes
            everything.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((c, i) => (
            <ScrollReveal key={c.id} delay={i * 100}>
              <div
                className="rounded-2xl overflow-hidden h-full group transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(217,166,46,0.2)]"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #3A3A35' }}
              >
                <div className="relative border-b border-white/5 bg-[#0B0E15] p-3 sm:p-4">
                  <div className="grid grid-cols-3 items-end gap-2 sm:gap-3">
                    {editionOrder.map((key) => (
                      <div key={key} className="group/cover flex flex-col items-center gap-2">
                        <div className="flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-lg bg-white/[0.04] p-1.5 transition-transform duration-500 group-hover/cover:-translate-y-1">
                          <img
                            src={c.editions[key].cover}
                            alt={`${editionLabels[key]} edition of ${c.title}`}
                            loading="lazy"
                            decoding="async"
                            className="block h-full w-full object-contain"
                            style={{ filter: 'brightness(1.12) contrast(1.08)' }}
                          />
                        </div>
                        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[#D0D3D8]/70">
                          {editionLabels[key]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <p className="font-cinzel text-xs tracking-[0.2em] text-gold-300 mb-2">
                    {c.volume}
                  </p>
                  <h3 className="font-cinzel text-xl font-bold text-white mb-2">{c.title}</h3>
                  <p className="text-[#D0D3D8]/70 text-sm mb-3">{c.scripture}</p>

                  <div className="flex items-center gap-2 text-[#D0D3D8] text-sm mb-4">
                    <Clock size={14} className="text-gold-300" />
                    <span>{c.days} Days</span>
                  </div>

                  <p className="text-[#D0D3D8] text-base leading-[1.6] mb-6">{c.description}</p>

                  {/* Per-edition prices */}
                  <div className="space-y-3 mb-6">
                    <p className="font-cinzel text-xs tracking-[0.18em] text-gold-300 uppercase">
                      Available Editions
                    </p>
                    {editionOrder.map((key) => {
                      const ed = c.editions[key];
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between rounded-lg px-4 py-3"
                          style={{ border: '1px solid #3A3A35', background: 'rgba(255,255,255,0.02)' }}
                        >
                          <p className="text-white text-base font-semibold">
                            {editionLabels[key]} Edition
                          </p>
                          <div className="text-right">
                            <p className="text-gold-300 text-sm font-bold">{ed.kes}</p>
                            <p className="text-gold-200 font-bold text-lg">{ed.usd}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div
                      className="flex items-center justify-between rounded-lg px-4 py-3"
                      style={{ border: '2px solid #D9A62E', background: 'rgba(217,166,46,0.08)' }}
                    >
                      <div>
                        <p className="text-white text-sm font-bold uppercase tracking-wide">Complete Family Bundle</p>
                        <p className="text-[#D0D3D8]/70 text-xs">All 3 editions</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[#D0D3D8]/50 text-sm line-through mr-2">$30</span>
                        <span className="font-cinzel text-gold-200 font-bold text-lg whitespace-nowrap">$25</span>
                        <p className="text-gold-300 text-xs font-semibold">SAVE $5</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.68rem] font-bold ${c.id === 'series-3' ? 'bg-white/10 text-white/70 border border-white/20' : 'bg-gold-500/20 text-gold-300 border border-gold-400/30'}`}>
                      {c.id === 'series-3' ? 'Coming Soon' : 'Available Now'}
                    </span>
                    <Link
                      to="/devotionals"
                      className="inline-flex items-center gap-2 text-gold-300 font-bold text-sm hover:text-gold-200 transition-colors group/btn"
                    >
                      VIEW BOOK
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
