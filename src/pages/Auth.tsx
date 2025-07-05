
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Feather, Loader2 } from 'lucide-react';

const Auth = () => {
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Sign in form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign up form state
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  // Reset password state
  const [resetEmail, setResetEmail] = useState('');
  const [showReset, setShowReset] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(signInEmail, signInPassword, rememberMe);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message || "Please check your credentials and try again.",
        });
      } else {
        window.location.href = './';
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signUp(signUpEmail, signUpPassword, displayName);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message || "Please try again.",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await resetPassword(resetEmail);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Reset failed",
          description: error.message || "Please try again.",
        });
      } else {
        toast({
          title: "Reset link sent!",
          description: "Check your email for password reset instructions.",
        });
        setShowReset(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-cream-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sage-600 rounded-full mb-4">
            <Feather className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-sage-900 mb-2">Quillify</h1>
          <p className="text-sage-600">Your digital writing sanctuary</p>
        </div>

        {showReset ? (
          <Card className="border-sage-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-serif text-sage-900">Reset Password</CardTitle>
              <CardDescription>Enter your email to receive reset instructions</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="border-sage-200 focus:border-sage-400"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-sage-600 hover:bg-sage-700"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Link
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowReset(false)}
                    className="border-sage-300 text-sage-700 hover:bg-sage-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-sage-200 bg-white/80 backdrop-blur-sm">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-sage-100">
                <TabsTrigger value="signin" className="text-sage-700 data-[state=active]:bg-white data-[state=active]:text-sage-900">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="text-sage-700 data-[state=active]:bg-white data-[state=active]:text-sage-900">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <CardHeader>
                  <CardTitle className="font-serif text-sage-900">Welcome back</CardTitle>
                  <CardDescription>Sign in to continue your writing journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        required
                        className="border-sage-200 focus:border-sage-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        required
                        className="border-sage-200 focus:border-sage-400"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember" 
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <Label htmlFor="remember" className="text-sm text-sage-600">Remember me</Label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowReset(true)}
                        className="text-sm text-sage-600 hover:text-sage-800 underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-sage-600 hover:bg-sage-700"
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>

              <TabsContent value="signup">
                <CardHeader>
                  <CardTitle className="font-serif text-sage-900">Create account</CardTitle>
                  <CardDescription>Start your writing adventure today</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <Label htmlFor="display-name">Display Name</Label>
                      <Input
                        id="display-name"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        className="border-sage-200 focus:border-sage-400"
                        placeholder="How should we address you?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        required
                        className="border-sage-200 focus:border-sage-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        required
                        className="border-sage-200 focus:border-sage-400"
                        placeholder="At least 6 characters"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-sage-600 hover:bg-sage-700"
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Auth;
