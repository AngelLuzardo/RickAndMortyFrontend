/**
 * Obtiene el color asociado a una temporada basado en el código del episodio
 * @param episode Código del episodio (ej: 'S01E01')
 * @returns Color hexadecimal de la temporada
 */
export function getSeasonColor(episode: string): string {
  const season = episode.substring(1, 3);
  const seasonColors: { [key: string]: string } = {
    '01': '#FF6B6B',
    '02': '#4ECDC4',
    '03': '#45B7D1',
    '04': '#FFA07A',
    '05': '#98D8C8',
  };
  return seasonColors[season] || '#667eea';
}
