'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Film, Image as ImageIcon, CheckCircle2, Link2, X, Play, Loader2, Sparkles } from 'lucide-react';
import { uploadMediaFile, UploadedMediaResult } from '@/lib/services/storageService';

interface MediaUploaderProps {
  initialUrl?: string;
  onMediaUploaded: (media: { url: string; fileName?: string; isVideo?: boolean }) => void;
  folder?: string;
}

export function MediaUploader({ initialUrl = '', onMediaUploaded, folder = 'entregas' }: MediaUploaderProps) {
  const [mode, setMode] = useState<'DIRECT_UPLOAD' | 'EXTERNAL_LINK'>('DIRECT_UPLOAD');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedResult, setUploadedResult] = useState<UploadedMediaResult | null>(null);
  const [externalUrl, setExternalUrl] = useState(initialUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSaveExternalLink = () => {
    if (!externalUrl.trim()) return;
    onMediaUploaded({
      url: externalUrl.trim(),
      isVideo: true,
    });
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-[#262626] pb-2">
        <div className="flex items-center gap-2">
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
            <span>Upload Direto do Arquivo (MP4/Foto)</span>
          </button>

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
            <span>Link do Drive / Vimeo / YouTube</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Direct File Drop Zone */}
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
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
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
              <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mx-auto mb-3 border border-primary/30">
                <UploadCloud className="w-6 h-6 animate-bounce" />
              </div>
              <p className="text-sm font-bold text-on-surface">
                Arraste o arquivo de vídeo (.mp4) ou foto aqui
              </p>
              <p className="text-[11px] text-on-surface-variant font-sans mt-1">
                Ou clique para selecionar do seu computador ou celular (MP4, MOV, JPG, PNG)
              </p>
              <span className="inline-block mt-3 text-[10px] bg-[#222] text-primary px-2.5 py-1 rounded-full border border-primary/30">
                ⚡ Upload com streaming em alta definição para o cliente
              </span>
            </div>
          )}

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="p-6 rounded-2xl bg-[#161616] border border-primary/40 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
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
              <span className="text-[10px] text-on-surface-variant block font-sans">
                Otimizando arquivo para reprodução instantânea no celular do cliente...
              </span>
            </div>
          )}

          {/* Upload Success & Preview */}
          {uploadedResult && (
            <div className="p-4 rounded-2xl bg-[#181818] border border-emerald-500/40 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Arquivo Pronto para Entrega & Aprovação!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedResult(null)}
                  className="text-on-surface-variant hover:text-on-surface text-[10px] underline"
                >
                  Substituir arquivo
                </button>
              </div>

              {/* Video Player Preview if it's a video */}
              {uploadedResult.isVideo ? (
                <div className="rounded-xl overflow-hidden bg-black border border-[#333] max-h-48 flex items-center justify-center">
                  <video
                    src={uploadedResult.url}
                    controls
                    className="w-full h-auto max-h-48 object-contain"
                  />
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden bg-black border border-[#333] max-h-48 flex items-center justify-center">
                  <img
                    src={uploadedResult.url}
                    alt={uploadedResult.fileName}
                    className="w-full h-auto max-h-48 object-contain"
                  />
                </div>
              )}

              <p className="text-[10px] text-on-surface-variant truncate">
                📄 {uploadedResult.fileName} • {(uploadedResult.fileSize / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: External Link Input */}
      {mode === 'EXTERNAL_LINK' && (
        <div className="space-y-3 bg-[#161616] p-4 rounded-2xl border border-[#262626]">
          <label className="block text-xs font-bold text-on-surface-variant uppercase">
            Link Externo do Vídeo ou Pasta
          </label>
          <div className="relative">
            <Link2 className="w-4 h-4 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              placeholder="https://drive.google.com/... ou https://vimeo.com/..."
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleSaveExternalLink}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Salvar Link da Mídia</span>
          </button>
        </div>
      )}
    </div>
  );
}
