import React from 'react';
import { DatePickerModal } from 'react-native-paper-dates';

interface Props {
  visible: boolean;
  value: string; // YYYY-MM-DD
  onConfirm: (date: string) => void;
  onCancel: () => void;
}

const DatePickerModalWrapper: React.FC<Props> = ({ visible, value, onConfirm, onCancel }) => {
  const date =
    value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(value) : undefined;

  return (
    <DatePickerModal
      locale="en"
      mode="single"
      visible={visible}
      onDismiss={onCancel}
      date={date}
      onConfirm={({ date: selectedDate }) => {
        if (selectedDate) {
          const y = selectedDate.getFullYear();
          const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
          const d = String(selectedDate.getDate()).padStart(2, '0');
          onConfirm(`${y}-${m}-${d}`);
        }
      }}
    />
  );
};

export default DatePickerModalWrapper;
