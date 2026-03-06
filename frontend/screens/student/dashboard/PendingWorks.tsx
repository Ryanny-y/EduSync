import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Text } from "components/ui/Text"
import { ChevronRight, CircleAlert, Clock } from "lucide-react-native"
import { TouchableOpacity, View } from "react-native"
import { StudentStackParamList } from "types/navigation"

type PendingWorksNavigationProps = NativeStackNavigationProp<StudentStackParamList, "StudentWorksScreen">;

const PendingWorks = () => {
  const navigation = useNavigation<PendingWorksNavigationProps>();

  return (
    <View className="gap-5">
      {/* Title */}
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold">Pending Works</Text>

        <TouchableOpacity onPress={() => navigation.navigate("StudentWorksScreen")}>
          <Text className="font-bold text-green-600">View All</Text>
        </TouchableOpacity>
      </View>

      {/* Works Container */}
      <View className="gap-4"> 
        <View className="flex-row bg-white gap-3 p-5 rounded-xl items-center">
          <View className="p-4 bg-green-100 rounded-xl">
            <Clock size={28} color="#16a34a"/>
          </View>
          
          <View className="gap-0.5">
            <Text className="font-bold text-xs text-slate-500">MATHEMATICS</Text>
            <Text className="text-xl font-bold">Calculus Quiz 2</Text>
            <Text className="text-slate-500 font-medium text-xs">Today, 11:59 PM</Text>
          </View>

          <View className="justify-self-end ml-auto">
            <ChevronRight color='#64748b'/>
          </View>
        </View>

        <View className="flex-row bg-white gap-3 p-5 rounded-xl items-center">
          <View className="p-4 bg-green-100 rounded-xl">
            <Clock size={28} color="#16a34a"/>
          </View>
          
          <View className="gap-0.5">
            <Text className="font-bold text-xs text-slate-500">PHYSICS</Text>
            <Text className="text-xl font-bold">Lab Report</Text>
            <Text className="text-slate-500 font-medium text-xs">Today, 11:59 PM</Text>
          </View>

          <View className="justify-self-end ml-auto">
            <ChevronRight color='#64748b'/>
          </View>
        </View>

        <View className="flex-row bg-white gap-3 p-5 rounded-xl items-center">
          <View className="p-4 bg-red-50 rounded-xl">
            <CircleAlert size={28} color="#dc2626"/>
          </View>
          
          <View className="gap-0.5">
            <Text className="font-bold text-xs text-slate-500">HISTORY</Text>
            <Text className="text-xl font-bold">Essay</Text>
            <Text className="text-slate-500 font-medium text-xs text-">Overdue</Text>
          </View>

          <View className="justify-self-end ml-auto">
            <ChevronRight color='#64748b'/>
          </View>
        </View>
      </View>
    </View>
  )
}

export default PendingWorks