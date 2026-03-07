import { Animated, TextInput, View } from "react-native";
import { useRef, useEffect, useState } from "react";

type FloatingInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  inputProps?: React.ComponentProps<typeof TextInput>;
};

const FloatingInput = ({ label, value, onChangeText, inputProps }: FloatingInputProps) => {
  const [focused, setFocused] = useState(false);
  const animated = useRef(new Animated.Value(value ? 1 : 0)).current;

  // Animate when value changes (for pre-filled fields)
  useEffect(() => {
    Animated.timing(animated, {
      toValue: focused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused, value]);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const labelStyle = {
    top: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -10],
    }),
    fontSize: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 13],
    }),
  };

  return (
    <View
      className={`relative rounded-xl border-2 px-3 py-2 mb-4 ${
        focused ? "border-green-500" : "border-gray-300"
      }`}
    >
      <Animated.Text
        pointerEvents="none"
        style={labelStyle}
        className={`absolute left-2 bg-slate-50 px-1 ${
          focused ? "text-green-600" : "text-gray-500"
        }`}
      >
        {label}
      </Animated.Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="h-[40px] text-base"
        {...inputProps}
      />
    </View>
  );
};

export default FloatingInput;