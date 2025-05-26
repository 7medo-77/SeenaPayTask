"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/posts/view/all", label: "All Posts" },
  { href: "/posts/view/my-posts", label: "My Posts" },
];

export default function PostNavigationComponent() {
  const pathname = usePathname();

  return (
    <nav className="mb-5 flex justify-center space-x-2 border-b border-t">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-blue-50 rounded-none border-b-2 border-blue-500 text-blue-600 font-semibold hover:bg-blue-100"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
