import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text } from 'components/ui/Text';

type DepartmentPickerProps = {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
};

export default function DepartmentPicker({
  value,
  onChange,
  error,
}: DepartmentPickerProps) {
  return (
    <View className="mb-3 gap-[6px]">
      <Text className="font-semibold text-slate-500">Department</Text>

      <View
        className={`rounded-xl border ${error ? 'border-red-500' : 'border-slate-200'}`}>
        <Picker selectedValue={value} onValueChange={(itemValue) => onChange(itemValue)}>
          <Picker.Item label="Select Department" value="" />
          <Picker.Item label="SOCSCI" value="SOCSCI" />
          <Picker.Item label="NATSCI" value="NATSCI" />
          <Picker.Item label="ENGSOC" value="ENGSOC" />
          <Picker.Item label="MAPS" value="MAPS" />
          <Picker.Item label="ICT" value="ICT" />
        </Picker>
      </View>

      {error && <Text className="text-sm text-red-500">{error}</Text>}
    </View>
  );
}