import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Session Processing Dashboard</h1>
        <p className="text-xl text-muted-foreground mb-8">Welcome to your session processing summary</p>
        <Button 
          onClick={() => navigate("/session-processing")}
          size="lg"
        >
          View Session Processing Summary
        </Button>
      </div>
    </div>
  );
};

export default Index;
