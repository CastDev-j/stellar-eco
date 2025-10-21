import { cn } from "@/lib/cn";
import React from "react";

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  circle?: boolean;
  className?: string;
  animate?: boolean;
  "aria-label"?: string;
};

const toSizeClass = (v?: string | number) => {
  if (v === undefined) return undefined;
  if (typeof v === "number") return `${v}px`;
  return v;
};

const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  rounded = true,
  circle = false,
  className,
  animate = true,
  "aria-label": ariaLabel = "loading",
}) => {
  const style: React.CSSProperties = {
    width: toSizeClass(width),
    height: toSizeClass(height) || undefined,
  };

  const baseClasses = "bg-indigo-200/70 overflow-hidden";

  const shapeClasses = circle
    ? "rounded-full"
    : rounded
    ? "rounded-md"
    : "rounded-none";

  const animationClasses = animate ? "animate-pulse" : "";

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={cn(baseClasses, shapeClasses, className, animationClasses)}
      style={style}
    />
  );
};

export default Skeleton;
