// Home page content. Every `image` is intentionally empty: drop in your Cloudinary render URLs.
// Empty or 404 images render a quiet fallback surface (see ImageWithFallback), never a broken icon.
// `HERO_PICKS` and `AI_DEMO.items` should come from real rows in your Supabase `furniture` table.

export const HERO_RENDER = '';

export const HERO_PICKS = [
  { id: 'hp1', name: 'Bouclé lounge sofa', price: 899, match: 97, image: '' },
  { id: 'hp2', name: 'Oak side table', price: 189, match: 94, image: '' },
  { id: 'hp3', name: 'Linen floor lamp', price: 129, match: 92, image: '' },
];

export const STATS = [
  { value: 11626, suffix: '+', label: 'Furniture pieces you can buy' },
  { value: 30, suffix: ' sec', label: 'Average render time' },
  { value: 98, suffix: '%', label: 'Average AI match' },
];

export const ROOM_CATEGORIES = ['All', 'Modern', 'Japandi', 'Scandinavian', 'Luxury', 'Minimal', 'Boho'];

export const FEATURED_ROOMS = [
  { id: 'r1', title: 'Sunlit Japandi living room', category: 'Japandi', ratio: 'aspect-[3/4]', image: '' },
  { id: 'r2', title: 'Walnut and linen bedroom', category: 'Modern', ratio: 'aspect-[4/3]', image: '' },
  { id: 'r3', title: 'Quiet Scandinavian kitchen', category: 'Scandinavian', ratio: 'aspect-square', image: '' },
  { id: 'r4', title: 'Marble and brass lounge', category: 'Luxury', ratio: 'aspect-[3/4]', image: '' },
  { id: 'r5', title: 'Minimal studio apartment', category: 'Minimal', ratio: 'aspect-[4/5]', image: '' },
  { id: 'r6', title: 'Terracotta reading corner', category: 'Boho', ratio: 'aspect-[4/3]', image: '' },
  { id: 'r7', title: 'Open-plan dining room', category: 'Modern', ratio: 'aspect-[4/5]', image: '' },
  { id: 'r8', title: 'Master suite in soft stone', category: 'Luxury', ratio: 'aspect-square', image: '' },
  { id: 'r9', title: 'Pale ash home office', category: 'Scandinavian', ratio: 'aspect-[3/4]', image: '' },
];

// boxes are percentages of the render (x, y, w, h)
export const AI_DEMO = {
  image: '',
  items: [
    { id: 'd1', label: 'Bouclé sofa', image: '', box: { x: 12, y: 50, w: 38, h: 28 } },
    { id: 'd2', label: 'Oak coffee table', image: '', box: { x: 30, y: 72, w: 22, h: 12 } },
    { id: 'd3', label: 'Floor lamp', image: '', box: { x: 58, y: 24, w: 8, h: 42 } },
    { id: 'd4', label: 'Lounge chair', image: '', box: { x: 68, y: 52, w: 20, h: 28 } },
  ],
};
