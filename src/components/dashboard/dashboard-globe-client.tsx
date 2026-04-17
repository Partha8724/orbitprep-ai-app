"use client";

import dynamic from "next/dynamic";

export const DashboardGlobeClient = dynamic(
  () => import("@/components/dashboard/orbit-globe").then((module) => module.OrbitGlobe),
  { ssr: false }
);
