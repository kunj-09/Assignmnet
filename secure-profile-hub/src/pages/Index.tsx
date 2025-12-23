import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Lock, UserCheck, ArrowRight } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-foreground bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <span className="font-display text-xl font-bold uppercase tracking-widest">
            SECURE_ID
          </span>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/profile">
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex min-h-screen items-center justify-center px-6 pt-16">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 border-2 border-foreground bg-secondary px-4 py-2">
              <Shield className="h-4 w-4" />
              <span className="font-display text-xs font-bold uppercase tracking-wider">
                Secure Identity Management
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mb-6 font-display text-5xl font-bold uppercase leading-tight tracking-tight md:text-7xl">
              Protect Your
              <br />
              <span className="border-b-4 border-foreground">Digital Identity</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-12 max-w-xl font-body text-lg text-muted-foreground md:text-xl">
              Securely store and manage your Aadhaar credentials with enterprise-grade encryption and seamless access.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isAuthenticated ? (
                <Button size="lg" asChild>
                  <Link to="/profile">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link to="/register">
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t-2 border-foreground bg-secondary py-24">
        <div className="container mx-auto px-6">
          <div className="grid gap-0 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="border-2 border-foreground bg-background p-8 md:border-r-0">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center border-2 border-foreground">
                <Lock className="h-7 w-7" />
              </div>
              <h3 className="mb-3 font-display text-lg font-bold uppercase tracking-tight">
                Encrypted Storage
              </h3>
              <p className="font-body text-muted-foreground">
                Your sensitive data is encrypted using industry-standard algorithms before being stored.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-2 border-foreground bg-background p-8 md:border-r-0">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center border-2 border-foreground">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="mb-3 font-display text-lg font-bold uppercase tracking-tight">
                Secure Access
              </h3>
              <p className="font-body text-muted-foreground">
                JWT-based authentication ensures only you can access your identity information.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-2 border-foreground bg-background p-8">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center border-2 border-foreground">
                <UserCheck className="h-7 w-7" />
              </div>
              <h3 className="mb-3 font-display text-lg font-bold uppercase tracking-tight">
                Verified Identity
              </h3>
              <p className="font-body text-muted-foreground">
                Seamlessly verify and manage your Aadhaar-linked identity from anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-foreground bg-background">
        <div className="container mx-auto flex h-16 items-center justify-center px-6">
          <p className="font-body text-sm text-muted-foreground">
            © 2025 SECURE_ID. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
