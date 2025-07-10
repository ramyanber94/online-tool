
"use client"

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ToolLayout } from '@/components/tool-layout';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Info, 
  Image as ImageIcon,
  FileImage,
  Trash2,
  Settings,
  DownloadCloud
} from 'lucide-react';

interface ImageFile {
  id: string;
  file: File;
  originalUrl: string;
  convertedUrl?: string;
  originalSize: number;
  convertedSize?: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

interface ConversionSettings {
  format: 'jpeg' | 'png' | 'webp' | 'bmp';
  quality: number;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
}

const defaultSettings: ConversionSettings = {
  format: 'jpeg',
  quality: 80,
  maintainAspectRatio: true,
};

const supportedFormats = [
  { value: 'jpeg', label: 'JPEG', description: 'Lossy compression, smaller file size' },
  { value: 'png', label: 'PNG', description: 'Lossless compression, transparency support' },
  { value: 'webp', label: 'WebP', description: 'Modern format, best compression' },
  { value: 'bmp', label: 'BMP', description: 'Uncompressed bitmap format' },
];

export default function ImageConverterClient() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<ConversionSettings>(defaultSettings);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const createImageUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const handleFileSelect = useCallback((files: FileList) => {
    const newImages: ImageFile[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const imageFile: ImageFile = {
          id: generateId(),
          file,
          originalUrl: createImageUrl(file),
          originalSize: file.size,
          status: 'pending',
        };
        newImages.push(imageFile);
      }
    });

    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const convertImage = useCallback(async (imageFile: ImageFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Resize if dimensions are specified
        if (settings.width || settings.height) {
          if (settings.maintainAspectRatio) {
            const aspectRatio = width / height;
            if (settings.width && settings.height) {
              // Use the smaller scaling factor to maintain aspect ratio
              const scaleX = settings.width / width;
              const scaleY = settings.height / height;
              const scale = Math.min(scaleX, scaleY);
              width = width * scale;
              height = height * scale;
            } else if (settings.width) {
              height = settings.width / aspectRatio;
              width = settings.width;
            } else if (settings.height) {
              width = settings.height * aspectRatio;
              height = settings.height;
            }
          } else {
            width = settings.width || width;
            height = settings.height || height;
          }
        }

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          // Set white background for JPEG
          if (settings.format === 'jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          const mimeType = `image/${settings.format}`;
          const quality = settings.quality / 100;

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                resolve(url);
              } else {
                reject(new Error('Failed to convert image'));
              }
            },
            mimeType,
            quality
          );
        } else {
          reject(new Error('Canvas context not available'));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageFile.originalUrl;
    });
  }, [settings]);

  const processImages = async () => {
    setIsProcessing(true);

    const pendingImages = images.filter(img => img.status === 'pending');
    
    for (const imageFile of pendingImages) {
      setImages(prev => 
        prev.map(img => 
          img.id === imageFile.id 
            ? { ...img, status: 'processing' } 
            : img
        )
      );

      try {
        const convertedUrl = await convertImage(imageFile);
        
        // Get converted file size
        const response = await fetch(convertedUrl);
        const blob = await response.blob();
        const convertedSize = blob.size;

        setImages(prev => 
          prev.map(img => 
            img.id === imageFile.id 
              ? { 
                  ...img, 
                  status: 'completed', 
                  convertedUrl,
                  convertedSize
                } 
              : img
          )
        );
      } catch (error) {
        setImages(prev => 
          prev.map(img => 
            img.id === imageFile.id 
              ? { 
                  ...img, 
                  status: 'error', 
                  error: error instanceof Error ? error.message : 'Conversion failed'
                } 
              : img
          )
        );
      }
    }

    setIsProcessing(false);
  };

  const downloadImage = (imageFile: ImageFile) => {
    if (!imageFile.convertedUrl) return;

    const link = document.createElement('a');
    const fileName = imageFile.file.name.replace(/\.[^/.]+$/, '') + '.' + settings.format;
    link.download = fileName;
    link.href = imageFile.convertedUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = () => {
    const completedImages = images.filter(img => img.status === 'completed' && img.convertedUrl);
    completedImages.forEach(img => downloadImage(img));
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.originalUrl);
        if (imageToRemove.convertedUrl) {
          URL.revokeObjectURL(imageToRemove.convertedUrl);
        }
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const clearAllImages = () => {
    images.forEach(img => {
      URL.revokeObjectURL(img.originalUrl);
      if (img.convertedUrl) {
        URL.revokeObjectURL(img.convertedUrl);
      }
    });
    setImages([]);
  };

  const getCompressionRatio = (original: number, converted: number): string => {
    const ratio = ((original - converted) / original) * 100;
    return ratio > 0 ? `-${ratio.toFixed(1)}%` : `+${Math.abs(ratio).toFixed(1)}%`;
  };

  return (
    <ToolLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center">Image Converter & Compressor</h1>
            <p className="text-muted-foreground text-center mt-2">
              Convert, resize, and compress images with batch processing support
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragOver 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted-foreground/25 hover:border-primary/50'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">
                      Drag & drop images here or click to browse
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports JPEG, PNG, WebP, BMP, and other image formats
                    </p>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                      className="hidden"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Image List */}
              {images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Images ({images.length})
                      </span>
                      <div className="flex gap-2">
                        {images.some(img => img.status === 'completed') && (
                          <Button
                            size="sm"
                            onClick={downloadAllImages}
                            variant="outline"
                          >
                            <DownloadCloud className="h-4 w-4 mr-2" />
                            Download All
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={clearAllImages}
                          variant="outline"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear All
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {images.map((imageFile) => (
                        <div key={imageFile.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={imageFile.originalUrl} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{imageFile.file.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(imageFile.originalSize)}
                              {imageFile.convertedSize && (
                                <span className="ml-2">
                                  → {formatFileSize(imageFile.convertedSize)}
                                  <span className="ml-1 text-green-600">
                                    ({getCompressionRatio(imageFile.originalSize, imageFile.convertedSize)})
                                  </span>
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${
                                imageFile.status === 'pending' ? 'bg-gray-400' :
                                imageFile.status === 'processing' ? 'bg-blue-400' :
                                imageFile.status === 'completed' ? 'bg-green-400' :
                                'bg-red-400'
                              }`} />
                              <span className="text-xs text-muted-foreground capitalize">
                                {imageFile.status}
                                {imageFile.error && `: ${imageFile.error}`}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {imageFile.status === 'completed' && imageFile.convertedUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadImage(imageFile)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeImage(imageFile.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Settings Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Conversion Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Format Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Output Format</label>
                    <div className="space-y-2">
                      {supportedFormats.map((format) => (
                        <label
                          key={format.value}
                          className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            settings.format === format.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:bg-muted/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="format"
                            value={format.value}
                            checked={settings.format === format.value}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              format: e.target.value as ConversionSettings['format']
                            }))}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{format.label}</div>
                            <div className="text-xs text-muted-foreground">{format.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Quality Slider */}
                  {(settings.format === 'jpeg' || settings.format === 'webp') && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Quality: {settings.quality}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={settings.quality}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          quality: parseInt(e.target.value) 
                        }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Smaller file</span>
                        <span>Better quality</span>
                      </div>
                    </div>
                  )}

                  {/* Resize Options */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Resize (optional)</label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">Width</label>
                          <Input
                            type="number"
                            placeholder="Auto"
                            value={settings.width || ''}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              width: e.target.value ? parseInt(e.target.value) : undefined 
                            }))}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Height</label>
                          <Input
                            type="number"
                            placeholder="Auto"
                            value={settings.height || ''}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              height: e.target.value ? parseInt(e.target.value) : undefined 
                            }))}
                          />
                        </div>
                      </div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.maintainAspectRatio}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            maintainAspectRatio: e.target.checked 
                          }))}
                        />
                        <span className="text-sm">Maintain aspect ratio</span>
                      </label>
                    </div>
                  </div>

                  {/* Process Button */}
                  <div className="pt-4">
                    <Button 
                      onClick={processImages}
                      disabled={isProcessing || images.length === 0 || !images.some(img => img.status === 'pending')}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <>
                          <LoadingSpinner size="sm" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Settings className="h-4 w-4 mr-2" />
                          Convert Images
                        </>
                      )}
                    </Button>
                  </div>

                  <Button 
                    onClick={() => setSettings(defaultSettings)}
                    variant="outline"
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Supported Formats:</h4>
                    <ul className="space-y-1 ml-4">
                      <li>• <strong>JPEG:</strong> Best for photos, lossy compression</li>
                      <li>• <strong>PNG:</strong> Best for graphics, lossless with transparency</li>
                      <li>• <strong>WebP:</strong> Modern format with excellent compression</li>
                      <li>• <strong>BMP:</strong> Uncompressed bitmap format</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Features:</h4>
                    <ul className="space-y-1 ml-4">
                      <li>• Batch processing support</li>
                      <li>• Resize with aspect ratio preservation</li>
                      <li>• Quality adjustment for compression</li>
                      <li>• File size comparison</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-1">Privacy:</h4>
                    <p>All image processing is done locally in your browser. No images are uploaded to external servers.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
