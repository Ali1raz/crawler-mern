"use client";

import { useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { singleUrlImportSchema } from "@/app/dashboard/import/schema";
import { useRouter } from "next/navigation";
import { scrapeUrlAction } from "../action";

export function SingleUrlImportForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      url: "",
    },
    validators: {
      onSubmit: singleUrlImportSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const result = await scrapeUrlAction(value.url);
        if (result.success) {
          toast.success("URL scraped successfully!");
          router.push("/dashboard");
        } else {
          toast.error(result.error || "Failed to scrape URL");
        }
      });
    },
  });

  return (
    <div className="grid gap-4 w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="url">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="https://example.com"
                    autoComplete="url"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 data-icon="inline-start" className="animate-spin" />
                Processing...
              </>
            ) : (
              "Import Url"
            )}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
