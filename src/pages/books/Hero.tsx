import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { heroBooks } from './assets';

const glowColors = [
  'rgba(245,158,11,0.35)',
  'rgba(59,130,246,0.35)',
  'rgba(217,166,46,0.35)',
];

const rotations = ['-4deg', '0deg', '4deg'];

const descriptions = [
  'Faith-filled devotionals for young hearts.',
  'Biblical truth for the journey of growing up.',
  'Daily reflections rooted in Christ and Scripture.',
];

const collectionLinks = ['/devotionals', '/devotionals', '/devotionals'];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden pt-16 pb-12">
      {/* Background: subtle star particles + radial lighting + vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(217,166,46,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 40% 40% at 20% 60%, rgba(245,158,11,0.04) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 40% 40% at 80% 60%, rgba(59,130,246,0.04) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(5,7,13,0.6) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Book Showcase */}
      <div className="relative z-10 w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-[60px] lg:gap-[80px] pt-4"
          style={{ perspective: '1200px' }}
        >
          {heroBooks.map((book, i) => (
            <Link
              key={book.id}
              to={collectionLinks[i]}
              className="group flex flex-col items-center"
            >
              {/* Book with glow behind */}
              <div
                className="relative transition-all duration-[350ms] ease-out group-hover:-translate-y-3 group-hover:scale-[1.04]"
                style={{
                  transform: `rotateY(0deg) rotate(${rotations[i]})`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Soft radial glow behind book */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full blur-[60px] opacity-60 transition-opacity duration-[350ms] group-hover:opacity-90 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${glowColors[i]} 0%, transparent 70%)` }}
                  aria-hidden="true"
                />
                <div className="relative flex h-[360px] w-[min(78vw,300px)] items-center justify-center sm:h-[430px] sm:w-[min(28vw,340px)]">
                  <img
                    src={book.cover}
                    alt={`${book.title} devotional cover`}
                    loading="eager"
                    decoding="async"
                    className="relative block max-h-full max-w-full object-contain shadow-2xl"
                    style={{ filter: 'brightness(1.15) contrast(1.08)' }}
                  />
                </div>
              </div>

              {/* Labels underneath */}
              <div className="mt-6 text-center">
                <p className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide uppercase">
                  {book.title}
                </p>
                <p className="mt-1 text-[15px] sm:text-base text-[#D0D3D8]/70 tracking-wide">
                  {book.subtitle}
                </p>
                <p className="mt-2 text-sm text-[#D0D3D8]/60 max-w-[280px] leading-[1.5]">
                  {descriptions[i]}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-gold-300 font-semibold text-sm group-hover:gap-2 transition-all">
                  Explore Collection <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Headline — 70-100px below the book showcase */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-[80px]">
        <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
          One Story.
          <br className="sm:hidden" /> One Saviour.
          <br className="sm:hidden" /> Every Generation.
        </h1>

        <p className="mt-5 font-cinzel text-lg sm:text-2xl text-gold-300 tracking-wide">
          Discover Jesus on Every Page of Scripture.
        </p>

        <p className="mt-5 max-w-2xl mx-auto text-lg text-[#D0D3D8] leading-[1.6]">
          From Genesis to Revelation, every devotional reveals Christ through rich biblical
          teaching, beautiful artwork, and daily reflections designed for Kids, Teens, and Adults.
        </p>

        <p className="mt-4 font-cinzel text-sm sm:text-base text-[#D0D3D8] tracking-[0.15em]">
          290 DAYS · THREE SERIES · ONE LIFE-CHANGING JOURNEY
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/free-sample"
            className="inline-flex items-center gap-2 px-8 rounded-full text-[#05070D] font-bold transition-all hover:brightness-110"
            style={{ backgroundColor: '#D9A62E', height: '52px', borderRadius: '26px' }}
          >
            START READING TODAY <ArrowRight size={18} />
          </Link>
          <Link
            to="/books#collections"
            className="inline-flex items-center gap-2 px-8 rounded-full text-gold-300 font-semibold hover:bg-gold-400/10 transition-all"
            style={{ border: '1px solid #D9A62E', height: '52px', borderRadius: '26px' }}
          >
            VIEW EVERY COLLECTION <BookOpen size={18} />
          </Link>
        </div>

        {/* Available on */}
        <p className="mt-6 text-xs sm:text-sm text-[#D0D3D8]/70 tracking-widest uppercase">
          Available on · InHimDaily.org
        </p>

        {/* Scripture quote */}
        <blockquote className="mt-10 max-w-3xl mx-auto">
          <p className="font-cinzel text-xl sm:text-3xl text-white/90 italic leading-relaxed">
            &ldquo;These are the very Scriptures that testify about Me.&rdquo;
          </p>
          <footer className="mt-3 text-gold-300 text-sm tracking-[0.2em]">JOHN 5:39</footer>
        </blockquote>
      </div>
    </section>
  );
}
