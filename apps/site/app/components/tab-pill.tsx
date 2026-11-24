import { motion } from "motion/react";

/**
 * The pill behind the chosen tab. It lives inside the chosen tab, so it is right from the first paint,
 * and glides to a newly chosen tab without bouncing. Tabs that share a `group` share one pill.
 */
export function TabPill({ group }: { group: string }) {
  return (
    <motion.span
      layoutId={`tab-pill-${group}`}
      initial={false}
      transition={{ type: "spring", duration: 0.26, bounce: 0 }}
      className="absolute inset-0 rounded-md bg-white shadow-xs ring-1 ring-black/[0.06] dark:bg-neutral-800 dark:shadow-none dark:ring-white/[0.06]"
      style={{ borderRadius: 6 }}
    />
  );
}
