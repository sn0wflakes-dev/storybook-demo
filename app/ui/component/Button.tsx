type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size    = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
    primary:   "bg-blue-500 text-white hover:bg-primary-hover",
    secondary: "bg-secondary text-white hover:bg-secondary-hover",
    danger:    "bg-danger text-white hover:bg-danger-hover",
    ghost:     "bg-transparent border border-gray-300 text-gray-700 hover:bg-muted",
};

const sizes: Record<Size, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
};

export function Button(
    {variant = "primary", size = "md", className = "", children, ...props}:
        { variant?: Variant; size?: Size; className?: string }
        & React.ButtonHTMLAttributes<HTMLButtonElement>)
{
    return (
        <button
            className={`inline-flex items-center justify-center font-medium rounded-md transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}