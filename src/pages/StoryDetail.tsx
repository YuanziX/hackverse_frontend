import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/constant";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navigation from "@/components/Navigation";

interface Frame {
  id: string;
  image_url: string;
}

interface StoryDetail {
  id: string;
  story: string;
  frame: Frame[];
}

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: story, isLoading } = useQuery({
    queryKey: ["story", id],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/video/timeline/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch story");
      const data = await response.json();
      return data[0];
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navigation />
        <div className="container mx-auto p-4">
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            className="mr-4 hover:bg-purple-50 dark:hover:bg-purple-900"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Story Details
          </h1>
        </div>

        {story?.frame && story.frame.length > 0 && (
          <ScrollArea className="w-full mb-8">
            <div className="flex space-x-4 p-4">
              {story.frame.map((frame: Frame) => (
                <img
                  key={frame.id}
                  src={frame.image_url}
                  alt="Frame"
                  className="h-48 w-auto rounded-lg shadow-lg"
                />
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="prose prose-purple max-w-none dark:prose-invert">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <p className="whitespace-pre-wrap">{story?.story}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
