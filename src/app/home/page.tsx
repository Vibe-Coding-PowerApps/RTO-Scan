import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/button';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md flex flex-col items-center justify-center px-6 py-8 space-y-8">
        <div className="w-full text-left space-y-4">
          <h1 className="text-5xl font-bold text-foreground">
            Return to<br />Office
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Scan the QR code to sign in and find available desks in real time.
          </p>
        </div>
        <Button
          onClick={() => navigate('/scan')}
          className="w-full rounded-full py-4 px-6 font-semibold flex items-center justify-between group"
          size="lg"
        >
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary-foreground" />
            <div className="w-6 h-2 rounded-full bg-primary-foreground" />
            <div className="w-2 h-2 rounded-full bg-primary-foreground" />
          </div>
          <span>Next</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
