import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";
import { useEffect, useState } from "react";
import { CircleAlert, CircleCheck, CircleX, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils"; // Đảm bảo bạn có utility cn

export function Toaster() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SonnerToaster
      position="top-center"
      theme={
        theme === "light" || theme === "dark" || theme === "system"
          ? theme
          : "light"
      }
      className="flex justify-center"
      expand={true}
      toastOptions={{
        style: {
          margin: "0 auto",
          width: "fit-content",
          minWidth: "100px",
          maxWidth: "90vw",
          backgroundColor: "transparent",
        },
        classNames: {
          toast: cn(
            "relative overflow-hidden",

            // Optimized glass effect
            "bg-gradient-to-br from-white/50 via-white/35 to-white/25",
            "dark:from-gray-900/70 dark:via-gray-900/50 dark:to-gray-900/40",

            // High performance blur
            "backdrop-blur-[48px]",
            "-webkit-backdrop-blur-[48px]",

            // Simple border
            "border border-white/50 dark:border-white/30",

            // Optimized shadows
            "shadow-2xl shadow-black/10",
            "dark:shadow-2xl dark:shadow-black/40",

            // Subtle inner highlight
            "shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]",
            "dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]",

            // Liquid animation với hiệu suất tốt
            "after:absolute after:inset-0",
            "after:bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.3)_50%,transparent_80%)]",
            "after:dark:bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.2)_50%,transparent_80%)]",
            "after:animate-shimmer after:bg-[length:200%_100%]",

            "rounded-3xl p-4",
            "transition-all duration-300"
          ),
          title: cn(
            "font-medium text-base",
            "text-gray-800 dark:text-gray-100"
          ),
          description: cn("text-sm", "text-gray-600 dark:text-gray-300"),
          actionButton: cn(
            "rounded-lg px-3 py-1 text-sm font-medium",
            "bg-white/20 hover:bg-white/30",
            "dark:bg-black/20 dark:hover:bg-black/30",
            "border border-white/30 dark:border-white/20",
            "transition-colors duration-200"
          ),
          cancelButton: cn(
            "rounded-lg px-3 py-1 text-sm font-medium",
            "bg-transparent hover:bg-white/10",
            "dark:hover:bg-black/20",
            "border border-white/20 dark:border-white/10",
            "transition-colors duration-200"
          ),
          closeButton: cn(
            "bg-white/20 hover:bg-white/30",
            "dark:bg-black/20 dark:hover:bg-black/30",
            "border border-white/30 dark:border-white/20",
            "rounded-full p-1 transition-colors duration-200"
          ),
        },
      }}
      icons={{
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        warning: <WarningIcon />,
        info: <InformationIcon />,
      }}
    />
  );
}

interface IconProps {
  size?: number;
}

const SuccessIcon = ({ size = 22 }: IconProps) => (
  <div className="relative">
    <CircleCheck
      size={size}
      className="text-green-500 drop-shadow-sm"
      strokeWidth={1.5}
    />
    <div className="absolute inset-0 animate-ping">
      <CircleCheck
        size={size}
        className="text-green-500/30"
        strokeWidth={1.5}
      />
    </div>
  </div>
);

const ErrorIcon = ({ size = 22 }: IconProps) => (
  <div className="relative">
    <CircleX
      size={size}
      className="text-red-500 drop-shadow-sm"
      strokeWidth={1.5}
    />
    <div className="absolute inset-0 animate-pulse">
      <CircleX size={size} className="text-red-500/30" strokeWidth={1.5} />
    </div>
  </div>
);

const InformationIcon = ({ size = 22 }: IconProps) => (
  <div className="relative">
    <CircleAlert
      size={size}
      className="text-blue-500 drop-shadow-sm"
      strokeWidth={1.5}
    />
    <div className="absolute inset-0 animate-pulse">
      <CircleAlert size={size} className="text-blue-500/30" strokeWidth={1.5} />
    </div>
  </div>
);

const WarningIcon = ({ size = 22 }: IconProps) => (
  <div className="relative">
    <TriangleAlert
      size={size}
      className="text-amber-500 drop-shadow-sm"
      strokeWidth={1.5}
    />
    <div className="absolute inset-0 animate-pulse">
      <TriangleAlert
        size={size}
        className="text-amber-500/30"
        strokeWidth={1.5}
      />
    </div>
  </div>
);
