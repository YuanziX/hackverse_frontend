
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  // Placeholder data - replace with your actual data structure
  const mockData = [
    { id: 1, title: "Video 1", date: "2025-04-17", duration: "2:30" },
    { id: 2, title: "Video 2", date: "2025-04-16", duration: "1:45" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4">
        {mockData.map((video) => (
          <Card key={video.id}>
            <CardHeader>
              <CardTitle>{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Recorded: {video.date}</p>
              <p>Duration: {video.duration}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
