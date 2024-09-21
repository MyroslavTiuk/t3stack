const clx = (classes: string | (string | undefined | false)[]): string => {
  if (typeof classes === 'string') return classes;
  else if (Array.isArray(classes)) return classes.filter((s) => s).join(' ');
  else throw new Error('clx received type other than string or array');
};

export default clx;
