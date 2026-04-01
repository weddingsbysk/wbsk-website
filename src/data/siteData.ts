// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface GalleryImage {
  url: string;
  caption?: string;
}

export interface Video {
  videoTitle: string;
  url: string;           // YouTube / Vimeo URL
  thumbnail?: string;    // optional custom thumbnail (auto-detected for YouTube)
}

export interface ClientFilms {
  weddingFilms?: Video[];
  highlights?: Video[];
  teasers?: Video[];
}

export interface Reel {
  url: string;   // YouTube Shorts / Vimeo URL
  title?: string;
}

export interface Client {
  id: string;        // matches folder name, e.g. "garhima-ankur"
  title: string;
  slug: string;      // same as id — used in page URLs: /client/[slug]
  coupleName: string;
  date: string;      // ISO format: "2025-02-08"
  venue: string;
  description: string;
  featured: boolean;
  coverImageUrl?: string;
  category?: string;
  gallery?: GalleryImage[];
  films?: ClientFilms;
  reels?: Reel[];
  whatWeCapture?: {
    candid?: { description: string; image?: string; };
    portrait?: { description: string; image?: string; };
    traditional?: { description: string; image?: string; };
  };
}

export interface Stat {
  number: string;
  label: string;
}

// ─── LOCAL IMAGE HELPERS ─────────────────────────────────────────────────────

const getCoverImage = (folderName: string): string =>
  `/images/weddings/${folderName}/cover.jpg`;

const generateImagePaths = (folderName: string, count: number): GalleryImage[] =>
  Array.from({ length: count }, (_, i) => ({
    url: `/images/weddings/${folderName}/image-${i + 1}.jpg`,
  }));

// ─── HERO ────────────────────────────────────────────────────────────────────

export const heroData = {
  heading: 'Timeless Moments. Preserved.',
  subtext:
    'Luxury wedding photography capturing authentic emotions, untold stories, and the quiet in-between moments that define your love.',
  ctaText: 'View Portfolio',
  secondaryText: 'Book a Session',
  backgroundImage: `/images/hero-bg.jpg`,
  scrollingCategories: [
    'Pre-Wedding',
    'Bride & Groom',
    'Luxury Photography',
    'Weddings',
    'Candid Moments',
    'Haldi Ceremonies',
    'Portraits',
    'Engagements',
  ],
};

// ─── PHILOSOPHY ──────────────────────────────────────────────────────────────

export const philosophyData = {
  label: 'OUR PHILOSOPHY',
  quote: '"We don\'t just photograph weddings. We preserve the feeling of them."',
  quoteHighlight: 'feeling',
  attribution: '— SIDDHANT KAPOOR  ·  LEAD PHOTOGRAPHER',
  stats: [
    { number: '9+', label: 'Years of Craft' },
    { number: '500+', label: 'Stories Told' },
    { number: '1', label: 'Wedding Per Day' },
    { number: '∞', label: 'Memories Made' },
  ] satisfies Stat[],
};

// ─── ABOUT ───────────────────────────────────────────────────────────────────

export const aboutData = {
  heading: 'About Weddings by Siddhant Kapoor',
  paragraphs: [
    "Hi, I'm Siddhant Kapoor, a passionate wedding photographer dedicated to capturing the magic of your special day. With years of experience in wedding photography, I specialize in creating timeless, elegant imagery that reflects the unique love story of each couple I work with.",
    'From intimate ceremonies to grand celebrations, I believe every wedding is unique and deserves to be captured with artistic vision and attention to detail. Let me help you preserve the authentic emotions, beautiful moments, and precious memories that make your wedding day truly unforgettable.',
  ],
  backgroundImage: '',
};

// ─── CLIENTS / WEDDINGS ──────────────────────────────────────────────────────
// Adding a new client:
//   1. Add an entry to the array below.
//   2. gallery  → generateImagePaths('folder-name', count)  OR custom GalleryImage[]
//   3. films    → { weddingFilms: [...], highlights: [...], teasers: [...] }
//   4. reels    → [{ url: 'https://youtu.be/SHORT_ID' }]
//   5. whatWeCapture → { candid, portrait, traditional } with description + optional image

export const clients: Client[] = [
  {
    id: 'ayushi-kunal',
    title: 'Cultural Celebration',
    slug: 'ayushi-kunal',
    coupleName: 'Ayushi & Kunal',
    date: '2025-02-14',
    venue: 'Mishtten Club, Kota',
    description: 'A vibrant celebration of love, tradition, and cultural heritage.',
    featured: true,
    coverImageUrl: getCoverImage('ayushi-kunal'),
    category: 'Traditional',
    gallery: generateImagePaths('ayushi-kunal', 10),
    films: {},
    reels: [],
  },
  {
    id: 'anusha-rohit',
    title: 'Seaside Elegance',
    slug: 'anusha-rohit',
    coupleName: 'Anusha & Rohit',
    date: '2025-03-29',
    venue: 'La Cabana, Goa',
    description: 'An elegant beachside ceremony with stunning ocean views.',
    featured: true,
    coverImageUrl: getCoverImage('anusha-rohit'),
    category: 'Destination',
    gallery: generateImagePaths('anusha-rohit', 10),
    films: {
      weddingFilms: [{ videoTitle: 'Wedding Film', url: 'https://youtu.be/KpuOqmcLa60' }],
      teasers: [{ videoTitle: 'Teaser', url: 'https://youtu.be/UXPAMWH12pQ' }],
    },
    reels: [],
  },
  {
    id: 'anukriti-gaurav',
    title: 'Mountain Bliss',
    slug: 'anukriti-gaurav',
    coupleName: 'Anukriti & Gaurav',
    date: '2025-03-03',
    venue: 'Evara Resort, Corbett',
    description: "A breathtaking mountain wedding surrounded by nature's grandeur.",
    featured: true,
    coverImageUrl: getCoverImage('anukriti-gaurav'),
    category: 'Destination',
    gallery: generateImagePaths('anukriti-gaurav', 10),
    films: {},
    reels: [],
  },
];
