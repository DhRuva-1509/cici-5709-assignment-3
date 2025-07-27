import type { ReactNode, HTMLAttributes } from 'react';

type BadgeProps = {
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Badge = ({ className, variant = "default", children, ...props }: BadgeProps) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    default: "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80",
    secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80",
    destructive: "border-transparent bg-red-500 text-gray-50 hover:bg-red-500/80",
    outline: "text-gray-950 border-gray-200"
  };

  const classes = `${baseClasses} ${variants[variant]} ${className || ""}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};