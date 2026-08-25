"use client";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { useScroll } from "@/hooks/use-scroll";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useSession,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { MobileNav } from "./mobile-nav";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function Header() {
  const scrolled = useScroll(10);
  const { isLoaded, session } = useSession();

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-transparent border-b", {
        "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
          scrolled,
      })}
    >
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center px-4">
        <Link className="p-2" href="/">
          <Image alt="Logo" height="36" src="/logo.png" width="36" />
        </Link>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          {isLoaded && session ? (
            <>
              <ThemeToggle />
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>Dashboard</MenubarTrigger>
                  <MenubarContent>
                    <MenubarRadioGroup>
                        <Link
                          href="/dashboard"
                        >
                      <MenubarItem>
                          Dashboard
                      </MenubarItem>
                        </Link>
                        <Link
                          href="/dashboard/import"
                        >
                      <MenubarItem>
                          Import
                      </MenubarItem>
                        </Link>
                    </MenubarRadioGroup>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>

              <Show when="signed-in">
                <UserButton />
              </Show>
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
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
