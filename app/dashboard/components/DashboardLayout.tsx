"use client";

import { motion } from "framer-motion";
import { springItem, staggerContainer } from "@/lib/animations";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <motion.div
      className="w-full max-w-full space-y-6 overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export const dashboardItem = {
  ...springItem,
};
