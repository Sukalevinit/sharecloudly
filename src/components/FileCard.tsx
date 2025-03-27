
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Link, 
  MoreVertical, 
  File, 
  Image, 
  Video, 
  FileText, 
  Trash, 
  QrCode,
  Share as ShareIcon
} from "lucide-react";
import { FileItem, formatFileSize } from "@/utils/fileUtils";
import { ShareModal } from "@/components/ShareModal";

interface FileCardProps {
  file: FileItem;
  onDelete: (id: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  const getFileIcon = () => {
    if (file.type.startsWith("image/")) return <Image className="w-10 h-10 text-blue-500" />;
    if (file.type.startsWith("video/")) return <Video className="w-10 h-10 text-purple-500" />;
    if (file.type.startsWith("text/")) return <FileText className="w-10 h-10 text-orange-500" />;
    if (file.type.includes("pdf")) return <FileText className="w-10 h-10 text-red-500" />;
    return <File className="w-10 h-10 text-gray-500" />;
  };

  // Simulate download (in a real app, this would download the actual file)
  const handleDownload = () => {
    // Create a mock download
    if (file.file) {
      const url = URL.createObjectURL(file.file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      console.log("File not available for download");
    }
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in glass-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {file.preview ? (
                <div className="w-12 h-12 rounded overflow-hidden">
                  <img 
                    src={file.preview} 
                    alt={file.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ) : (
                getFileIcon()
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{file.name}</h3>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setShareModalOpen(true)}
              >
                <ShareIcon className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
                
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-32 py-1 rounded-md shadow-lg bg-popover z-10 animate-fade-in">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 text-sm"
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(file.id);
                      }}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ShareModal 
        isOpen={shareModalOpen} 
        onClose={() => setShareModalOpen(false)} 
        fileId={file.id}
        fileName={file.name}
      />
    </>
  );
};
