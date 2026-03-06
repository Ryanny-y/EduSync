import { Text as RNText, TextProps } from "react-native";
import { twMerge } from "tailwind-merge";

type Props = TextProps & {
  className?: string;
};

export function Text({ className, ...props }: Props) {
  return (
    <RNText
      {...props}
      className={twMerge("text-slate-800", className)}
    />
  );
}