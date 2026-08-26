import { Client, Task, ServiceRequest } from '../types';

export interface QuotaCalculationResult {
  contractedVideos: number;
  usedVideos: number;
  remainingVideos: number;
  extraVideos: number;
  contractedPhotos: number;
  usedPhotos: number;
  remainingPhotos: number;
  extraPhotos: number;
  baseMonthlyFee: number;
  extraVideosCost: number;
  extraPhotosCost: number;
  otherExtrasCost: number;
  totalExtrasCost: number;
  grandTotalCost: number;
  percentageUsed: number;
}

export function calculateClientQuotas(
  client?: Client | null,
  clientTasks: Task[] = [],
  approvedRequests: ServiceRequest[] = []
): QuotaCalculationResult {
  if (!client) {
    return {
      contractedVideos: 0,
      usedVideos: 0,
      remainingVideos: 0,
      extraVideos: 0,
      contractedPhotos: 0,
      usedPhotos: 0,
      remainingPhotos: 0,
      extraPhotos: 0,
      baseMonthlyFee: 0,
      extraVideosCost: 0,
      extraPhotosCost: 0,
      otherExtrasCost: 0,
      totalExtrasCost: 0,
      grandTotalCost: 0,
      percentageUsed: 0,
    };
  }

  // Count produced and approved/published videos
  const completedVideoTasks = (clientTasks || []).filter(
    (t) => t && t.taskType === 'VIDEO' && ['APPROVED', 'PUBLISHED', 'IN_REVIEW', 'IN_PRODUCTION'].includes(t.status)
  );

  const completedPhotoTasks = (clientTasks || []).filter(
    (t) => t && t.taskType === 'PHOTO' && ['APPROVED', 'PUBLISHED', 'IN_REVIEW', 'IN_PRODUCTION'].includes(t.status)
  );

  const explicitExtraVideos = (clientTasks || []).filter(
    (t) => t && t.taskType === 'VIDEO' && t.isExtra
  ).length;

  const totalVideosProduced = completedVideoTasks.length;
  const contractedVideos = client.contractedVideos || 0;
  
  // Extra videos calculation
  const extraVideos = explicitExtraVideos > 0 
    ? explicitExtraVideos 
    : Math.max(0, totalVideosProduced - contractedVideos);

  const usedVideos = Math.min(contractedVideos, totalVideosProduced);
  const remainingVideos = Math.max(0, contractedVideos - totalVideosProduced);

  // Photos
  const contractedPhotos = client.contractedPhotos || 0;
  const totalPhotosProduced = completedPhotoTasks.length;
  const extraPhotos = Math.max(0, totalPhotosProduced - contractedPhotos);
  const usedPhotos = Math.min(contractedPhotos, totalPhotosProduced);
  const remainingPhotos = Math.max(0, contractedPhotos - totalPhotosProduced);

  // Additional approved extras from requests
  const otherExtrasCost = (approvedRequests || [])
    .filter(req => req && req.status === 'APPROVED' && !['VIDEO', 'PHOTO'].includes(req.serviceType))
    .reduce((sum, req) => sum + (req.totalEstimated || 0), 0);

  // Extra unit prices
  const extraVideoUnitPrice = client.extraVideoPrice || 150;
  const extraPhotoUnitPrice = client.extraPhotoPrice || 80;

  const extraVideosCost = extraVideos * extraVideoUnitPrice;
  const extraPhotosCost = extraPhotos * extraPhotoUnitPrice;
  const totalExtrasCost = extraVideosCost + extraPhotosCost + otherExtrasCost;

  const baseMonthlyFee = client.monthlyFee || 0;
  const grandTotalCost = baseMonthlyFee + totalExtrasCost;

  const percentageUsed = contractedVideos > 0 
    ? Math.min(100, Math.round((usedVideos / contractedVideos) * 100))
    : 0;

  return {
    contractedVideos,
    usedVideos,
    remainingVideos,
    extraVideos,
    contractedPhotos,
    usedPhotos,
    remainingPhotos,
    extraPhotos,
    baseMonthlyFee,
    extraVideosCost,
    extraPhotosCost,
    otherExtrasCost,
    totalExtrasCost,
    grandTotalCost,
    percentageUsed,
  };
}
