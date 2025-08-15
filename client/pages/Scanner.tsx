import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Camera, Hash, Scan, Target, Zap, CheckCircle, Settings, QrCode } from "lucide-react";
import { ProfessionalHeader, NavigationBreadcrumbs } from "@/components/ProfessionalHeader";
import { WrenchBadge } from "@/components/WrenchLogo";

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

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Equipment Scanner" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
      {/* Professional Header */}
      <ProfessionalHeader 
        title="Equipment Scanner"
        subtitle="Professional machine identification system"
        variant="gradient"
      />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <NavigationBreadcrumbs items={breadcrumbs} />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <WrenchBadge className="mb-4" />
          <h1 className="text-3xl lg:text-4xl font-black text-wrench-navy-900 mb-4">
            Professional Equipment
            <br />
            <span className="bg-gradient-to-r from-wrench-accent to-wrench-success bg-clip-text text-transparent">
              Identification System
            </span>
          </h1>
          <p className="text-lg text-wrench-navy-600 max-w-2xl mx-auto">
            Instantly access equipment maintenance records and task schedules using our 
            advanced QR code scanning technology.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* QR Scanner Section */}
          <Card className="bg-white border-wrench-navy-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="text-center border-b border-wrench-navy-100">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="h-12 w-12 bg-gradient-to-br from-wrench-accent to-wrench-navy-700 rounded-full flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-wrench-navy-800 text-xl">
                  QR Code Scanner
                </CardTitle>
              </div>
              <CardDescription className="text-wrench-navy-600">
                Point your camera at the QR code attached to the equipment
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Camera View */}
                <div className="relative bg-wrench-navy-900 rounded-xl overflow-hidden shadow-inner">
                  {!scanning ? (
                    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-wrench-navy-100 to-wrench-navy-200">
                      <div className="text-center">
                        <div className="h-20 w-20 bg-wrench-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Scan className="h-10 w-10 text-wrench-accent" />
                        </div>
                        <p className="text-wrench-navy-700 text-lg font-semibold mb-2">
                          Camera Ready
                        </p>
                        <p className="text-wrench-navy-500 text-sm">
                          Press start to begin professional scanning
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
                      <div className="relative">
                        <div className="w-48 h-48 border-4 border-wrench-accent rounded-xl shadow-lg">
                          <div className="w-full h-full border-4 border-white border-dashed rounded-xl animate-pulse"></div>
                        </div>
                        {/* Corner guides */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                  {!scanning ? (
                    <Button
                      onClick={startScanner}
                      className="flex-1 bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white py-4 text-lg hover-lift shadow-lg"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      Start Professional Scan
                    </Button>
                  ) : (
                    <Button
                      onClick={stopScanner}
                      variant="outline"
                      className="flex-1 border-wrench-error text-wrench-error hover:bg-wrench-error hover:text-white py-4 text-lg"
                    >
                      <Target className="h-5 w-5 mr-2" />
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

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-wrench-navy-100">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-wrench-success" />
                    <span className="text-sm text-wrench-navy-700">Instant Recognition</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-wrench-accent" />
                    <span className="text-sm text-wrench-navy-700">Auto-Focus</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual Entry Section */}
          <Card className="bg-white border-wrench-navy-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="text-center border-b border-wrench-navy-100">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="h-12 w-12 bg-gradient-to-br from-wrench-warning to-wrench-warning/80 rounded-full flex items-center justify-center">
                  <Hash className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-wrench-navy-800 text-xl">
                  Manual Entry
                </CardTitle>
              </div>
              <CardDescription className="text-wrench-navy-600">
                Enter equipment ID manually if QR scanning is not available
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleManualSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="machineId" className="text-wrench-navy-700 font-semibold text-base">
                    Equipment Identifier
                  </Label>
                  <Input
                    id="machineId"
                    type="text"
                    placeholder="Enter equipment ID (e.g., TRUMPF-5000-001)"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    className="border-wrench-navy-200 focus:border-wrench-accent focus:ring-wrench-accent/20 text-wrench-navy-800 h-14 text-lg"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={!manualId.trim()}
                  className="w-full bg-gradient-to-r from-wrench-navy-800 to-wrench-navy-700 hover:from-wrench-navy-900 hover:to-wrench-navy-800 text-white py-4 text-lg hover-lift shadow-lg"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Access Equipment Records
                </Button>
              </form>

              {/* Example IDs */}
              <div className="mt-6 p-6 bg-gradient-to-br from-wrench-navy-50 to-wrench-accent/5 rounded-xl border border-wrench-navy-100">
                <div className="flex items-center space-x-2 mb-4">
                  <QrCode className="h-5 w-5 text-wrench-accent" />
                  <p className="text-wrench-navy-700 font-semibold">
                    Sample Equipment IDs:
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-mono text-sm bg-wrench-navy-800 text-white px-3 py-1 rounded">TRUMPF-5000-001</span>
                    <span className="text-wrench-navy-600 text-sm">Trumpf TruPunch 5000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-mono text-sm bg-wrench-navy-800 text-white px-3 py-1 rounded">TRUMPF-5000-002</span>
                    <span className="text-wrench-navy-600 text-sm">Trumpf TruPunch 5000 #2</span>
                  </div>
                </div>
              </div>

              {/* Professional Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-wrench-navy-100">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-wrench-success" />
                  <span className="text-sm text-wrench-navy-700">Validated Access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-wrench-accent" />
                  <span className="text-sm text-wrench-navy-700">Secure Protocol</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Instructions */}
      </main>
    </div>
  );
}
