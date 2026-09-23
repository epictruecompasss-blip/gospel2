import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import { ArrowRight, BookOpen, Users, Clock, Check, Search, ChevronDown, Calendar, Download } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { dailyDevotionals, getTodayDevotional, type DailyDevotional } from '@/data/devotionals';
import { faqCategories, type FAQCategory } from '@/data/faq';
import { collections } from '@/pages/books/assets';

const series = collections.map((c) => ({
  number: c.volume,
  title: c.title,
  subtitle: c.scripture,
  days: c.days,
  available: true,
  img: c.editions.adult.cover,
  description: c.description,
  highlights: ['Christ-centred daily readings', 'Three editions for every age', 'Reflection questions and prayer', 'Daily confession of faith'],
  audiences: ['Adults: Deep theological reflection', 'Teens: Real-life application', 'Children: Engaging stories'],
}));

const inside = [
  { n:'01', title:'Key Scripture',       desc:'The foundational verse shared across all three editions for that day.' },
  { n:'02', title:'Devotional Reading',  desc:'A unique, age-appropriate reflection on the scripture.' },
  { n:'03', title:'Reflection Questions',desc:'Thoughtful questions to personalise and deepen the encounter.' },
  { n:'04', title:'Daily Prayer',        desc:'A guided prayer drawn directly from the scripture and theme.' },
  { n:'05', title:'Daily Confession',    desc:"A declaration of faith rooted in that day's scripture." },
  { n:'06', title:'Family Connection',   desc:'Questions designed to spark conversation across generations.' },
];

/* ─── Daily Devotional Section ────────────────────────────── */

function DailyDevotionalSection() {
  const [current, setCurrent] = useState<DailyDevotional>(getTodayDevotional());
  const [fadeKey, setFadeKey] = useState(0);

  function selectDevotional(d: DailyDevotional) {
    setCurrent(d);
    setFadeKey(k => k + 1);
  }

  return (
    <section className="py-24 ih-section" aria-labelledby="daily-devotional-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <p className="ih-eyebrow mb-3">Today's Devotional</p>
          <h2 id="daily-devotional-heading" className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            The Daily Devotional
          </h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">
            A new devotional each day of the week—rooted in scripture, written to help you encounter Jesus.
          </p>
        </ScrollReveal>

        {/* Day selector */}
        <ScrollReveal className="flex justify-center gap-2 mb-10 flex-wrap">
          {dailyDevotionals.map((d) => (
            <button
              key={d.day}
              onClick={() => selectDevotional(d)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-250 ${
                current.dayLabel === d.dayLabel ? 'ih-btn-gold' : 'ih-btn-ghost'
              }`}
              aria-pressed={current.dayLabel === d.dayLabel}
            >
              {d.dayLabel}
            </button>
          ))}
        </ScrollReveal>

        {/* Devotional card with fade animation */}
        <ScrollReveal>
          <div key={fadeKey} className="rounded-2xl ih-card overflow-hidden animate-fade-in">
            <div className="px-8 py-5 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gold-400" aria-hidden="true" />
                <div>
                  <p className="text-[0.68rem] font-bold tracking-[0.15em] uppercase text-gold-300 opacity-80">
                    {current.dayLabel} · The Daily Devotional
                  </p>
                  <p className="font-playfair text-xl font-bold text-white mt-0.5">{current.title}</p>
                </div>
              </div>
              <BookOpen size={22} className="text-gold-400/40" aria-hidden="true" />
            </div>

            <div className="px-8 py-6 bg-white/[0.03] border-b border-white/10">
              <p className="font-cormorant text-xl italic text-white/90 leading-relaxed">{current.scripture}</p>
              <p className="text-gold-300 text-sm font-semibold mt-2">{current.reference}</p>
            </div>

            <div className="px-8 py-8 bg-white/[0.02]">
              <p className="text-white/45 text-sm font-medium mb-4">{current.subtitle}</p>
              <p className="text-white/65 text-sm leading-relaxed mb-7">{current.text}</p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/5 border-l-4 border-gold-400">
                  <p className="text-[0.65rem] font-bold text-gold-300 uppercase tracking-[0.12em] mb-1">Pause and Reflect</p>
                  <p className="text-sm text-white/80 italic">{current.reflect}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border-l-4 border-navy-400">
                  <p className="text-[0.65rem] font-bold text-navy-300 uppercase tracking-[0.12em] mb-1">30-Second Prayer</p>
                  <p className="text-sm text-white/80 italic">{current.prayer}</p>
                </div>
              </div>

              <div className="mt-7 text-center">
                <Link to="/free-sample" className="inline-flex items-center gap-2 px-7 py-3.5 ih-btn-gold text-sm">
                  <Download size={15} aria-hidden="true" />
                  Download the Free 7-Day Sample
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── FAQ Section ────────────────────────────────────────── */

function FAQSection() {
  const [query, setQuery] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const filteredCategories: FAQCategory[] = useMemo(() => {
    if (!query.trim()) return faqCategories;
    const q = query.toLowerCase();
    return faqCategories
      .map(cat => ({
        ...cat,
        items: cat.items.filter(
          item =>
            item.q.toLowerCase().includes(q) ||
            item.a.toLowerCase().includes(q)
        ),
      }))
      .filter(cat => cat.items.length > 0);
  }, [query]);

  function toggleItem(key: string) {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <section className="py-24 ih-section" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-10">
          <p className="ih-eyebrow mb-3">Questions & Answers</p>
          <h2 id="faq-heading" className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">
            Everything you need to know about In Him Daily—searchable and organized.
          </p>
        </ScrollReveal>

        {/* Search bar */}
        <ScrollReveal className="mb-10">
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search questions…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 ih-input text-white placeholder-white/35 text-sm"
              aria-label="Search FAQ"
            />
          </div>
        </ScrollReveal>

        {/* FAQ categories */}
        <div className="space-y-8">
          {filteredCategories.length === 0 ? (
            <p className="text-center text-white/45 py-10">No questions match your search. Try a different term.</p>
          ) : (
            filteredCategories.map((cat, ci) => (
              <ScrollReveal key={cat.category} delay={ci * 50}>
                <div>
                  <h3 className="font-playfair text-lg font-bold text-gold-300 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 rounded-full bg-gold-400" aria-hidden="true" />
                    {cat.category}
                  </h3>
                  <div className="space-y-2.5">
                    {cat.items.map((item, ii) => {
                      const key = `${ci}-${ii}`;
                      const isOpen = openItems.has(key);
                      return (
                        <div key={key} className="ih-card-solid rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleItem(key)}
                            className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 transition-colors hover:bg-white/5"
                            aria-expanded={isOpen}
                          >
                            <span className="text-sm font-semibold text-white/90">{item.q}</span>
                            <ChevronDown
                              size={16}
                              className={`text-gold-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                              aria-hidden="true"
                            />
                          </button>
                          <div
                            className="overflow-hidden transition-all duration-300 ease-out"
                            style={{ maxHeight: isOpen ? '500px' : '0px', opacity: isOpen ? 1 : 0 }}
                          >
                            <p className="px-5 pb-5 text-sm text-white/60 leading-relaxed">{item.a}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            ))
          )}
        </div>

        {/* Still have a question? */}
        <ScrollReveal className="mt-12 text-center">
          <div className="gold-divider mx-auto mb-6" aria-hidden="true" />
          <p className="font-cormorant text-xl text-white italic mb-4">Still have a question?</p>
          <p className="text-white/55 text-sm mb-6">We would love to hear from you. Reach us through the contact form and we will respond within 24 hours.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 ih-btn-ghost text-sm">
            Contact Us <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */

export default function DevotionalsPage() {
  useSEO({
    title: 'Daily Devotionals & FAQ | In Him Daily',
    description: 'Read today\'s devotional, explore the six-volume devotional library, and find answers to common questions about In Him Daily devotionals for adults, teens, and children.',
    canonicalPath: '/devotionals',
  });

  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-32 pb-24 bg-navy-700 overflow-hidden" aria-label="Devotionals hero">
        <div className="absolute inset-0 bg-cover bg-center" aria-hidden="true" style={{ backgroundImage: "url('https://images.pexels.com/photos/235554/pexels-photo-235554.jpeg?auto=compress&cs=tinysrgb&w=1920')", opacity: 0.2 }} />
        <div className="absolute inset-0" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(14,32,53,0.78) 0%, rgba(14,32,53,0.92) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 75%, rgba(201,152,58,0.11) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold-400 text-[0.72rem] font-semibold tracking-[0.16em] uppercase mb-4">The Library</p>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            The Devotional Library
          </h1>
          <p className="text-white/65 text-xl max-w-2xl mx-auto leading-relaxed">
            Premium series crafted to take your family deeper into the presence, character, and glory of Jesus—one scripture at a time.
          </p>
        </div>
      </section>

      {/* Daily Devotional */}
      <DailyDevotionalSection />

      {/* 240 Days timeline */}
      <section className="py-10 ih-section border-y border-white/10" aria-label="240 Days of Encountering Jesus">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-6">
            <h2 className="font-playfair text-2xl font-bold text-white">240 Days of Encountering Jesus</h2>
          </ScrollReveal>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              {day:'Day 1',  name:'The Word',       ref:'John 1:1',   s1:true},
              {day:'Day 30', name:'Bread of Life',  ref:'John 6:35',  s1:true},
              {day:'Day 60', name:'Good Shepherd',  ref:'John 10:11', s1:true},
              {day:'Day 120',name:'King of Kings',  ref:'Rev 19:16',  s1:true},
              {day:'Day 121',name:'Grace & Truth',  ref:'John 1:14',  s1:false},
              {day:'Day 240',name:'It Is Finished', ref:'John 19:30', s1:false},
            ].map((item,i,arr)=>(
              <div key={i} className="flex items-center gap-3">
                <div className="text-center">
                  <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-1.5 ${item.s1 ? 'bg-gold-400' : 'bg-navy-400'}`} />
                  <p className="text-[0.72rem] font-bold text-white">{item.day}</p>
                  <p className="text-[0.68rem] text-white/50 max-w-[72px] leading-tight">{item.name}</p>
                  <p className="text-[0.65rem] text-gold-400">{item.ref}</p>
                </div>
                {i < arr.length-1 && <div className="w-8 h-px bg-white/15" aria-hidden="true" />}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-5">
            <div className="flex items-center gap-2 text-xs text-white/55"><div className="w-2.5 h-2.5 rounded-full bg-gold-400" aria-hidden="true" /> Series One</div>
            <div className="flex items-center gap-2 text-xs text-white/55"><div className="w-2.5 h-2.5 rounded-full bg-navy-400" aria-hidden="true" /> Series Two</div>
          </div>
        </div>
      </section>

      {/* Series */}
      <section className="py-24 ih-section" aria-label="Series">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {series.map((s,i)=>(
            <ScrollReveal key={s.number} delay={i*80}>
              <div className="rounded-3xl overflow-hidden ih-card">
                <div className={`grid lg:grid-cols-2 ${i%2!==0 ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={`relative h-64 lg:h-auto ${i%2!==0 ? 'lg:col-start-2' : ''}`}>
                    <img src={s.img} alt={s.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#05070D]/60 to-transparent" aria-hidden="true" />
                    <div className="absolute top-5 left-5">
                      <span className={`px-3.5 py-1.5 rounded-full text-[0.72rem] font-bold ${s.available ? 'bg-gold-500 text-[#05070D]' : 'bg-white/15 text-white backdrop-blur'}`}>
                        {s.available ? 'Available Now' : 'Coming Soon'}
                      </span>
                    </div>
                  </div>
                  <div className={`p-10 lg:p-12 flex flex-col justify-center ${i%2!==0 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <p className="text-gold-300 text-[0.68rem] font-bold tracking-[0.14em] uppercase mb-3">{s.number}</p>
                    <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white leading-tight mb-1">{s.title}</h2>
                    <p className="text-gold-400 font-semibold text-lg mb-3">{s.subtitle}</p>
                    <div className="flex items-center gap-4 mb-5 text-sm text-white/55">
                      <span className="flex items-center gap-1.5"><Clock size={13} aria-hidden="true" /> {s.days} Days</span>
                      <span className="flex items-center gap-1.5"><Users size={13} aria-hidden="true" /> All Generations</span>
                      <span className="flex items-center gap-1.5"><BookOpen size={13} aria-hidden="true" /> 3 Editions</span>
                    </div>
                    <p className="text-white/60 leading-relaxed mb-6 text-[0.9rem]">{s.description}</p>
                    <ul className="space-y-1.5 mb-6" role="list">
                      {s.highlights.map((h,j)=>(
                        <li key={j} className="flex items-start gap-2 text-sm text-white/75">
                          <Check size={13} className="text-gold-400 mt-0.5 shrink-0" aria-hidden="true" /> {h}
                        </li>
                      ))}
                    </ul>
                    <div className="p-4 rounded-xl bg-white/5 mb-6">
                      <p className="text-[0.68rem] font-semibold text-white/50 uppercase tracking-wider mb-2">Editions Included</p>
                      {s.audiences.map((a,j)=>(
                        <p key={j} className="text-[0.82rem] text-white/70 py-1 border-b border-white/10 last:border-0">{a}</p>
                      ))}
                    </div>
                    <Link to="/free-sample"
                      className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:-translate-y-px w-fit ${
                        s.available ? 'ih-btn-gold' : 'bg-white/10 text-white/40 cursor-not-allowed'
                      }`}>
                      {s.available ? 'Get Free Sample' : 'Join Waitlist'}
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-24 ih-section" aria-labelledby="inside-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <p className="ih-eyebrow mb-3">Every Day Includes</p>
            <h2 id="inside-heading" className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white">What's Inside Each Day</h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {inside.map((item,i)=>(
              <ScrollReveal key={i} delay={i*70}>
                <div className="premium-card p-6 ih-card">
                  <div className="w-8 h-8 rounded-lg bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mb-4">
                    <span className="text-gold-300 font-bold text-[0.72rem]">{item.n}</span>
                  </div>
                  <h3 className="font-playfair text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/55 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <section className="py-20 ih-section text-center" aria-label="Get started">
        <div className="max-w-xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="font-playfair text-4xl font-bold text-white mb-4">Ready to Begin?</h2>
            <p className="text-white/55 mb-8">Start your family's encounter with a free 7-day sample from Series One.</p>
            <Link to="/free-sample" className="inline-flex items-center gap-2 px-8 py-4 ih-btn-gold">
              Get Your Free Sample <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
