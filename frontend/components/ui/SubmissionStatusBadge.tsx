import { View } from 'react-native';
import { Text } from 'components/ui/Text';
import { SubmissionStatus } from 'types/submission';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react-native';

export const STATUS_CONFIG: Record<SubmissionStatus, any> = {
  SUBMITTED: {
    label: 'Submitted',
    icon: CheckCircle2,
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    textColor: '#10b981',
  },
  LATE: {
    label: 'Late',
    icon: AlertCircle,
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    textColor: '#ef4444',
  },
  PENDING: {
    label: 'Pending',
    icon: Clock,
    bgColor: '#f1f5f9',
    borderColor: '#e2e8f0',
    textColor: '#64748b',
  },
  MISSING: {
    label: 'Missing',
    icon: AlertCircle,
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    textColor: '#ef4444',
  },
  GRADED: {
    label: 'Graded',
    icon: CheckCircle2,
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    textColor: '#3b82f6',
  },
};

interface Props {
  status: SubmissionStatus;
}

const SubmissionStatusBadge = ({ status }: Props) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;

  const Icon = config.icon;

  return (
    <View
      className="flex-row items-center rounded-full px-2 py-1"
      style={{
        backgroundColor: config.bgColor,
        borderWidth: 1,
        borderColor: config.borderColor,
      }}
    >
      {Icon && (
        <Icon
          size={12}
          color={config.textColor}
          style={{ marginRight: 4 }}
        />
      )}

      <Text
        className="text-[10px] font-bold"
        style={{ color: config.textColor }}
      >
        {config.label}
      </Text>
    </View>
  );
};

export default SubmissionStatusBadge;