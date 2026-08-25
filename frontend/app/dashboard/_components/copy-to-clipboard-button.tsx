'use client';

import { Copy } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export function CopyToClipboardButton({ link }: { link: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Copy link"
      onClick={() => {
        navigator.clipboard.writeText(link);
        toast.success('Link copied to clipboard');
      }}
    >
      <Copy data-icon="inline-start" />
    </Button>
  );
}
