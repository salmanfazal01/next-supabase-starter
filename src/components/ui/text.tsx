import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-bold tracking-tight lg:text-7xl text-foreground leading-[110%]",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight lg:text-6xl first:mt-0 text-foreground leading-[115%]",
      h3: "scroll-m-20 text-2xl font-medium tracking-tight lg:text-5xl text-foreground leading-[118%]",
      h4: "scroll-m-20 text-xl font-medium tracking-tight lg:text-4xl text-foreground leading-[120%]",
      h5: "scroll-m-20 text-lg font-medium tracking-tight lg:text-2xl text-foreground leading-[125%]",
      h6: "scroll-m-20 text-base font-medium tracking-tight lg:text-xl text-foreground leading-[130%]",
      p: "leading-7 text-foreground",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold text-foreground",
      small: "text-sm text-foreground",
      muted: "text-sm text-muted-foreground",
    },
    font: {
      default: "", // Uses HaasGrotText
      majesty: "font-heading", // Uses Majesty
      notes: "font-notes", // Uses RedditMono
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
      "7xl": "text-7xl",
      "8xl": "text-8xl",
      "9xl": "text-9xl",
    },
    weight: {
      300: "font-light",
      400: "font-normal",
      500: "font-medium",
      600: "font-semibold",
      700: "font-bold",
      800: "font-extrabold",
    },
  },
  defaultVariants: {
    variant: "p",
    font: "default",
  },
});

type TypographyElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
type FontVariant = "default" | "majesty" | "notes";
type SizeVariant =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";
type WeightVariant = 300 | 400 | 500 | 600 | 700 | 800;

const variantElementMap: Record<
  NonNullable<VariantProps<typeof typographyVariants>["variant"]>,
  TypographyElement
> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  lead: "p",
  large: "p",
  small: "span",
  muted: "span",
};

interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof typographyVariants> {
  as?: TypographyElement;
  font?: FontVariant;
  size?: SizeVariant;
  weight?: WeightVariant;
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      variant = "p",
      font = "default",
      size,
      weight,
      as,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as ?? variantElementMap[variant!];

    return React.createElement(
      Component,
      {
        className: cn(
          typographyVariants({ variant, font, size, weight, className })
        ),
        ref,
        ...props,
      },
      children
    );
  }
);

Text.displayName = "Text";

export { Text, typographyVariants };
export type { TextProps };
