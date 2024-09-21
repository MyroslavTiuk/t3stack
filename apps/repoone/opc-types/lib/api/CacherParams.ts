export type CacherParams<Args extends any[]> = {
  key: string;
  time?: number; // minutes
  expiry?: number;
  args?: Args;
  shouldUse?: (...args: Args) => boolean;
  shouldSave?: (result: any, args?: Args) => boolean;
};
