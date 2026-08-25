import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowLeft, User, Calendar, Clock, ExternalLink } from 'lucide-react';

import { getSavedItem } from '@/data/saved-items';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ItemContent } from './_components/item-content';
import { RetryButton } from '../../_components/retry-button';
import { DeleteButton } from '../../_components/delete-button';

function ItemDetailsSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 flex flex-col gap-6">
      <Skeleton className="h-8 w-16" />
      <Card className="overflow-hidden pt-0">
        <Skeleton className="aspect-video w-full rounded-none" />
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
          <Skeleton className="h-7 w-3/4 mt-1" />
          <Skeleton className="h-4 w-full mt-1" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

async function ItemDetails({ itemId }: { itemId: string }) {
  const item = await getSavedItem(itemId);


  if (!item) {
    notFound();
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 flex flex-col gap-6">
      <Button variant="ghost" size="sm" asChild className="w-fit">
        <Link href="/dashboard">
          <ArrowLeft data-icon="inline-start" />
          Back
        </Link>
      </Button>

      <Card className="overflow-hidden pt-0">
        {item.ogImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.ogImage}
            alt={item.title || 'Cover image'}
            className="aspect-video w-full object-cover"
          />
        ) : null}
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant={item.status === 'COMPLETED' ? 'default' : 'secondary'}
            >
              {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
            </Badge>
            <div className="flex items-center gap-2">
              {item.status === 'FAILED' && <RetryButton itemId={item._id} />}
              <DeleteButton itemId={item._id} />
              <Button variant="outline" size="sm" asChild>
                <a href={item.url} target="_blank" rel="noreferrer">
                  <ExternalLink data-icon="inline-start" />
                  Open source
                </a>
              </Button>
            </div>
          </div>
          <CardTitle className="text-2xl leading-normal font-semibold">
            {item.title}
          </CardTitle>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-primary hover:underline truncate"
          >
            {item.url}
          </a>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <User className="size-4" />
              {item.author || 'Unknown Author'}
            </span>
            {item.publishedAt ? (
              <span className="flex items-center gap-2">
                <Calendar className="size-4" />
                {new Date(item.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            ) : null}
            <span className="flex items-center gap-2">
              <Clock className="size-4" />
              Saved{' '}
              {new Date(item.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <Separator />
          <ItemContent content={item.content ?? ''} />
        </CardContent>
      </Card>
    </div>
  );
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;

  return (
    <Suspense fallback={<ItemDetailsSkeleton />}>
      <ItemDetails itemId={itemId} />
    </Suspense>
  );
}
