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
import { ArrowLeft, Camera, Hash, Scan } from "lucide-react";

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
      navigate(`/machine/${manualId.trim()}`);
    }
  };

  // Simulate QR code detection (in real app, would use html5-qrcode library)
  const simulateQRScan = (machineId: string) => {
    stopScanner();
    navigate(`/machine/${machineId}`);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Scan Machine</h1>
              <p className="text-blue-100">Identify machines via QR code scanning</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Scanner Section */}
          <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <Camera className="h-6 w-6" />
                QR Code Scanner
              </CardTitle>
              <CardDescription className="text-slate-400">
                Point your camera at the QR code attached to the machine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {!scanning ? (
                  <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <Scan className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">Ready to scan QR code</p>
                    <Button
                      onClick={startScanner}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 bg-black rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-lg">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-blue-400 w-32 h-32 rounded-lg"></div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={stopScanner}
                        variant="outline"
                        className="flex-1"
                      >
                        Stop Scanner
                      </Button>
                      {/* Demo QR codes for testing */}
                      <Button
                        onClick={() => simulateQRScan("CAR-001")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Demo: Car A
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Entry Section */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <Hash className="h-6 w-6" />
                Manual Entry
              </CardTitle>
              <CardDescription className="text-slate-400">
                Enter machine ID manually if QR scanning is not available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="machineId" className="text-slate-300">Machine ID</Label>
                  <Input
                    id="machineId"
                    type="text"
                    placeholder="e.g., CAR-001, PUMP-05, etc."
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!manualId.trim()}
                >
                  Access Machine
                </Button>
              </form>

              {/* Demo Machine IDs */}
              <div className="mt-6 p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  Demo Machine IDs:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["CAR-001", "PUMP-05", "DRILL-12"].map((id) => (
                    <Button
                      key={id}
                      variant="outline"
                      size="sm"
                      onClick={() => setManualId(id)}
                      className="bg-slate-600/50 border-slate-500 text-white hover:bg-slate-500"
                    >
                      {id}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
