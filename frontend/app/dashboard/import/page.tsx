import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SingleUrlImportForm } from './_components/single-url-import-form';

export default function DashboardPage() {
  return (
    <div className="flex w-full justify-center items-center p-4 h-screen">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Import URL</CardTitle>
          <CardDescription>
            Enter a website URL to scrape its content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SingleUrlImportForm />
        </CardContent>
      </Card>
    </div>
  );
}
