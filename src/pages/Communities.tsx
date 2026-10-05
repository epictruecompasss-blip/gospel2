import { useState } from 'react';
import { ExternalLink, Check, Users, Youtube, Facebook, Instagram, Shield, Clock, AlertCircle } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import ScrollReveal from '@/components/ScrollReveal';
import LocationFields, { type LocationData } from '@/components/LocationFields';
import { insertCommunityJoinRequest } from '@/lib/supabase';

function WhatsAppIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type CommunityId = 'adults' | 'teens' | 'kids';

const whatsappGroups: {
  id: CommunityId;
  label: string;
  tag: string;
  gradA: string;
  gradB: string;
  glow: string;
  description: string;
  features: string[];
  qrImage: string;
  members: string;
  requiresParent: boolean;
}[] = [
  {
    id: 'adults',
    label: 'Adults',
    tag: 'Depth · Reflection · Encounter',
    gradA: '#17324D',
    gradB: '#1E4F72',
    glow: 'rgba(23,50,77,0.22)',
    description: 'Deep daily discussions, reflection questions, prayer encouragement, and meaningful conversations around each devotional encounter.',
    features: ['Daily reflection threads', 'Prayer requests & support', 'Weekly scripture deep-dives', 'Group accountability'],
    qrImage: '/images/communities/IMG_20260714_211254.jpg',
    members: '500+',
    requiresParent: false,
  },
  {
    id: 'teens',
    label: 'Teens',
    tag: 'Real · Honest · Alive',
    gradA: '#C9983A',
    gradB: '#A87D2C',
    glow: 'rgba(201,152,58,0.22)',
    description: 'A place for honest questions, authentic conversations, scripture reflections, and growing deeper with Jesus alongside other teens.',
    features: ['Honest Q&A threads', 'Peer encouragement', 'Scripture challenges', 'Teen prayer circle'],
    qrImage: '/images/communities/IMG_20260714_211131.jpg',
    members: '300+',
    requiresParent: false,
  },
  {
    id: 'kids',
    label: 'Kids',
    tag: 'Fun · Safe · Growing',
    gradA: '#6B5BA8',
    gradB: '#8470DC',
    glow: 'rgba(107,91,168,0.22)',
    description: 'A parent-guided community where children stay connected to the devotional journey through fun engagement, prayer, and family discussions.',
    features: ['Parent-guided space', 'Fun family activities', "Children's prayer wall", 'Weekly family challenges'],
    qrImage: '/images/communities/IMG_20260714_211224.jpg',
    members: '250+',
    requiresParent: true,
  },
];

const socialLinks = [
  {
    id: 'youtube',
    label: 'YouTube',
    handle: '@InHimDaily',
    description: 'Watch devotional teachings, scripture reflections, and family faith content on our YouTube channel.',
    link: 'https://www.youtube.com/channel/UCXbhOCzUufGVQ6n5amOf3GQ',
    Icon: Youtube,
    color: '#FF0000',
    bg: 'rgba(255,0,0,0.08)',
    border: 'rgba(255,0,0,0.18)',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    handle: 'Inhimdaily',
    description: 'Follow us on Facebook for daily devotional posts, community updates, and family faith encouragement.',
    link: 'https://www.facebook.com/people/Inhimdaily/61591293759943/',
    Icon: Facebook,
    color: '#1877F2',
    bg: 'rgba(24,119,242,0.08)',
    border: 'rgba(24,119,242,0.18)',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@inhimdailyministries',
    description: 'Daily scripture graphics, devotional highlights, and behind-the-scenes moments from In Him Daily.',
    link: 'https://www.instagram.com/inhimdailyministries/',
    Icon: Instagram,
    color: '#E1306C',
    bg: 'rgba(225,48,108,0.08)',
    border: 'rgba(225,48,108,0.18)',
  },
];

const safetyGuidelines = [
  'All join requests are reviewed by our moderation team before access is granted.',
  'The Kids community requires a parent or guardian\'s name and email for approval.',
  'Group admins reserve the right to remove content or members that violate community guidelines.',
  'No personal information (phone numbers, home addresses) should be shared in group chats.',
  'All groups are Christ-centred spaces — respectful, encouraging, and grounded in Scripture.',
];

export default function CommunitiesPage() {
  useSEO({
    title: 'Communities | In Him Daily',
    description: 'Join thousands of believers growing daily in Christ through our WhatsApp communities for adults, teens, and kids — plus YouTube, Facebook, and Instagram.',
    canonicalPath: '/communities',
  });

  const [selectedCommunity, setSelectedCommunity] = useState<CommunityId | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState<LocationData>({ country: '', city_region: '' });
  const [ageRange, setAgeRange] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const inputCls = "w-full px-5 py-3.5 rounded-xl ih-input text-white placeholder-white/35 transition-colors text-sm";

  const selectedGroup = whatsappGroups.find(g => g.id === selectedCommunity);

  function openJoinForm(communityId: CommunityId) {
    setSelectedCommunity(communityId);
    setSubmitted(false);
    setFormError('');
    setSubmitting(false);
  }

  function closeJoinForm() {
    setSelectedCommunity(null);
    setName('');
    setEmail('');
    setPhone('');
    setLocation({ country: '', city_region: '' });
    setAgeRange('');
    setParentName('');
    setParentEmail('');
    setMessage('');
    setFormError('');
    setSubmitted(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!name || !email) {
      setFormError('Please fill in your name and email.');
      return;
    }
    if (!selectedCommunity) return;
    if (selectedGroup?.requiresParent && (!parentName || !parentEmail)) {
      setFormError('Please provide a parent or guardian\'s name and email for the Kids community.');
      return;
    }
    setSubmitting(true);
    try {
      await insertCommunityJoinRequest({
        name,
        email,
        phone: phone || undefined,
        community: selectedCommunity,
        country: location.country || undefined,
        city_region: location.city_region || undefined,
        parent_name: parentName || undefined,
        parent_email: parentEmail || undefined,
        age_range: ageRange || undefined,
        message: message || undefined,
      });
      setSubmitted(true);
    } catch {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative pt-32 pb-20 bg-navy-700 overflow-hidden" aria-label="Communities hero">
        <div className="absolute inset-0 bg-cover bg-center" aria-hidden="true" style={{ backgroundImage: "url('https://images.pexels.com/photos/8108066/pexels-photo-8108066.jpeg?auto=compress&cs=tinysrgb&w=1920')", opacity: 0.2 }} />
        <div className="absolute inset-0" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(14,32,53,0.78) 0%, rgba(14,32,53,0.92) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 65%, rgba(201,152,58,0.13) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden="true"
          style={{ backgroundImage: 'radial-gradient(circle, #E4B86A 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/15 border border-[#25D366]/25 mb-8">
            <WhatsAppIcon size={14} className="text-[#25D366]" />
            <span className="text-[#25D366] text-[0.68rem] font-bold tracking-[0.15em] uppercase">Our Communities</span>
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            You Were Never Meant<br />
            <span className="text-gold-gradient">to Walk Alone</span>
          </h1>
          <p className="text-white/65 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Join thousands of believers growing daily in Christ — across WhatsApp communities, YouTube, Facebook, and Instagram.
            Find your generation and continue the journey together.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#whatsapp" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#25D366] hover:bg-[#1DB954] text-white font-bold text-sm rounded-full transition-all duration-300 shadow-lg hover:-translate-y-0.5">
              <WhatsAppIcon size={16} />
              Request to Join
            </a>
            <a href="#social" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/25 text-white/80 hover:text-white hover:border-white/45 font-medium text-sm rounded-full transition-all duration-200">
              Follow on Social Media
            </a>
          </div>
        </div>
      </section>

      {/* WHATSAPP SECTION */}
      <section id="whatsapp" className="py-24 ih-section relative overflow-hidden" aria-labelledby="whatsapp-heading">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: 'radial-gradient(circle at 10% 50%, rgba(37,211,102,0.05) 0%, transparent 55%), radial-gradient(circle at 90% 20%, rgba(23,50,77,0.04) 0%, transparent 55%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 border border-[#25D366]/22 mb-6">
              <WhatsAppIcon size={14} className="text-[#128C7E]" />
              <span className="text-[#128C7E] text-[0.68rem] font-bold tracking-[0.15em] uppercase">WhatsApp Communities</span>
            </div>
            <h2 id="whatsapp-heading" className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Three Groups. One Family.
            </h2>
            <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
              Request to join the community that matches your generation. Each request is reviewed by our moderation team
              to keep every group safe and Christ-centred.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-7 lg:gap-8">
            {whatsappGroups.map((group, i) => (
              <ScrollReveal key={group.id} delay={i * 100}>
                <div
                  className="rounded-3xl overflow-hidden ih-card flex flex-col transition-all duration-300 hover:-translate-y-2"
                  style={{
                    borderColor: `${group.gradA}22`,
                    boxShadow: `0 8px 32px ${group.glow}`,
                  }}
                >
                  {/* Top accent bar */}
                  <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${group.gradA}, ${group.gradB})` }} aria-hidden="true" />

                  <div className="p-7 flex flex-col flex-1">
                    {/* Header */}
                    <div className="mb-5">
                      <p className="font-playfair text-2xl font-bold text-white leading-none mb-1">{group.label}</p>
                      <p className="text-[0.68rem] font-semibold tracking-wider" style={{ color: group.gradA }}>{group.tag}</p>
                    </div>

                    {/* QR Code */}
                    <div className="mb-6 relative">
                      <div className="relative rounded-2xl overflow-hidden border-2 bg-white p-3 mx-auto w-fit"
                        style={{ borderColor: `${group.gradA}20` }}>
                        <img
                          src={group.qrImage}
                          alt={`QR code for the ${group.label} WhatsApp community`}
                          className="w-48 h-48 object-cover rounded-xl"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg">
                          <WhatsAppIcon size={16} className="text-white" />
                        </div>
                      </div>
                      <p className="text-center text-xs text-white/40 mt-3 font-medium">Scan to preview the community</p>
                    </div>

                    <p className="text-white/60 text-sm leading-relaxed mb-5">{group.description}</p>

                    <ul className="space-y-2 mb-5 flex-1" role="list">
                      {group.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2.5 text-xs text-white/65">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: `${group.gradA}15` }}>
                            <Check size={9} style={{ color: group.gradA }} aria-hidden="true" />
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center gap-1.5 mb-5">
                      <Users size={12} className="text-white/40" aria-hidden="true" />
                      <span className="text-xs text-white/45">{group.members} members growing daily</span>
                    </div>

                    {/* Approval badge */}
                    {group.requiresParent && (
                      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
                        <Shield size={14} className="text-gold-300 shrink-0" aria-hidden="true" />
                        <p className="text-[0.68rem] text-white/50 leading-relaxed">
                          Parent or guardian approval required to join.
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => openJoinForm(group.id)}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
                      style={{
                        background: `linear-gradient(130deg, ${group.gradA}, ${group.gradB})`,
                        color: '#FAF8F3',
                      }}
                    >
                      <WhatsAppIcon size={16} />
                      Request to Join {group.label}
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* How to join note */}
          <ScrollReveal className="mt-12">
            <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-[#25D366]/8 border border-[#25D366]/20 text-center">
              <p className="text-sm text-white/70 leading-relaxed">
                <span className="font-semibold text-white">How to join:</span> Tap the "Request to Join" button and fill out the short form.
                Our moderation team will review your request and send the WhatsApp invite link to your email — usually within 24 hours.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SAFETY GUIDELINES SECTION */}
      <section className="py-20 bg-navy-700 relative overflow-hidden" aria-labelledby="safety-heading">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: 'radial-gradient(circle at 50% 80%, rgba(201,152,58,0.06) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/10 border border-gold-400/22 mb-6">
              <Shield size={14} className="text-gold-300" aria-hidden="true" />
              <span className="text-gold-300 text-[0.68rem] font-bold tracking-[0.15em] uppercase">Community Safety</span>
            </div>
            <h2 id="safety-heading" className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
              Safe, Organized, Christ-Centred
            </h2>
            <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
              We take the safety of every member seriously — especially our children. Here's how we keep our communities healthy.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-4">
            {safetyGuidelines.map((guideline, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="flex items-start gap-3 p-5 rounded-2xl ih-card">
                  <div className="w-8 h-8 rounded-full bg-gold-400/15 border border-gold-400/25 flex items-center justify-center shrink-0">
                    <Check size={14} className="text-gold-300" aria-hidden="true" />
                  </div>
                  <p className="text-white/65 text-sm leading-relaxed">{guideline}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA SECTION */}
      <section id="social" className="py-24 ih-section relative overflow-hidden" aria-labelledby="social-heading">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" aria-hidden="true"
          style={{ backgroundImage: 'radial-gradient(circle, #E4B86A 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <p className="text-gold-400 text-[0.72rem] font-semibold tracking-[0.16em] uppercase mb-3">Follow Us</p>
            <h2 id="social-heading" className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Stay Connected Everywhere
            </h2>
            <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
              Follow In Him Daily across all platforms and never miss a devotional, teaching, or word of encouragement.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-6 lg:gap-7">
            {socialLinks.map((social, i) => (
              <ScrollReveal key={social.id} delay={i * 100}>
                <a
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow In Him Daily on ${social.label} — opens in new tab`}
                  className="group block rounded-3xl p-7 border-2 transition-all duration-300 hover:-translate-y-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.10)',
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: social.bg, border: `1.5px solid ${social.border}` }}
                  >
                    <social.Icon size={26} style={{ color: social.color }} aria-hidden="true" />
                  </div>

                  <p className="font-playfair text-xl font-bold text-white mb-1">{social.label}</p>
                  <p className="text-[0.72rem] font-semibold tracking-wide mb-3" style={{ color: social.color }}>{social.handle}</p>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">{social.description}</p>

                  <div
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300"
                    style={{ background: social.bg, color: social.color, border: `1.5px solid ${social.border}` }}
                  >
                    Follow on {social.label}
                    <ExternalLink size={13} aria-hidden="true" />
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>

          {/* Scripture callout */}
          <ScrollReveal className="mt-16 max-w-2xl mx-auto text-center">
            <div className="gold-divider mx-auto mb-8" aria-hidden="true" />
            <p className="font-cormorant text-2xl md:text-3xl text-gold-200 italic leading-relaxed">
              &ldquo;And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together.&rdquo;
            </p>
            <p className="mt-4 text-gold-500 text-[0.72rem] font-semibold tracking-[0.18em] uppercase">Hebrews 10:24–25</p>
            <div className="gold-divider mx-auto mt-8" aria-hidden="true" />
          </ScrollReveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 ih-section text-center" aria-label="Final community call to action">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="w-14 h-14 mx-auto mb-7 rounded-full bg-[#25D366]/15 flex items-center justify-center">
              <WhatsAppIcon size={26} className="text-[#25D366]" />
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
              Find Your Community Today
            </h2>
            <p className="text-white/55 text-lg mb-8 leading-relaxed">
              Every encounter with Jesus becomes richer when shared with others. Request to join and become part of thousands already walking together in faith.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#whatsapp" onClick={e => { e.preventDefault(); document.getElementById('whatsapp')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 ih-btn-gold">
                <WhatsAppIcon size={17} />
                Request to Join a Group
              </a>
              <a href="#social" onClick={e => { e.preventDefault(); document.getElementById('social')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 ih-btn-ghost">
                Follow on Social
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* JOIN REQUEST MODAL */}
      {selectedCommunity && selectedGroup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeJoinForm}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl ih-card border-gold-400/20 p-7 md:p-8"
            onClick={e => e.stopPropagation()}
          >
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center mx-auto mb-6">
                  <Check size={28} className="text-green-400" aria-hidden="true" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-3">Request Received!</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  Thank you{name ? `, ${name}` : ''}! Your request to join the <span className="text-gold-300 font-semibold">{selectedGroup.label}</span> community has been received.
                  Our moderation team will review it and send the WhatsApp invite link to {email || 'your email'} — usually within 24 hours.
                </p>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left mb-6">
                  <p className="text-[0.68rem] font-bold text-gold-300 uppercase tracking-[0.12em] mb-2">What Happens Next</p>
                  <ul className="space-y-2" role="list">
                    <li className="flex items-start gap-2.5 text-sm text-white/60">
                      <Clock size={14} className="text-gold-300 mt-0.5 shrink-0" aria-hidden="true" />
                      Our team reviews your request (usually within 24 hours).
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-white/60">
                      <Check size={14} className="text-green-400 mt-0.5 shrink-0" aria-hidden="true" />
                      If approved, you'll receive the WhatsApp invite link by email.
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-white/60">
                      <Check size={14} className="text-green-400 mt-0.5 shrink-0" aria-hidden="true" />
                      Join the group and start growing with your community.
                    </li>
                  </ul>
                </div>
                <button onClick={closeJoinForm} className="px-6 py-3 ih-btn-gold text-sm font-bold rounded-full">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${selectedGroup.gradA}15`, border: `1px solid ${selectedGroup.gradA}30` }}>
                    <WhatsAppIcon size={18} className="" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-bold text-white">Join the {selectedGroup.label} Community</h3>
                    <p className="text-white/45 text-xs">{selectedGroup.tag}</p>
                  </div>
                </div>

                {selectedGroup.requiresParent && (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-gold-400/8 border border-gold-400/20 mb-5">
                    <AlertCircle size={16} className="text-gold-300 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-gold-200/80 text-xs leading-relaxed">
                      This is a parent-guided community. Please provide a parent or guardian's name and email — we'll contact them before approving your request.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <input type="text" placeholder="Your Name *" value={name} onChange={e=>setName(e.target.value)} required aria-label="Your name" className={inputCls} />
                    <input type="email" placeholder="Email Address *" value={email} onChange={e=>setEmail(e.target.value)} required aria-label="Email address" className={inputCls} />
                  </div>

                  <input type="tel" placeholder="Phone Number (for WhatsApp invite)" value={phone} onChange={e=>setPhone(e.target.value)} aria-label="Phone number" className={inputCls} />

                  <LocationFields value={location} onChange={setLocation} />

                  {(selectedCommunity === 'teens' || selectedCommunity === 'kids') && (
                    <div>
                      <label className="block text-[0.72rem] font-semibold text-white/50 mb-1.5 tracking-wider uppercase">Age Range</label>
                      <select value={ageRange} onChange={e=>setAgeRange(e.target.value)} aria-label="Age range" className={inputCls}>
                        <option value="">Select age range…</option>
                        {selectedCommunity === 'kids'
                          ? ['5–7', '8–10', '11–12'].map(a => <option key={a} value={a}>{a}</option>)
                          : ['13–15', '16–18'].map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  )}

                  {selectedGroup.requiresParent && (
                    <div className="space-y-3.5 p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[0.68rem] font-bold text-gold-300 uppercase tracking-[0.12em]">Parent / Guardian Information</p>
                      <input type="text" placeholder="Parent / Guardian Name *" value={parentName} onChange={e=>setParentName(e.target.value)} required={selectedGroup.requiresParent} aria-label="Parent or guardian name" className={inputCls} />
                      <input type="email" placeholder="Parent / Guardian Email *" value={parentEmail} onChange={e=>setParentEmail(e.target.value)} required={selectedGroup.requiresParent} aria-label="Parent or guardian email" className={inputCls} />
                    </div>
                  )}

                  <div>
                    <label className="block text-[0.72rem] font-semibold text-white/50 mb-1.5 tracking-wider uppercase">Message <span className="text-white/30 normal-case">(optional)</span></label>
                    <textarea
                      placeholder="Tell us a bit about yourself or why you'd like to join…"
                      value={message}
                      onChange={e=>setMessage(e.target.value)}
                      rows={2}
                      aria-label="Optional message"
                      className={inputCls + ' resize-none'}
                    />
                  </div>

                  {formError && <p className="text-red-400 text-xs text-center">{formError}</p>}

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={closeJoinForm} className="flex-1 py-3.5 ih-btn-ghost text-sm font-semibold rounded-xl">
                      Cancel
                    </button>
                    <button type="submit" disabled={submitting} className="flex-1 py-3.5 ih-btn-gold text-sm font-bold rounded-xl disabled:opacity-50">
                      {submitting ? 'Sending…' : 'Submit Request'}
                    </button>
                  </div>
                  <p className="text-white/30 text-xs text-center flex items-center justify-center gap-1.5">
                    <Shield size={11} aria-hidden="true" /> Your request is reviewed by our team before access is granted.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
