
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Dashboard = () => {
  const navigate = useNavigate();
  const mockData = [
    { id: 1, title: "Video 1", date: "2025-04-17", duration: "2:30" },
    { id: 2, title: "Video 2", date: "2025-04-16", duration: "1:45" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navigation />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/record")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Video className="w-4 h-4" />
              Record Video
            </Button>
            <Button
              variant="outline"
              className="border-purple-200 hover:bg-purple-50"
              onClick={() => navigate("/history")}
            >
              <History className="w-4 h-4" />
              View History
            </Button>
          </div>
        </div>
        <div className="grid gap-4">
          {mockData.map((video, index) => (
            <Card 
              key={video.id} 
              className="hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] animate-fade-in"
              style={{ '--animation-order': index } as React.CSSProperties}
            >
              <CardHeader>
                <CardTitle>{video.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Recorded: {video.date}</p>
                <p className="text-gray-600">Duration: {video.duration}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
