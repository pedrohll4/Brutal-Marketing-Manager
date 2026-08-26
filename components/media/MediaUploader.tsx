'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Film, Image as ImageIcon, CheckCircle2, Link2, X, Play, Loader2, Sparkles, FolderOpen } from 'lucide-react';
import { uploadMediaFile, UploadedMediaResult } from '@/lib/services/storageService';

interface MediaUploaderProps {
  initialUrl?: string;
  onMediaUploaded: (media: { url: string; fileName?: string; isVideo?: boolean }) => void;
  folder?: string;
}

export function MediaUploader({ initialUrl = '', onMediaUploaded, folder = 'entregas' }: MediaUploaderProps) {
  // If initialUrl looks like a drive/web link, start in EXTERNAL_LINK mode
  const isWebUrl = initialUrl.startsWith('http://') || initialUrl.startsWith('https://');
  const [mode, setMode] = useState<'EXTERNAL_LINK' | 'DIRECT_UPLOAD'>(isWebUrl || !initialUrl ? 'EXTERNAL_LINK' : 'DIRECT_UPLOAD');

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedResult, setUploadedResult] = useState<UploadedMediaResult | null>(null);
  const [externalUrl, setExternalUrl] = useState(initialUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setExternalUrl(initialUrl);
  }, [initialUrl]);

  const handleExternalUrlChange = (value: string) => {
    setExternalUrl(value);
    // Realtime sync to parent state so user doesn't need to click any extra button
    onMediaUploaded({
      url: value.trim(),
      isVideo: true,
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUpload(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processUpload(file);
  };

  const processUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(10);

    try {
      const result = await uploadMediaFile(file, folder, (progress) => {
        setUploadProgress(progress);
      });

      setUploadedResult(result);
      setIsUploading(false);
      setExternalUrl(result.url);
      onMediaUploaded({
        url: result.url,
        fileName: result.fileName,
        isVideo: result.isVideo,
      });
    } catch (err) {
      setIsUploading(false);
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-[#262626] pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('EXTERNAL_LINK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'EXTERNAL_LINK'
                ? 'bg-primary text-white shadow'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-[#1f1f1f]'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Link do Google Drive / YouTube (Recomendado)</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('DIRECT_UPLOAD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'DIRECT_UPLOAD'
                ? 'bg-primary text-white shadow'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-[#1f1f1f]'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload do Arquivo MP4/Foto</span>
          </button>
        </div>
      </div>

      {/* Mode 1: External Link Input (Default & Instant) */}
      {mode === 'EXTERNAL_LINK' && (
        <div className="space-y-2 bg-[#181818] p-4 rounded-xl border border-[#2a2a2a]">
          <div className="flex justify-between items-center">
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
              Link do Vídeo ou Foto para Aprovação:
            </label>
            <span className="text-[10px] text-primary font-mono font-bold">
              ✓ Salva automaticamente ao colar
            </span>
          </div>

          <div className="relative">
            <Link2 className="w-4 h-4 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              placeholder="Cole o link do Google Drive (https://drive.google.com/file/d/...), YouTube ou Vimeo..."
              value={externalUrl}
              onChange={(e) => handleExternalUrlChange(e.target.value)}
              className="w-full bg-[#121212] border border-[#333] rounded-lg pl-9 pr-3 py-2.5 text-xs text-on-surface font-mono focus:border-primary focus:outline-none"
            />
          </div>

          {externalUrl ? (
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Link anexado com sucesso para a visualização da cliente!</span>
            </div>
          ) : (
            <p className="text-[10px] text-on-surface-variant/80 font-sans">
              Dica: Certifique-se de que o link do Google Drive está como <strong>&quot;Qualquer pessoa com o link pode ver&quot;</strong> para o player carregar sem pedir login.
            </p>
          )}
        </div>
      )}

      {/* Mode 2: Direct File Drop Zone (Optional MP4 Upload) */}
      {mode === 'DIRECT_UPLOAD' && (
        <div>
          {!uploadedResult && !isUploading && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-primary bg-primary/10 scale-[1.01]'
                  : 'border-[#333] hover:border-primary/60 bg-[#161616] hover:bg-[#1a1a1a]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center mx-auto mb-2.5 border border-primary/30">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-on-surface">
                Arraste o arquivo de vídeo (.mp4) ou foto aqui
              </p>
              <p className="text-[10px] text-on-surface-variant font-sans mt-0.5">
                Ou clique para selecionar (MP4, MOV, JPG, PNG)
              </p>
            </div>
          )}

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="p-5 rounded-xl bg-[#161616] border border-primary/40 text-center space-y-2.5">
              <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface font-bold">Enviando mídia para a nuvem...</span>
                <span className="text-primary font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[#262626] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Success & Preview */}
          {uploadedResult && (
            <div className="p-4 rounded-xl bg-[#181818] border border-emerald-500/40 space-y-2.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Arquivo carregado com sucesso!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedResult(null)}
                  className="text-on-surface-variant hover:text-on-surface text-[10px] underline"
                >
                  Trocar arquivo
                </button>
              </div>

              {uploadedResult.isVideo ? (
                <div className="rounded-lg overflow-hidden bg-black border border-[#333] max-h-40 flex items-center justify-center">
                  <video
                    src={uploadedResult.url}
                    controls
                    className="w-full h-auto max-h-40 object-contain"
                  />
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden bg-black border border-[#333] max-h-40 flex items-center justify-center">
                  <img
                    src={uploadedResult.url}
                    alt={uploadedResult.fileName}
                    className="w-full h-auto max-h-40 object-contain"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
