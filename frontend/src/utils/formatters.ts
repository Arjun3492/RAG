
// Format date to a human-readable string
export const formatDateTime = (dateTimeString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(dateTimeString).toLocaleDateString(undefined, options);
};

// Check if file is of allowed type
export const isAllowedFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf', // PDF
    'image/jpeg', // JPEG images
    'image/png',  // PNG images
    'image/gif',  // GIF images
    'image/webp', // WebP images
    'image/tiff', // TIFF images
  ];
  
  return allowedTypes.includes(file.type);
};

// Get file type label from mime type
export const getFileTypeLabel = (mimeType: string): string => {
  if (mimeType === 'pdf') return 'PDF';
  if (mimeType.startsWith('image/')) return 'Image';
  return mimeType.split('/').pop() || 'Unknown';
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
