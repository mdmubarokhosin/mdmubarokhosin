'use client';

import { useFirebase } from '@/context/FirebaseContext';

interface DashboardSectionProps {
  onNavigate: (section: string) => void;
}

export default function DashboardSection({ onNavigate }: DashboardSectionProps) {
  const { data, visitors, settings } = useFirebase();

  const stats = [
    { label: 'Total Visitors', value: visitors.toLocaleString(), icon: 'bi-people-fill', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Projects', value: data.projects?.length ?? 0, icon: 'bi-folder-fill', color: 'text-[#006a4e]', bg: 'bg-[#006a4e]/10' },
    { label: 'Skills', value: data.skills?.length ?? 0, icon: 'bi-code-slash', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Testimonials', value: data.testimonials?.length ?? 0, icon: 'bi-chat-quote-fill', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Services', value: data.services?.length ?? 0, icon: 'bi-headset', color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { label: 'Certificates', value: data.certificates?.length ?? 0, icon: 'bi-award-fill', color: 'text-[#f42a41]', bg: 'bg-[#f42a41]/10' },
  ];

  const quickLinks = [
    { label: 'Edit Profile', icon: 'bi-person-fill', section: 'personal', color: 'text-[#006a4e]' },
    { label: 'Add Project', icon: 'bi-folder-plus', section: 'projects', color: 'text-blue-500' },
    { label: 'Add Skill', icon: 'bi-plus-circle', section: 'skills', color: 'text-amber-500' },
    { label: 'Site Settings', icon: 'bi-gear-fill', section: 'settings', color: 'text-purple-500' },
  ];

  const featuresStatus = [
    { label: 'AI Chatbot', enabled: settings.aiChatbotEnabled, icon: 'bi-robot' },
    { label: 'Sound', enabled: settings.soundEnabled, icon: 'bi-volume-up-fill' },
    { label: 'Easter Egg', enabled: settings.easterEggEnabled, icon: 'bi-egg-fill' },
    { label: 'Live Chat', enabled: settings.liveChatEnabled, icon: 'bi-chat-dots-fill' },
    { label: 'Visitor Counter', enabled: settings.visitorCounterEnabled, icon: 'bi-eye-fill' },
    { label: 'Color Picker', enabled: settings.colorCustomizerEnabled, icon: 'bi-palette-fill' },
    { label: 'Keyboard', enabled: settings.keyboardShortcutsEnabled, icon: 'bi-keyboard-fill' },
    { label: 'Notifications', enabled: settings.notificationBellEnabled, icon: 'bi-bell-fill' },
    { label: 'PWA', enabled: settings.pwaEnabled, icon: 'bi-phone-fill' },
    { label: 'Parallax', enabled: settings.parallaxEnabled, icon: 'bi-layers-fill' },
    { label: 'Map', enabled: settings.mapEnabled, icon: 'bi-geo-alt-fill' },
    { label: 'QR Code', enabled: settings.qrCodeEnabled, icon: 'bi-qr-code' },
    { label: 'Email Sub', enabled: settings.emailSubscriptionEnabled, icon: 'bi-envelope-fill' },
    { label: 'Video Intro', enabled: settings.videoIntroEnabled, icon: 'bi-play-circle-fill' },
  ];

  return (
    <div className="space-y-5">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <i className={`bi ${stat.icon} ${stat.color} text-lg`} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-extrabold leading-tight">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground truncate">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
          <i className="bi bi-lightning-fill text-amber-500" /> Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickLinks.map((link) => (
            <button
              key={link.section}
              onClick={() => onNavigate(link.section)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors active:scale-[0.98]"
            >
              <i className={`bi ${link.icon} ${link.color}`} />
              {link.label}
            </button>
          ))}
        </div>
      </div>

      {/* Features Status */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
          <i className="bi bi-toggle-on text-[#006a4e]" /> Feature Status
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {featuresStatus.map((f) => (
            <div
              key={f.label}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                f.enabled
                  ? 'border-[#006a4e]/30 bg-[#006a4e]/5 text-[#006a4e]'
                  : 'border-border bg-muted/50 text-muted-foreground'
              }`}
            >
              <i className={`bi ${f.icon}`} />
              <span className="truncate">{f.label}</span>
              <span className={`ml-auto w-2 h-2 rounded-full flex-shrink-0 ${f.enabled ? 'bg-[#006a4e]' : 'bg-muted-foreground/40'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Site Info */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
          <i className="bi bi-info-circle-fill text-[#006a4e]" /> Site Information
        </h3>
        <div className="space-y-0 text-sm">
          {[
            { label: 'Site Name', value: settings.siteName },
            { label: 'Description', value: settings.siteDescription },
            { label: 'Primary Color', value: settings.primaryColor, isColor: true, color: settings.primaryColor },
            { label: 'Accent Color', value: settings.accentColor, isColor: true, color: settings.accentColor },
            { label: 'AI Chatbot', value: settings.aiChatbotEnabled ? 'Enabled' : 'Disabled', isBool: true, bool: settings.aiChatbotEnabled },
            { label: 'AI Provider', value: settings.aiChatbotProvider },
            { label: 'AI Model', value: settings.aiChatbotModel },
          ].map((row, i) => (
            <div key={row.label} className={`flex justify-between items-center py-2.5 ${i < 6 ? 'border-b border-border' : ''}`}>
              <span className="text-muted-foreground text-xs">{row.label}</span>
              {row.isColor ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: row.color }} />
                  <span className="font-mono text-xs">{row.value}</span>
                </div>
              ) : row.isBool ? (
                <span className={`font-medium text-xs ${row.bool ? 'text-[#006a4e]' : 'text-muted-foreground'}`}>{row.value}</span>
              ) : (
                <span className="font-medium text-xs truncate max-w-[180px]">{row.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
