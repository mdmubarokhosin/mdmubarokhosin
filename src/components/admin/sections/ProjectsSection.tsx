'use client';

import { useState } from 'react';
import { useFirebase } from '@/context/FirebaseContext';
import { useToast } from '@/hooks/use-toast';

interface Project {
  title: string; titleBn: string;
  description: string; descriptionBn: string;
  tags: string[]; icon: string; color: string;
  liveUrl: string; codeUrl: string;
  featured: boolean; category: string;
}

const emptyProject: Project = {
  title: '', titleBn: '', description: '', descriptionBn: '',
  tags: [], icon: 'bi-folder', color: '#006a4e',
  liveUrl: '', codeUrl: '', featured: false, category: 'fullstack',
};

export default function ProjectsSection() {
  const { data, updateData, pushData, removeData } = useFirebase();
  const { toast } = useToast();
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Project>(emptyProject);
  const [tagsInput, setTagsInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const projects = data.projects as unknown as Project[];

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]/30 focus:border-[#006a4e] transition-all';
  const labelClass = 'block text-sm font-semibold mb-1.5';

  const openAdd = () => {
    setForm(emptyProject);
    setTagsInput('');
    setEditingIdx(null);
    setShowForm(true);
  };

  const openEdit = (idx: number) => {
    const p = projects[idx];
    setForm({ ...p });
    setTagsInput(p.tags?.join(', ') ?? '');
    setEditingIdx(idx);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: '⚠️ Validation', description: 'Title is required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const updated = { ...form, tags: tagsInput.split(',').map(t => t.trim()).filter(t => t) };
      if (editingIdx !== null) {
        const newProjects = [...projects];
        newProjects[editingIdx] = updated;
        await updateData('projects', newProjects);
        toast({ title: '✅ Success', description: 'Project updated' });
      } else {
        await pushData('projects', updated);
        toast({ title: '✅ Success', description: 'Project added' });
      }
      setShowForm(false);
      setEditingIdx(null);
    } catch {
      toast({ title: '❌ Error', description: 'Operation failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (idx: number) => {
    setSaving(true);
    try {
      await removeData(`projects/${idx}`);
      // Rebuild array without the deleted item
      const newProjects = projects.filter((_, i) => i !== idx);
      await updateData('projects', newProjects);
      toast({ title: '🗑️ Deleted', description: 'Project removed' });
      setDeleteConfirm(null);
    } catch {
      toast({ title: '❌ Error', description: 'Delete failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <button onClick={openAdd} className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#006a4e] to-[#00875a] text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#006a4e]/25 transition-all active:scale-[0.98]">
        <i className="bi bi-plus-lg" /> Add Project
      </button>

      {/* Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">{editingIdx !== null ? 'Edit Project' : 'New Project'}</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><i className="bi bi-x-lg" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelClass}>Title (EN) *</label><input className={inputClass} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div><label className={labelClass}>Title (বাংলা)</label><input className={inputClass} value={form.titleBn} onChange={e => setForm(p => ({ ...p, titleBn: e.target.value }))} /></div>
            <div className="sm:col-span-2"><label className={labelClass}>Description (EN)</label><textarea className={inputClass + ' min-h-[80px] resize-y'} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
            <div className="sm:col-span-2"><label className={labelClass}>Description (বাংলা)</label><textarea className={inputClass + ' min-h-[80px] resize-y'} value={form.descriptionBn} onChange={e => setForm(p => ({ ...p, descriptionBn: e.target.value }))} /></div>
            <div><label className={labelClass}>Tags (comma-separated)</label><input className={inputClass} value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="React, Node.js, MongoDB" /></div>
            <div><label className={labelClass}>Category</label>
              <select className={inputClass} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                <option value="fullstack">Full Stack</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
              </select>
            </div>
            <div><label className={labelClass}>Icon (bi-*)</label><input className={inputClass} value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="bi-folder" /></div>
            <div><label className={labelClass}>Color</label><div className="flex gap-2 items-center"><input type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} className="w-10 h-10 rounded-lg border border-border cursor-pointer" /><input className={inputClass + ' flex-1'} value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} /></div></div>
            <div><label className={labelClass}>Live URL</label><input className={inputClass} value={form.liveUrl} onChange={e => setForm(p => ({ ...p, liveUrl: e.target.value }))} /></div>
            <div><label className={labelClass}>Code URL</label><input className={inputClass} value={form.codeUrl} onChange={e => setForm(p => ({ ...p, codeUrl: e.target.value }))} /></div>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded border-border accent-[#006a4e]" />
              <span className="text-sm font-medium">Featured Project</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#006a4e] to-[#00875a] text-white disabled:opacity-50 flex items-center gap-2 active:scale-[0.98]">
              {saving ? <><i className="bi bi-arrow-repeat animate-spin" /> Saving...</> : <><i className="bi bi-check-lg" /> Save</>}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-2">
        {projects.map((project, idx) => (
          <div key={idx} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: project.color + '15' }}>
              <i className={`bi ${project.icon || 'bi-folder'}`} style={{ color: project.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm truncate">{project.title}</p>
                {project.featured && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#006a4e]/10 text-[#006a4e]">Featured</span>}
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{project.category}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{project.description}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {(project.tags || []).slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{tag}</span>
                ))}
                {(project.tags || []).length > 3 && <span className="text-[10px] text-muted-foreground">+{project.tags.length - 3}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => openEdit(idx)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-[#006a4e]">
                <i className="bi bi-pencil text-sm" />
              </button>
              {deleteConfirm === idx ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => handleDelete(idx)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#f42a41]/10 text-[#f42a41] hover:bg-[#f42a41]/20 transition-colors">
                    <i className="bi bi-check-lg text-sm" />
                  </button>
                  <button onClick={() => setDeleteConfirm(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
                    <i className="bi bi-x-lg text-sm" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(idx)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f42a41]/10 text-muted-foreground hover:text-[#f42a41] transition-colors">
                  <i className="bi bi-trash3 text-sm" />
                </button>
              )}
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <i className="bi bi-folder-x text-3xl block mb-2" />
            <p className="text-sm">No projects yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
