
export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
  preview?: string;
  file?: File;
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileIcon = (type: string): string => {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type.startsWith("text/")) return "file-text";
  if (type.includes("pdf")) return "file-text";
  if (type.includes("word") || type.includes("document")) return "file-text";
  if (type.includes("excel") || type.includes("spreadsheet")) return "file-spreadsheet";
  if (type.includes("presentation") || type.includes("powerpoint")) return "file-presentation";
  
  return "file";
};

export const generateShareableLink = (fileId: string): string => {
  // In a real application, this would generate a unique, secure link
  // For this demo, we'll just create a fake link
  return `https://sharecloudly.com/share/${fileId}`;
};

export const generateQRCode = async (text: string): Promise<string> => {
  // In a real application, this would generate a QR code
  // For this demo, we'll return a placeholder URL
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
};

// Helper to create a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Helper to create file preview for images
export const createFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      resolve("");
    }
  });
};
