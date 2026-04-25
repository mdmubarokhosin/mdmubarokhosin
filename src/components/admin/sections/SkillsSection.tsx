'use client';

import { useState } from 'react';
import { useFirebase } from '@/context/FirebaseContext';
import { useToast } from '@/hooks/use-toast';

interface Skill {
  name: string; icon: string; level: number; color: string; category: string;
}

const emptySkill: Skill = { name: '', icon: 'bi-code-slash', level: 50, color: '#006a4e', category: 'frontend' };

export default function SkillsSection() {
  const { data, updateData, pushData, removeData } = useFirebase();
  const { toast } = useToast();
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Skill>(emptySkill);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const skills = data.skills as unknown as Skill[];
  const inputClass = 'w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/30 focus:border-[#006a4e] transition-all';
  const labelClass = 'block text-sm font-semibold mb-1.5';

  const openAdd = () => { setForm(emptySkill); setEditingIdx(null); setShowForm(true); };
  const openEdit = (idx: number) => { setForm({ ...skills[idx] }); setEditingIdx(idx); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: '⚠️ Validation', description: 'Skill name is required', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      if (editingIdx !== null) {
        const newSkills = [...skills]; newSkills[editingIdx] = form;
        await updateData('skills', newSkills);
        toast({ title: '✅ Success', description: 'Skill updated' });
      } else {
        await pushData('skills', form);
        toast({ title: '✅ Success', description: 'Skill added' });
      }
      setShowForm(false); setEditingIdx(null);
    } catch { toast({ title: '❌ Error', description: 'Operation failed', variant: 'destructive' }); } finally { setSaving(false); }
  };

  const handleDelete = async (idx: number) => {
    setSaving(true);
    try {
      const newSkills = skills.filter((_, i) => i !== idx);
      await updateData('skills', newSkills);
      toast({ title: '🗑️ Deleted', description: 'Skill removed' });
      setDeleteConfirm(null);
    } catch { toast({ title: '❌ Error', description: 'Delete failed', variant: 'destructive' }); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <button onClick={openAdd} className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#006a4e] to-[#00875a] text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#006a4e]/25 transition-all active:scale-[0.98]">
        <i className="bi bi-plus-lg" /> Add Skill
      </button>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">{editingIdx !== null ? 'Edit Skill' : 'New Skill'}</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><i className="bi bi-x-lg" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelClass}>Name *</label><input className={inputClass} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div><label className={labelClass}>Category</label>
              <select className={inputClass} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="tools">Tools</option>
              </select>
            </div>
            <div><label className={labelClass}>Icon (bi-*)</label><input className={inputClass} value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="bi-code-slash" /></div>
            <div><label className={labelClass}>Color</label><div className="flex gap-2 items-center"><input type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} className="w-10 h-10 rounded-lg border border-border cursor-pointer" /><input className={inputClass + ' flex-1'} value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} /></div></div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Level: {form.level}%</label>
              <input type="range" min={10} max={100} step={5} value={form.level} onChange={e => setForm(p => ({ ...p, level: Number(e.target.value) }))} className="w-full accent-[#006a4e]" />
              <div className="w-full bg-muted rounded-full h-2 mt-2"><div className="h-2 rounded-full transition-all" style={{ width: `${form.level}%`, backgroundColor: form.color }} /></div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#006a4e] to-[#00875a] text-white disabled:opacity-50 flex items-center gap-2 active:scale-[0.98]">
              {saving ? <><i className="bi bi-arrow-repeat animate-spin" /> Saving...</> : <><i className="bi bi-check-lg" /> Save</>}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {skills.map((skill, idx) => (
          <div key={idx} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: skill.color + '15' }}>
              <i className={`bi ${skill.icon}`} style={{ color: skill.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{skill.name}</p>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{skill.category}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 mt-1.5"><div className="h-1.5 rounded-full" style={{ width: `${skill.level}%`, backgroundColor: skill.color }} /></div>
            </div>
            <span className="text-xs font-bold text-muted-foreground mr-1">{skill.level}%</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => openEdit(idx)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-[#006a4e]"><i className="bi bi-pencil text-sm" /></button>
              {deleteConfirm === idx ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => handleDelete(idx)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#f42a41]/10 text-[#f42a41]"><i className="bi bi-check-lg text-sm" /></button>
                  <button onClick={() => setDeleteConfirm(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground"><i className="bi bi-x-lg text-sm" /></button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(idx)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f42a41]/10 text-muted-foreground hover:text-[#f42a41] transition-colors"><i className="bi bi-trash3 text-sm" /></button>
              )}
            </div>
          </div>
        ))}
        {skills.length === 0 && (
          <div className="text-center py-8 text-muted-foreground"><i className="bi bi-code-slash text-3xl block mb-2" /><p className="text-sm">No skills yet</p></div>
        )}
      </div>
    </div>
  );
}
