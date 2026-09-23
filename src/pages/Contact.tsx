import { useState } from 'react';
import { Mail, MessageSquare, Heart, Check, ArrowRight } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import ScrollReveal from '@/components/ScrollReveal';
import LocationFields, { type LocationData } from '@/components/LocationFields';
import { insertPrayerRequest, insertNewsletterSubscriber } from '@/lib/supabase';

type FormType = 'contact' | 'prayer' | 'newsletter';

export default function ContactPage() {
  useSEO({
    title: 'Contact Us | In Him Daily',
    description: 'Get in touch with In Him Daily — send a message, share a prayer request, or subscribe to our newsletter. We read every message and respond personally.',
    canonicalPath: '/contact',
  });

  const [active, setActive]         = useState<FormType>('contact');
  const [submitted, setSubmitted]   = useState<FormType | null>(null);
  const [formError, setFormError]   = useState('');
  const [isSending, setIsSending]   = useState(false);

  const [cData, setCData]   = useState({ name:'', email:'', subject:'', message:'', location:{country:'',city_region:''} as LocationData });
  const [pData, setPData]   = useState({ name:'', email:'', request:'', location:{country:'',city_region:''} as LocationData });
  const [nData, setNData]   = useState({ name:'', email:'', location:{country:'',city_region:''} as LocationData });

  const inputCls  = "w-full px-5 py-3.5 rounded-xl ih-input text-white placeholder-white/35 transition-colors text-sm";
  const taCls     = `${inputCls} resize-none`;

  const sideItems = [
    { id:'contact' as FormType,    icon:Mail,          label:'General Contact',   desc:'Questions, feedback, partnerships' },
    { id:'prayer' as FormType,     icon:Heart,         label:'Prayer Request',    desc:'Share your prayer needs with us' },
    { id:'newsletter' as FormType, icon:MessageSquare, label:'Newsletter Signup', desc:'Stay updated on new content' },
  ];

  async function handleContactSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    if (!cData.location.country) {
      setFormError('Please select your country.');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cData.name,
          email: cData.email,
          subject: cData.subject,
          message: cData.message,
          country: cData.location.country,
          city_region: cData.location.city_region,
        }),
      });

      const result = await response.json().catch(() => ({})) as {
        error?: string | { message?: string };
      };

      if (!response.ok) {
        const message = typeof result.error === 'string'
          ? result.error
          : result.error?.message;
        throw new Error(message || 'Failed to send your message. Please try again.');
      }

      setSubmitted('contact');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-32 pb-24 bg-navy-700 overflow-hidden" aria-label="Contact hero">
        <div className="absolute inset-0 bg-cover bg-center" aria-hidden="true" style={{ backgroundImage: "url('https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=1920')", opacity: 0.2 }} />
        <div className="absolute inset-0" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(14,32,53,0.78) 0%, rgba(14,32,53,0.92) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 75%, rgba(201,152,58,0.11) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold-400 text-[0.72rem] font-semibold tracking-[0.16em] uppercase mb-4">Reach Out</p>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">Get in Touch</h1>
          <p className="text-white/65 text-xl max-w-xl mx-auto leading-relaxed">
            We'd love to hear from you—whether it's a question, a prayer request, or just a hello.
          </p>
        </div>
      </section>

      <section className="py-24 ih-section" aria-label="Contact forms">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="space-y-3">
              <ScrollReveal>
                <h2 className="font-playfair text-2xl font-bold text-white mb-5">How Can We Help?</h2>
              </ScrollReveal>
              {sideItems.map((item)=>(
                <ScrollReveal key={item.id}>
                  <button onClick={()=>{ setActive(item.id); setSubmitted(null); }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                      active===item.id ? 'ih-card border-gold-400/50' : 'ih-card-solid border-white/10 hover:border-gold-400/30'
                    }`}
                    aria-pressed={active===item.id}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active===item.id ? 'bg-gold-400/20' : 'bg-white/5'}`}>
                        <item.icon size={17} className={active===item.id ? 'text-gold-300' : 'text-white/50'} aria-hidden="true" />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${active===item.id ? 'text-white' : 'text-white/70'}`}>{item.label}</p>
                        <p className={`text-xs mt-0.5 ${active===item.id ? 'text-white/55' : 'text-white/40'}`}>{item.desc}</p>
                      </div>
                    </div>
                  </button>
                </ScrollReveal>
              ))}
              <ScrollReveal delay={180}>
                <div className="mt-6 p-5 ih-card-solid rounded-2xl">
                  <h3 className="font-playfair font-bold text-white mb-3 text-base">Contact</h3>
                  <a href="mailto:hello@inhimdaily.org" className="flex items-center gap-2 text-sm text-white/55 hover:text-gold-300 transition-colors">
                    <Mail size={13} aria-hidden="true" /> hello@inhimdaily.org
                  </a>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-2">
              <ScrollReveal>
                <div className="ih-card p-8">
                  {active === 'contact' && (
                    submitted === 'contact' ? (
                      <div className="text-center py-12">
                        <div className="w-14 h-14 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center mx-auto mb-5">
                          <Check size={22} className="text-gold-600" aria-hidden="true" />
                        </div>
                        <h3 className="font-playfair text-2xl font-bold text-white mb-2">Message Received!</h3>
                        <p className="text-white/55">Thank you, {cData.name}. We'll reply within 24–48 hours.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-4" noValidate>
                        <div>
                          <h2 className="font-playfair text-2xl font-bold text-white mb-1">Send a Message</h2>
                          <p className="text-white/55 text-sm">We read every message and respond personally.</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3.5">
                          <input type="text" placeholder="Your Name *" value={cData.name} onChange={e=>setCData({...cData,name:e.target.value})} required aria-label="Your name" className={inputCls} />
                          <input type="email" placeholder="Email Address *" value={cData.email} onChange={e=>setCData({...cData,email:e.target.value})} required aria-label="Email address" className={inputCls} />
                        </div>
                        <input type="text" placeholder="Subject" value={cData.subject} onChange={e=>setCData({...cData,subject:e.target.value})} required aria-label="Subject" className={inputCls} />
                        <textarea placeholder="Your message…" value={cData.message} onChange={e=>setCData({...cData,message:e.target.value})} required rows={5} aria-label="Message" className={taCls} />
                        <LocationFields value={cData.location} onChange={(loc)=>setCData({...cData,location:loc})} />
                        <button type="submit" disabled={isSending} className="inline-flex items-center gap-2 px-7 py-3.5 ih-btn-gold disabled:cursor-not-allowed disabled:opacity-60">
                          {isSending ? 'Sending…' : 'Send Message'} <ArrowRight size={15} aria-hidden="true" />
                        </button>
                        {formError && <p className="text-red-400 text-xs">{formError}</p>}
                      </form>
                    )
                  )}

                  {active === 'prayer' && (
                    submitted === 'prayer' ? (
                      <div className="text-center py-12">
                        <div className="w-14 h-14 rounded-full bg-gold-400/15 border border-gold-400/30 flex items-center justify-center mx-auto mb-5">
                          <Heart size={22} className="text-gold-300 fill-gold-400/30" aria-hidden="true" />
                        </div>
                        <h3 className="font-playfair text-2xl font-bold text-white mb-2">We'll Pray For You</h3>
                        <p className="text-white/55">Thank you, {pData.name}. Your request is in safe hands.</p>
                      </div>
                    ) : (
                      <form onSubmit={async (e)=>{ e.preventDefault(); setFormError(''); try { await insertPrayerRequest({name:pData.name, email:pData.email||undefined, request:pData.request, country:pData.location.country||undefined, city_region:pData.location.city_region||undefined}); setSubmitted('prayer'); } catch { setFormError('Something went wrong. Please try again.'); } }} className="space-y-4" noValidate>
                        <div>
                          <h2 className="font-playfair text-2xl font-bold text-white mb-1">Submit a Prayer Request</h2>
                          <p className="text-white/55 text-sm">Your request will be held in confidence and prayed over faithfully.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gold-400/10 border border-gold-400/20">
                          <p className="font-cormorant text-lg text-white italic">&ldquo;Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God.&rdquo;</p>
                          <p className="text-gold-300 text-[0.72rem] font-semibold mt-2">Philippians 4:6</p>
                        </div>
                        <input type="text" placeholder="Your Name" value={pData.name} onChange={e=>setPData({...pData,name:e.target.value})} required aria-label="Your name" className={inputCls} />
                        <input type="email" placeholder="Email (optional)" value={pData.email} onChange={e=>setPData({...pData,email:e.target.value})} aria-label="Email address (optional)" className={inputCls} />
                        <textarea placeholder="Share your prayer request…" value={pData.request} onChange={e=>setPData({...pData,request:e.target.value})} required rows={5} aria-label="Prayer request" className={taCls} />
                        <LocationFields value={pData.location} onChange={(loc)=>setPData({...pData,location:loc})} />
                        <button type="submit" className="inline-flex items-center gap-2 px-7 py-3.5 ih-btn-gold">
                          Submit Request <Heart size={15} aria-hidden="true" />
                        </button>
                        {formError && <p className="text-red-400 text-xs">{formError}</p>}
                      </form>
                    )
                  )}

                  {active === 'newsletter' && (
                    submitted === 'newsletter' ? (
                      <div className="text-center py-12">
                        <div className="w-14 h-14 rounded-full bg-gold-400/15 border border-gold-400/30 flex items-center justify-center mx-auto mb-5">
                          <Check size={22} className="text-gold-300" aria-hidden="true" />
                        </div>
                        <h3 className="font-playfair text-2xl font-bold text-white mb-2">You're Subscribed!</h3>
                        <p className="text-white/55">Welcome, {nData.name}! Look out for updates from In Him Daily.</p>
                      </div>
                    ) : (
                      <form onSubmit={async (e)=>{ e.preventDefault(); setFormError(''); try { await insertNewsletterSubscriber({name:nData.name,email:nData.email,country:nData.location.country||undefined,city_region:nData.location.city_region||undefined}); setSubmitted('newsletter'); } catch { setFormError('Something went wrong. Please try again.'); } }} className="space-y-4" noValidate>
                        <div>
                          <h2 className="font-playfair text-2xl font-bold text-white mb-1">Subscribe to Our Newsletter</h2>
                          <p className="text-white/55 text-sm">New content, family resources, and ministry updates.</p>
                        </div>
                        <ul className="space-y-2" role="list">
                          {['New devotional series announcements','Free bonus content','Prayer partner updates','Ministry news and stories'].map((item,i)=>(
                            <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                              <Check size={13} className="text-gold-400" aria-hidden="true" /> {item}
                            </li>
                          ))}
                        </ul>
                        <input type="text" placeholder="Your First Name" value={nData.name} onChange={e=>setNData({...nData,name:e.target.value})} required aria-label="First name" className={inputCls} />
                        <input type="email" placeholder="Email Address" value={nData.email} onChange={e=>setNData({...nData,email:e.target.value})} required aria-label="Email address" className={inputCls} />
                        <LocationFields value={nData.location} onChange={(loc)=>setNData({...nData,location:loc})} />
                        <button type="submit" className="inline-flex items-center gap-2 px-7 py-3.5 ih-btn-gold">
                          Subscribe <ArrowRight size={15} aria-hidden="true" />
                        </button>
                        {formError && <p className="text-red-400 text-xs">{formError}</p>}
                        <p className="text-white/35 text-xs">No spam. Unsubscribe anytime.</p>
                      </form>
                    )
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 ih-section text-center" aria-label="Closing scripture">
        <div className="max-w-xl mx-auto px-4">
          <ScrollReveal>
            <div className="gold-divider mx-auto mb-7" aria-hidden="true" />
            <p className="font-cormorant text-3xl text-white italic leading-relaxed">&ldquo;Ask and it will be given to you; seek and you will find.&rdquo;</p>
            <p className="text-gold-400 text-[0.72rem] font-semibold mt-3 tracking-[0.18em] uppercase">Matthew 7:7</p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
