import React from 'react';
import { TextInput, View } from 'react-native';
import { Text } from './Text';

type FormTextAreaProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  inputProps?: React.ComponentProps<typeof TextInput>;
  maxLength?: number;
  placeholder?: string;
};

const FormTextArea = ({
  label,
  value,
  onChangeText,
  inputProps,
  maxLength,
  placeholder,
}: FormTextAreaProps) => {
  return (
    <View className="gap-2">
      <Text className="text-sm font-bold uppercase text-gray-400">{label}</Text>

      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="top"
        numberOfLines={4}
        maxLength={maxLength}
        className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-4 min-h-[120px] placeholder:text-gray-500"
        {...inputProps}
      />
    </View>
  );
};

export default FormTextArea;