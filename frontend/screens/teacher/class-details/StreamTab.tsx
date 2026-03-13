import { Text } from 'components/ui/Text';
import { ScrollView, View } from 'react-native';

const StreamTab = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Text className="text-lg font-bold">StreamTab Content</Text>
      </View>
    </ScrollView>
  );
};

export default StreamTab;
