declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.module.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.svg' {
  const content: React.FC<{ className: string; alt?: string }>;
  export = content;
}

declare module 'node-scrapy' {
  export = any;
}
declare module 'react-ab-test/lib/Experiment' {
  export = any;
}
declare module 'react-ab-test/lib/Variant' {
  export = any;
}
declare module 'react-ab-test/lib/emitter' {
  export = any;
}
