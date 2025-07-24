import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions or use manual entry.");
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Scan Machine</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Scanner Section */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Camera className="h-6 w-6" />
                QR Code Scanner
              </CardTitle>
              <CardDescription>
                Point your camera at the QR code attached to the machine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {!scanning ? (
                  <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <Scan className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">Ready to scan QR code</p>
                    <Button onClick={startScanner} className="bg-blue-600 hover:bg-blue-700">
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
                      <Button onClick={stopScanner} variant="outline" className="flex-1">
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
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Hash className="h-6 w-6" />
                Manual Entry
              </CardTitle>
              <CardDescription>
                Enter machine ID manually if QR scanning is not available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="machineId">Machine ID</Label>
                  <Input
                    id="machineId"
                    type="text"
                    placeholder="e.g., CAR-001, PUMP-05, etc."
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={!manualId.trim()}>
                  Access Machine
                </Button>
              </form>

              {/* Demo Machine IDs */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Demo Machine IDs:</h4>
                <div className="flex flex-wrap gap-2">
                  {["CAR-001", "PUMP-05", "DRILL-12"].map((id) => (
                    <Button
                      key={id}
                      variant="outline"
                      size="sm"
                      onClick={() => setManualId(id)}
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
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
