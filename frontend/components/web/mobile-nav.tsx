"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { XIcon, MenuIcon } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useSession,
} from "@clerk/nextjs";
import { Portal, PortalBackdrop } from "../ui/portal";
import { Separator } from "../ui/separator";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { isLoaded, isSignedIn } = useSession();

  return (
    <div className="md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
      >
        {open ? (
          <XIcon className="size-4.5" />
        ) : (
          <MenuIcon className="size-4.5" />
        )}
      </Button>
      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop />
          <div
            className={cn(
              "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
              "size-full p-4",
            )}
            data-slot={open ? "open" : "closed"}
          >
            <div className="mt-12 flex flex-col gap-2">
              {isLoaded && isSignedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className={buttonVariants({ className: "w-full" })}
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/import"
                    className={buttonVariants({
                      className: "w-full",
                      variant: "outline",
                    })}
                    onClick={() => setOpen(false)}
                  >
                    Import
                  </Link>
                  <Separator className="my-2" />
                  <div className="ml-auto">
                    <Show when="signed-in">
                      <UserButton />
                    </Show>
                  </div>
                </>
              ) : (
                <Show when="signed-out">
                  <div className="flex items-center gap-2">
                    <SignInButton mode="modal">
                      <Button>Login</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button>Sign Up</Button>
                    </SignUpButton>
                  </div>
                </Show>
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
