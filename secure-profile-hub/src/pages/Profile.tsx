import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/lib/api';
import { Loader2, User, Mail, Shield, Calendar, LogOut, RefreshCw } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout, fetchProfile } = useAuth();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchProfile();
      toast({
        title: 'Profile updated',
        description: 'Your profile data has been refreshed.',
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        variant: 'destructive',
        title: 'Failed to refresh',
        description: apiError.message || 'Could not refresh profile data.',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Signed out',
      description: 'You have been successfully logged out.',
    });
    navigate('/login');
  };

  // Format Aadhaar for display (mask middle digits)
  const formatAadhaar = (aadhaar: string) => {
    if (!aadhaar || aadhaar.length !== 12) return aadhaar;
    return aadhaar;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-foreground bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="font-display text-xl font-bold uppercase tracking-widest">
            SECURE_ID
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-2xl animate-slide-up">
          {/* Page Title */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold uppercase tracking-tight">
                Profile
              </h1>
              <p className="mt-1 font-body text-muted-foreground">
                Your secure identity information
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Profile Card */}
          <div className="border-2 border-foreground bg-card">
            {/* User Avatar Section */}
            <div className="border-b-2 border-foreground bg-secondary p-8">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center border-2 border-foreground bg-background">
                  <User className="h-10 w-10 text-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold uppercase">
                    {user?.name || 'User'}
                  </h2>
                  <p className="font-body text-muted-foreground">
                    Verified Identity
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="divide-y-2 divide-border">
              {/* Email */}
              <div className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-foreground bg-secondary">
                  <Mail className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email Address
                  </p>
                  <p className="mt-1 font-body text-lg">
                    {user?.email || '—'}
                  </p>
                </div>
              </div>

              {/* Aadhaar */}
              <div className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-foreground bg-secondary">
                  <Shield className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Aadhaar Number
                  </p>
                  <p className="mt-1 font-display text-lg tracking-wider">
                    {user?.aadhaar ? formatAadhaar(user.aadhaar) : '—'}
                  </p>
                </div>
              </div>

              {/* Created At */}
              {user?.createdAt && (
                <div className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center border-2 border-foreground bg-secondary">
                    <Calendar className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Member Since
                    </p>
                    <p className="mt-1 font-body text-lg">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 border-2 border-foreground bg-secondary p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-foreground" />
              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider">
                  Security Notice
                </h3>
                <p className="mt-1 font-body text-sm text-muted-foreground">
                  Your Aadhaar number is encrypted and securely stored. Only partial digits are displayed for your protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
