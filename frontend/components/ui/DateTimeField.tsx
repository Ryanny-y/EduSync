import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { Text } from './Text';

type Props = {
  label: string;
  value?: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
};

const DateTimeField = ({ label, value, onChange, placeholder = 'Select date & time' }: Props) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (event.type === 'set' && selectedDate) {
      const newDate = new Date(value ?? new Date());
      newDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );

      onChange(newDate);
      setShowTimePicker(true);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);

    if (event.type === 'set' && selectedTime) {
      const newDate = new Date(value ?? new Date());
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());

      onChange(newDate);
    }
  };

  return (
    <View className="flex-1">
      <Text className="mb-2 text-sm font-bold uppercase text-gray-400">{label}</Text>

      <Pressable
        onPress={() => setShowDatePicker(true)}
        className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-5">
        <Text>{value ? dayjs(value).format('MMM D, YYYY h:mm A') : `${placeholder}`}</Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          minimumDate={dayjs().startOf('day').toDate()}
          value={value ?? new Date()}
          mode="date"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker value={value ?? new Date()} mode="time" onChange={handleTimeChange} />
      )}
    </View>
  );
};

export default DateTimeField;
