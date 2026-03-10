import { ScrollView, View } from 'react-native';
import Header from './class-details/Header';
import { useState, useRef } from 'react';
import { Text } from 'components/ui/Text';
import Pressable from 'components/ui/Pressable';
import PagerView from 'react-native-pager-view';
import StreamTab from './class-details/StreamTab';
import StudentTab from './class-details/StudentTab';

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
          <StreamTab />
        </View>

        {/* Students */}
        <View key="1" className="w-full flex-1 px-4 py-10">
          {/* <StudentTab classId={}/> */}
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
