import { AlertTriangle } from "lucide-react-native";
import { Modal, Pressable, View } from "react-native";
import { Text } from "./ui/Text";

interface DeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  loading?: boolean;
}

const DeleteConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  loading,
}: DeleteModalProps) => {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50 px-4">
        <View className="w-full max-w-sm rounded-3xl bg-white p-6">

          <View className="items-center mb-4">
            <View className="rounded-full bg-red-100 p-4">
              <AlertTriangle size={32} color="#ef4444" />
            </View>
          </View>

          <Text className="text-center text-xl font-bold text-slate-900 mb-2">
            Delete Item?
          </Text>

          <Text className="text-center text-slate-500 mb-6">
            Are you sure you want to delete{" "}
            <Text className="font-semibold text-slate-700">"{title}"</Text>?
          </Text>

          <View className="flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 rounded-2xl bg-slate-100 py-4">

              <Text className="text-center font-semibold text-slate-700">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              className="flex-1 rounded-2xl bg-red-500 py-4">

              <Text className="text-center font-bold text-white">
                {loading ? "Deleting..." : "Delete"}
              </Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmationModal;