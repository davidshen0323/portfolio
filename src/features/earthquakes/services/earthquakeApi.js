const ENDPOINT = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
export function normalizeEarthquakes(features) {
  if (!Array.isArray(features)) throw new Error('資料格式不符預期');
  return features
    .filter((entry) => Number.isFinite(entry.properties?.time))
    .map(({ id, properties, geometry }) => ({
      id,
      place: properties.place || '位置未提供',
      magnitude: Number.isFinite(properties.mag) ? properties.mag : null,
      time: properties.time,
      depth: Number.isFinite(geometry?.coordinates?.[2]) ? geometry.coordinates[2] : null,
      url:
        typeof properties.url === 'string' &&
        properties.url.startsWith('https://earthquake.usgs.gov/')
          ? properties.url
          : null,
    }))
    .sort((a, b) => b.time - a.time);
}
export async function fetchEarthquakes({ days, magnitude, signal }, fetcher = fetch) {
  const params = new URLSearchParams({
    format: 'geojson',
    starttime: new Date(Date.now() - days * 86400000).toISOString(),
    minlatitude: '20.5',
    maxlatitude: '26.5',
    minlongitude: '119',
    maxlongitude: '123.5',
    minmagnitude: String(magnitude),
    orderby: 'time',
    limit: '300',
    eventtype: 'earthquake',
  });
  const response = await fetcher(`${ENDPOINT}?${params}`, { signal });
  if (response.status === 204) return [];
  if (!response.ok) throw new Error('無法取得資料，請檢查網路後重試。');
  return normalizeEarthquakes((await response.json()).features);
}
