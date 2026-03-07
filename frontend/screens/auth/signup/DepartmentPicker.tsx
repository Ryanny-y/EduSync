import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text } from 'components/ui/Text';
import { useEffect, useState } from 'react';
import { API_URL } from 'config/constant';

type Department = {
  id: string;
  name: string;
};

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
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`${API_URL}/department`);
        const data = await res.json();

        setDepartments(data.data);
      } catch (err) {
        console.error('Failed to fetch departments', err);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <View className="mb-3 gap-[6px]">
      <Text className="font-semibold text-slate-500">Department</Text>

      <View
        className={`rounded-xl border ${error ? 'border-red-500' : 'border-slate-200'}`}
      >
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onChange(itemValue)}
        >
          <Picker.Item label="Select Department" value="" />

          {departments.map((dept) => (
            <Picker.Item
              key={dept.id}
              label={dept.name}
              value={dept.id}
            />
          ))}
        </Picker>
      </View>

      {error && <Text className="text-sm text-red-500">{error}</Text>}
    </View>
  );
}