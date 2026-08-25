'use client';

import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface UploadedMediaResult {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  isVideo: boolean;
  isPhoto: boolean;
  uploadedAt: string;
}

export async function uploadMediaFile(
  file: File,
  folder: string = 'entregas',
  onProgress?: (progressPct: number) => void
): Promise<UploadedMediaResult> {
  const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|avi|mkv|webm)$/i.test(file.name);
  const isPhoto = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file.name);
  const fileExt = file.name.split('.').pop() || 'bin';
  const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const filePath = `${folder}/${cleanFileName}`;

  // Fake progressive tick for instant UX feedback
  let currentPct = 15;
  let interval: any = null;
  if (onProgress) {
    onProgress(15);
    interval = setInterval(() => {
      currentPct = Math.min(85, currentPct + 15);
      onProgress(currentPct);
      if (currentPct >= 85 && interval) {
        clearInterval(interval);
      }
    }, 150);
  }

  // 1. Try Supabase Storage if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('brutal-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('brutal-media')
          .getPublicUrl(filePath);

        if (onProgress) onProgress(100);

        return {
          url: publicUrlData.publicUrl,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          isVideo,
          isPhoto,
          uploadedAt: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn('Supabase storage upload fallback:', err);
    }
  }

  // 2. Fallback: Browser Object URL / Local Data URL for instant fast playback
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    if (onProgress) onProgress(100);

    resolve({
      url: objectUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      isVideo,
      isPhoto,
      uploadedAt: new Date().toISOString(),
    });
  });
}
