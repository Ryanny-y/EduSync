import { View } from "react-native";
import { Text } from "components/ui/Text";

type StatusBadgeProps = {
  label: string;
  icon?: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
};

const StatusBadge = ({
  label,
  icon,
  bgColor = "#f1f5f9",
  borderColor = "#e2e8f0",
  textColor = "#64748b",
}: StatusBadgeProps) => {
  return (
    <View
      className="flex-row items-center px-2.5 py-1 rounded-full border"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      {icon}
      <Text
        className="text-[10px] font-bold ml-1"
        style={{ color: textColor }}
      >
        {label}
      </Text>
    </View>
  );
};

export default StatusBadge;