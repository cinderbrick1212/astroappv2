import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function range(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i++) result.push(i);
  return result;
}

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

interface WheelColumnProps {
  data: string[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
}

const WheelColumn: React.FC<WheelColumnProps> = ({ data, selectedIndex, onIndexChange }) => {
  const listRef = useRef<FlatList<string>>(null);

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0 && selectedIndex < data.length) {
      listRef.current.scrollToOffset({
        offset: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, [selectedIndex, data.length]);

  const handleMomentumScrollEnd = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, data.length - 1));
      onIndexChange(clamped);
    },
    [data.length, onIndexChange]
  );

  const renderItem = ({ item, index }: ListRenderItemInfo<string>) => (
    <View style={styles.wheelItem}>
      <Text
        style={[
          styles.wheelItemText,
          index === selectedIndex && styles.wheelItemTextSelected,
        ]}
      >
        {item}
      </Text>
    </View>
  );

  return (
    <View style={styles.wheelColumn}>
      {/* Top fade padding */}
      <View pointerEvents="none" style={styles.wheelFadeTop} />
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * 2,
        }}
        style={{ height: PICKER_HEIGHT }}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index + ITEM_HEIGHT * 2,
          index,
        })}
      />
      {/* Bottom fade padding */}
      <View pointerEvents="none" style={styles.wheelFadeBottom} />
      {/* Center highlight */}
      <View pointerEvents="none" style={styles.wheelHighlight} />
    </View>
  );
};

interface Props {
  visible: boolean;
  value: string; // YYYY-MM-DD
  onConfirm: (date: string) => void;
  onCancel: () => void;
}

const currentYear = new Date().getFullYear();
const MIN_YEAR = 1920;
const YEARS = range(MIN_YEAR, currentYear).map(String);
const DAYS_MAX = 31;

const DatePickerModal: React.FC<Props> = ({ visible, value, onConfirm, onCancel }) => {
  const parsed = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(value) : new Date(1990, 0, 1);
  const initYear = isNaN(parsed.getTime()) ? 1990 : parsed.getFullYear();
  const initMonth = isNaN(parsed.getTime()) ? 0 : parsed.getMonth(); // 0-indexed
  const initDay = isNaN(parsed.getTime()) ? 0 : parsed.getDate() - 1; // 0-indexed

  const [yearIndex, setYearIndex] = React.useState(
    Math.max(0, YEARS.indexOf(String(initYear)))
  );
  const [monthIndex, setMonthIndex] = React.useState(initMonth);
  const [dayIndex, setDayIndex] = React.useState(initDay);

  // Reset state when modal opens with new value
  useEffect(() => {
    if (visible) {
      const p = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(value) : new Date(1990, 0, 1);
      const y = isNaN(p.getTime()) ? 1990 : p.getFullYear();
      const m = isNaN(p.getTime()) ? 0 : p.getMonth();
      const d = isNaN(p.getTime()) ? 0 : p.getDate() - 1;
      setYearIndex(Math.max(0, YEARS.indexOf(String(y))));
      setMonthIndex(m);
      setDayIndex(d);
    }
  }, [visible, value]);

  const selectedYear = parseInt(YEARS[yearIndex] ?? String(currentYear), 10);
  const selectedMonth = monthIndex + 1; // 1-indexed
  const maxDays = daysInMonth(selectedMonth, selectedYear);
  const days = range(1, maxDays).map(d => String(d).padStart(2, '0'));

  // Clamp dayIndex if month/year changes number of days
  const safeDayIndex = Math.min(dayIndex, days.length - 1);

  const handleConfirm = () => {
    const y = YEARS[yearIndex] ?? String(currentYear);
    const m = String(monthIndex + 1).padStart(2, '0');
    const d = days[safeDayIndex] ?? '01';
    onConfirm(`${y}-${m}-${d}`);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Date of Birth</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.confirmText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerRow}>
            <View style={styles.columnWrapper}>
              <Text style={styles.columnLabel}>Day</Text>
              <WheelColumn
                data={days}
                selectedIndex={safeDayIndex}
                onIndexChange={i => setDayIndex(i)}
              />
            </View>

            <View style={styles.columnWrapper}>
              <Text style={styles.columnLabel}>Month</Text>
              <WheelColumn
                data={MONTHS}
                selectedIndex={monthIndex}
                onIndexChange={i => setMonthIndex(i)}
              />
            </View>

            <View style={styles.columnWrapper}>
              <Text style={styles.columnLabel}>Year</Text>
              <WheelColumn
                data={YEARS}
                selectedIndex={yearIndex}
                onIndexChange={i => setYearIndex(i)}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cancelText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  columnWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  columnLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  wheelColumn: {
    width: '100%',
    position: 'relative',
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelItemText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  wheelItemTextSelected: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  wheelHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 4,
    right: 4,
    height: ITEM_HEIGHT,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 4,
  },
  wheelFadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    zIndex: 1,
  },
  wheelFadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    zIndex: 1,
  },
});

export default DatePickerModal;
