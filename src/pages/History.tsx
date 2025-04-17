
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();
  // Placeholder data - replace with your actual data structure
  const mockData = [
    { id: 1, title: "Video 1", date: "2025-04-17", duration: "2:30" },
    { id: 2, title: "Video 2", date: "2025-04-16", duration: "1:45" },
    { id: 3, title: "Video 3", date: "2025-04-15", duration: "3:15" },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">Recording History</h1>
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

export default History;
