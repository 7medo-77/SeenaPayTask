"use client";

import { ReactNode } from "react";
import PostNavigationComponent from "@/app/components/authorized/navigation/post-navigation.component";

interface ViewPostLayoutProps {
  children: ReactNode;
}

export default function ViewPostLayout({ children }: ViewPostLayoutProps) {
  return (
    <div>
      <PostNavigationComponent />
      {children}
    </div>
  );
}
