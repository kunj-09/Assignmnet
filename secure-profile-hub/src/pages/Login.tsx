import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/AuthLayout';
import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateLogin } from '@/lib/validation';
import { ApiError } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateLogin(formData);
    if (validation.success === false) {
      setErrors(validation.errors);
      return;
    }

    const validData = validation.data;
    setIsSubmitting(true);
    setErrors({});

    try {
      await login({ email: validData.email, password: validData.password });
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      navigate('/profile');
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: apiError.message || 'Invalid credentials. Please try again.',
      });
      
      // Set field-specific errors if available
      if (apiError.errors) {
        setErrors(
          Object.fromEntries(
            Object.entries(apiError.errors).map(([key, messages]) => [key, messages[0]])
          )
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Enter your credentials to access your account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isSubmitting}
          required
          maxLength={255}
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isSubmitting}
          required
          maxLength={100}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        <div className="text-center">
          <p className="font-body text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-display font-bold uppercase text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
