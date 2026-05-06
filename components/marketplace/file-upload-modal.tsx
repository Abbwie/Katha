'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, FileIcon } from 'lucide-react';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    files: string[];
    specifications: string;
    budget?: number;
    turnaroundRequest?: number;
  }) => void;
  providerName?: string;
}

export function FileUploadModal({
  isOpen,
  onClose,
  onSubmit,
  providerName,
}: FileUploadModalProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState('');
  const [budget, setBudget] = useState('');
  const [turnaround, setTurnaround] = useState('');
  const [dragActive, setDragActive] = useState(false);

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const fileNames = Array.from(e.dataTransfer.files).map((file) => file.name);
      setFiles((prev) => [...prev, ...fileNames]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map((file) => file.name);
      setFiles((prev) => [...prev, ...fileNames]);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter((f) => f !== fileName));
  };

  const handleSubmit = () => {
    if (files.length === 0 || !specifications) {
      alert('Please upload files and add specifications');
      return;
    }

    onSubmit({
      files,
      specifications,
      budget: budget ? parseInt(budget) : undefined,
      turnaroundRequest: turnaround ? parseInt(turnaround) : undefined,
    });

    // Reset form
    setFiles([]);
    setSpecifications('');
    setBudget('');
    setTurnaround('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Request Quote from {providerName || 'Provider'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Upload Files *
            </Label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition ${
                dragActive
                  ? 'border-accent bg-accent/5'
                  : 'border-border bg-secondary/50'
              }`}
            >
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Drag and drop files here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse
                  </p>
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2 mt-3">
                <p className="text-xs text-muted-foreground font-medium">
                  {files.length} file{files.length !== 1 ? 's' : ''} uploaded
                </p>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file}
                      className="flex items-center justify-between p-2 bg-secondary rounded"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileIcon className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-foreground truncate">
                          {file}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(file)}
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

          {/* Specifications */}
          <div className="space-y-2">
            <Label htmlFor="specs" className="text-sm font-semibold text-foreground">
              Project Specifications *
            </Label>
            <textarea
              id="specs"
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              placeholder="Describe your project requirements, materials, tolerances, etc."
              className="w-full h-24 p-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Budget (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-sm font-semibold text-foreground">
              Budget (Optional)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ₱
              </span>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="0"
                className="pl-7 bg-input text-foreground placeholder:text-muted-foreground rounded-lg"
              />
            </div>
          </div>

          {/* Turnaround Request (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="turnaround" className="text-sm font-semibold text-foreground">
              Desired Turnaround (Optional, in days)
            </Label>
            <Input
              id="turnaround"
              type="number"
              value={turnaround}
              onChange={(e) => setTurnaround(e.target.value)}
              placeholder="e.g., 5"
              className="bg-input text-foreground placeholder:text-muted-foreground rounded-lg"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handleSubmit}
            >
              Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
