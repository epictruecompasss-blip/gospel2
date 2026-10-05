import { Link } from 'react-router-dom';
import { Baby, Sparkles, BookText, Users, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { ageCards } from './assets';

const icons = [Baby, Sparkles, BookText, Users];

export default function AgeCards() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <p className="font-cinzel text-gold-300 tracking-[0.25em] text-sm mb-3">SECTION 01</p>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white">
            One Message. <span className="text-[#D0D3D8]">Every Age.</span>
          </h2>
          <p className="mt-4 text-lg text-[#D0D3D8] max-w-2xl mx-auto leading-[1.6]">
            Designed for every stage of life — the same unchanging story, told in a voice each
            generation can understand.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {ageCards.map((card, i) => {
            const Icon = icons[i] ?? Baby;
            return (
              <ScrollReveal key={card.id} delay={i * 120}>
                <Link
                  to="/books#collections"
                  className="block rounded-2xl p-8 h-full group transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(217,166,46,0.18)]"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid #3A3A35',
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                      style={{
                        background: 'rgba(217,166,46,0.12)',
                        boxShadow: '0 0 24px rgba(217,166,46,0.2)',
                      }}
                    >
                      <Icon className="text-gold-300" size={26} />
                    </div>
                    <span className="font-cinzel text-xs tracking-[0.2em] text-[#D0D3D8]/70">
                      {card.range}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-2xl font-bold text-white mb-1">
                    {card.age}
                  </h3>
                  <p className="text-sm text-[#D0D3D8]/70 mb-5">{card.range}</p>

                  <ul className="space-y-3 mb-6">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-[#D0D3D8] text-base leading-[1.6]">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div
                    className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl bg-[#0B0E15] p-3"
                    style={{ border: '1px solid #3A3A35' }}
                  >
                    <img
                      src={card.cover}
                      alt={`${card.age} devotional cover`}
                      loading="lazy"
                      decoding="async"
                      className="block h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                      style={{ filter: 'brightness(1.12) contrast(1.08)' }}
                    />
                    <span className="pointer-events-none absolute inset-x-4 bottom-3 h-12 rounded-full bg-gold-400/10 blur-xl" />
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-gold-300 font-semibold text-sm group-hover:gap-3 transition-all">
                    View Books <ArrowRight size={16} />
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
