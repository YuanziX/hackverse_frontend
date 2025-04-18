import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, MessageSquareIcon, Video, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/constant";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface Story {
  id: string;
  title: string | null;
  video: {
    created_at: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: stories, isLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/video/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 404) {
        toast({
          title: "No stories found",
          description: "You haven't recorded any stories yet.",
          variant: "default",
        });
        return [];
      }

      if (!response.ok) throw new Error("Failed to fetch stories");

      const data = await response.json();
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/chat")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <MessageSquareIcon className="w-4 h-4 mr-2" />
              Talk to AI
            </Button>
            <Button
              onClick={() => navigate("/record")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Video className="w-4 h-4 mr-2" />
              Record Video
            </Button>
            <Button
              variant="outline"
              className="border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900"
              onClick={() => navigate("/history")}
            >
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="grid gap-4">
            {stories?.map((story: Story, index: number) => (
              <Card
                key={story.id}
                className="hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] animate-fade-in cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                onClick={() => navigate(`/story/${story.id}`)}
              >
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    {story.title || story.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Recorded: {format(new Date(story.video.created_at), "PPpp")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
