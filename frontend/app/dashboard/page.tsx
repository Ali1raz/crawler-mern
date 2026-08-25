import Link from 'next/link';
import { Suspense } from 'react';
import { User, Clock } from 'lucide-react';

import { getSavedItems } from '@/data/saved-items';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { CopyToClipboardButton } from './_components/copy-to-clipboard-button';
import { RetryButton } from './_components/retry-button';
import { DeleteButton } from './_components/delete-button';
import type { SavedItem } from '@/types/saved-item';

function ItemsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="overflow-hidden pt-0">
          <Skeleton className="aspect-video w-full rounded-none" />
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="size-8 rounded-md" />
            </div>
            <Skeleton className="h-5 w-full mt-1" />
            <Skeleton className="h-5 w-3/4" />
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SavedItemCard({ item }: { item: SavedItem }) {
  const href = `/dashboard/items/${item._id}`;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg pt-0">
      <Link href={href} className="block">
        <div className="aspect-video w-full overflow-hidden bg-muted">
          {item.ogImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={item.ogImage}
              alt={item.title || 'Saved Item Thumbnail'}
              className="w-full h-full hover:scale-105 transition-transform object-cover"
            />
          ) : null}
        </div>
      </Link>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Badge variant={item.status === 'COMPLETED' ? 'default' : 'secondary'}>
            {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
          </Badge>
          <div className="flex items-center gap-1">
            {item.status === 'FAILED' && <RetryButton itemId={item._id} />}
            <DeleteButton itemId={item._id} />
            <CopyToClipboardButton link={item.url} />
          </div>
        </div>
        <CardTitle className="group-hover:text-primary text-xl leading-normal font-semibold hover:underline line-clamp-2 transition-colors underline-offset-4">
          <Link href={href}>{item.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center mt-auto justify-between">
        <p className="flex items-center gap-2">
          <User className="size-4" />
          {item.author || 'Unknown Author'}
        </p>
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          <Clock className="size-4" />
          {new Date(item.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </CardContent>
    </Card>
  );
}

async function SavedItemsList() {
  const items = await getSavedItems();

  if (items.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No saved items yet</EmptyTitle>
          <EmptyDescription>
            Import a URL to start building your collection.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <SavedItemCard key={item._id} item={item} />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Saved Items</h1>
        <p className="text-sm text-muted-foreground">
          Your scraped and saved content.
        </p>
      </div>
      <Suspense fallback={<ItemsSkeleton />}>
        <SavedItemsList />
      </Suspense>
    </div>
  );
}
