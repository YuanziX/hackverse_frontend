
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, StopCircle, Upload, Trash2, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

const VideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = URL.createObjectURL(blob);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleUpload = () => {
    if (recordedBlob) {
      console.log("Uploading video blob:", recordedBlob);
    }
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const discardRecording = () => {
    setRecordedBlob(null);
    if (videoRef.current) {
      videoRef.current.src = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <Card className="max-w-2xl mx-auto shadow-lg transform hover:scale-[1.02] transition-all">
        <CardContent className="p-6 space-y-6">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative group">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted={isRecording}
            />
            {recordedBlob && !isRecording && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={togglePlayback}
                  className="bg-black/50 hover:bg-black/70 text-white"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 text-white px-3 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-medium">Recording</span>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4">
            {!isRecording && !recordedBlob && (
              <Button 
                onClick={startRecording}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Video className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            )}
            {isRecording && (
              <Button onClick={stopRecording} variant="destructive">
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            )}
            {recordedBlob && !isRecording && (
              <>
                <Button
                  onClick={handleUpload}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </Button>
                <Button
                  onClick={discardRecording}
                  variant="destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Discard
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoRecorder;
