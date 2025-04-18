import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Video,
  StopCircle,
  Upload,
  Trash2,
  Play,
  Pause,
  SquareArrowLeft,
} from "lucide-react";
import { BASE_URL } from "@/lib/constant";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const VideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const blobUrlRef = useRef<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => {
          console.error("Error playing live video stream:", err);
          setError("Error playing live video stream.");
        });
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
          // Revoke previous URL if exists
          if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
          }
          blobUrlRef.current = URL.createObjectURL(blob);
          videoRef.current.src = blobUrlRef.current;
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleUpload = async () => {
    setError(null);
    if (!recordedBlob) {
      setError("No video recorded to upload.");
      return;
    }

    if (recordedBlob) {
      const formData = new FormData();
      formData.append("file", recordedBlob, "recorded-video.webm");

      try {
        const response = await fetch(`${BASE_URL}/video/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        const data = await response.json();

        setRecordedBlob(null);
        discardRecording();

        toast({
          variant: "default",
          title: "Upload Successful",
          description: "Your video has been uploaded successfully.",
        });
      } catch (err) {
        console.error("Upload failed:", err);
        setError("Video upload failed.");
      }
    }
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => {
          console.error("Error playing video:", err);
          setError("Error playing video");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const discardRecording = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = "";
    }
    setRecordedBlob(null);
    if (videoRef.current) {
      videoRef.current.src = "";
    }
    mediaRecorderRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsPlaying(false);
  };

  return (
    <div className="flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="flex-row h-18 bg-black w-full">
        <Button
          variant="secondary"
          onClick={() => navigate("/dashboard")}
          className="mx-4 my-4"
        >
          <SquareArrowLeft className="h-4 w-4" />
        </Button>
        <span className="py-4 text-white font-medium text-2xl">
          {" "}
          Record your experience{" "}
        </span>
      </div>
      <Card className="max-w-2xl mx-auto shadow-lg transform hover:scale-[1.02] transition-all my-12">
        <CardContent className="p-6 space-y-6">
          {error && (
            <div className="text-red-500 text-center py-2">{error}</div>
          )}
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative group">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted={isRecording}
              playsInline
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
                <Button onClick={discardRecording} variant="destructive">
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
