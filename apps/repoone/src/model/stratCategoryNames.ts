const scn: Record<string, string> = {};

export default function getStratCatName(catKey: string) {
  return scn[catKey] || `${catKey[0].toUpperCase()}${catKey.substr(1)}`;
}
