import { apiGet } from '@/lib/api-server';
import { DEFAULT_PROGRAMS, PROGRAM_IMAGES, type Program } from '@/lib/programs';

export interface Stat {
  value: string;
  label: string;
  note: string;
}

export interface SiteContent {
  stats: Stat[];
  programs: Program[];
}

/** Shown until someone edits the numbers in the admin. Replace them there with your current figures. */
export const DEFAULT_STATS: Stat[] = [
  { value: '83', label: 'Students on our first farm excursion', note: 'Where it began, at Ibiteinye Inye Integrated Farms in 2024' },
  { value: '10', label: 'School gardens', note: 'Demonstration plots in our program plan' },
  { value: '500+', label: 'Young people to train', note: 'Students in the agricultural workshop program' },
];

interface ApiProgram {
  title: string;
  short: string;
  timeline?: string;
  description?: string;
  impact?: string;
  activities?: string[];
}

/**
 * The website's editable content. Reads from the API, and falls back to the built-in defaults when
 * nothing has been saved yet or the API is unreachable, so pages never come up empty.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const data = await apiGet<{ stats: Stat[] | null; programs: ApiProgram[] | null }>('/settings', 60);

  const programs: Program[] = data?.programs?.length
    ? data.programs.map((p, i) => ({
        title: p.title,
        short: p.short,
        timeline: p.timeline ?? '',
        timelineLong: p.timeline ?? '',
        description: p.description || p.short,
        impact: p.impact ?? '',
        activities: p.activities ?? [],
        image: PROGRAM_IMAGES[i] ?? PROGRAM_IMAGES[PROGRAM_IMAGES.length - 1],
      }))
    : DEFAULT_PROGRAMS;

  return {
    stats: data?.stats?.length ? data.stats : DEFAULT_STATS,
    programs,
  };
}
