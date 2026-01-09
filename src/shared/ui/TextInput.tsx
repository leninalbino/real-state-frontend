import type { InputHTMLAttributes } from "react";

type TextInputVariant = "unstyled" | "base" | "search";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  wrapperClassName?: string;
  variant?: TextInputVariant;
};

const variantStyles: Record<TextInputVariant, string> = {
  unstyled: "",
  base:
    "w-full border border-gray-300 px-3 py-2 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-blue-200 outline-none",
  search:
    "w-full bg-[#eef9fd] border-none py-3 pl-10 pr-12 rounded-md text-base text-gray-600 focus:ring-2 focus:ring-blue-200 outline-none",
};

export const TextInput = ({
  className = "",
  wrapperClassName = "",
  variant = "base",
  ...props
}: TextInputProps) => (
  <div className={`relative ${wrapperClassName}`}>
    <input
      {...props}
      className={`${variantStyles[variant]} ${className}`}
    />
  </div>
);
