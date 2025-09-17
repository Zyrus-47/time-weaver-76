import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: "Invalid email or password. Please check your credentials and try again."
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            variant: "destructive", 
            title: "Email not confirmed",
            description: "Please check your email and click the confirmation link before signing in."
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: error.message
          });
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in."
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-card bg-gradient-card">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;


