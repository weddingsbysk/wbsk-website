import { clients, type Client, type ClientFilms, type Reel } from '@/data/siteData';

export function getFeaturedClients(): Client[] {
  return clients.filter((c) => c.featured);
}

export function getClientBySlug(slug: string): Client | null {
  return clients.find((c) => c.slug === slug) ?? null;
}

export function getAllClientSlugs(): string[] {
  return clients.map((c) => c.slug);
}

// ─── VIDEO HELPERS ────────────────────────────────────────────────────────────

export function getEmbedUrl(url: string): string {
  if (!url) return '';
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=0&rel=0`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

export function getVideoThumbnail(url: string): string {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/maxresdefault.jpg`;
  return '';
}

export function getReelEmbedUrl(url: string): string {
  if (!url) return '';
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (yt) {
    const id = yt[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&enablejsapi=1&playsinline=1&controls=0&rel=0&modestbranding=1`;
  }
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&muted=1&loop=1&background=1`;
  return url;
}

// ─── PROCESS FILMS FOR PAGE ───────────────────────────────────────────────────

interface ProcessedVideo {
  title: string;
  embedUrl: string;
  thumbnail: string;
}

interface ProcessedFilms {
  weddingFilms: ProcessedVideo[];
  highlights: ProcessedVideo[];
  teasers: ProcessedVideo[];
}

export function processFilms(films: ClientFilms | undefined): ProcessedFilms {
  const process = (arr: ClientFilms[keyof ClientFilms]) =>
    (arr ?? []).map((v) => ({
      title: v.videoTitle,
      embedUrl: getEmbedUrl(v.url),
      thumbnail: v.thumbnail || getVideoThumbnail(v.url),
    }));

  return {
    weddingFilms: process(films?.weddingFilms),
    highlights: process(films?.highlights),
    teasers: process(films?.teasers),
  };
}

// ─── PROCESS REELS FOR PAGE ───────────────────────────────────────────────────

interface ProcessedReel {
  embedUrl: string;
  title: string;
}

export function processReels(reels: Reel[] | undefined): ProcessedReel[] {
  return (reels ?? []).map((r) => ({
    embedUrl: getReelEmbedUrl(r.url),
    title: r.title ?? '',
  }));
}
