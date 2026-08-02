import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertTriangle, Clock, RefreshCw, Sparkles, Filter } from 'lucide-react';
import { EmailNotification } from '../types';

interface NotificationsViewProps {
  notifications: EmailNotification[];
  onSendTestEmail: (data: { toEmail: string; eventType: EmailNotification['eventType']; subject: string; bodyText: string }) => Promise<void>;
  onRefresh: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onSendTestEmail,
  onRefresh,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [toEmail, setToEmail] = useState('ops@acmeglobal.com');
  const [eventType, setEventType] = useState<EmailNotification['eventType']>('provisioning_success');
  const [subject, setSubject] = useState('Your ERPNext Tenant is Live!');
  const [bodyText, setBodyText] = useState('Hello! Your ERPNext SaaS site has been successfully provisioned.');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const filtered = filterType === 'all' ? notifications : notifications.filter((n) => n.eventType === filterType);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await onSendTestEmail({ toEmail, eventType, subject, bodyText });
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to dispatch email notification:', err);
    } finally {
      setIsSending(false);
    }
  };

  const getEventBadgeClass = (type: EmailNotification['eventType']) => {
    switch (type) {
      case 'provisioning_success':
      case 'payment_succeeded':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'provisioning_started':
      case 'user_signup':
      case 'backup_completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'payment_failed':
      case 'subscription_canceled':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'provisioning_failed':
      case 'site_deleted':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" />
            Automated Email Notifications & Dispatch Log
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time transactional email log for signups, provisioning events, backups, payment updates, and site deletions.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="self-start md:self-center px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>Refresh Queue</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Test Dispatch Simulator */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" />
            Simulate Email Dispatch
          </h3>
          <p className="text-xs text-slate-400">
            Test firing transactional emails to customer recipients.
          </p>

          <form onSubmit={handleSend} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Recipient Email</label>
              <input
                type="email"
                required
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => {
                  const val = e.target.value as EmailNotification['eventType'];
                  setEventType(val);
                  if (val === 'user_signup') {
                    setSubject('Welcome to ERPNext SaaS Platform');
                    setBodyText('Thank you for creating your customer account!');
                  } else if (val === 'provisioning_started') {
                    setSubject('Provisioning Started: acme-global.saas.cloud');
                    setBodyText('Your ERPNext instance setup is underway on bench node US-East Alpha.');
                  } else if (val === 'provisioning_success') {
                    setSubject('Your ERPNext Site is Ready!');
                    setBodyText('Site https://acme-global.saas.cloud is online. SSO link generated.');
                  } else if (val === 'backup_completed') {
                    setSubject('Site Snapshot Backup Completed');
                    setBodyText('Automated database snapshot vault dump completed successfully.');
                  } else if (val === 'site_deleted') {
                    setSubject('Site Deletion Notice & Vault Backup');
                    setBodyText('Site has been safely deleted and a final archive snapshot stored in Vault.');
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="user_signup">User Signup</option>
                <option value="provisioning_started">Provisioning Started</option>
                <option value="provisioning_success">Provisioning Success</option>
                <option value="provisioning_failed">Provisioning Failed</option>
                <option value="backup_completed">Backup Completed</option>
                <option value="payment_succeeded">Payment Succeeded</option>
                <option value="payment_failed">Payment Failed</option>
                <option value="subscription_canceled">Subscription Canceled</option>
                <option value="site_deleted">Site Deleted</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Body Text</label>
              <textarea
                rows={3}
                required
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-indigo-950/40"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Sending Notification...' : 'Dispatch Email'}</span>
            </button>

            {sentSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Email notification logged and sent!</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Notification Log Feed */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Recent Dispatch Log ({filtered.length})
            </h3>

            {/* Event Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg border font-medium whitespace-nowrap ${
                  filterType === 'all'
                    ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setFilterType('provisioning_success')}
                className={`px-2.5 py-1 rounded-lg border font-medium whitespace-nowrap ${
                  filterType === 'provisioning_success'
                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                Provisioning
              </button>
              <button
                onClick={() => setFilterType('site_deleted')}
                className={`px-2.5 py-1 rounded-lg border font-medium whitespace-nowrap ${
                  filterType === 'site_deleted'
                    ? 'bg-rose-600/20 text-rose-300 border-rose-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                Deletions
              </button>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold border ${getEventBadgeClass(
                            item.eventType
                          )}`}
                        >
                          {item.eventType.replace('_', ' ')}
                        </span>
                        <span className="font-bold text-white">{item.subject}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">To: {item.toEmail}</p>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 font-sans leading-relaxed">
                    {item.bodyText}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 italic text-xs">
              No email notifications match the selected filter.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
