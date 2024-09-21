export default function camelToSnakeCaps(camel: string): string {
  return camel.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase();
}
