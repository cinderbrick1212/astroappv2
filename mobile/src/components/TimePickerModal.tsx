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

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

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
      <View pointerEvents="none" style={styles.wheelFadeBottom} />
      <View pointerEvents="none" style={styles.wheelHighlight} />
    </View>
  );
};

interface Props {
  visible: boolean;
  value: string; // HH:MM
  onConfirm: (time: string) => void;
  onCancel: () => void;
}

const TimePickerModal: React.FC<Props> = ({ visible, value, onConfirm, onCancel }) => {
  const [hourIndex, setHourIndex] = React.useState(0);
  const [minuteIndex, setMinuteIndex] = React.useState(0);

  useEffect(() => {
    if (visible) {
      const parts = value && /^\d{1,2}:\d{2}$/.test(value) ? value.split(':') : ['0', '0'];
      const h = Math.min(23, Math.max(0, parseInt(parts[0] ?? '0', 10)));
      const m = Math.min(59, Math.max(0, parseInt(parts[1] ?? '0', 10)));
      setHourIndex(h);
      setMinuteIndex(m);
    }
  }, [visible, value]);

  const handleConfirm = () => {
    const h = HOURS[hourIndex] ?? '00';
    const m = MINUTES[minuteIndex] ?? '00';
    onConfirm(`${h}:${m}`);
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
            <Text style={styles.title}>Time of Birth</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.confirmText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerRow}>
            <View style={styles.columnWrapper}>
              <Text style={styles.columnLabel}>Hour (24hr)</Text>
              <WheelColumn
                data={HOURS}
                selectedIndex={hourIndex}
                onIndexChange={i => setHourIndex(i)}
              />
            </View>

            <View style={styles.separator}>
              <Text style={styles.separatorText}>:</Text>
            </View>

            <View style={styles.columnWrapper}>
              <Text style={styles.columnLabel}>Minute</Text>
              <WheelColumn
                data={MINUTES}
                selectedIndex={minuteIndex}
                onIndexChange={i => setMinuteIndex(i)}
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    gap: spacing.md,
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
  separator: {
    paddingTop: 28, // align with items after label
    alignItems: 'center',
  },
  separatorText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
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
    fontSize: 22,
    color: colors.textSecondary,
  },
  wheelItemTextSelected: {
    fontSize: 26,
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

export default TimePickerModal;
