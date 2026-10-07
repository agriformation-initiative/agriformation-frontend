export const formatDate = (value: string, style: 'long' | 'short' = 'long') =>
  new Date(value).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
  });

/** Whole days from now until the given date. Negative once it has passed. */
export const daysUntil = (value: string) =>
  Math.ceil((new Date(value).getTime() - Date.now()) / 86_400_000);

export const titleCase = (value: string) =>
  value.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
