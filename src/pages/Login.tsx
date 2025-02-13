
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
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
  useEffect(() => {
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

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Logged in with Google successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google authentication failed");
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
        <div className="h-[calc(100%-3rem)] p-6 bg-black/95 overflow-y-auto">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cover bg-center"
               style={{ backgroundImage: "url('/lovable-uploads/62fd8eb1-f0c1-4a66-a3b6-f9588687db41.png')" }}>
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            {isSignUp ? "Create Account" : "Sign In To RAVEN AI"}
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

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-white/50">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
                onClick={handleGoogleSignIn}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
          </div>

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
