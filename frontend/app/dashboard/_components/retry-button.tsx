'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { retryScrapeAction } from '@/data/saved-items';

export function RetryButton({ itemId }: { itemId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleRetry(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await retryScrapeAction(itemId);

      if (result.success) {
        toast.success('Retry successful');
        router.refresh();
      } else {
        toast.error(result.error || 'Retry failed');
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRetry}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 data-icon="inline-start" className="animate-spin" />
      ) : (
        <RotateCcw data-icon="inline-start" />
      )}
      Retry
    </Button>
  );
}
