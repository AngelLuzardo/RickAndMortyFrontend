export function getSeasonColor(episode: string): string {
  const season = episode.substring(1, 3);
  const seasonColors: { [key: string]: string } = {
    '01': '#00B7C3',
    '02': '#FFB81C',
    '03': '#E91E63',
    '04': '#673AB7',
    '05': '#FF6F00',
  };
  return seasonColors[season] || '#1976D2';
}
