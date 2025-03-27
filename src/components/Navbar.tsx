
import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  return (
    <header className="border-b sticky top-0 z-10 backdrop-blur-md bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-xl tracking-tight">ShareCloudly</div>
        </div>
        
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search files..."
              className="w-full pl-9 rounded-full bg-secondary/50"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full"
            aria-label="User profile"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
