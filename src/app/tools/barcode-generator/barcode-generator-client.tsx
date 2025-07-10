'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ToolLayout } from '@/components/tool-layout';
import { 
  Download, 
  Copy, 
  RotateCcw, 
  Info, 
  QrCode, 
  BarChart3,
  Package,
  ShoppingCart,
  Shuffle
} from 'lucide-react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

type BarcodeFormat = 
  | 'CODE128' 
  | 'CODE39' 
  | 'EAN13' 
  | 'EAN8' 
  | 'UPC' 
  | 'ITF14' 
  | 'MSI' 
  | 'pharmacode'
  | 'QR';

interface BarcodeOptions {
  format: BarcodeFormat;
  width: number;
  height: number;
  displayValue: boolean;
  text: string;
  textAlign: 'left' | 'center' | 'right';
  textPosition: 'bottom' | 'top';
  fontSize: number;
  textMargin: number;
  background: string;
  lineColor: string;
  margin: number;
}

const defaultOptions: BarcodeOptions = {
  format: 'CODE128',
  width: 2,
  height: 100,
  displayValue: true,
  text: '',
  textAlign: 'center',
  textPosition: 'bottom',
  fontSize: 20,
  textMargin: 2,
  background: '#ffffff',
  lineColor: '#000000',
  margin: 10,
};

const barcodeFormats = [
  { value: 'CODE128', label: 'Code 128', description: 'Most common format, supports all ASCII characters' },
  { value: 'CODE39', label: 'Code 39', description: 'Alphanumeric format, widely used in automotive industry' },
  { value: 'EAN13', label: 'EAN-13', description: '13-digit European Article Number' },
  { value: 'EAN8', label: 'EAN-8', description: '8-digit European Article Number' },
  { value: 'UPC', label: 'UPC-A', description: '12-digit Universal Product Code' },
  { value: 'ITF14', label: 'ITF-14', description: '14-digit Interleaved 2 of 5' },
  { value: 'MSI', label: 'MSI', description: 'Modified Plessey code' },
  { value: 'pharmacode', label: 'Pharmacode', description: 'Pharmaceutical Binary Code' },
  { value: 'QR', label: 'QR Code', description: '2D matrix barcode' },
];

export default function BarcodeGeneratorClient() {
  const [input, setInput] = useState('Hello World');
  const [options, setOptions] = useState<BarcodeOptions>(defaultOptions);
  const [generatedBarcode, setGeneratedBarcode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // GTIN/SKU Generator states
  const [gtin, setGtin] = useState('');
  const [generatedGtin, setGeneratedGtin] = useState('');
  const [generatedSku, setGeneratedSku] = useState('');

  const generateBarcode = useCallback(async () => {
    if (!input.trim()) {
      setError('Please enter text to generate barcode');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      if (options.format === 'QR') {
        // Generate QR Code
        const canvas = qrCanvasRef.current;
        if (canvas) {
          await QRCode.toCanvas(canvas, input, {
            width: 300,
            margin: 2,
            color: {
              dark: options.lineColor,
              light: options.background,
            },
          });
          const dataURL = canvas.toDataURL();
          setGeneratedBarcode(dataURL);
        }
      } else {
        // Generate traditional barcode
        const canvas = canvasRef.current;
        if (canvas) {
          JsBarcode(canvas, input, {
            format: options.format,
            width: options.width,
            height: options.height,
            displayValue: options.displayValue,
            text: options.text || input,
            textAlign: options.textAlign,
            textPosition: options.textPosition,
            fontSize: options.fontSize,
            textMargin: options.textMargin,
            background: options.background,
            lineColor: options.lineColor,
            margin: options.margin,
          });
          const dataURL = canvas.toDataURL();
          setGeneratedBarcode(dataURL);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate barcode');
    } finally {
      setIsGenerating(false);
    }
  }, [input, options]);

  const copyToClipboard = async () => {
    if (!generatedBarcode) return;

    try {
      // Convert data URL to blob
      const response = await fetch(generatedBarcode);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: copy data URL as text
      try {
        await navigator.clipboard.writeText(generatedBarcode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setError('Failed to copy to clipboard');
      }
    }
  };

  const downloadBarcode = () => {
    if (!generatedBarcode) return;

    const link = document.createElement('a');
    link.download = `barcode-${options.format.toLowerCase()}-${Date.now()}.png`;
    link.href = generatedBarcode;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setInput('Hello World');
    setOptions(defaultOptions);
    setGeneratedBarcode('');
    setError('');
    setGtin('');
    setGeneratedGtin('');
    setGeneratedSku('');
  };

  // GTIN validation
  const validateGtin = (code: string): boolean => {
    if (!/^\d{8}$|^\d{12}$|^\d{13}$|^\d{14}$/.test(code)) return false;
    
    const digits = code.split('').map(Number);
    const checkDigit = digits.pop()!;
    
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += digits[i] * (i % 2 === 0 ? 1 : 3);
    }
    
    const calculatedCheckDigit = (10 - (sum % 10)) % 10;
    return checkDigit === calculatedCheckDigit;
  };

  // Generate GTIN-13
  const generateGTIN13 = () => {
    const prefix = '123'; // Example company prefix
    const randomPart = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    const baseCode = prefix + randomPart;
    
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(baseCode[i]) * (i % 2 === 0 ? 1 : 3);
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    const gtin13 = baseCode + checkDigit;
    
    setGeneratedGtin(gtin13);
    setInput(gtin13);
    setOptions(prev => ({ ...prev, format: 'EAN13' }));
  };

  // Generate SKU
  const generateSKU = () => {
    const prefix = 'SKU';
    const randomPart = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    const newSku = `${prefix}-${randomPart}-${timestamp}`;
    
    setGeneratedSku(newSku);
    setInput(newSku);
    setOptions(prev => ({ ...prev, format: 'CODE128' }));
  };

  useEffect(() => {
    if (input) {
      generateBarcode();
    }
  }, [input, options, generateBarcode]);

  return (
    <ToolLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center">Barcode Generator</h1>
            <p className="text-muted-foreground text-center mt-2">
              Generate barcodes, QR codes, GTINs, and SKUs with customizable options
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Text Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Barcode Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text to encode..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
                className="resize-none"
              />
              
              <div className="flex gap-2">
                <Button onClick={generateBarcode} disabled={isGenerating || !input.trim()}>
                  {isGenerating ? <LoadingSpinner size="sm" /> : <BarChart3 className="h-4 w-4" />}
                  Generate
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* GTIN/SKU Generators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Quick Generators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  onClick={generateGTIN13}
                  className="w-full justify-start"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Generate GTIN-13
                </Button>
                {generatedGtin && (
                  <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
                    Generated: {generatedGtin}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  onClick={generateSKU}
                  className="w-full justify-start"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Generate SKU
                </Button>
                {generatedSku && (
                  <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
                    Generated: {generatedSku}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Validate GTIN:</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter GTIN to validate"
                    value={gtin}
                    onChange={(e) => setGtin(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const isValid = validateGtin(gtin);
                      setError(isValid ? '' : 'Invalid GTIN check digit');
                      if (isValid) {
                        setInput(gtin);
                        setOptions(prev => ({ 
                          ...prev, 
                          format: gtin.length === 13 ? 'EAN13' : gtin.length === 8 ? 'EAN8' : 'CODE128' 
                        }));
                      }
                    }}
                    disabled={!gtin}
                  >
                    Validate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Barcode Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                {barcodeFormats.map((format) => (
                  <label
                    key={format.value}
                    className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      options.format === format.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.value}
                      checked={options.format === format.value}
                      onChange={(e) => setOptions(prev => ({ ...prev, format: e.target.value as BarcodeFormat }))}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{format.label}</div>
                      <div className="text-sm text-muted-foreground">{format.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          {options.format !== 'QR' && (
            <Card>
              <CardHeader>
                <CardTitle>Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Width</label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={options.width}
                      onChange={(e) => setOptions(prev => ({ ...prev, width: parseInt(e.target.value) || 2 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Height</label>
                    <Input
                      type="number"
                      min="50"
                      max="200"
                      value={options.height}
                      onChange={(e) => setOptions(prev => ({ ...prev, height: parseInt(e.target.value) || 100 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Font Size</label>
                    <Input
                      type="number"
                      min="10"
                      max="30"
                      value={options.fontSize}
                      onChange={(e) => setOptions(prev => ({ ...prev, fontSize: parseInt(e.target.value) || 20 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Margin</label>
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      value={options.margin}
                      onChange={(e) => setOptions(prev => ({ ...prev, margin: parseInt(e.target.value) || 10 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={options.displayValue}
                      onChange={(e) => setOptions(prev => ({ ...prev, displayValue: e.target.checked }))}
                    />
                    <span className="text-sm font-medium">Display text below barcode</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Background Color</label>
                    <Input
                      type="color"
                      value={options.background}
                      onChange={(e) => setOptions(prev => ({ ...prev, background: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Line Color</label>
                    <Input
                      type="color"
                      value={options.lineColor}
                      onChange={(e) => setOptions(prev => ({ ...prev, lineColor: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {/* Generated Barcode */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Generated Barcode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-center min-h-[200px] bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25">
                {isGenerating ? (
                  <LoadingSpinner />
                ) : generatedBarcode ? (
                  <div className="p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={generatedBarcode} 
                      alt="Generated barcode" 
                      className="max-w-full h-auto"
                    />
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Your barcode will appear here</p>
                  </div>
                )}
              </div>

              {generatedBarcode && (
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                    <Copy className="h-4 w-4" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button onClick={downloadBarcode} variant="outline" className="flex-1">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
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
                <h4 className="font-medium text-foreground mb-1">Barcode Formats:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Code 128:</strong> Most versatile, supports all ASCII characters</li>
                  <li>• <strong>Code 39:</strong> Alphanumeric, widely used in automotive/healthcare</li>
                  <li>• <strong>EAN-13/8:</strong> Standard for retail products worldwide</li>
                  <li>• <strong>UPC-A:</strong> Standard in North America for retail</li>
                  <li>• <strong>QR Code:</strong> 2D code with high data capacity</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-1">GTIN (Global Trade Item Number):</h4>
                <p>Used to identify products globally. Includes UPC, EAN, and other standards.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-1">SKU (Stock Keeping Unit):</h4>
                <p>Internal product identifier used for inventory management.</p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-1">Privacy:</h4>
                <p>All barcode generation is done client-side. No data is sent to external servers.</p>
              </div>
            </CardContent>
          </Card>
        </div>
          </div>
        </div>
      </div>

      {/* Hidden canvases for barcode generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <canvas ref={qrCanvasRef} style={{ display: 'none' }} />
    </ToolLayout>
  );
}
