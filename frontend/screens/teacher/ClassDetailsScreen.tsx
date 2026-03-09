import { ScrollView, View } from 'react-native';
import Header from './class-details/Header';
import { useState, useRef } from 'react';
import { Text } from 'components/ui/Text';
import Pressable from 'components/ui/Pressable';
import { EllipsisVertical, MessageSquare } from 'lucide-react-native';
import PagerView from 'react-native-pager-view';

const TABS = ['Stream', 'Students', 'Lessons', 'Works'] as const;
type Tab = (typeof TABS)[number];

const ClassDetailsScreen = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>('Stream');
  const pagerRef = useRef<PagerView>(null);

  const onPageSelected = (e: any) => {
    const index = e.nativeEvent.position;
    setSelectedTab(TABS[index]);
  };

  return (
    <View className="w-full flex-1 items-center justify-start bg-background">
      <Header />

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        className="grow-0 border-b border-slate-100 py-3">
        {TABS.map((tab, index) => {
          const active = tab === selectedTab;
          return (
            <Pressable
              key={tab}
              onPress={() => {
                setSelectedTab(tab);
                pagerRef.current?.setPage(index);
              }}
              className="relative mr-2 gap-2 px-5 py-2">
              <Text className={`text-lg font-bold ${active ? 'text-green-500' : 'text-slate-500'}`}>
                {tab}
              </Text>
              {active && (
                <View className="absolute -bottom-2.5 left-0 right-0 h-1 rounded-full bg-green-500" />
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* PagerView */}
      <PagerView
        style={{ flex: 1, width: '100%' }}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={onPageSelected}>
        {/* Stream */}
        <View key="0" className="w-full flex-1 px-4 py-10">
          <Text className="text-lg font-bold">Stream Content</Text>
        </View>

        {/* Students */}
        <View key="1" className="w-full flex-1 px-4 py-10">
          <View className="gap-7">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold uppercase">Enrolled Students (5)</Text>
              <Pressable>
                <Text className="font-semibold text-green-500">Add Student</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center justify-between rounded-xl border border-slate-300 p-4">
                  <View className="flex-row items-center gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-green-500">
                      <Text className="font-semibold text-white">JD</Text>
                    </View>
                    <View>
                      <Text className="text-xl font-bold text-slate-800">Juan Dela Cruz</Text>
                      <Text className="text-sm font-semibold">ID: 24-1367</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-5">
                    <Pressable>
                      <MessageSquare size={20} color="#90CF8E" />
                    </Pressable>
                    <Pressable>
                      <EllipsisVertical size={20} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Lessons */}
        <View key="2" className="w-full flex-1 px-4 py-10">
          <Text className="text-lg font-bold">Lessons Content</Text>
        </View>

        {/* Works */}
        <View key="3" className="w-full flex-1 px-4 py-10">
          <Text className="text-lg font-bold">Works Content</Text>
        </View>
      </PagerView>
    </View>
  );
};

export default ClassDetailsScreen;
