import { AlertTriangle } from "lucide-react-native";
import { Modal, Pressable, View } from "react-native";
import { Text } from "./ui/Text";

interface DeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className: string;
}

const DeleteConfirmationModal = ({ visible, onClose, onConfirm, className }: DeleteModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50 px-4">
        <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
          {/* Icon */}
          <View className="items-center mb-4">
            <View className="rounded-full bg-red-100 p-4">
              <AlertTriangle size={32} color="#ef4444" />
            </View>
          </View>

          {/* Title */}
          <Text className="text-center text-xl font-bold text-slate-900 mb-2">
            Delete Class?
          </Text>

          {/* Message */}
          <Text className="text-center text-slate-500 mb-6 leading-5">
            Are you sure you want to delete <Text className="font-semibold text-slate-700">"{className}"</Text>? This action cannot be undone and all associated data will be permanently removed.
          </Text>

          {/* Buttons */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 rounded-2xl bg-slate-100 py-4 active:bg-slate-200">
              <Text className="text-center font-semibold text-slate-700">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              className="flex-1 rounded-2xl bg-red-500 py-4 active:bg-red-600">
              <Text className="text-center font-bold text-white">
                Delete
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmationModal