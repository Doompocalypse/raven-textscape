
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Background } from "@/components/Background";
import { Input } from "@/components/ui/input";
import { Mail, Lock, SignalLow, BatteryLow } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Update time every second
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully!");
      }
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center overflow-hidden">
      <Background />
      <div className="relative w-[380px] h-[700px] mx-auto bg-black rounded-[3rem] border-4 border-white/10 shadow-2xl overflow-hidden">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-40 bg-black rounded-b-2xl z-20"></div>
        
        {/* Status Bar */}
        <div className="relative h-12 bg-black flex items-center justify-between px-6 border-b border-white/10">
          <span className="text-white text-sm">{formatTime(currentTime)}</span>
          <div className="flex items-center space-x-2">
            <SignalLow className="w-4 h-4 text-white" />
            <span className="text-white text-sm">5G</span>
            <BatteryLow className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Auth Content */}
        <div className="h-[calc(100%-3rem)] p-6 bg-black/95">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cover bg-center"
               style={{ backgroundImage: "url('/lovable-uploads/62fd8eb1-f0c1-4a66-a3b6-f9588687db41.png')" }}>
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-raven-accent hover:bg-raven-accent/80"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-white/70 hover:text-white"
            >
              {isSignUp
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
