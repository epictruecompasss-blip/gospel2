import { Users, BookOpen, MessageCircle, Star, Heart, Check, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const communities = [
  {
    id:    'adults',
    label: 'Adults',
    tag:   'Depth · Reflection · Encounter',
    Icon:  BookOpen,
    gradA: '#17324D',
    gradB: '#1E4F72',
    glow:  'rgba(23,50,77,0.28)',
    description: 'Deep daily discussions, reflection questions, prayer encouragement, and meaningful conversations around each devotional encounter.',
    features: ['Daily reflection threads','Prayer requests & support','Weekly scripture deep-dives','Group accountability'],
    members: '500+',
    requiresParent: false,
  },
  {
    id:    'teens',
    label: 'Teens',
    tag:   'Real · Honest · Alive',
    Icon:  MessageCircle,
    gradA: '#C9983A',
    gradB: '#A87D2C',
    glow:  'rgba(201,152,58,0.28)',
    description: 'A place for honest questions, authentic conversations, scripture reflections, and growing deeper with Jesus alongside other teens.',
    features: ['Honest Q&A threads','Peer encouragement','Scripture challenges','Teen prayer circle'],
    members: '300+',
    requiresParent: false,
  },
  {
    id:    'kids',
    label: 'Kids',
    tag:   'Fun · Safe · Growing',
    Icon:  Star,
    gradA: '#6B5BA8',
    gradB: '#8470DC',
    glow:  'rgba(107,91,168,0.28)',
    description: 'A parent-guided community where children stay connected to the devotional journey through fun engagement, prayer, and family discussions.',
    features: ['Parent-guided space','Fun family activities',"Children's prayer wall",'Weekly family challenges'],
    members: '250+',
    requiresParent: true,
  },
];

const whyItems = [
  { Icon: Heart,         text: 'Daily Encouragement' },
  { Icon: BookOpen,      text: 'Scripture Discussions' },
  { Icon: MessageCircle, text: 'Prayer Support' },
  { Icon: Users,         text: 'Family Connection' },
  { Icon: Star,          text: 'Community Accountability' },
];

function WhatsAppIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function WhatsAppCommunity() {
  return (
    <section className="py-24 bg-ivory-200 relative overflow-hidden" id="community" aria-labelledby="community-heading">
      {/* ambient bg */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: 'radial-gradient(circle at 15% 50%, rgba(201,152,58,0.06) 0%, transparent 55%), radial-gradient(circle at 85% 20%, rgba(23,50,77,0.05) 0%, transparent 55%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 border border-[#25D366]/22 mb-6">
            <WhatsAppIcon size={14} className="text-[#128C7E]" />
            <span className="text-[#128C7E] text-[0.68rem] font-bold tracking-[0.15em] uppercase">WhatsApp Communities</span>
          </div>
          <h2 id="community-heading" className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-navy-700 mb-4 leading-tight">
            Continue the Journey Together
          </h2>
          <p className="text-[#6B6B6B] text-lg max-w-2xl mx-auto leading-relaxed">
            The encounter doesn't end when today's reading is finished.{' '}
            <span className="text-navy-700 font-medium">Join believers from your generation</span>{' '}
            as we read, pray, reflect, and grow together every day.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-7 mb-12">
          {communities.map((c) => (
            <div key={c.id}
              className="relative rounded-3xl overflow-hidden transition-all duration-400"
              style={{ boxShadow: '0 4px 20px rgba(23,50,77,0.07)' }}
            >
              {/* glass bg */}
              <div className="absolute inset-0" style={{ background: 'rgba(250,248,243,0.96)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} aria-hidden="true" />
              {/* border */}
              <div className="absolute inset-0 rounded-3xl border-2 pointer-events-none transition-all duration-400"
                style={{ borderColor: 'rgba(201,152,58,0.14)' }} aria-hidden="true" />

              {/* Content */}
              <div className="relative z-10 p-7">
                {/* top bar */}
                <div className="w-full h-0.5 rounded-full mb-6"
                  style={{ background:`linear-gradient(90deg, ${c.gradA}, ${c.gradB})`, opacity: 0.45 }} aria-hidden="true" />

                {/* icon + label */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0"
                    style={{ background:`${c.gradA}14`, border:`1px solid ${c.gradA}28` }}>
                    <c.Icon size={21} style={{ color: c.gradA }} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-playfair text-xl font-bold text-navy-700">{c.label}</p>
                    <p className="text-[0.68rem] font-medium tracking-wider" style={{ color: c.gradA }}>{c.tag}</p>
                  </div>
                </div>

                <p className="text-[#6B6B6B] text-sm leading-relaxed mb-5">{c.description}</p>

                <ul className="space-y-2 mb-6" role="list">
                  {c.features.map((f,i)=>(
                    <li key={i} className="flex items-center gap-2.5 text-xs text-navy-600">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background:`${c.gradA}15` }}>
                        <Check size={9} style={{ color: c.gradA }} aria-hidden="true" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-1.5 mb-4">
                  <Users size={12} className="text-navy-300" aria-hidden="true" />
                  <span className="text-xs text-navy-400">{c.members} members growing daily</span>
                </div>

                {/* Approval badge for kids */}
                {c.requiresParent && (
                  <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl bg-gold-50 border border-gold-200">
                    <Shield size={13} className="text-gold-600 shrink-0" aria-hidden="true" />
                    <p className="text-[0.68rem] text-navy-500 leading-relaxed">
                      Parent or guardian approval required.
                    </p>
                  </div>
                )}

                {/* CTA — links to communities page for approval */}
                <Link to="/communities#whatsapp"
                  aria-label={`Request to join the ${c.label} community`}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 hover:opacity-90"
                  style={{
                    background: `${c.gradA}12`,
                    color: c.gradA,
                    border: `1.5px solid ${c.gradA}35`,
                  }}>
                  <WhatsAppIcon size={16} />
                  Request to Join
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Why join bar */}
        <div className="flex flex-wrap justify-center gap-x-7 gap-y-3 py-7 px-6 rounded-2xl bg-white border border-ivory-300 shadow-sm mb-14">
          <p className="w-full text-center text-[0.68rem] font-bold text-navy-400 uppercase tracking-[0.14em] mb-0.5">Why Join?</p>
          {whyItems.map((item,i)=>(
            <div key={i} className="flex items-center gap-2 text-sm text-navy-700 font-medium">
              <div className="w-6 h-6 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center">
                <item.Icon size={11} className="text-gold-600" aria-hidden="true" />
              </div>
              {item.text}
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div className="max-w-xl mx-auto">
          <div className="p-10 rounded-3xl bg-navy-700 border border-white/10 relative overflow-hidden text-center">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
              style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(201,152,58,0.09) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <h3 className="font-playfair text-3xl font-bold text-white mb-3">You Were Never Meant to Walk Alone</h3>
              <p className="font-cormorant text-xl text-gold-200 italic mb-1">&ldquo;Come and see.&rdquo;</p>
              <p className="text-gold-500 text-[0.72rem] font-semibold tracking-wider mb-5">John 1:39</p>
              <p className="text-white/55 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                Every encounter with Jesus becomes richer when shared with others. Find your generation. Join the conversation.
              </p>
              <Link to="/communities#whatsapp"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-800 font-bold rounded-full transition-all duration-300 shadow-gold hover:-translate-y-0.5"
                aria-label="Go to communities page to request to join">
                <WhatsAppIcon size={17} />
                Request to Join Your Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
