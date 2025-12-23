import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-foreground bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="font-display text-xl font-bold uppercase tracking-widest">
            SECURE_ID
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-screen items-center justify-center px-6 pt-16">
        <div className="w-full max-w-md animate-slide-up">
          {/* Title Section */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-display text-3xl font-bold uppercase tracking-tight">
              {title}
            </h1>
            <p className="font-body text-muted-foreground">
              {subtitle}
            </p>
          </div>

          {/* Form Container */}
          <div className="border-2 border-foreground bg-card p-8">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t-2 border-foreground bg-background">
        <div className="container mx-auto flex h-12 items-center justify-center px-6">
          <p className="font-body text-xs text-muted-foreground">
            © 2024 SECURE_ID. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
