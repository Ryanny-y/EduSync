import React from 'react';
import { TextInput, View } from 'react-native';
import { Text } from './Text';

type FormInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  inputProps?: React.ComponentProps<typeof TextInput>;
  maxLength?: number;
  placeholder?: string;
};

const FormInput = ({ label, value, onChangeText, inputProps, maxLength, placeholder }: FormInputProps) => {
  
  return (
    <View className="gap-2 ">
      <Text className="text-sm font-bold uppercase text-gray-400">{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 rounded-lg border border-gray-200 bg-gray-100 px-3 py-4 placeholder:text-gray-500"
        maxLength={maxLength}
        {...inputProps}
      />
    </View>
  );
};

export default FormInput;
