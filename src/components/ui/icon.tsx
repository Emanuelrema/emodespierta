import * as Icons from "lucide-react";

interface IconProps extends Omit<React.ComponentProps<"svg">, "ref"> {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className, ...props }: IconProps) {
  const LucideIcon = (Icons as any)[name];
  if (!LucideIcon) {
    return <Icons.HelpCircle size={size} className={className} {...props} />;
  }
  return <LucideIcon size={size} className={className} {...props} />;
}
