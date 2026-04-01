// Custom image loader for next-image-export-optimizer
// This is required when using output: 'export' with image optimization
export default function imageLoader({ src, width, quality }) {
  // For remote images (e.g. YouTube thumbnails), return as-is
  if (src.startsWith('http')) {
    return src;
  }

  const basePath = process.env.nextImageExportOptimizer_exportFolderName || 'nextImageExportOptimizer';
  const quality_ = quality || process.env.nextImageExportOptimizer_quality || 75;

  // Strip leading slash
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  const extension = process.env.nextImageExportOptimizer_storePicturesInWEBP === 'true' ? 'webp' : 'jpg';

  // Optimized path: /<exportFolderName>/<path>/<filename>-opt-<width>.<ext>
  const parts = cleanSrc.split('/');
  const filename = parts[parts.length - 1].replace(/\.[^.]+$/, '');
  const dir = parts.slice(0, -1).join('/');

  return `/${basePath}/${dir}/${filename}-opt-${width}.${extension}`;
}
