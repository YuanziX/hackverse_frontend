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
  Loader2,
  FileVideo,
} from "lucide-react";
import { BASE_URL } from "@/lib/constant";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

const VideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [prompt, setPrompt] = useState("Generate me a journal");
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file.");
        return;
      }
      setRecordedBlob(file);
      if (videoRef.current) {
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
        }
        blobUrlRef.current = URL.createObjectURL(file);
        videoRef.current.src = blobUrlRef.current;
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    setError(null);
    if (!recordedBlob) {
      setError("No video recorded to upload.");
      return;
    }

    setIsUploading(true);

    if (recordedBlob) {
      const formData = new FormData();
      formData.append("file", recordedBlob, "recorded-video.webm");
      formData.append("prompt", prompt);

      try {
        const response = await fetch(`${BASE_URL}/video/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (!response.ok) {
          setError("Upload failed.");
          return;
        }

        const data = await response.json();

        setRecordedBlob(null);
        discardRecording();

        toast({
          variant: "default",
          title: "Upload Successful",
          description: "Your video has been uploaded successfully.",
        });

        navigate(`/story/${data["timeline_id"]}`);
      } catch (err) {
        console.error("Upload failed:", err);
        setError("Video upload failed.");
      } finally {
        setIsUploading(false);
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
          Record or upload your experience
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
          <Input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileSelect}
            ref={fileInputRef}
          />
          <div className="space-y-2">
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700"
            >
              Custom Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full border rounded-md p-2 text-sm"
              rows={3}
              placeholder="Generate me a journal"
            />
          </div>
          <div className="flex justify-center gap-4">
            {!isRecording && !recordedBlob && (
              <>
                <Button
                  onClick={startRecording}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white dark:from-purple-500 dark:to-pink-500"
                >
                  <Video className="mr-2 h-4 w-4" />
                  Start Recording
                </Button>
                <Button
                  onClick={triggerFileInput}
                  variant="outline"
                  className="border-purple-200 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900"
                >
                  <FileVideo className="mr-2 h-4 w-4" />
                  Pick Video File
                </Button>
              </>
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
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white dark:from-green-500 dark:to-teal-500"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Video
                    </>
                  )}
                </Button>
                <Button
                  onClick={discardRecording}
                  variant="destructive"
                  disabled={isUploading}
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
