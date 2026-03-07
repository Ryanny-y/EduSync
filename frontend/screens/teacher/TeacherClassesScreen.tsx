import ClassCard from "components/ClassCard"
import Header from "components/Header"
import TeacherClassCard from "components/TeacherClassCard";
import { ScrollView, View } from "react-native"

const classes = [
  {
    id: 1,
    title: 'Algebra & Trigonometry',
    teacher: 'Mr. Cruz',
    section: '10-Section A',
    time: '8:00 - 9:00 AM',
    room: '203',
    color: 'bg-indigo-500',
    students: 35
  },
  {
    id: 2,
    title: 'Algebra & Trigonometry',
    teacher: 'Mr. Cruz',
    section: '10-Section A',
    time: '8:00 - 9:00 AM',
    room: '203',
    color: 'bg-orange-300',
    students: 35
  },
  {
    id: 3,
    title: 'Algebra & Trigonometry',
    teacher: 'Mr. Cruz',
    section: '10-Section A',
    time: '8:00 - 9:00 AM',
    room: '203',
    color: 'bg-yellow-400',
    students: 35
  },
];

const TeacherClassesScreen = () => {
  return (
    <View className="flex-1 bg-slate-50">
      <Header title="My Classes" />

      <ScrollView
        className="px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        {classes.map((item) => (
          <TeacherClassCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  )
}

export default TeacherClassesScreen