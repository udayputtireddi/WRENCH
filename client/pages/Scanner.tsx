import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Camera, Hash, Scan, Wrench, Target, Zap } from "lucide-react";

export default function Scanner() {
  const [scanning, setScanning] = useState(false);
  const [manualId, setManualId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScanner = async () => {
    try {
      setError("");
      setScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError(
        "Camera access denied. Please enable camera permissions or use manual entry.",
      );
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    setScanning(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      navigate(`/machine/${manualId.trim()}?from=scan`);
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="app-container bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-wrench-navy-800 via-wrench-navy-700 to-wrench-navy-800 shadow-2xl relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Header Background Elements */}
        <div className="absolute top-4 right-4 text-wrench-navy-300 opacity-20">
          <Target className="h-6 w-6" />
        </div>

        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 hover-lift"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Wrench className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Machine Scanner</h1>
                <p className="text-wrench-navy-200">
                  Identify machines via QR code scanning
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Scanner Section */}
          <Card className="mb-8 bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="h-12 w-12 bg-gradient-to-br from-wrench-accent to-wrench-navy-700 rounded-full flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-wrench-navy-800 text-xl">
                  QR Code Scanner
                </CardTitle>
              </div>
              <CardDescription className="text-wrench-navy-600">
                Point your camera at the QR code attached to the machine
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                {/* Camera View */}
                <div className="relative bg-wrench-navy-900 rounded-lg overflow-hidden">
                  {!scanning ? (
                    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-wrench-navy-100 to-wrench-navy-200">
                      <div className="text-center">
                        <Scan className="h-16 w-16 text-wrench-navy-400 mx-auto mb-4" />
                        <p className="text-wrench-navy-600 text-lg font-medium">
                          Camera Ready
                        </p>
                        <p className="text-wrench-navy-500 text-sm">
                          Press start to begin scanning
                        </p>
                      </div>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full aspect-video object-cover"
                    />
                  )}
                  
                  {/* Scanning Overlay */}
                  {scanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-4 border-wrench-accent rounded-lg">
                        <div className="w-full h-full border-4 border-white border-dashed rounded-lg animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                  {!scanning ? (
                    <Button
                      onClick={startScanner}
                      className="flex-1 bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white py-3 hover-lift"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      Start Scanner
                    </Button>
                  ) : (
                    <Button
                      onClick={stopScanner}
                      variant="outline"
                      className="flex-1 border-wrench-error text-wrench-error hover:bg-wrench-error hover:text-white py-3"
                    >
                      Stop Scanner
                    </Button>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-wrench-error/10 border border-wrench-error/20 rounded-lg">
                    <p className="text-wrench-error text-sm font-medium">{error}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Manual Entry Section */}
          <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="h-12 w-12 bg-gradient-to-br from-wrench-warning to-wrench-warning/80 rounded-full flex items-center justify-center">
                  <Hash className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-wrench-navy-800 text-xl">
                  Manual Entry
                </CardTitle>
              </div>
              <CardDescription className="text-wrench-navy-600">
                Enter machine ID manually if QR scanning is not available
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="machineId" className="text-wrench-navy-700 font-medium">
                    Machine ID
                  </Label>
                  <Input
                    id="machineId"
                    type="text"
                    placeholder="Enter machine identifier (e.g., TRUMPF-5000-001)"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    className="border-wrench-navy-200 focus:border-wrench-accent focus:ring-wrench-accent/20 text-wrench-navy-800"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={!manualId.trim()}
                  className="w-full bg-gradient-to-r from-wrench-navy-800 to-wrench-navy-700 hover:from-wrench-navy-900 hover:to-wrench-navy-800 text-white py-3 hover-lift"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Access Machine
                </Button>
              </form>

              {/* Example IDs */}
              <div className="mt-6 p-4 bg-wrench-navy-50 rounded-lg">
                <p className="text-wrench-navy-700 text-sm font-medium mb-2">
                  Example Machine IDs:
                </p>
                <div className="space-y-1 text-sm">
                  <p className="text-wrench-navy-600">
                    <span className="font-mono bg-white px-2 py-1 rounded">TRUMPF-5000-001</span>
                    <span className="text-wrench-navy-500 ml-2">Trumpf TruPunch 5000</span>
                  </p>
                  <p className="text-wrench-navy-600">
                    <span className="font-mono bg-white px-2 py-1 rounded">TRUMPF-5000-002</span>
                    <span className="text-wrench-navy-500 ml-2">Trumpf TruPunch 5000 #2</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-wrench-accent/10 rounded-full">
              <Wrench className="h-4 w-4 text-wrench-accent" />
              <p className="text-wrench-navy-700 text-sm font-medium">
                Professional maintenance identification system
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
