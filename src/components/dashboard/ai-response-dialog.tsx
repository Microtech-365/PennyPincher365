'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

type AIResponseDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  prompt: string | null;
  response: string | null;
  isLoading: boolean;
};

export function AIResponseDialog({ isOpen, setIsOpen, prompt, response, isLoading }: AIResponseDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Assistant</DialogTitle>
          <DialogDescription>
            Your response from the AI finance assistant.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <h4 className="font-semibold">Your Question:</h4>
                <p className="text-sm text-muted-foreground">{prompt}</p>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold">AI Response:</h4>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[80%]" />
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-4 w-[70%]" />
                    </div>
                ) : (
                    <p className="text-sm">{response}</p>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
