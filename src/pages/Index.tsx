
import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { FileUploader } from "@/components/FileUploader";
import { FileGrid } from "@/components/FileGrid";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, FolderPlus, Upload, Plus } from "lucide-react";
import { FileItem } from "@/utils/fileUtils";

const Index = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  // Filter files when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFiles(files);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredFiles(
        files.filter(file => 
          file.name.toLowerCase().includes(query) || 
          file.type.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, files]);
  
  const handleFileUpload = (newFiles: FileItem[]) => {
    setFiles(prev => [...newFiles, ...prev]);
    setUploadDialogOpen(false);
  };
  
  const handleDeleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar onSearch={handleSearch} />
        
        <main className="flex-1 container py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Files</h1>
            
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Files
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md glass-card animate-scale-in">
                <DialogHeader>
                  <DialogTitle>Upload Files</DialogTitle>
                </DialogHeader>
                <FileUploader onFileUpload={handleFileUpload} />
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs defaultValue="all" className="mb-8">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Files</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="shared">Shared</TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm" className="gap-2">
                <FolderPlus className="h-4 w-4" />
                New Folder
              </Button>
            </div>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <div className="space-y-4">
                    <div className="font-medium">Folders</div>
                    
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 h-9"
                      >
                        <Folder className="h-4 w-4" />
                        <span>Documents</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 h-9"
                      >
                        <Folder className="h-4 w-4" />
                        <span>Images</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 h-9"
                      >
                        <Folder className="h-4 w-4" />
                        <span>Videos</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 h-9"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Folder</span>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-3">
                  <FileGrid 
                    files={filteredFiles} 
                    onDelete={handleDeleteFile} 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="recent">
              <div className="text-center p-12">
                <p className="text-muted-foreground">No recent files.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="shared">
              <div className="text-center p-12">
                <p className="text-muted-foreground">No shared files.</p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
