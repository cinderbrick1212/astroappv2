import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';

const AdCard: React.FC = () => {
  const theme = useTheme();
  return (
    <Card
      mode="outlined"
      style={[styles.card, { borderColor: theme.colors.outlineVariant }]}
      accessibilityLabel="Sponsored advertisement"
    >
      <Card.Content style={styles.content}>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}
        >
          Advertisement placeholder — native ad will render here.
        </Text>
        <Chip
          mode="outlined"
          compact
          style={{ borderColor: theme.colors.outline }}
          textStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
          accessibilityLabel="Sponsored content"
        >
          Sponsored
        </Chip>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default AdCard;
