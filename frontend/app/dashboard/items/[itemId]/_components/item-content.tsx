'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageResponse } from '@/components/ai-elements/message';

export function ItemContent({ content }: { content: string }) {
  const [contentOpen, setContentOpen] = useState(false);

  if (!content) {
    return <p className="text-sm text-muted-foreground">No content available.</p>;
  }

  return (
    <Collapsible open={contentOpen} onOpenChange={setContentOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="font-medium">See Full Content</span>
          <ChevronDown
            data-icon="inline-end"
            className={cn(
              contentOpen && 'rotate-180',
              'transition-transform duration-200'
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mt-2">
          <CardContent>
            <MessageResponse>{content}</MessageResponse>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
