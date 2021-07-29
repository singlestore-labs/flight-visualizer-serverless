// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function pruneToSize(obj: any, count: number) {
  const keys = Object.keys(obj);
  if (keys.length > count) {
    for (let i = 0; i < keys.length - count; i++) {
      delete obj[keys[i]];
    }
  }
}
