import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/devotionals', label: 'Devotionals' },
  { to: '/books', label: 'Books' },
  { to: '/blog', label: 'Blog' },
  { to: '/communities', label: 'Communities' },
  { to: '/prayer-partners', label: 'Prayer' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const MOBILE_LINKS = [
  ...LINKS,
  { to: '/donate', label: 'Donate' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || open ? 'bg-ink-900/95 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-playfair text-xl font-bold text-gold-300">In Him Daily</span>
          </Link>
          <div className="hidden lg:flex items-center gap-0.5">
            {LINKS.map((link) => (
              <Link key={link.to} to={link.to}
                className={`px-2.5 py-2 text-[0.83rem] font-medium rounded-lg whitespace-nowrap transition-colors ${location.pathname === link.to ? 'text-gold-300' : 'text-white/70 hover:text-white'}`}>
                {link.label}
              </Link>
            ))}
            <Link to="/free-sample" className="ml-2 px-4 py-2 ih-btn-gold text-sm whitespace-nowrap">Free Sample</Link>
          </div>
          <button className="lg:hidden p-2 text-white/70" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div className="lg:hidden pb-4 space-y-1">
            {MOBILE_LINKS.map((link) => (
              <Link key={link.to} to={link.to}
                className={`block px-4 py-2.5 text-sm font-medium rounded-lg ${location.pathname === link.to ? 'text-gold-300 bg-white/5' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                {link.label}
              </Link>
            ))}
            <Link to="/free-sample" className="block px-4 py-2.5 text-sm font-semibold text-gold-300">Free Sample</Link>
            {isAdmin && <Link to="/admin" className="block px-4 py-2.5 text-sm font-semibold text-gold-300">Dashboard</Link>}
          </div>
        )}
      </nav>
    </header>
  );
}
