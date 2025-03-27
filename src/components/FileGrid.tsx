
import React from "react";
import { FileItem } from "@/utils/fileUtils";
import { FileCard } from "@/components/FileCard";

interface FileGridProps {
  files: FileItem[];
  onDelete: (id: string) => void;
}

export const FileGrid: React.FC<FileGridProps> = ({ files, onDelete }) => {
  if (files.length === 0) {
    return (
      <div className="text-center p-12">
        <p className="text-muted-foreground">No files yet. Upload some files to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
