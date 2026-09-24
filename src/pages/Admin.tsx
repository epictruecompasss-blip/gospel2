import { useEffect, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabaseClient, SUPABASE_URL, fetchUnreadEmailCount, fetchPendingCommentsCount, uploadAttachment, sendEmail as sendEmailRequest, type AttachmentMeta } from '@/lib/supabase';
import { Users, Mail, Heart, MessageSquare, BookOpen, RefreshCw, Rocket, ExternalLink, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, HandHeart, PenLine, LogOut, Send, Save, Eye, EyeOff, X, Reply, Inbox, Paperclip, Plus, Trash2 } from 'lucide-react';

const BlogAdmin = lazy(() => import('./admin/BlogAdmin'));
const AdminInbox = lazy(() => import('@/components/AdminInbox'));
const AdminComments = lazy(() => import('@/components/AdminComments'));

type FreeSampleLead = { id: string; first_name: string; email: string; source: string; status: string; created_at: string; };
type NewsletterSub  = { id: string; name: string; email: string; status: string; created_at: string; };
type PrayerPartner  = { id: string; name: string; email: string; status: string; created_at: string; };
type PrayerRequest  = { id: string; name: string; email: string | null; request: string; status: string; created_at: string; };
type ContactMessage = { id: string; name: string; email: string; subject: string; message: string; status: string; country: string | null; city_region: string | null; created_at: string; };
type Donation = { id: string; name: string; email: string; country: string | null; city_region: string | null; amount: number | null; prayer_request: string | null; message: string | null; status: string; created_at: string; };

type Tab = 'inbox' | 'comments' | 'leads' | 'newsletter' | 'partners' | 'prayers' | 'messages' | 'donations' | 'blog' | 'email';

const TABS: { id: Tab; label: string; icon: React.ElementType; color: string; isSettings?: boolean; isNotification?: boolean }[] = [
  { id: 'inbox',     label: 'Inbox',                icon: Inbox,          color: 'text-gold-300', isNotification: true },
  { id: 'comments',  label: 'Comments',             icon: MessageSquare,  color: 'text-gold-300', isNotification: true },
  { id: 'leads',     label: 'Free Sample Leads',    icon: BookOpen,       color: 'text-gold-300' },
  { id: 'newsletter',label: 'Newsletter',           icon: Mail,           color: 'text-gold-300' },
  { id: 'partners',  label: 'Prayer Partners',      icon: Users,          color: 'text-gold-300' },
  { id: 'prayers',   label: 'Prayer Requests',      icon: Heart,          color: 'text-gold-300' },
  { id: 'messages',  label: 'Contact Messages',     icon: MessageSquare,  color: 'text-gold-300' },
  { id: 'donations', label: 'Donations',             icon: HandHeart,      color: 'text-gold-300' },
  { id: 'blog',      label: 'Blog Articles',        icon: PenLine,        color: 'text-gold-300' },
  { id: 'email',     label: 'Email Settings',       icon: Send,           color: 'text-gold-300', isSettings: true },
];

const STATUS_COLORS: Record<string, string> = {
  new:          'bg-blue-500/15 text-blue-300 border-blue-500/30',
  sent:         'bg-green-500/15 text-green-300 border-green-500/30',
  subscribed:   'bg-green-500/15 text-green-300 border-green-500/30',
  active:       'bg-green-500/15 text-green-300 border-green-500/30',
  received:     'bg-amber-500/15 text-amber-300 border-amber-500/30',
  read:         'bg-blue-500/15 text-blue-300 border-blue-500/30',
  replied:      'bg-green-500/15 text-green-300 border-green-500/30',
  prayed_over:  'bg-purple-500/15 text-purple-300 border-purple-500/30',
  closed:       'bg-gray-500/15 text-gray-400 border-gray-500/30',
  unsubscribed: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  inactive:     'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold border ${STATUS_COLORS[status] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/30'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab,      setTab]      = useState<Tab>('leads');
  const [loading,  setLoading]  = useState(true);
  const [loadError, setLoadError] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [counts,   setCounts]   = useState<Record<Tab, number>>({ inbox:0, comments:0, leads:0, newsletter:0, partners:0, prayers:0, messages:0, donations:0, blog:0, email:0 });

  const [resendKey,      setResendKey]      = useState('');
  const [resendFromEmail, setResendFromEmail] = useState('');
  const [resendSaved,    setResendSaved]    = useState(false);
  const [resendSaving,   setResendSaving]   = useState(false);
  const [resendError,   setResendError]    = useState('');
  const [resendStatus,  setResendStatus]   = useState<'unknown' | 'configured' | 'not_configured'>('unknown');
  const [showResendKey, setShowResendKey]  = useState(false);

  const [leads,    setLeads]    = useState<FreeSampleLead[]>([]);
  const [subs,     setSubs]     = useState<NewsletterSub[]>([]);
  const [partners, setPartners] = useState<PrayerPartner[]>([]);
  const [prayers,  setPrayers]  = useState<PrayerRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  const [composeOpen,    setComposeOpen]    = useState(false);
  const [composeTo,      setComposeTo]      = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody,    setComposeBody]    = useState('');
  const [composeInReplyTo, setComposeInReplyTo] = useState<string | undefined>(undefined);
  const [composeThreadId, setComposeThreadId] = useState<string | undefined>(undefined);
  const [attachments,  setAttachments]    = useState<AttachmentMeta[]>([]);
  const [uploadingFile, setUploadingFile]  = useState(false);
  const [sending,        setSending]        = useState(false);
  const [sendResult,     setSendResult]     = useState<{ ok: boolean; msg: string } | null>(null);

  function openCompose(to: string, subject = '', inReplyTo?: string, threadId?: string) {
    setComposeTo(to);
    setComposeSubject(subject);
    setComposeBody('');
    setComposeInReplyTo(inReplyTo);
    setComposeThreadId(threadId);
    setAttachments([]);
    setSendResult(null);
    setComposeOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingFile(true);
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id ?? 'admin';
      for (const file of Array.from(files)) {
        const att = await uploadAttachment(file, userId);
        setAttachments((prev) => [...prev, att]);
      }
    } catch {
      setSendResult({ ok: false, msg: 'Could not upload file. Please try again.' });
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  }

  function removeAttachment(idx: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  }

  function buildEmailHtml(body: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0E2035;font-family:Georgia,'Times New Roman',serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0E2035;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#13294a;border:1px solid rgba(228,184,106,0.2);border-radius:16px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:40px 40px 24px;background:linear-gradient(180deg,rgba(201,152,58,0.08) 0%,transparent 100%);">
              <p style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#C9983A;font-weight:bold;margin:0 0 12px 0;">In Him Daily</p>
              <h1 style="font-size:24px;color:#ffffff;margin:0;font-weight:bold;">A Message From In Him Daily</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 40px 40px;">
              <div style="font-size:16px;color:rgba(255,255,255,0.8);line-height:1.7;white-space:pre-wrap;">${body.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 40px 40px;border-top:1px solid rgba(228,184,106,0.2);">
              <p style="font-size:12px;color:rgba(255,255,255,0.35);line-height:1.5;margin:24px 0 0 0;">
                In Him Daily — a ministry of Epic True North<br/>
                <a href="https://inhimdaily.org" style="color:rgba(201,152,58,0.6);text-decoration:none;">inhimdaily.org</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  async function sendEmail() {
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      setSendResult({ ok: false, msg: 'Please fill in all fields.' });
      return;
    }
    setSending(true);
    setSendResult(null);
    try {
      await sendEmailRequest({
        to: composeTo.trim(),
        subject: composeSubject.trim(),
        html: buildEmailHtml(composeBody),
        text: composeBody,
        attachments,
        in_reply_to: composeInReplyTo,
        thread_id: composeThreadId,
      });
      setSendResult({ ok: true, msg: 'Email sent successfully.' });
      setAttachments([]);
      setTimeout(() => setComposeOpen(false), 2000);
    } catch (err) {
      setSendResult({
        ok: false,
        msg: err instanceof Error ? err.message : 'Could not send email. Please try again.',
      });
    } finally {
      setSending(false);
    }
  }

  async function loadAll() {
    setLoading(true);
    setLoadError('');

    try {
      const supabase = getSupabaseClient();
      const [l, n, pp, pr, m, d, b] = await Promise.all([
        supabase.from('free_sample_leads').select('*').order('created_at', { ascending: false }),
        supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('prayer_partners').select('*').order('created_at', { ascending: false }),
        supabase.from('prayer_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('donations').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      ]);
      const blogResult = b as { count?: number; data?: unknown[]; error?: unknown };
      const requestError = [l, n, pp, pr, m, d, b].find((result) => result.error)?.error;
      if (requestError) throw requestError;

      setLeads(l.data ?? []);
      setSubs(n.data ?? []);
      setPartners(pp.data ?? []);
      setPrayers(pr.data ?? []);
      setMessages(m.data ?? []);
      setDonations(d.data ?? []);
      const [unreadE, pendingC] = await Promise.all([fetchUnreadEmailCount(), fetchPendingCommentsCount()]);
      setCounts({
        inbox:      unreadE,
        comments:   pendingC,
        leads:      l.data?.length    ?? 0,
        newsletter: n.data?.length    ?? 0,
        partners:   pp.data?.length   ?? 0,
        prayers:    pr.data?.length   ?? 0,
        messages:   m.data?.length    ?? 0,
        donations:  d.data?.length    ?? 0,
        blog:       blogResult.count ?? blogResult.data?.length ?? 0,
        email:      0,
      });
    } catch {
      setLoadError(
        'Submission data could not be loaded. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadResendKey() {
    try {
      const supabase = getSupabaseClient();
      const [{ data: keyData }, { data: fromData }] = await Promise.all([
        supabase.from('app_config').select('value').eq('key', 'RESEND_API_KEY').maybeSingle(),
        supabase.from('app_config').select('value').eq('key', 'RESEND_FROM_EMAIL').maybeSingle(),
      ]);
      if (keyData?.value) {
        setResendKey(keyData.value);
        setResendStatus('configured');
      } else {
        setResendStatus('not_configured');
      }
      if (fromData?.value) {
        setResendFromEmail(fromData.value);
      } else {
        setResendFromEmail('In Him Daily <henry@inhimdaily.org>');
      }
    } catch {
      setResendStatus('not_configured');
    }
  }

  async function saveResendKey() {
    setResendSaving(true);
    setResendError('');
    setResendSaved(false);
    try {
      const supabase = getSupabaseClient();

      // Save API key
      const { data: existingKey } = await supabase
        .from('app_config')
        .select('key')
        .eq('key', 'RESEND_API_KEY')
        .maybeSingle();
      if (existingKey) {
        const { error } = await supabase
          .from('app_config')
          .update({ value: resendKey.trim(), updated_at: new Date().toISOString() })
          .eq('key', 'RESEND_API_KEY');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('app_config')
          .insert({ key: 'RESEND_API_KEY', value: resendKey.trim() });
        if (error) throw error;
      }

      // Save from email
      const fromVal = resendFromEmail.trim() || 'In Him Daily <henry@inhimdaily.org>';
      const { data: existingFrom } = await supabase
        .from('app_config')
        .select('key')
        .eq('key', 'RESEND_FROM_EMAIL')
        .maybeSingle();
      if (existingFrom) {
        await supabase
          .from('app_config')
          .update({ value: fromVal, updated_at: new Date().toISOString() })
          .eq('key', 'RESEND_FROM_EMAIL');
      } else {
        await supabase
          .from('app_config')
          .insert({ key: 'RESEND_FROM_EMAIL', value: fromVal });
      }

      setResendSaved(true);
      setResendStatus('configured');
      setTimeout(() => setResendSaved(false), 4000);
    } catch {
      setResendError('Could not save the settings. Please try again.');
    } finally {
      setResendSaving(false);
    }
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/admin/login', { replace: true });
          return;
        }
        setAuthChecked(true);
        loadAll();
        loadResendKey();
        const pollInterval = setInterval(async () => {
          const [u, p] = await Promise.all([fetchUnreadEmailCount(), fetchPendingCommentsCount()]);
          setCounts((prev) => ({ ...prev, inbox: u, comments: p }));
        }, 30000);
        return () => clearInterval(pollInterval);
      } catch {
        navigate('/admin/login', { replace: true });
      }
    }
    checkAuth();
  }, [navigate]);

  async function handleSignOut() {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    } catch { /* ignore */ }
    navigate('/admin/login', { replace: true });
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="text-white px-4 sm:px-6 lg:px-8 py-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-gold-400 text-[0.72rem] font-semibold tracking-[0.16em] uppercase mb-1">Ministry Dashboard</p>
            <h1 className="font-playfair text-3xl font-bold">In Him Daily — Submissions</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => openCompose('')}
              className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-ink-900 rounded-full text-sm font-semibold transition-colors"
              aria-label="Compose new email">
              <Plus size={15} aria-hidden="true" />
              Compose
            </button>
            <button onClick={loadAll} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
              aria-label="Refresh data">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
              Refresh
            </button>
            <button onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-300 rounded-full text-sm font-medium transition-colors"
              aria-label="Sign out">
              <LogOut size={15} aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadError && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start" role="alert">
            <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-amber-200">{loadError}</p>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 relative ${
                tab === t.id ? 'ih-card border-gold-400/50' : 'ih-card-solid border-white/10 hover:border-gold-400/30'
              }`}>
              <div className="flex items-center justify-between mb-3">
                <t.icon size={20} className={tab === t.id ? 'text-gold-300' : t.color} aria-hidden="true" />
                {t.isNotification && counts[t.id] > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-gold-500 text-ink-900 text-[0.65rem] font-bold">{counts[t.id]}</span>
                )}
              </div>
              <p className={`text-2xl font-bold font-playfair ${tab === t.id ? 'text-white' : 'text-white'}`}>
                {loading ? '—' : t.isSettings
                  ? (resendStatus === 'configured'
                    ? <CheckCircle2 size={22} className="text-green-400" aria-label="Configured" />
                    : resendStatus === 'not_configured'
                      ? <AlertCircle size={22} className="text-amber-400" aria-label="Not configured" />
                      : '—')
                  : t.isNotification
                    ? (counts[t.id] > 0 ? counts[t.id] : '0')
                    : counts[t.id]}
              </p>
              <p className={`text-xs mt-0.5 ${tab === t.id ? 'text-white/60' : 'text-white/45'}`}>{t.label}</p>
            </button>
          ))}
        </div>

        <div className="ih-card overflow-hidden">
          {loading && tab !== 'inbox' && tab !== 'comments' ? (
            <div className="flex items-center justify-center py-24 text-white/50">
              <RefreshCw size={22} className="animate-spin mr-3" aria-hidden="true" />
              Loading submissions…
            </div>
          ) : (
            <>
              {tab === 'inbox' && (
                <Suspense fallback={<div className="flex items-center justify-center py-16 text-white/50"><RefreshCw size={20} className="animate-spin mr-3" /> Loading inbox...</div>}>
                  <AdminInbox onComposeReply={openCompose} />
                </Suspense>
              )}
              {tab === 'comments' && (
                <Suspense fallback={<div className="flex items-center justify-center py-16 text-white/50"><RefreshCw size={20} className="animate-spin mr-3" /> Loading comments...</div>}>
                  <AdminComments />
                </Suspense>
              )}
              {tab === 'leads' && (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/50 text-[0.72rem] uppercase tracking-wider">
                    <tr>{['Name','Email','Source','Status','Date',''].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {leads.length === 0 ? <tr><td colSpan={6} className="px-5 py-10 text-center text-white/40">No leads yet.</td></tr>
                      : leads.map(r => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-white">{r.first_name}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.email}</td>
                          <td className="px-5 py-3.5 text-white/60 text-[0.8rem]">{r.source.replace('_', ' ')}</td>
                          <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                          <td className="px-5 py-3.5 text-white/60 text-[0.8rem]">{fmt(r.created_at)}</td>
                          <td className="px-5 py-3.5"><button onClick={() => openCompose(r.email, `Re: Your Free Sample — In Him Daily`)} className="text-gold-300 hover:text-gold-200 transition-colors" aria-label={`Reply to ${r.email}`}><Reply size={15} /></button></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {tab === 'newsletter' && (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/50 text-[0.72rem] uppercase tracking-wider">
                    <tr>{['Name','Email','Status','Subscribed',''].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {subs.length === 0 ? <tr><td colSpan={5} className="px-5 py-10 text-center text-white/40">No subscribers yet.</td></tr>
                      : subs.map(r => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-white">{r.name}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.email}</td>
                          <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                          <td className="px-5 py-3.5 text-white/60 text-[0.8rem]">{fmt(r.created_at)}</td>
                          <td className="px-5 py-3.5"><button onClick={() => openCompose(r.email, `Re: In Him Daily Newsletter`)} className="text-gold-300 hover:text-gold-200 transition-colors" aria-label={`Reply to ${r.email}`}><Reply size={15} /></button></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {tab === 'partners' && (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/50 text-[0.72rem] uppercase tracking-wider">
                    <tr>{['Name','Email','Status','Joined',''].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {partners.length === 0 ? <tr><td colSpan={5} className="px-5 py-10 text-center text-white/40">No prayer partners yet.</td></tr>
                      : partners.map(r => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-white">{r.name}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.email}</td>
                          <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                          <td className="px-5 py-3.5 text-white/60 text-[0.8rem]">{fmt(r.created_at)}</td>
                          <td className="px-5 py-3.5"><button onClick={() => openCompose(r.email, `Re: In Him Daily Prayer Partners`)} className="text-gold-300 hover:text-gold-200 transition-colors" aria-label={`Reply to ${r.email}`}><Reply size={15} /></button></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {tab === 'prayers' && (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/50 text-[0.72rem] uppercase tracking-wider">
                    <tr>{['Name','Email','Request','Status','Date',''].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {prayers.length === 0 ? <tr><td colSpan={6} className="px-5 py-10 text-center text-white/40">No prayer requests yet.</td></tr>
                      : prayers.map(r => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-white whitespace-nowrap">{r.name}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.email ?? <span className="text-white/30 italic text-xs">anonymous</span>}</td>
                          <td className="px-5 py-3.5 text-white/60 max-w-xs"><span className="line-clamp-2">{r.request}</span></td>
                          <td className="px-5 py-3.5 whitespace-nowrap"><StatusBadge status={r.status} /></td>
                          <td className="px-5 py-3.5 text-white/60 text-[0.8rem] whitespace-nowrap">{fmt(r.created_at)}</td>
                          <td className="px-5 py-3.5">{r.email && <button onClick={() => openCompose(r.email!, `Re: Your Prayer Request — In Him Daily`)} className="text-gold-300 hover:text-gold-200 transition-colors" aria-label={`Reply to ${r.email}`}><Reply size={15} /></button>}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {tab === 'messages' && (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/50 text-[0.72rem] uppercase tracking-wider">
                    <tr>{['Name','Email','Subject','Message','Status','Date',''].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {messages.length === 0 ? <tr><td colSpan={7} className="px-5 py-10 text-center text-white/40">No messages yet.</td></tr>
                      : messages.map(r => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-white whitespace-nowrap">{r.name}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.email}</td>
                          <td className="px-5 py-3.5 text-white font-medium">{r.subject}</td>
                          <td className="px-5 py-3.5 text-white/60 max-w-xs"><span className="line-clamp-2">{r.message}</span></td>
                          <td className="px-5 py-3.5 whitespace-nowrap"><StatusBadge status={r.status} /></td>
                          <td className="px-5 py-3.5 text-white/60 text-[0.8rem] whitespace-nowrap">{fmt(r.created_at)}</td>
                          <td className="px-5 py-3.5"><button onClick={() => openCompose(r.email, `Re: ${r.subject}`)} className="text-gold-300 hover:text-gold-200 transition-colors" aria-label={`Reply to ${r.email}`}><Reply size={15} /></button></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {tab === 'donations' && (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/50 text-[0.72rem] uppercase tracking-wider">
                    <tr>{['Name','Email','Amount','Country','City/Region','Date',''].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {donations.length === 0 ? <tr><td colSpan={7} className="px-5 py-10 text-center text-white/40">No donations yet.</td></tr>
                      : donations.map(r => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-white whitespace-nowrap">{r.name}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.email}</td>
                          <td className="px-5 py-3.5 text-gold-300 font-semibold">{r.amount ? `${r.amount}` : '—'}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.country ?? '—'}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.city_region ?? '—'}</td>
                          <td className="px-5 py-3.5 text-white/60 text-[0.8rem] whitespace-nowrap">{fmt(r.created_at)}</td>
                          <td className="px-5 py-3.5"><button onClick={() => openCompose(r.email, `Re: Your Donation — In Him Daily`)} className="text-gold-300 hover:text-gold-200 transition-colors" aria-label={`Reply to ${r.email}`}><Reply size={15} /></button></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {tab === 'blog' && (
                <div className="p-6">
                  <Suspense fallback={<div className="flex items-center justify-center py-16 text-white/50"><RefreshCw size={20} className="animate-spin mr-3" /> Loading blog manager...</div>}>
                    <BlogAdmin />
                  </Suspense>
                </div>
              )}
              {tab === 'email' && (
                <div className="p-6 sm:p-8 max-w-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Send size={20} className="text-gold-300" aria-hidden="true" />
                    <h2 className="font-playfair text-xl font-bold text-white">Email Settings</h2>
                  </div>
                  <p className="text-sm text-white/50 mb-6">
                    When someone requests a free sample, the system automatically sends them a
                    beautifully designed email with their 7-day devotional sample. To enable this,
                    connect a free Resend account below.
                  </p>

                  {resendStatus === 'configured' ? (
                    <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex gap-3 items-start">
                      <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-green-300">Email service is active</p>
                        <p className="text-xs text-green-400/70 mt-0.5">Free sample emails are being sent automatically when someone fills the form.</p>
                      </div>
                    </div>
                  ) : resendStatus === 'not_configured' ? (
                    <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start">
                      <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-amber-300">Email service not yet connected</p>
                        <p className="text-xs text-amber-400/70 mt-0.5">Leads are still saved in the dashboard, but no email is sent to the visitor yet.</p>
                      </div>
                    </div>
                  ) : null}

                  {resendSaved && (
                    <div className="mb-5 p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 flex gap-2.5 items-center">
                      <CheckCircle2 size={16} className="text-green-400 shrink-0" aria-hidden="true" />
                      <p className="text-sm text-green-300">API key saved. Emails will now be sent automatically.</p>
                    </div>
                  )}
                  {resendError && (
                    <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-2.5 items-center">
                      <AlertCircle size={16} className="text-red-400 shrink-0" aria-hidden="true" />
                      <p className="text-sm text-red-300">{resendError}</p>
                    </div>
                  )}

                  <label htmlFor="resend-key" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                    Resend API Key
                  </label>
                  <div className="relative mb-4">
                    <input
                      id="resend-key"
                      type={showResendKey ? 'text' : 'password'}
                      value={resendKey}
                      onChange={(e) => setResendKey(e.target.value)}
                      placeholder="re_..."
                      className="ih-input w-full px-4 py-3 pr-11 text-sm font-mono"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResendKey(!showResendKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white/40 hover:text-white/70 transition-colors"
                      aria-label={showResendKey ? 'Hide API key' : 'Show API key'}
                      tabIndex={-1}
                    >
                      {showResendKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <label htmlFor="resend-from" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                    From Email Address
                  </label>
                  <div className="relative mb-4">
                    <input
                      id="resend-from"
                      type="text"
                      value={resendFromEmail}
                      onChange={(e) => setResendFromEmail(e.target.value)}
                      placeholder="In Him Daily <henry@inhimdaily.org>"
                      className="ih-input w-full px-4 py-3 text-sm"
                    />
                  </div>
                  <p className="text-xs text-white/40 mb-4 -mt-2">
                    Your domain <code className="text-gold-300 bg-gold-400/10 px-1 rounded">inhimdaily.org</code> is verified with Resend. Use <code className="text-gold-300 bg-gold-400/10 px-1 rounded">In Him Daily &lt;henry@inhimdaily.org&gt;</code> to send emails to any address.
                  </p>
                  <p className="text-xs text-white/40 mb-4">
                    For production, prefer setting <code className="text-gold-300 bg-gold-400/10 px-1 rounded">RESEND_API_KEY</code> and <code className="text-gold-300 bg-gold-400/10 px-1 rounded">RESEND_FROM_EMAIL</code> in Netlify &rarr; Site settings &rarr; Environment variables. Those take priority over the values saved here, and keep the key out of the database.
                  </p>

                  <button
                    onClick={saveResendKey}
                    disabled={resendSaving || !resendKey.trim()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-[#05070D] text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendSaving ? (
                      <><RefreshCw size={15} className="animate-spin" aria-hidden="true" /> Saving...</>
                    ) : (
                      <><Save size={15} aria-hidden="true" /> Save Settings</>
                    )}
                  </button>

                  <div className="mt-8 p-5 rounded-xl bg-white/[0.03] border border-white/10">
                    <h3 className="font-playfair text-base font-bold text-white mb-3">How to set up Resend (free)</h3>
                    <ol className="space-y-2.5 text-sm text-white/60">
                      <li className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-300 text-[0.7rem] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span>Go to <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-gold-300 hover:text-gold-200 underline">resend.com</a> and create a free account (3,000 emails per month free).</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-300 text-[0.7rem] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <span>In the Resend dashboard, go to API Keys and click &ldquo;Create API Key&rdquo;.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-300 text-[0.7rem] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span>Copy the API key (starts with <code className="text-gold-300 bg-gold-400/10 px-1 rounded text-xs">re_</code>) and paste it in the field above.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-300 text-[0.7rem] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                        <span>Click Save. Emails send from <code className="text-gold-300 bg-gold-400/10 px-1 rounded text-xs">henry@inhimdaily.org</code> and can reach any address.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-300 text-[0.7rem] font-bold flex items-center justify-center shrink-0 mt-0.5">5</span>
                        <span>In Resend, go to Domains, add <code className="text-gold-300 bg-gold-400/10 px-1 rounded text-xs">inhimdaily.org</code> and add the DNS records it gives you. Once verified, set the From address above to that domain &mdash; you can then email anyone.</span>
                      </li>
                    </ol>
                  </div>

                  <div className="mt-6 p-5 rounded-xl bg-white/[0.03] border border-white/10">
                    <h3 className="font-playfair text-base font-bold text-white mb-3">Receiving inbound emails</h3>
                    <p className="text-sm text-white/60 mb-4">
                      When people reply to your emails, those replies appear in the Inbox tab automatically.
                      To enable this, point Resend&rsquo;s inbound webhook to the URL below.
                    </p>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                      <code className="text-xs text-gold-300 font-mono flex-1 overflow-x-auto whitespace-nowrap">
                        {window.location.origin}/api/resend-webhook
                      </code>
                      <button
                        onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/api/resend-webhook`)}
                        className="p-2 rounded-lg text-white/40 hover:text-gold-300 hover:bg-white/10 transition-colors shrink-0"
                        aria-label="Copy webhook URL"
                      >
                        <Plus size={14} className="rotate-45" />
                      </button>
                    </div>
                    <ol className="space-y-2.5 text-sm text-white/60 mt-4">
                      <li className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-300 text-[0.7rem] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span>In Resend, verify your domain (e.g. <code className="text-gold-300 bg-gold-400/10 px-1 rounded text-xs">inhimdaily.org</code>) under Domains.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-300 text-[0.7rem] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <span>Set up an MX or forwarding address on your domain that routes replies to Resend&rsquo;s inbound address (found in Resend &rarr; Webhooks).</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-300 text-[0.7rem] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span>In Resend &rarr; Webhooks, create a webhook with the URL above, listening for <code className="text-gold-300 bg-gold-400/10 px-1 rounded text-xs">email.received</code> events.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-300 text-[0.7rem] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                        <span>Replies will now appear in the Inbox tab with full message body and attachments.</span>
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          In Him Daily Admin · Data secured with Supabase Row Level Security
        </p>

        {composeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="ih-card rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#13294a] z-10">
                <div className="flex items-center gap-3">
                  <Reply size={18} className="text-gold-300" aria-hidden="true" />
                  <h2 className="font-playfair text-lg font-bold text-white">Compose Email</h2>
                </div>
                <button onClick={() => setComposeOpen(false)} className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors" aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {sendResult && (
                  <div className={`p-3.5 rounded-xl flex gap-2.5 items-center ${sendResult.ok ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                    {sendResult.ok ? <CheckCircle2 size={16} className="text-green-400 shrink-0" /> : <AlertCircle size={16} className="text-red-400 shrink-0" />}
                    <p className={`text-sm ${sendResult.ok ? 'text-green-300' : 'text-red-300'}`}>{sendResult.msg}</p>
                  </div>
                )}
                <div>
                  <label htmlFor="compose-to" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">To</label>
                  <input id="compose-to" type="email" value={composeTo} onChange={(e) => setComposeTo(e.target.value)} className="ih-input w-full px-4 py-3 text-sm" placeholder="recipient@example.com" />
                </div>
                <div>
                  <label htmlFor="compose-subject" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Subject</label>
                  <input id="compose-subject" type="text" value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)} className="ih-input w-full px-4 py-3 text-sm" placeholder="Email subject" />
                </div>
                <div>
                  <label htmlFor="compose-body" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea id="compose-body" value={composeBody} onChange={(e) => setComposeBody(e.target.value)} rows={8} className="ih-input w-full px-4 py-3 text-sm resize-none" placeholder="Type your message here..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Attachments</label>
                  {attachments.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {attachments.map((att, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                          <Paperclip size={14} className="text-gold-300 shrink-0" />
                          <span className="text-sm text-white/70 truncate flex-1">{att.filename}</span>
                          <span className="text-xs text-white/30 shrink-0">{att.size < 1024 ? `${att.size} B` : `${(att.size / 1024).toFixed(1)} KB`}</span>
                          <button onClick={() => removeAttachment(idx)} className="p-1 rounded-lg text-white/40 hover:text-red-300 hover:bg-red-500/10 transition-colors" aria-label="Remove attachment">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white/70 cursor-pointer transition-colors">
                    <Paperclip size={15} />
                    {uploadingFile ? 'Uploading...' : 'Add file'}
                    <input type="file" multiple onChange={handleFileUpload} className="hidden" disabled={uploadingFile} />
                  </label>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setComposeOpen(false)} className="px-5 py-2.5 rounded-xl text-white/60 hover:text-white/90 hover:bg-white/10 text-sm font-medium transition-colors">Cancel</button>
                  <button onClick={sendEmail} disabled={sending} className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-[#05070D] text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {sending ? <><RefreshCw size={15} className="animate-spin" /> Sending...</> : <><Send size={15} /> Send Email</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 ih-card overflow-hidden">
          <div className="bg-white/5 px-6 py-5 flex items-center gap-3 border-b border-white/10">
            <Rocket size={20} className="text-gold-300" aria-hidden="true" />
            <h2 className="font-playfair text-lg font-bold text-white">Netlify Deployment</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[0.68rem] font-semibold text-white/40 uppercase tracking-wider mb-1">Build Command</p>
                <p className="text-sm text-white font-mono">npm run build</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[0.68rem] font-semibold text-white/40 uppercase tracking-wider mb-1">Publish Directory</p>
                <p className="text-sm text-white font-mono">dist</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[0.68rem] font-semibold text-white/40 uppercase tracking-wider mb-1">Framework</p>
                <p className="text-sm text-white font-mono">React + Vite</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-playfair text-base font-bold text-white">Deploy in 3 Steps</h3>
              <ol className="space-y-3">
                <li className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="text-sm font-medium text-white">Connect your repository</p>
                    <p className="text-xs text-white/50 mt-0.5">Push this project to GitHub, then log in to Netlify and select &ldquo;Add new site &rarr; Import an existing project&rdquo;.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="text-sm font-medium text-white">Configure build settings</p>
                    <p className="text-xs text-white/50 mt-0.5">Set build command to <code className="text-gold-300 bg-gold-400/10 px-1 rounded">npm run build</code> and publish directory to <code className="text-gold-300 bg-gold-400/10 px-1 rounded">dist</code>.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div>
                    <p className="text-sm font-medium text-white">Set environment variables</p>
                    <p className="text-xs text-white/50 mt-0.5">In Netlify &rarr; Site settings &rarr; Environment variables, add <code className="text-gold-300 bg-gold-400/10 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="text-gold-300 bg-gold-400/10 px-1 rounded">VITE_SUPABASE_ANON_KEY</code>.</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex gap-3 items-start">
              <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-green-300">netlify.toml is configured for Vite</p>
                <p className="text-xs text-green-400/70 mt-0.5">Build command, publish directory, and SPA redirect rules are all set up.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex gap-3 items-start">
              <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-green-300">Environment variables pre-configured</p>
                <p className="text-xs text-green-400/70 mt-0.5">Supabase credentials are built in — no environment variables need to be set in Netlify for forms and dashboard to work in production.</p>
              </div>
            </div>

            <a href="https://app.netlify.com/start" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 ih-btn-gold text-sm">
              <ExternalLink size={16} aria-hidden="true" />
              Go to Netlify
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
