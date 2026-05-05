'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, FileIcon, Sparkles, Loader2, Store, ArrowRight } from 'lucide-react';
import { mockProviders, categoryLabels } from '@/lib/mock-data';

interface KathaAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AIResponse {
  summary: string;
  recommendations: string[];
  suggestedCategory: string;
  shops: typeof mockProviders;
}

export function KathaAIModal({ isOpen, onClose }: KathaAIModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFiles([]);
    setPrompt('');
    setAiResponse(null);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please describe what you are looking for.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Read file contents if any
      let fileContents: { name: string; content: string }[] = [];
      for (const file of files) {
        if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          const content = await file.text();
          fileContents.push({ name: file.name, content });
        } else {
          fileContents.push({ name: file.name, content: `[Binary file: ${file.type || 'unknown type'}]` });
        }
      }

      const response = await fetch('/api/katha-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          files: fileContents,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      setAiResponse(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('[v0] KathaAI error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            KathaAI Compatibility Assistant
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload a document and describe your problem. KathaAI will analyze it and recommend the best service providers for your needs.
          </DialogDescription>
        </DialogHeader>

        {!aiResponse ? (
          <div className="space-y-6 py-4">
            {/* File Upload Area */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Upload Document (Optional)
              </Label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer ${
                  dragActive
                    ? 'border-accent bg-accent/5'
                    : 'border-border bg-secondary/50 hover:border-accent/50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.md,.stl,.step,.stp,.sch,.brd,.gerber,.dxf"
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Drag and drop files here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      or click to browse (PDF, CAD files, schematics, etc.)
                    </p>
                  </div>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2 mt-3">
                  <p className="text-xs text-muted-foreground font-medium">
                    {files.length} file{files.length !== 1 ? 's' : ''} selected
                  </p>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between p-2 bg-secondary rounded"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileIcon className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="text-sm text-foreground truncate">
                            {file.name}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="text-muted-foreground hover:text-foreground transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <Label htmlFor="ai-prompt" className="text-sm font-semibold text-foreground">
                What problem are you trying to solve? *
              </Label>
              <textarea
                id="ai-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your project, problem, or what you're looking for. For example: 'I need to create a custom enclosure for my Raspberry Pi project with ventilation holes and mounting points...'"
                className="w-full h-32 p-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-lg"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Recommendations
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* AI Response View */
          <div className="space-y-6 py-4">
            {/* Summary Section */}
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                AI Analysis Summary
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {aiResponse.summary}
              </p>
            </div>

            {/* Recommendations */}
            {aiResponse.recommendations.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Recommendations</h3>
                <ul className="space-y-2">
                  {aiResponse.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
                      <ArrowRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested Category */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Suggested Service Type:</span>
              <span className="text-sm font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                {categoryLabels[aiResponse.suggestedCategory] || aiResponse.suggestedCategory}
              </span>
            </div>

            {/* Recommended Shops */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Store className="w-4 h-4 text-accent" />
                Recommended Providers ({aiResponse.shops.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {aiResponse.shops.map((shop) => (
                  <div
                    key={shop.id}
                    className="p-3 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-foreground">{shop.name}</p>
                        <p className="text-xs text-muted-foreground">{shop.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-accent">
                          {shop.rating} <span className="text-muted-foreground">({shop.reviewCount} reviews)</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {shop.turnaroundDays} day turnaround
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-foreground/70 mt-2 line-clamp-2">
                      {shop.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {shop.services.slice(0, 3).map((service) => (
                        <span
                          key={service}
                          className="text-xs bg-background px-2 py-0.5 rounded text-muted-foreground"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-lg"
                onClick={resetForm}
              >
                Start New Search
              </Button>
              <Button
                className="flex-1 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={handleClose}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
