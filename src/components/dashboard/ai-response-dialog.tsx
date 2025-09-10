'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

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
      <DialogContent className="sm:max-w-lg">
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
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[80%]" />
                            <Skeleton className="h-4 w-[90%]" />
                            <Skeleton className="h-4 w-[70%]" />
                        </div>
                    ) : (
                        <p className="text-sm whitespace-pre-wrap">{response}</p>
                    )}
                </ScrollArea>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
