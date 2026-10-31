import { Check, Star, Users, Gift, Sparkles, ShoppingCart } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { pdfPricing, bulkPricing, freeEntryPoints } from './assets';
 
export default function PricingCards() {
  return (
    <section id="pricing" className="relative py-16 sm:py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <p className="font-cinzel text-gold-300 tracking-[0.25em] text-sm mb-3">SECTION 07</p>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white">
            Choose Your Journey
          </h2>
          <p className="mt-4 text-lg text-[#D0D3D8] max-w-2xl mx-auto leading-[1.6]">
            Every volume is available as a digital PDF, priced for families and ministries across
            the world. Pick the edition that fits your household.
          </p>
        </ScrollReveal>

        {/* PDF pricing cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pdfPricing.map((tier, i) => (
            <ScrollReveal key={tier.id} delay={i * 100}>
              <div
                className={`relative rounded-2xl p-8 h-full flex flex-col transition-all duration-500 hover:-translate-y-2 ${
                  tier.highlight
                    ? 'border-2 border-gold-300 shadow-[0_0_48px_rgba(217,166,46,0.25)]'
                    : 'hover:border-gold-400/40'
                }`}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: tier.highlight ? '2px solid #D9A62E' : '1px solid #3A3A35',
                }}
              >
                {tier.highlight && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[#05070D] text-xs font-bold whitespace-nowrap"
                    style={{ backgroundColor: '#D9A62E' }}
                  >
                    BEST VALUE
                  </span>
                )}

                <h3 className="font-cinzel text-2xl font-bold text-white mb-1">
                  {tier.name}
                </h3>
                <p className="text-[#D0D3D8]/70 text-sm mb-6">{tier.tagline}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {tier.formats.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1 rounded-full text-xs font-medium text-[#D0D3D8] border border-white/15"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <ul className="space-y-2 mb-8 flex-1">
                  {tier.prices.map((p) => (
                    <li
                      key={p.currency}
                      className={`flex items-baseline justify-between text-base ${
                        p.currency === 'USD' ? 'text-gold-300 font-bold' : 'text-[#D0D3D8]'
                      }`}
                    >
                      <span className="tracking-wider">{p.currency}</span>
                      <span>{p.amount}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-2">
                  <a
                    href={tier.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 px-6 rounded-full font-bold transition-all ${
                      tier.highlight
                        ? 'text-[#05070D] hover:brightness-110'
                        : 'text-gold-300 hover:bg-gold-400/10'
                    }`}
                    style={
                      tier.highlight
                        ? { backgroundColor: '#D9A62E', height: '52px', borderRadius: '26px' }
                        : { border: '1px solid #D9A62E', height: '52px', borderRadius: '26px' }
                    }
                  >
                    <ShoppingCart size={16} />
                    Buy on Amazon
                  </a>
                  <a
                    href={tier.selarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 rounded-full font-bold transition-all text-white/70 hover:text-white hover:bg-white/10"
                    style={{ border: '1px solid rgba(255,255,255,0.2)', height: '44px', borderRadius: '22px', fontSize: '0.85rem' }}
                  >
                    Buy on Selar (Africa)
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Church & ministry bulk pricing */}
        <ScrollReveal delay={200}>
          <div className="mt-12 rounded-2xl p-8 sm:p-10" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #3A3A35' }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-full flex items-center justify-center bg-gold-400/10 border border-gold-400/30">
                <Users className="text-gold-300" size={20} />
              </span>
              <h3 className="font-cinzel text-2xl font-bold text-white">
                Church &amp; Ministry Bulk Pricing
              </h3>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {bulkPricing.map((tier) => (
                <div
                  key={tier.id}
                  className="rounded-xl p-6 text-center"
                  style={{ border: '1px solid #3A3A35', background: 'rgba(255,255,255,0.02)' }}
                >
                  <p className="text-[#D0D3D8] text-sm mb-2">{tier.quantity}</p>
                  <p className="font-cinzel text-2xl font-bold text-gold-300 mb-2">
                    {tier.discount}
                  </p>
                  {tier.note && (
                    <p className="text-[#D0D3D8]/60 text-xs mt-2">{tier.note}</p>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-[#D0D3D8]/70 text-sm">
              Bible study groups of 10+: contact us for group licence pricing.
            </p>
          </div>
        </ScrollReveal>

        {/* Free entry points */}
        <ScrollReveal delay={250}>
          <div className="mt-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Gift className="text-gold-300" size={20} />
              <h3 className="font-cinzel text-xl font-bold text-white tracking-wide">
                Free Entry Points
              </h3>
              <Sparkles className="text-gold-300" size={16} />
            </div>
            <p className="text-[#D0D3D8]/70 text-sm mb-8 max-w-xl mx-auto">
              Always available at zero cost — start your journey with no commitment.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 text-left">
              {freeEntryPoints.map((f) => (
                <div
                  key={f.id}
                  className="rounded-xl p-6"
                  style={{ border: '1px solid #3A3A35', background: 'rgba(255,255,255,0.02)' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Check size={16} className="text-gold-300 shrink-0" />
                    <h4 className="font-cinzel text-base font-bold text-white">
                      {f.title}
                    </h4>
                  </div>
                  <p className="text-[#D0D3D8] text-sm leading-[1.6]">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="flex items-center justify-center gap-2 mt-10 text-[#D0D3D8]/70 text-sm">
          <Star size={14} className="text-gold-300 fill-gold-300" />
          <Star size={14} className="text-gold-300 fill-gold-300" />
          <Star size={14} className="text-gold-300 fill-gold-300" />
          <Star size={14} className="text-gold-300 fill-gold-300" />
          <Star size={14} className="text-gold-300 fill-gold-300" />
          <span className="ml-2">Loved by families, churches, and small groups worldwide.</span>
        </ScrollReveal>
      </div>
    </section>
  );
}
