
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, QrCode, Copy, Check } from "lucide-react";
import { generateShareableLink, generateQRCode } from "@/utils/fileUtils";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, fileId, fileName }) => {
  const [link, setLink] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const shareableLink = generateShareableLink(fileId);
      setLink(shareableLink);
      
      // Generate QR code
      generateQRCode(shareableLink).then(url => {
        setQrCodeUrl(url);
      });
    }
  }, [isOpen, fileId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share it with anyone",
      });
      
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md glass-card animate-scale-in">
        <DialogHeader>
          <DialogTitle>Share "{fileName}"</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="p-4">
            <div className="flex space-x-2">
              <Input 
                value={link} 
                readOnly 
                className="flex-1"
              />
              <Button 
                size="icon" 
                onClick={handleCopyLink}
                variant="outline"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Anyone with this link can view and download this file
            </p>
          </TabsContent>
          
          <TabsContent value="qr" className="flex flex-col items-center p-4">
            {qrCodeUrl && (
              <div className="mb-2 bg-white p-2 rounded-md">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Scan this QR code to access the file
            </p>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
