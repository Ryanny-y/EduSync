import React from "react";
import { PressableProps, Pressable as RNPressable } from "react-native";
import { twMerge } from "tailwind-merge";

interface Props extends PressableProps {
  className?: string;
}

const Pressable = ({ children, className, ...props } : Props) => {
  return (
    <RNPressable
      {...props}
      className={twMerge("active:opacity-90", className)}
    >
      {children}
    </RNPressable>
  );
};

export default Pressable;