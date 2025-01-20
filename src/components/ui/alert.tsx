import * as React from "react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "warning";
}

export function Alert({
  children,
  className = "",
  variant = "default",
  ...props
}: AlertProps) {
  const variantClasses =
    variant === "warning"
      ? "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-200"
      : "bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800";

  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 flex items-start gap-3 ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertDescription({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  );
}
