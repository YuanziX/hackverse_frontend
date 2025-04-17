
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Video, LayoutDashboard, LogOut } from "lucide-react";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/record")}
            >
              <Video className="mr-2 h-4 w-4" />
              Record
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              // Placeholder for logout logic
              console.log("Logout clicked");
              navigate("/login");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
