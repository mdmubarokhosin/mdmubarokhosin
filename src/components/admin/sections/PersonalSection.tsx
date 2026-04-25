'use client';

import { useState } from 'react';
import { useFirebase } from '@/context/FirebaseContext';
import { useToast } from '@/hooks/use-toast';

export default function PersonalSection() {
  const { data, updateData } = useFirebase();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...data.personal });
  const [bioShort, setBioShort] = useState(data.personal.bio.short);
  const [bioShortBn, setBioShortBn] = useState(data.personal.bio.shortBn);
  const [bioFull, setBioFull] = useState(data.personal.bio.full.join('\n'));
  const [bioFullBn, setBioFullBn] = useState(data.personal.bio.fullBn.join('\n'));
  const [languages, setLanguages] = useState(data.personal.languages.join(', '));

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = {
        ...form,
        bio: {
          short: bioShort,
          shortBn: bioShortBn,
          full: bioFull.split('\n').filter(l => l.trim()),
          fullBn: bioFullBn.split('\n').filter(l => l.trim()),
        },
        languages: languages.split(',').map(l => l.trim()).filter(l => l),
      };
      await updateData('personal', updated);
      toast({ title: '✅ Success', description: 'Personal info updated successfully' });
    } catch {
      toast({ title: '❌ Error', description: 'Failed to update personal info', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/30 focus:border-[#006a4e] transition-all';
  const labelClass = 'block text-sm font-semibold mb-1.5';

  return (
    <div className="space-y-5">
      {/* Basic Info */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <i className="bi bi-person-fill text-[#006a4e]" /> Basic Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input className={inputClass} value={form.name} onChange={e => handleChange('name', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>First Name</label>
            <input className={inputClass} value={form.firstName} onChange={e => handleChange('firstName', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Initials</label>
            <input className={inputClass} value={form.initials} onChange={e => handleChange('initials', e.target.value)} maxLength={2} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input className={inputClass} type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Profile Image URL</label>
            <input className={inputClass} value={form.profileImage} onChange={e => handleChange('profileImage', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Resume URL</label>
            <input className={inputClass} value={form.resumeUrl} onChange={e => handleChange('resumeUrl', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Languages (comma-separated)</label>
            <input className={inputClass} value={languages} onChange={e => setLanguages(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Title & Tagline (Bilingual) */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <i className="bi bi-translate text-[#006a4e]" /> Title & Tagline
        </h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Title (EN)</label>
            <input className={inputClass} value={form.title} onChange={e => handleChange('title', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Title (বাংলা)</label>
            <input className={inputClass} value={form.titleBn} onChange={e => handleChange('titleBn', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Tagline (EN)</label>
            <input className={inputClass} value={form.tagline} onChange={e => handleChange('tagline', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Tagline (বাংলা)</label>
            <input className={inputClass} value={form.taglineBn} onChange={e => handleChange('taglineBn', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Location & Availability (Bilingual) */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <i className="bi bi-geo-alt-fill text-[#006a4e]" /> Location & Availability
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Location (বাংলা)</label>
            <input className={inputClass} value={form.location} onChange={e => handleChange('location', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Location (EN)</label>
            <input className={inputClass} value={form.locationEn} onChange={e => handleChange('locationEn', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Availability (EN)</label>
            <input className={inputClass} value={form.availability} onChange={e => handleChange('availability', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Availability (বাংলা)</label>
            <input className={inputClass} value={form.availabilityBn} onChange={e => handleChange('availabilityBn', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Bio (Bilingual) */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <i className="bi bi-card-text text-[#006a4e]" /> Bio
        </h3>
        <div>
          <label className={labelClass}>Short Bio (EN)</label>
          <textarea className={inputClass + ' min-h-[80px] resize-y'} value={bioShort} onChange={e => setBioShort(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Short Bio (বাংলা)</label>
          <textarea className={inputClass + ' min-h-[80px] resize-y'} value={bioShortBn} onChange={e => setBioShortBn(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Full Bio (EN) — one paragraph per line</label>
          <textarea className={inputClass + ' min-h-[140px] resize-y'} value={bioFull} onChange={e => setBioFull(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Full Bio (বাংলা) — one paragraph per line</label>
          <textarea className={inputClass + ' min-h-[140px] resize-y'} value={bioFullBn} onChange={e => setBioFullBn(e.target.value)} />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#006a4e] to-[#00875a] text-white hover:shadow-lg hover:shadow-[#006a4e]/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        {saving ? <><i className="bi bi-arrow-repeat animate-spin" /> Saving...</> : <><i className="bi bi-check-lg" /> Save Personal Info</>}
      </button>
    </div>
  );
}
