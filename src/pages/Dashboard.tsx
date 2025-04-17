
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  // Placeholder data - replace with your actual data structure
  const mockData = [
    { id: 1, title: "Video 1", date: "2025-04-17", duration: "2:30" },
    { id: 2, title: "Video 2", date: "2025-04-16", duration: "1:45" },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => navigate("/record")}
            variant="default"
            className="flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            Record Video
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate("/history")}
          >
            <History className="w-4 h-4" />
            View History
          </Button>
        </div>
      </div>
      <div className="grid gap-4">
        {mockData.map((video) => (
          <Card key={video.id} className="hover:bg-gray-50 cursor-pointer">
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
  );
};

export default Dashboard;
