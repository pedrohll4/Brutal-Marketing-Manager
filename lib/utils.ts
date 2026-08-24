import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  try {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(dateString);
    return d.toLocaleDateString("pt-BR");
  } catch {
    return dateString;
  }
}

export function formatMonthName(monthNumber: number): string {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  return months[monthNumber - 1] || `Mês ${monthNumber}`;
}

export function getEmbeddableMediaUrl(url?: string): {
  type: 'gdrive_file' | 'gdrive_folder' | 'youtube' | 'vimeo' | 'direct' | 'none';
  embedUrl?: string;
  originalUrl?: string;
  fileId?: string;
} {
  if (!url || !url.trim()) return { type: 'none' };
  const trimmed = url.trim();

  // 1. Google Drive Folder
  if (trimmed.includes('drive.google.com/drive/folders/') || trimmed.includes('drive.google.com/drive/u/')) {
    return {
      type: 'gdrive_folder',
      embedUrl: trimmed,
      originalUrl: trimmed,
    };
  }

  // 2. Google Drive Single File (Video / Photo / PDF)
  // Formats:
  // https://drive.google.com/file/d/1a2b3c4d5e/view?usp=sharing
  // https://drive.google.com/open?id=1a2b3c4d5e
  // https://drive.google.com/uc?id=1a2b3c4d5e
  const gdriveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (gdriveMatch && gdriveMatch[1]) {
    const fileId = gdriveMatch[1];
    return {
      type: 'gdrive_file',
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      originalUrl: trimmed,
      fileId,
    };
  }

  // 3. YouTube (Shorts, Watch, Share links)
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([a-zA-Z0-9_-]+)/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      originalUrl: trimmed,
    };
  }

  // 4. Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`,
      originalUrl: trimmed,
    };
  }

  // 5. Direct MP4 / Image URL
  return {
    type: 'direct',
    embedUrl: trimmed,
    originalUrl: trimmed,
  };
}
