import React from 'react';
import { TimePickerModal } from 'react-native-paper-dates';

interface Props {
  visible: boolean;
  value: string; // HH:MM
  onConfirm: (time: string) => void;
  onCancel: () => void;
}

const TimePickerModalWrapper: React.FC<Props> = ({ visible, value, onConfirm, onCancel }) => {
  const parts =
    value && /^\d{1,2}:\d{2}$/.test(value) ? value.split(':') : ['0', '0'];
  const hours = Math.min(23, Math.max(0, parseInt(parts[0] ?? '0', 10)));
  const minutes = Math.min(59, Math.max(0, parseInt(parts[1] ?? '0', 10)));

  return (
    <TimePickerModal
      locale="en"
      visible={visible}
      onDismiss={onCancel}
      hours={hours}
      minutes={minutes}
      onConfirm={({ hours: h, minutes: m }) => {
        onConfirm(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }}
    />
  );
};

export default TimePickerModalWrapper;
