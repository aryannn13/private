import { Link, useLocation } from "wouter";
import { Code2, Plus, Home, Github, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateRepl, useRepls } from "@/hooks/use-repls";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { mutate: createRepl, isPending: isCreating } = useCreateRepl();
  const { data: repls, isLoading } = useRepls();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCreate = () => {
    createRepl(
      { title: "Untitled Repl", html: "", css: "", js: "" },
      {
        onSuccess: (data) => {
          setLocation(`/repl/${data.id}`);
          setIsMobileMenuOpen(false);
        }
      }
    );
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Code2 className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Repl.build
        </span>
      </div>

      <div className="space-y-1 mb-6">
        <Button 
          onClick={handleCreate} 
          disabled={isCreating}
          className="w-full justify-start gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-900/20 border-0"
        >
          <Plus className="w-4 h-4" />
          {isCreating ? "Creating..." : "New Repl"}
        </Button>

        <Link href="/" className={cn(
          "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
          location === "/" 
            ? "bg-accent text-accent-foreground shadow-sm" 
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
        )}>
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-1">
        <div className="text-xs font-semibold text-muted-foreground mb-3 px-2 uppercase tracking-wider">
          Your Repls
        </div>
        {isLoading ? (
          <div className="px-2 space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 rounded bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : repls?.length === 0 ? (
          <div className="px-2 text-sm text-muted-foreground/60 italic">No repls yet. Create one!</div>
        ) : (
          repls?.map((repl) => (
            <Link 
              key={repl.id} 
              href={`/repl/${repl.id}`}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all duration-200 truncate group",
                location === `/repl/${repl.id}`
                  ? "bg-muted text-foreground font-medium" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-500 transition-colors" />
              <span className="truncate">{repl.title || "Untitled"}</span>
            </Link>
          ))
        )}
      </div>

      <div className="mt-auto pt-6 border-t border-border/40">
        <a 
          href="#" 
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
        >
          <Github className="w-3.5 h-3.5" />
          <span>Source Code</span>
        </a>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/30 backdrop-blur-xl p-4 z-20">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <Code2 className="text-blue-500 w-5 h-5" />
          <span className="font-bold">Repl.build</span>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6 bg-card border-r border-border">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 flex flex-col relative overflow-hidden pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
