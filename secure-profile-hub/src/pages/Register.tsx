import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/AuthLayout';
import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateRegister } from '@/lib/validation';
import { ApiError } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    aadhaar: '',
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
    
    // Only allow digits for Aadhaar
    if (name === 'aadhaar' && value && !/^\d*$/.test(value)) {
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateRegister(formData);
    if (validation.success === false) {
      setErrors(validation.errors);
      return;
    }

    const validData = validation.data;
    setIsSubmitting(true);
    setErrors({});

    try {
      await register({
        name: validData.name,
        email: validData.email,
        password: validData.password,
        aadhaar: validData.aadhaar,
      });
      toast({
        title: 'Account created!',
        description: 'Welcome! Your account has been successfully created.',
      });
      navigate('/profile');
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: apiError.message || 'Could not create account. Please try again.',
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
      title="Create Account"
      subtitle="Register to securely store your identity"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          id="name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          disabled={isSubmitting}
          required
          maxLength={100}
        />

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
          placeholder="Min 8 chars with uppercase, number & symbol"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isSubmitting}
          required
          maxLength={100}
        />

        <FormField
          id="aadhaar"
          label="Aadhaar Number"
          type="text"
          placeholder="12 digit Aadhaar number"
          value={formData.aadhaar}
          onChange={handleChange}
          error={errors.aadhaar}
          disabled={isSubmitting}
          required
          maxLength={12}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        <div className="text-center">
          <p className="font-body text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-display font-bold uppercase text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
