export type AddedNotification = {
  type: "cart" | "quote";
  name: string;
  variantName?: string;
  image?: { src: string; alt: string };
};

type Listener = (n: AddedNotification) => void;
const listeners = new Set<Listener>();

export function emitAdded(n: AddedNotification) {
  for (const l of listeners) l(n);
}

export function onAdded(cb: Listener): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
