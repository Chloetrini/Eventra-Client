import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Camera, AlertCircle, X } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (ticketReference: string) => void;
  isScanning?: boolean;
}

export default function QRScannerModal({
  isOpen,
  onClose,
  onScan,
  isScanning = false,
}: QRScannerModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const [isReady, setIsReady] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScanningRef = useRef(isScanning);

  useEffect(() => {
    isScanningRef.current = isScanning;
  }, [isScanning]);

  const startScanner = useCallback(async () => {
    if (!containerRef.current) return;

    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        // Ignore cleanup errors
      }
      scannerRef.current = null;
    }

    try {
      scannerRef.current = new Html5Qrcode(containerRef.current.id);

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      const onDecode = (decodedText: string) => {
        if (!isScanningRef.current && decodedText) {
          onScan(decodedText);
        }
      };

      const onFrameError = (_errorMessage: string) => {
        // Ignore frequent frame errors
      };

      try {
        await scannerRef.current.start(
          { facingMode: 'environment' },
          config,
          onDecode,
          onFrameError
        );
      } catch (constraintErr) {
        console.warn('environment facingMode unavailable, falling back:', constraintErr);
        const cameras = await Html5Qrcode.getCameras();
        if (!cameras.length) throw new Error('No camera found');
        await scannerRef.current.start(cameras[0].id, config, onDecode, onFrameError);
      }

      setIsReady(true);
      setHasPermission(true);
      setError(null);
    } catch (err: any) {
      console.error('Failed to start scanner — name:', err?.name, 'message:', err?.message, err);

      if (err?.name === 'NotAllowedError' || err?.message?.includes('Permission denied')) {
        setHasPermission(false);
        setError('Camera access denied. Please allow camera access and try again.');
      } else if (err?.name === 'NotFoundError' || err?.message?.includes('No camera')) {
        setHasPermission(false);
        setError('No camera found. Please use a device with a camera.');
      } else if (err?.name === 'NotReadableError') {
        setHasPermission(false);
        setError('Camera is already in use by another app or browser tab.');
      } else if (err?.message?.includes('already started')) {
        // Ignore - scanner is already running
      } else {
        setError(`Failed to access camera: ${err?.name || 'Unknown error'}`);
      }
    }
  }, [onScan]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.error('Failed to stop scanner:', err);
      }
      scannerRef.current = null;
      setIsReady(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        startScanner();
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    } else {
      stopScanner();
    }
  }, [isOpen, startScanner, stopScanner]);

  const handleRetry = useCallback(async () => {
    await stopScanner();
    setError(null);
    setHasPermission(true);
    setIsReady(false);
    setTimeout(() => {
      startScanner();
    }, 500);
  }, [startScanner, stopScanner]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className=" text-lg font-semibold">Scan Ticket QR Code</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              {/* <X className="h-4 w-4" /> */}
            </Button>
          </div>
          <DialogDescription>
            Position the QR code within the frame to scan
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {!hasPermission ? (
            <div className="text-center py-8 space-y-4">
              <div className="flex justify-center">
                <Camera className="h-16 w-16 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">{error || 'Camera access required'}</p>
              <Button
                onClick={handleRetry}
                className="bg-[#0F6E56] hover:bg-[#0A5240]"
              >
                Grant Camera Access
              </Button>
            </div>
          ) : (
            <>
              <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-xl bg-muted">
                <div
                  id="qr-reader-container"
                  ref={containerRef}
                  className="absolute inset-0"
                />

                {!isReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted pointer-events-none">
                    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                  </div>
                )}
                {isReady && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 border-2 border-[#0F6E56] rounded-xl opacity-50" />
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isScanning && (
                <div className="mt-4 flex items-center justify-center gap-2 text-[#0F6E56]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-medium">Verifying ticket...</span>
                </div>
              )}

              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}