import { type ReactNode } from 'react';
import { ProgressBar } from '../ui/ProgressBar';

interface WizardLayoutProps {
  children: ReactNode;
}

export function WizardLayout({ children }: WizardLayoutProps) {
  return (
    <div className="flex-1 flex flex-col">
      <ProgressBar />
      <div className="flex-1 flex justify-center px-4 py-6">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
