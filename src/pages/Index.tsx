import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Clock, Video } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 animate-fade-in">
            Transform Your Videos into
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}
              Interactive Memories
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
            Memory Weave turns your video streams into rich, interactive
            timelines. Capture moments, understand actions, and relive memories
            with AI-powered insights.
          </p>
          <div className="flex gap-4 justify-center animate-fade-in">
            <Button
              onClick={() => navigate("/signup")}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              size="lg"
              className="px-8"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                <Video className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Smart Timeline
              </h3>
              <p className="text-gray-600">
                Convert video streams into interactive checkpoints that capture
                key moments and actions.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto">
                <Brain className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600">
                Get context-aware descriptions of moments using advanced AI
                understanding.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Event Context
              </h3>
              <p className="text-gray-600">
                Customize the system with event context for more relevant and
                accurate descriptions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
