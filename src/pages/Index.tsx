
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Video Recorder</h1>
        <p className="text-xl text-gray-600 mb-8">Record, upload, and view your videos</p>
        <div className="flex space-x-4 justify-center">
          <Button 
            onClick={() => navigate("/login")} 
            variant="default"
            size="lg"
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate("/signup")} 
            variant="outline"
            size="lg"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
