import Header from 'components/Header';
import FloatingInput from 'components/ui/FloatingInput';
import { Text } from 'components/ui/Text';
import React, { useState } from 'react';
import { Keyboard, Pressable, View } from 'react-native';

type CreateClassType = {
  name: string;
  subject: string;
  section: string;
  time: string;
  room: string;
  gmeetLink?: string;
};

const CreateClassScreen = () => {
  const [formData, setFormData] = useState<CreateClassType>({
    name: '',
    subject: '',
    section: '',
    time: '',
    room: '',
    gmeetLink: '',
  });

  const handleChange = (key: keyof CreateClassType, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Pressable className="flex-1 bg-slate-50" onPress={() => Keyboard.dismiss()}>
      <Header title="Create Class" />

      <View className="px-4 py-5">
        <FloatingInput
          label="Class Name"
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
        />
        <FloatingInput
          label="Subject"
          value={formData.subject}
          onChangeText={(text) => handleChange('subject', text)}
        />
        <FloatingInput
          label="Section"
          value={formData.section}
          onChangeText={(text) => handleChange('section', text)}
        />
        <FloatingInput
          label="Time"
          value={formData.time}
          onChangeText={(text) => handleChange('time', text)}
        />
        <FloatingInput
          label="Room"
          value={formData.room}
          onChangeText={(text) => handleChange('room', text)}
        />
        <FloatingInput
          label="Google Meet Link"
          value={formData.gmeetLink || ''}
          onChangeText={(text) => handleChange('gmeetLink', text)}
          inputProps={{ keyboardType: 'url' }}
        />
      </View>

      <View className="flex-row gap-3 px-4">
        <Pressable className="flex-1 items-center justify-center rounded-xl bg-green-600/80 p-3 active:opacity-80">
          <Text className="text-lg font-medium text-white">Create Class</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

export default CreateClassScreen;
