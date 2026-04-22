# Next.js Flexible Component System

A Next.js project demonstrating how to build reusable, flexible UI components using Tailwind CSS. This repo is intended as a tutorial for separating components from the main layout in a clean and scalable way.

---

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## Project Structure

```
app/
  ui/
    component/
      Button.tsx       # Reusable button component
  page.tsx             # Main page consuming components
  layout.tsx           # Root layout with font and global config
  globals.css          # Global styles and Tailwind directives
```

---

## Font Setup

This project uses `next/font` to load **Poppins** from Google Fonts. Fonts are optimized at build time — no external requests at runtime, no flash of unstyled text.

```tsx
// app/layout.tsx
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
```

The font is applied via `poppins.className` on the `<body>` tag. The `variable` option additionally registers `--font-poppins` as a CSS custom property for use in Tailwind or plain CSS.

---

## How to Build Flexible Components

The core idea is to define a component's visual options as TypeScript union types, then map each option to a Tailwind class string. The component accepts these options as props and merges them at render time.

### Step 1 — Define your variant and size types

```ts
type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size    = "sm" | "md" | "lg";
```

Using union types instead of plain `string` gives you autocomplete, type safety, and a clear contract for consumers of the component.

### Step 2 — Map each option to Tailwind classes

```ts
const variants: Record<Variant, string> = {
  primary:   "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-yellow-500 text-white hover:bg-yellow-600",
  danger:    "bg-red-500 text-white hover:bg-red-600",
  ghost:     "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};
```

Using `Record<Type, string>` ensures every variant and size is accounted for. If you add a new type later and forget to add its class mapping, TypeScript will throw a compile error.

### Step 3 — Accept native HTML props via intersection types

```tsx
export function Button({
  variant = "primary",
  size    = "md",
  className = "",
  children,
  ...props
}: {
  variant?:  Variant;
  size?:     Size;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
```

The `& React.ButtonHTMLAttributes<HTMLButtonElement>` part means the component automatically accepts all native button attributes — `onClick`, `disabled`, `type`, `aria-*`, and so on — without you having to declare each one manually.

### Step 4 — Merge classes at render time

```tsx
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium rounded-md transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
```

The `className` prop at the end lets consumers pass additional Tailwind classes to override or extend styling without modifying the component itself.

---

## Available Components

### Button

Located at `app/ui/component/Button.tsx`.

```tsx
import { Button } from "@/app/ui/component/Button";

<Button variant="primary" size="sm">Primary Small</Button>
<Button variant="primary" size="md">Primary Medium</Button>
<Button variant="primary" size="lg">Primary Large</Button>
<Button variant="danger"  size="md">Delete</Button>
<Button variant="ghost"   size="md">Cancel</Button>
```

**Props:**

| Prop        | Type                                      | Default     | Description                              |
|-------------|-------------------------------------------|-------------|------------------------------------------|
| `variant`   | `primary` `secondary` `danger` `ghost`    | `primary`   | Controls color and style                 |
| `size`      | `sm` `md` `lg`                            | `md`        | Controls padding and font size           |
| `className` | `string`                                  | `""`        | Additional Tailwind classes to merge in  |
| `children`  | `ReactNode`                               | required    | Button label or content                  |
| `...props`  | `ButtonHTMLAttributes`                    | —           | Any native button attribute              |

---

## Extending the Pattern

The same pattern can be applied to any component. To add a new component:

1. Create a file under `app/ui/component/`.
2. Define union types for each dimension of variation (variant, size, state, etc.).
3. Create a `Record` map from each type to its Tailwind class string.
4. Spread native HTML attributes using the appropriate `React.*HTMLAttributes` intersection type.
5. Merge all class strings and the consumer's `className` in the return statement.

Example for an Input component:

```tsx
// app/ui/component/Input.tsx
type InputSize = "sm" | "md" | "lg";

const sizes: Record<InputSize, string> = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2 text-base",
  lg: "px-4 py-3 text-lg",
};

export function Input({
  size = "md",
  error,
  label,
  className = "",
  ...props
}: {
  size?:      InputSize;
  error?:     string;
  label?:     string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={`w-full border rounded-md outline-none transition
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? "border-red-500" : "border-gray-300"}
          ${sizes[size]}
          ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
```

---

## Key Principles

**Separate concerns.** Components live in `ui/component/`, pages live in `app/`. Pages consume components; they do not define styles.

**Use TypeScript union types for variants.** Avoid plain strings. Union types make props self-documenting and catch typos at compile time.

**Always pass through native HTML attributes.** Using `& React.*HTMLAttributes` means consumers can use `onClick`, `disabled`, `aria-label`, and any other standard attribute without extra work.

**Allow className overrides.** Appending a consumer-supplied `className` to the end of the class string lets any component be customized one-off without creating a new variant.

**Keep mapping objects outside the component function.** Defining `variants` and `sizes` as module-level constants means they are not recreated on every render.

---

## Tech Stack

- [Next.js 14+](https://nextjs.org) with App Router
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) for Poppins