'use client';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { settingsService, StatInput, ProgramInput } from '@/services/settingsService';
import { DEFAULT_STATS } from '@/lib/settings';
import { DEFAULT_PROGRAMS } from '@/lib/programs';
import Button from '@/components/ui/Button';
import { TextField, TextAreaField } from '@/components/ui/Field';
import { PageHeader, ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';

const MAX_STATS = 6;
const MAX_PROGRAMS = 8;

const emptyStat = (): StatInput => ({ value: '', label: '', note: '' });
const emptyProgram = (): ProgramInput => ({ title: '', short: '', timeline: '', description: '', impact: '', activities: [] });

const defaultsAsInput = (): { stats: StatInput[]; programs: ProgramInput[] } => ({
  stats: DEFAULT_STATS.map((s) => ({ ...s })),
  programs: DEFAULT_PROGRAMS.map(({ title, short, timeline, description, impact, activities }) => ({
    title, short, timeline, description, impact, activities: [...activities],
  })),
});

export default function SiteContentPage() {
  const [stats, setStats] = useState<StatInput[]>([]);
  const [programs, setPrograms] = useState<ProgramInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setFailed(false);
    try {
      const data = await settingsService.get();
      const fallback = defaultsAsInput();
      setStats(data.stats?.length ? data.stats.map((s) => ({ ...s, note: s.note ?? '' })) : fallback.stats);
      setPrograms(data.programs?.length ? data.programs : fallback.programs);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStat = (i: number, key: keyof StatInput, value: string) =>
    setStats((list) => list.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  const updateProgram = <K extends keyof ProgramInput>(i: number, key: K, value: ProgramInput[K]) =>
    setPrograms((list) => list.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stats.some((s) => !s.value.trim() || !s.label.trim())) return setError('Every stat needs a number and a label. Remove any you do not need.');
    if (programs.some((p) => !p.title.trim() || !p.short.trim())) return setError('Every program needs a title and a short summary. Remove any you do not need.');
    if (!stats.length || !programs.length) return setError('Keep at least one stat and one program.');
    setError('');
    setSaving(true);
    try {
      const saved = await settingsService.save({ stats, programs });
      setStats(saved.stats.map((s) => ({ ...s, note: s.note ?? '' })));
      setPrograms(saved.programs);
      toast.success('Site content saved. The website updates within a minute.');
    } catch (err) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'We could not save your changes. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardSkeleton />;
  if (failed) return <ErrorState message="We could not load the site content." onRetry={load} />;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Site content"
        description="The impact figures and programs shown on the home, programs and transparency pages."
      />

      <form onSubmit={save} noValidate className="space-y-10">
        <section aria-labelledby="stats-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="stats-heading" className="font-sans text-xl font-semibold">Impact figures</h2>
              <p className="mt-1 text-stone-600">Shown as counting numbers on the home page. Use your current totals.</p>
            </div>
            {stats.length < MAX_STATS && (
              <Button variant="secondary" onClick={() => setStats((l) => [...l, emptyStat()])}><Plus size={16} aria-hidden="true" /> Add figure</Button>
            )}
          </div>
          <ul className="mt-5 space-y-4">
            {stats.map((s, i) => (
              <li key={i} className="rounded-xl bg-white p-5">
                <div className="grid gap-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <TextField id={`stat-value-${i}`} label="Number" placeholder="1,200+" maxLength={20} value={s.value} onChange={(e) => updateStat(i, 'value', e.target.value)} />
                  </div>
                  <div className="sm:col-span-4">
                    <TextField id={`stat-label-${i}`} label="Label" placeholder="Students reached" maxLength={80} value={s.label} onChange={(e) => updateStat(i, 'label', e.target.value)} />
                  </div>
                  <div className="sm:col-span-6">
                    <TextField id={`stat-note-${i}`} label="Detail" optional maxLength={160} value={s.note} onChange={(e) => updateStat(i, 'note', e.target.value)} />
                  </div>
                </div>
                <button type="button" onClick={() => setStats((l) => l.filter((_, idx) => idx !== i))}
                  className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-red-700 hover:underline">
                  <Trash2 size={16} aria-hidden="true" /> Remove figure {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="programs-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="programs-heading" className="font-sans text-xl font-semibold">Programs</h2>
              <p className="mt-1 text-stone-600">Shown in this order. Photos are chosen by position, so program 1 keeps the first program photo.</p>
            </div>
            {programs.length < MAX_PROGRAMS && (
              <Button variant="secondary" onClick={() => setPrograms((l) => [...l, emptyProgram()])}><Plus size={16} aria-hidden="true" /> Add program</Button>
            )}
          </div>
          <ul className="mt-5 space-y-4">
            {programs.map((p, i) => (
              <li key={i} className="rounded-xl bg-white p-5">
                <h3 className="font-sans text-base font-semibold text-stone-900">Program {i + 1}</h3>
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <TextField id={`p-title-${i}`} label="Title" maxLength={120} value={p.title} onChange={(e) => updateProgram(i, 'title', e.target.value)} />
                    </div>
                    <TextField id={`p-timeline-${i}`} label="When" optional placeholder="Term 2, 2026" maxLength={60} value={p.timeline} onChange={(e) => updateProgram(i, 'timeline', e.target.value)} />
                  </div>
                  <TextAreaField id={`p-short-${i}`} label="Short summary" rows={2} maxLength={300} hint="Shown on the home page." value={p.short} onChange={(e) => updateProgram(i, 'short', e.target.value)} />
                  <TextAreaField id={`p-desc-${i}`} label="Full description" optional rows={4} maxLength={1200} value={p.description} onChange={(e) => updateProgram(i, 'description', e.target.value)} />
                  <TextAreaField id={`p-activities-${i}`} label="Key activities" optional rows={4} hint="One per line."
                    value={p.activities.join('\n')} onChange={(e) => updateProgram(i, 'activities', e.target.value.split('\n'))} />
                  <TextField id={`p-impact-${i}`} label="Aim" optional maxLength={300} value={p.impact} onChange={(e) => updateProgram(i, 'impact', e.target.value)} />
                </div>
                <button type="button" onClick={() => setPrograms((l) => l.filter((_, idx) => idx !== i))}
                  className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-red-700 hover:underline">
                  <Trash2 size={16} aria-hidden="true" /> Remove program {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" loading={saving}>Save site content</Button>
          <Button variant="secondary" onClick={() => { const d = defaultsAsInput(); setStats(d.stats); setPrograms(d.programs); toast('Original text restored. Save to keep it.'); }}>
            Restore original text
          </Button>
        </div>
      </form>
    </div>
  );
}
