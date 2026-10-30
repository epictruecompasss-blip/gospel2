import { Link } from 'react-router-dom';
import { Heart, Youtube, Instagram, Facebook } from 'lucide-react';

// TikTok and WhatsApp icons (not in lucide-react)
function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/>
    </svg>
  );
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink-800/50 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-playfair text-lg font-bold text-gold-300 mb-3">In Him Daily</h3>
            <p className="text-sm text-white/50 leading-relaxed max-w-md mb-5">
              Christ-centred devotionals and books for every age — helping you see Jesus on every page of Scripture.
            </p>
            {/* Social media icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.youtube.com/@inhimdaily"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-white/40 hover:text-gold-300 transition-colors"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://www.instagram.com/inhimdaily/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/40 hover:text-gold-300 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/inhimdaily"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white/40 hover:text-gold-300 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@inhimdaily"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-white/40 hover:text-gold-300 transition-colors"
              >
                <TikTokIcon size={18} />
              </a>
              <Link
                to="/communities#whatsapp"
                aria-label="WhatsApp Community"
                className="text-white/40 hover:text-gold-300 transition-colors"
              >
                <WhatsAppIcon size={20} />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/devotionals" className="text-white/50 hover:text-gold-300">Devotionals</Link></li>
              <li><Link to="/books" className="text-white/50 hover:text-gold-300">Books</Link></li>
              <li><Link to="/blog" className="text-white/50 hover:text-gold-300">Blog</Link></li>
              <li><Link to="/communities" className="text-white/50 hover:text-gold-300">Communities</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-white/50 hover:text-gold-300">Contact</Link></li>
              <li><Link to="/prayer-partners" className="text-white/50 hover:text-gold-300">Prayer Partners</Link></li>
              <li><Link to="/donate" className="text-white/50 hover:text-gold-300">Donate</Link></li>
              <li><Link to="/free-sample" className="text-white/50 hover:text-gold-300">Free Sample</Link></li>
              <li><Link to="/privacy" className="text-white/50 hover:text-gold-300">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} In Him Daily. All rights reserved.</p>
          <p className="text-xs text-white/30 flex items-center gap-1.5">Made with <Heart size={12} className="text-gold-400" /> for His glory</p>
        </div>
      </div>
    </footer>
  );
}
