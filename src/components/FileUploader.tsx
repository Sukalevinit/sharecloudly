
import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";
import { FileItem, generateId, createFilePreview } from "@/utils/fileUtils";

interface FileUploaderProps {
  onFileUpload: (files: FileItem[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filesToUpload, setFilesToUpload] = useState<FileItem[]>([]);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: FileItem[] = [];
    
    for (const file of acceptedFiles) {
      const preview = await createFilePreview(file);
      
      newFiles.push({
        id: generateId(),
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        preview: preview,
        file: file
      });
    }
    
    setFilesToUpload(prev => [...prev, ...newFiles]);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'text/*': [],
      'video/*': [],
      'audio/*': []
    }
  });
  
  const removeFile = (id: string) => {
    setFilesToUpload(prev => prev.filter(file => file.id !== id));
  };
  
  const uploadFiles = () => {
    if (filesToUpload.length === 0) return;
    
    setUploading(true);
    setProgress(0);
    
    // Simulate upload progress
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
            progressInterval.current = null;
            
            // Complete the upload
            setTimeout(() => {
              setUploading(false);
              onFileUpload(filesToUpload);
              setFilesToUpload([]);
              toast("Files uploaded successfully");
            }, 400);
          }
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };
  
  const cancelUpload = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setUploading(false);
    setProgress(0);
  };

  return (
    <div className="w-full space-y-4">
      <div 
        {...getRootProps()} 
        className={`dropzone flex flex-col items-center justify-center p-8 cursor-pointer transition-all ${
          isDragActive ? "active" : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <p className="text-center text-sm font-medium">
          {isDragActive ? (
            "Drop the files here"
          ) : (
            "Drag & drop files, or click to select"
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supports images, documents, videos, and audio files
        </p>
      </div>
      
      {filesToUpload.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            {filesToUpload.map(file => (
              <div 
                key={file.id} 
                className="flex items-center justify-between p-2 bg-secondary/50 rounded animate-fade-in"
              >
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeFile(file.id)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          {uploading ? (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between items-center">
                <span className="text-xs">{progress}% complete</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelUpload}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={uploadFiles} 
              className="w-full"
            >
              Upload {filesToUpload.length} file{filesToUpload.length !== 1 ? "s" : ""}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
