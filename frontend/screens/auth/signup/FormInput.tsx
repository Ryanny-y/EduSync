import { View, TextInput} from 'react-native';
import { Text } from 'components/ui/Text';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import Pressable from 'components/ui/Pressable';

type Props = {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  secure?: boolean;
  show?: boolean;
  toggleShow?: () => void;
  keyboardType?: 'default' | 'email-address';
  maxLength?: number;
  onChange: (value: string) => void;
};

export default function FormInput({
  label,
  value,
  placeholder,
  error,
  secure,
  show,
  toggleShow,
  keyboardType = 'default',
  maxLength,
  onChange,
}: Props) {
  return (
    <View className="mb-3 gap-[6px]">
      <Text className="font-semibold text-slate-500">{label}</Text>

      <View
        className={`rounded-xl border px-3 py-2 ${
          error ? 'border-red-500' : 'border-slate-200'
        } flex-row items-center`}>
        
        {secure && <Lock size={16} color="#94a3b8" />}

        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={onChange}
          className="ml-2 flex-1 text-base"
          secureTextEntry={secure && !show}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
          placeholderTextColor="#94a3b8"
        />

        {toggleShow && (
          <Pressable onPress={toggleShow}>
            {show ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
          </Pressable>
        )}
      </View>

      {error && <Text className="text-sm text-red-500">{error}</Text>}
    </View>
  );
}