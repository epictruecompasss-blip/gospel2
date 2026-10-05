import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import { ArrowRight, BookOpen, Star, Check, X, Sparkles, ChevronRight, Mail, Copy } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import WhatsAppCommunity from '@/components/WhatsAppCommunity';
import { insertFreeSampleLead, insertNewsletterSubscriber } from '@/lib/supabase';
import { collections, testimonials as bookTestimonials } from '@/pages/books/assets';

const todaysVerse = {
  reference: 'John 1:14',
  text: 'The Word became flesh and made His dwelling among us. We have seen His glory, the glory of the one and only Son, who came from the Father, full of grace and truth.',
  reflection: 'God did not stay distant. He moved into the neighborhood. Today, He invites you to experience His grace and truth up close — not as a concept, but as a person.',
};

const latestDevotionals = [
  { day: 'Day 103', title: 'Jesus the Light of the World', scripture: 'John 8:12', excerpt: "Jesus doesn't merely illuminate your path—He IS the light. To follow Him is to walk in an entirely different quality of life.", edition: 'Adult' },
  { day: 'Day 55',  title: 'Jesus the Good Shepherd',     scripture: 'John 10:11', excerpt: "He doesn't drive the sheep from behind. He leads them. He knows each one by name — and lays down His life for them.", edition: 'Teen' },
  { day: 'Day 42',  title: 'Jesus the Prince of Peace',    scripture: 'Isaiah 9:6', excerpt: "His peace isn't the absence of trouble. It's the presence of Someone who is bigger than the trouble.", edition: 'Child' },
  { day: 'Day 100', title: 'Jesus the Lamb of God',        scripture: 'John 1:29', excerpt: "He takes away the sin of the world. Not by force, but by sacrifice. Not by demanding, but by giving.", edition: 'Adult' },
];

const familyEncounterData = {
  scripture: { reference: 'John 8:12', text: '"I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life."' },
  adult: {
    label: 'Adult Edition',
    title: 'Walking in the Light of His Presence',
    content: "Jesus doesn't merely illuminate your path—He IS the light. In a world filled with moral ambiguity and spiritual confusion, this declaration is both radical and deeply personal. To follow Jesus is not just to adopt a belief system; it is to walk in an entirely different quality of life.",
    reflection: 'Where in your life have you been walking in darkness, unwilling to let His light fully illuminate?',
    prayer: 'Lord Jesus, I choose to walk in Your light today. Expose every area of darkness in my life and fill it with Your presence.',
  },
  teen: {
    label: 'Teen Edition',
    title: "You Don't Have to Figure It Out Alone",
    content: "Imagine walking into a completely dark room, fumbling around, bumping into everything. That's life without Jesus. But when you follow Him, it's like someone turned on the most powerful light you've ever seen—everything becomes clear.",
    reflection: "What's one thing in your life right now that feels really confusing or dark? How could following Jesus bring light to that situation?",
    prayer: "Jesus, sometimes my life feels so confusing. Thank You for being a light I can actually follow. Help me trust You with the things I don't understand.",
  },
  child: {
    label: "Children's Edition",
    title: 'Jesus Is Like a Super Light!',
    content: "Have you ever been somewhere really dark and felt a little scared? Maybe your bedroom at night. When someone turns on the light—everything changes! Jesus says He is the light of the whole world. That means when Jesus is with you, you never have to be afraid of the dark!",
    reflection: 'Draw a picture of you walking with Jesus as your light! What does it look like?',
    prayer: 'Thank You Jesus for being my light! Help me follow You everywhere I go so I never have to be scared of the dark. Amen!',
  },
};

const comparisonRows = [
  { feature: 'Same scripture across all ages',  traditional: false,          ihd: true },
  { feature: 'Three generational voices',       traditional: false,          ihd: true },
  { feature: 'Families grow together',          traditional: false,          ihd: true },
  { feature: 'Age-appropriate language',        traditional: 'Single age',   ihd: true },
  { feature: 'Shared family discussion',        traditional: false,          ihd: true },
  { feature: 'Daily scripture focus',           traditional: true,           ihd: true },
  { feature: 'Reflection questions',            traditional: true,           ihd: true },
  { feature: 'Daily prayer',                    traditional: true,           ihd: true },
];

const testimonials = bookTestimonials.map(t => ({ quote: t.quote, author: t.author, role: '' }));

const editions = [
  { label: 'Adult Edition', bg: 'bg-navy-700', text: 'text-white', sub: 'text-gold-300', title: 'Walking in the Light of His Presence', excerpt: "Jesus doesn't merely illuminate your path—He IS the light. This declaration calls us to walk in an entirely different quality of life.", features: ['Theological depth', 'Life application', 'Intercession prayer'] },
  { label: 'Teen Edition',  bg: 'bg-gold-500', text: 'text-navy-800', sub: 'text-navy-700', title: "You Don't Have to Figure It Out Alone", excerpt: "Life feels dark and confusing sometimes. But Jesus says following Him is like having the most powerful flashlight ever.", features: ['Real-life scenarios', 'Honest questions', 'Personal application'] },
  { label: "Children's",   bg: 'bg-lavender-200', text: 'text-navy-700', sub: 'text-navy-500', title: 'Jesus Is Like a Super Light!', excerpt: "When someone turns on a light in a dark room—everything changes! Jesus says He is the light of the whole world.", features: ['Simple language', 'Fun activities', 'Bedtime prayers'] },
];

const stats = [
  { number: '5,000+', label: 'Believers Growing Daily', sub: 'Across all communities' },
  { number: '12+',    label: 'Countries Reached',         sub: 'And expanding' },
  { number: '290+',   label: 'Days of Devotionals',      sub: 'Three series available' },
  { number: '3',      label: 'Generations Reading',      sub: 'Adults, teens, children' },
];

export default function HomePage() {
  useSEO({
    title: 'In Him Daily | Daily Christian Devotionals & Faith Community',
    description: 'Grow closer to Christ through daily devotionals, Bible reflections, prayer resources, and a thriving Christian community. Written for adults, teens, and children — every generation, every day.',
    canonicalPath: '/',
  });

  const [active, setActive]         = useState<'adult'|'teen'|'child'>('adult');
  const [submitted, setSubmitted]   = useState(false);
  const [email, setEmail]           = useState('');
  const [firstName, setFirstName]   = useState('');
  const [formError, setFormError]   = useState('');

  const [nlSubmitted, setNlSubmitted] = useState(false);
  const [nlName, setNlName]           = useState('');
  const [nlEmail, setNlEmail]         = useState('');
  const [nlError, setNlError]         = useState('');
  const [copied, setCopied]           = useState(false);

  const data = familyEncounterData[active];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !firstName) return;
    try {
      await insertFreeSampleLead({ first_name: firstName, email, source: 'homepage_cta' });
      setSubmitted(true);
    } catch {
      setFormError('Something went wrong. Please try again.');
    }
  }

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!nlName || !nlEmail) return;
    try {
      await insertNewsletterSubscriber({ name: nlName, email: nlEmail });
      setNlSubmitted(true);
    } catch {
      setNlError('Something went wrong. Please try again.');
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center bg-navy-700 overflow-hidden" aria-label="Hero">
        {/* Logo image as atmospheric background — screen blend removes black, leaves gold/white glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <img
            src="/images/733127106_122096833941384062_9064072413288732878_n.jpg"
            alt=""
            className="w-full h-full object-cover opacity-30"
            style={{ mixBlendMode: 'screen' }}
          />
        </div>
        <div className="absolute inset-0" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(14,32,53,0.55) 0%, rgba(14,32,53,0.80) 60%, rgba(14,32,53,0.97) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 65%, rgba(201,152,58,0.13) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden="true"
          style={{ backgroundImage: 'radial-gradient(circle, #E4B86A 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-3/4 pointer-events-none" aria-hidden="true">
          {[-36,-22,-10,0,10,22,36].map((deg, i) => (
            <div key={i} className="absolute bottom-0 left-1/2 origin-bottom"
              style={{ width: '1.5px', height: `${42 + i * 5}%`, background: 'linear-gradient(to top, rgba(228,184,106,0.55), transparent)', transform: `translateX(-50%) rotate(${deg}deg)`, animation: `ray-appear ${0.9 + i * 0.12}s ease-out forwards` }} />
          ))}
        </div>
        {[14,25,38,52,63,75].map((left, i) => (
          <div key={i} className="particle absolute w-1 h-1 rounded-full bg-gold-300/40 pointer-events-none" aria-hidden="true"
            style={{ left: `${left}%`, top: `${22 + (i % 3) * 18}%`, animationDelay: `${i * 0.55}s`, animationDuration: `${3.5 + i * 0.6}s` }} />
        ))}

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32 pt-40">

          {/* Logo badge */}
          <div className="flex justify-center mb-10 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl opacity-50" style={{ background: 'radial-gradient(circle, rgba(201,152,58,0.6) 0%, transparent 70%)' }} aria-hidden="true" />
              <img
                src="/images/733127106_122096833941384062_9064072413288732878_n.jpg"
                alt="In Him Daily logo"
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-gold-400/50 shadow-gold-lg"
                style={{ boxShadow: '0 0 48px rgba(201,152,58,0.45), 0 0 12px rgba(201,152,58,0.25)' }}
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-400/30 mb-8 animate-fade-in">
            <Sparkles size={13} className="text-gold-300" aria-hidden="true" />
            <span className="text-gold-200 text-[0.72rem] font-semibold tracking-[0.14em] uppercase">A New Way for Families to Encounter Jesus</span>
          </div>

          <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold text-white leading-[1.08] mb-8 mt-2">
            Grow Closer to Christ<br />
            <span className="text-gold-gradient">Every Day</span>
          </h1>

          <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Daily devotionals, Bible reflections, prayer resources, and a community of believers.
            Written for <em className="not-italic text-gold-300">adults, teens, and children</em> — so every generation encounters Jesus together.
          </p>

          <div className="mb-6">
            <p className="font-cormorant text-lg sm:text-xl text-gold-200 italic leading-relaxed max-w-xl mx-auto">
              &ldquo;For you died, and your life is now hidden with Christ in God.&rdquo;
            </p>
            <p className="text-gold-400 text-[0.72rem] font-semibold tracking-[0.16em] uppercase mt-1">Colossians 3:3</p>
          </div>

          <div className="theme-roller mb-10 max-w-2xl mx-auto">
            <span className="font-cormorant text-lg sm:text-xl text-white/80 italic">
              Because everything you need is already found in Him.
            </span>
            <span className="font-cormorant text-lg sm:text-xl text-white/80 italic">
              &ldquo;Discover who you are, what you have, and where you stand — in Christ.&rdquo;
            </span>
            <span className="font-cormorant text-lg sm:text-xl text-white/80 italic">
              &ldquo;Grace. Identity. Victory. Every day — in Him.&rdquo;
            </span>
            <span className="font-cormorant text-lg sm:text-xl text-white/80 italic">
              &ldquo;Your life is hidden with Christ in God. Live from that place — every day.&rdquo;
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/devotionals" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-800 font-bold text-[0.9rem] rounded-full transition-all duration-300 shadow-gold hover:-translate-y-0.5">
              Read Today&apos;s Devotional
              <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
            <a href="#community" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/25 text-white/80 hover:text-white hover:border-white/40 font-medium text-[0.9rem] rounded-full transition-all duration-200">
              Join Our WhatsApp Community
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Link to="/free-sample" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-gold-300 hover:text-gold-200 font-medium text-[0.85rem] rounded-full transition-all duration-200 hover:bg-white/5">
              Start Your Faith Journey
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-20 flex items-end justify-center gap-5" aria-hidden="true">
            {[{l:'Adults',h:56},{l:'Teens',h:40},{l:'Children',h:28}].map((p,i)=>(
              <div key={i} className="flex flex-col items-center gap-2 animate-fade-up opacity-0" style={{animationDelay:`${i*0.18}s`,animationFillMode:'forwards'}}>
                <div className="w-px bg-gradient-to-t from-gold-400 to-transparent" style={{height:p.h}} />
                <div className="w-2 h-2 rounded-full bg-gold-400" />
                <span className="text-white/40 text-[0.65rem] tracking-[0.12em] uppercase">{p.l}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2 ml-1 animate-fade-up opacity-0" style={{animationDelay:'0.58s',animationFillMode:'forwards'}}>
              <div className="w-px h-16 bg-gradient-to-t from-gold-300 to-transparent" />
              <div className="w-3 h-3 rounded-full bg-gold-300 shadow-gold animate-glow-pulse" />
              <span className="text-gold-200 text-[0.65rem] font-semibold tracking-[0.12em] uppercase">One Jesus</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 ih-section border-t border-white/5" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Community statistics</h2>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-10">
            <p className="font-cormorant text-2xl text-gold-200 italic leading-relaxed">
              Over 5,000 believers growing daily in Christ through In Him Daily.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="text-center p-5 rounded-2xl bg-white/5 border border-white/10">
                  <p className="font-playfair text-3xl md:text-4xl font-bold text-gold-300 mb-1">{s.number}</p>
                  <p className="text-white font-semibold text-sm mb-0.5">{s.label}</p>
                  <p className="text-white/40 text-xs">{s.sub}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TODAY'S VERSE */}
      <section className="py-24 ih-section" aria-labelledby="verse-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-10">
            <p className="ih-eyebrow mb-3">Today&apos;s Verse</p>
            <h2 id="verse-heading" className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2">A Word for Today</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="relative p-8 md:p-12 rounded-2xl ih-card overflow-hidden text-center">
              <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse at 50% 110%, rgba(201,152,58,0.12) 0%, transparent 65%)'}} aria-hidden="true" />
              <div className="relative">
                <p className="font-cormorant text-2xl md:text-3xl text-white/90 italic leading-relaxed mb-5">
                  &ldquo;{todaysVerse.text}&rdquo;
                </p>
                <span className="text-gold-400 text-sm font-semibold tracking-wider mb-6 block">{todaysVerse.reference}</span>
                <div className="gold-divider mx-auto mb-6" aria-hidden="true" />
                <p className="text-white/60 text-sm leading-relaxed max-w-xl mx-auto">{todaysVerse.reflection}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* LATEST DEVOTIONALS */}
      <section className="py-24 ih-section" aria-labelledby="latest-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <p className="ih-eyebrow mb-3">Latest Devotionals</p>
            <h2 id="latest-heading" className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Recent Encounters with Jesus</h2>
            <p className="text-white/55 text-lg max-w-xl mx-auto">Fresh devotional content from our Christ-centred devotional library.</p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-6">
            {latestDevotionals.map((d, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="premium-card p-7 rounded-2xl ih-card h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[0.68rem] font-bold text-gold-300 tracking-[0.14em] uppercase">{d.day}</span>
                    <span className="text-[0.68rem] bg-white/10 text-gold-200 px-2.5 py-1 rounded-full font-medium">{d.edition} Edition</span>
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-white mb-2 leading-snug">{d.title}</h3>
                  <p className="text-gold-400 text-sm font-medium mb-3">{d.scripture}</p>
                  <p className="text-white/55 text-sm leading-relaxed flex-1 mb-5">{d.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <Link to="/devotionals" className="text-sm font-semibold text-gold-300 hover:text-gold-200 transition-colors flex items-center gap-1">
                      Read more <ChevronRight size={14} aria-hidden="true" />
                    </Link>
                    <div className="flex items-center gap-2">
                      <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(d.title + ' — ' + d.scripture + ' | In Him Daily')}`, '_blank')} aria-label="Share on WhatsApp" className="w-8 h-8 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 flex items-center justify-center transition-colors">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-[#128C7E]" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </button>
                      <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} aria-label="Share on Facebook" className="w-8 h-8 rounded-full bg-[#1877F2]/15 hover:bg-[#1877F2]/25 flex items-center justify-center transition-colors">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-[#1877F2]" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </button>
                      <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(d.title + ' — ' + d.scripture + ' | In Him Daily')}`, '_blank')} aria-label="Share on X" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-white/70" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </button>
                      <button onClick={copyLink} aria-label={copied ? 'Link copied' : 'Copy link'} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors">
                        {copied ? <Check size={12} className="text-green-400" aria-hidden="true" /> : <Copy size={12} className="text-gold-300" aria-hidden="true" />}
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal className="text-center mt-10">
            <Link to="/devotionals" className="inline-flex items-center gap-2 px-8 py-4 ih-btn-ghost text-white font-semibold">
              View All Devotionals <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 ih-section" aria-labelledby="problem-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <p className="ih-eyebrow mb-3">The Challenge</p>
            <h2 id="problem-heading" className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-3xl mx-auto leading-tight">
              Does your family read the Bible together—but experience it separately?
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <ScrollReveal delay={80}>
              <div className="p-8 rounded-2xl ih-card-solid h-full">
                <div className="w-9 h-9 rounded-full bg-red-500/15 flex items-center justify-center mb-5">
                  <X size={16} className="text-red-400" aria-hidden="true" />
                </div>
                <h3 className="font-playfair text-lg font-bold text-white mb-4">Before In Him Daily</h3>
                <ul className="space-y-2.5" role="list">
                  {["Dad reads an adult commentary","Mom finishes a women's devotional","Teen scrolls through a youth app","Child looks at a picture Bible","Nobody has the same conversation","Family grows in faith… separately"].map((item,i)=>(
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/55">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400/60 mt-2 shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={180}>
              <div className="p-8 rounded-2xl ih-card h-full">
                <div className="w-9 h-9 rounded-full bg-gold-400/20 flex items-center justify-center mb-5">
                  <Check size={16} className="text-gold-300" aria-hidden="true" />
                </div>
                <h3 className="font-playfair text-lg font-bold text-gold-200 mb-4">With In Him Daily</h3>
                <ul className="space-y-2.5" role="list">
                  {["Every generation reads the same scripture","Three voices speak to three ages","Dinner conversations about the Word","Kids teach parents what they discovered","One shared encounter with Jesus","Family grows in faith… together"].map((item,i)=>(
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                      <Check size={13} className="text-gold-400 mt-0.5 shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* THREE EDITIONS */}
      <section className="py-24 ih-section" aria-labelledby="solution-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <p className="ih-eyebrow mb-3">The Solution</p>
            <h2 id="solution-heading" className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">One Encounter. Three Generations.</h2>
            <p className="text-white/55 text-lg max-w-xl mx-auto">The same scripture, in three unique voices—each crafted to meet its reader exactly where they are.</p>
          </ScrollReveal>
          <ScrollReveal className="max-w-2xl mx-auto text-center mb-14">
            <div className="relative p-8 rounded-2xl ih-card overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse at 50% 110%, rgba(201,152,58,0.12) 0%, transparent 65%)'}} aria-hidden="true" />
              <div className="relative">
                <p className="font-cormorant text-xl md:text-2xl text-white/90 italic leading-relaxed mb-3">
                  &ldquo;I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life.&rdquo;
                </p>
                <span className="text-gold-400 text-sm font-semibold tracking-wider">John 8:12</span>
              </div>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {editions.map((ed, i) => (
              <ScrollReveal key={i} delay={i * 90}>
                <div className={`premium-card p-7 rounded-2xl ih-card h-full flex flex-col`}>
                  <p className="text-[0.68rem] font-bold tracking-[0.15em] uppercase text-gold-300 mb-4">{ed.label}</p>
                  <h3 className="font-playfair text-xl font-bold text-white mb-3 leading-snug">{ed.title}</h3>
                  <p className="text-sm leading-relaxed mb-5 text-white/65 flex-1">{ed.excerpt}</p>
                  <ul className="space-y-1.5" role="list">
                    {ed.features.map((f,j)=>(
                      <li key={j} className="flex items-center gap-2 text-xs text-white/55">
                        <Check size={11} className="text-gold-400" aria-hidden="true" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAMILY ENCOUNTER */}
      <section className="py-24 ih-section" id="family-encounter" aria-labelledby="encounter-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <p className="ih-eyebrow mb-3">Interactive Preview</p>
            <h2 id="encounter-heading" className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">The Family Encounter</h2>
            <p className="text-white/55 text-lg max-w-xl mx-auto">Select your generation to see how the same scripture speaks uniquely to you.</p>
          </ScrollReveal>
          <ScrollReveal className="max-w-xl mx-auto text-center mb-10">
            <div className="inline-block px-6 py-4 rounded-xl ih-card">
              <p className="font-cormorant text-lg text-white italic leading-snug">
                &ldquo;{familyEncounterData.scripture.text}&rdquo;
              </p>
              <span className="text-gold-400 text-sm font-semibold mt-2 block">{familyEncounterData.scripture.reference}</span>
            </div>
          </ScrollReveal>
          <div className="flex justify-center gap-2.5 mb-10" role="tablist" aria-label="Choose generation">
            {(['adult','teen','child'] as const).map((gen) => (
              <button key={gen} role="tab" aria-selected={active === gen} aria-controls={`panel-${gen}`}
                onClick={() => setActive(gen)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-250 ${
                  active === gen ? 'ih-btn-gold' : 'ih-btn-ghost'
                }`}>
                {gen === 'adult' ? 'Adult' : gen === 'teen' ? 'Teen' : 'Child'}
              </button>
            ))}
          </div>
          <div className="max-w-2xl mx-auto" id={`panel-${active}`} role="tabpanel">
            <div className="rounded-2xl ih-card overflow-hidden">
              <div className="px-8 py-4 bg-white/5">
                <span className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-gold-300">
                  {data.label}
                </span>
              </div>
              <div className="p-8">
                <h3 className="font-playfair text-2xl font-bold text-white mb-4">{data.title}</h3>
                <p className="text-white/60 leading-relaxed mb-6 text-sm">{data.content}</p>
                <div className="space-y-3.5">
                  <div className="p-4 rounded-xl bg-white/5 border-l-4 border-gold-400">
                    <p className="text-[0.68rem] font-bold text-gold-300 uppercase tracking-[0.12em] mb-1">Reflection</p>
                    <p className="text-sm text-white/80 italic">{data.reflection}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border-l-4 border-navy-400">
                    <p className="text-[0.68rem] font-bold text-navy-300 uppercase tracking-[0.12em] mb-1">Prayer</p>
                    <p className="text-sm text-white/80 italic">{data.prayer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppCommunity />

      {/* COMPARISON TABLE */}
      <section className="py-24 bg-navy-700" aria-labelledby="comparison-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <p className="text-gold-400 text-[0.72rem] font-semibold tracking-[0.16em] uppercase mb-3">The Difference</p>
            <h2 id="comparison-heading" className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Why In Him Daily Is Different</h2>
            <p className="text-white/55 text-lg max-w-xl mx-auto">Traditional devotionals were built for individuals. In Him Daily was built for families—all of them, at once.</p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <div className="grid grid-cols-3 bg-white/5">
                <div className="p-4" />
                <div className="p-4 text-center border-l border-white/10">
                  <span className="text-white/45 text-[0.68rem] font-medium tracking-wider uppercase">Traditional</span>
                </div>
                <div className="p-4 text-center border-l border-white/10 bg-gold-500/10">
                  <span className="text-gold-300 text-[0.68rem] font-bold tracking-wider uppercase">In Him Daily</span>
                </div>
              </div>
              {comparisonRows.map((row, i) => (
                <div key={i} className={`grid grid-cols-3 border-t border-white/10 ${i%2===0 ? 'bg-transparent' : 'bg-white/[0.02]'}`}>
                  <div className="p-4"><span className="text-white/75 text-sm">{row.feature}</span></div>
                  <div className="p-4 flex items-center justify-center border-l border-white/10">
                    {row.traditional === false ? <X size={15} className="text-red-400" aria-label="No" /> : row.traditional === true ? <Check size={15} className="text-white/40" aria-label="Yes" /> : <span className="text-white/40 text-xs text-center leading-tight">{row.traditional as string}</span>}
                  </div>
                  <div className="p-4 flex items-center justify-center border-l border-white/10 bg-gold-500/5">
                    {row.ihd && <Check size={15} className="text-gold-400" aria-label="Yes" />}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* DEVOTIONAL LIBRARY */}
      <section className="py-24 ih-section" aria-labelledby="library-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <p className="ih-eyebrow mb-3">The Library</p>
            <h2 id="library-heading" className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">The Devotional Library</h2>
            <p className="text-white/55 text-lg max-w-xl mx-auto">Premium series crafted to take your family deeper into Jesus—one scripture at a time.</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {collections.map((s,i)=>(
              <ScrollReveal key={i} delay={i*120}>
                <div className="premium-card rounded-2xl overflow-hidden ih-card">
                  <div className="relative h-48 overflow-hidden bg-white/5">
                    <img src={s.cover} alt={s.title} loading="lazy" decoding="async" className="w-full h-full object-contain transition-transform duration-500 hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070D]/80 to-transparent" aria-hidden="true" />
                    <div className="absolute bottom-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-[0.72rem] font-bold ${s.id === 'series-3' ? 'bg-white/15 text-white backdrop-blur' : 'bg-gold-500 text-[#05070D]'}`}>
                        {s.id === 'series-3' ? 'Coming Soon' : 'Available Now'}
                      </span>
                    </div>
                  </div>
                  <div className="p-7">
                    <p className="text-gold-300 text-[0.68rem] font-bold tracking-[0.14em] uppercase mb-2">{s.volume}</p>
                    <h3 className="font-playfair text-2xl font-bold text-white leading-tight">{s.title}</h3>
                    <p className="text-gold-400 font-medium text-sm mb-3">{s.scripture}</p>
                    <p className="text-white/55 text-sm leading-relaxed mb-5">{s.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[0.72rem] text-white/60 bg-white/10 px-3 py-1.5 rounded-full">{s.days} Days</span>
                      <Link to="/books#collections" className="text-sm font-semibold text-gold-300 hover:text-gold-200 transition-colors flex items-center gap-1">
                        Learn more <ChevronRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal className="text-center mt-10">
            <Link to="/devotionals" className="inline-flex items-center gap-2 px-8 py-4 ih-btn-ghost text-white font-semibold">
              View Full Library <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 ih-section" aria-labelledby="testimonials-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <p className="ih-eyebrow mb-3">Testimonials</p>
            <h2 id="testimonials-heading" className="font-playfair text-3xl md:text-4xl font-bold text-white">
              What Families Are Saying
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t,i)=>(
              <ScrollReveal key={i} delay={i*90}>
                <div className="premium-card p-7 rounded-2xl ih-card h-full flex flex-col">
                  <div className="flex gap-1 mb-5" aria-label="5 stars">
                    {[...Array(5)].map((_,j)=><Star key={j} size={13} className="text-gold-400 fill-gold-400" aria-hidden="true" />)}
                  </div>
                  <p className="font-cormorant text-lg text-white/85 italic leading-relaxed flex-1 mb-5">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="w-9 h-9 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-300 text-sm font-bold shrink-0" aria-hidden="true">{t.author[0]}</div>
                    <div>
                      <p className="font-semibold text-white text-sm">{t.author}</p>
                      <p className="text-white/45 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 ih-section" aria-labelledby="newsletter-heading">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <div className="w-14 h-14 mx-auto mb-8 relative">
              <div className="w-full h-full rounded-full bg-gold-400/20 flex items-center justify-center">
                <Mail size={26} className="text-gold-300" aria-hidden="true" />
              </div>
            </div>
            <h2 id="newsletter-heading" className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
              Receive Daily Devotionals in Your Inbox
            </h2>
            <p className="text-white/55 text-lg mb-10 leading-relaxed">
              Don&apos;t rely only on WhatsApp. Get each day&apos;s devotional delivered directly to your email — and own your faith journey.
            </p>
            {nlSubmitted ? (
              <div className="p-8 rounded-2xl ih-card border-gold-400/30 animate-fade-in">
                <div className="w-11 h-11 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check size={22} className="text-green-400" aria-hidden="true" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-2">You&apos;re Subscribed!</h3>
                <p className="text-white/55">Welcome to the In Him Daily family, {nlName}. Watch your inbox for tomorrow&apos;s devotional.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-3.5" noValidate>
                <div className="flex flex-col sm:flex-row gap-3.5">
                  <input type="text" placeholder="Your Name" value={nlName} onChange={e=>setNlName(e.target.value)} required aria-label="Your name"
                    className="flex-1 px-5 py-3.5 ih-input transition-colors text-sm" />
                  <input type="email" placeholder="Email Address" value={nlEmail} onChange={e=>setNlEmail(e.target.value)} required aria-label="Email address"
                    className="flex-1 px-5 py-3.5 ih-input transition-colors text-sm" />
                </div>
                <button type="submit" className="w-full py-4 ih-btn-gold text-[0.9rem]">
                  Subscribe to Daily Devotionals
                </button>
                {nlError && <p className="text-red-400 text-xs text-center">{nlError}</p>}
                <p className="text-white/35 text-xs">We respect your privacy. No spam. Unsubscribe anytime.</p>
              </form>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* FREE SAMPLE CTA */}
      <section className="py-24 bg-navy-700 relative overflow-hidden" aria-labelledby="cta-heading">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{background:'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(201,152,58,0.10) 0%, transparent 70%)'}} />
        <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <div className="w-14 h-14 mx-auto mb-8 relative">
              <div className="w-full h-full rounded-full bg-gold-400/20 flex items-center justify-center">
                <BookOpen size={26} className="text-gold-300" aria-hidden="true" />
              </div>
              <div className="absolute inset-0 rounded-full bg-gold-400/10 animate-glow-pulse" aria-hidden="true" />
            </div>
            <h2 id="cta-heading" className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Start Your Faith Journey Today
            </h2>
            <p className="text-white/60 text-lg mb-10">
              Receive a free 7-day sample—all three editions, one scripture. See how In Him Daily transforms family devotion.
            </p>
            {submitted ? (
              <div className="p-8 rounded-2xl bg-gold-400/15 border border-gold-400/25 animate-fade-in">
                <div className="w-11 h-11 rounded-full bg-gold-400/25 flex items-center justify-center mx-auto mb-4">
                  <Check size={22} className="text-gold-300" aria-hidden="true" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-2">Your Sample Is On Its Way!</h3>
                <p className="text-white/60">Check your inbox, {firstName}. Your free 7-day devotional for all three generations is waiting.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
                <div className="flex flex-col sm:flex-row gap-3.5">
                  <input type="text" placeholder="First Name" value={firstName} onChange={e=>setFirstName(e.target.value)} required aria-label="First name"
                    className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/35 focus:outline-none focus:border-gold-400 transition-colors text-sm" />
                  <input type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} required aria-label="Email address"
                    className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/35 focus:outline-none focus:border-gold-400 transition-colors text-sm" />
                </div>
                <button type="submit" className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-navy-800 font-bold rounded-full transition-all duration-300 shadow-gold hover:-translate-y-0.5 text-[0.9rem]">
                  Send Me The Free Sample
                </button>
                {formError && <p className="text-red-300 text-xs text-center">{formError}</p>}
                <p className="text-white/30 text-xs">No spam. Just scripture. Unsubscribe anytime.</p>
              </form>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* CLOSING SCRIPTURE */}
      <section className="py-24 ih-section text-center" aria-label="Closing scripture">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="gold-divider mx-auto mb-10" aria-hidden="true" />
            <p className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-white italic leading-tight scripture-glow">
              &ldquo;For you died, and your life is now hidden with Christ in God.&rdquo;
            </p>
            <p className="mt-5 text-gold-400 text-[0.72rem] font-semibold tracking-[0.18em] uppercase">Colossians 3:3</p>
            <div className="gold-divider mx-auto mt-10" aria-hidden="true" />
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
