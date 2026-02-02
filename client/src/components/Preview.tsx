import { useEffect, useState } from "react";
import { RefreshCw, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewProps {
  html: string;
  css: string;
  js: string;
  autoRefresh?: boolean;
}

export function Preview({ html, css, js, autoRefresh = false }: PreviewProps) {
  const [srcDoc, setSrcDoc] = useState("");
  const [key, setKey] = useState(0);

  const generatePreview = () => {
    const doc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; font-family: sans-serif; }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch (err) {
              console.error(err);
            }
          </script>
        </body>
      </html>
    `;
    setSrcDoc(doc);
    setKey(prev => prev + 1);
  };

  // Debounced update if auto-refresh is on
  useEffect(() => {
    if (!autoRefresh) return;
    
    const timeout = setTimeout(() => {
      generatePreview();
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [html, css, js, autoRefresh]);

  // Initial load
  useEffect(() => {
    generatePreview();
  }, []); // Run once on mount

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Maximize2 className="w-3 h-3" />
          Preview
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 hover:bg-background/80 hover:text-primary transition-colors"
          onClick={generatePreview}
          title="Refresh Preview"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>
      <div className="flex-1 bg-white relative w-full h-full">
        <iframe
          key={key}
          title="preview"
          srcDoc={srcDoc}
          sandbox="allow-scripts"
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    </div>
  );
}
