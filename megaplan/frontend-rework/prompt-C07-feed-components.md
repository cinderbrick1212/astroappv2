# Prompt 07 — Feed Components MD3 Rewrite (FeedHeader + FeedItemCard + AdCard + RemedyCard)

## Task

Rewrite four component files in `mobile/src/components/` to use Material Design 3 Paper components:

1. `FeedHeader.tsx`
2. `FeedItemCard.tsx`
3. `AdCard.tsx`
4. `RemedyCard.tsx`

All existing props interfaces, logic, and service calls remain unchanged. Only the UI layer changes.

---

## Component 1: FeedHeader

**File:** `mobile/src/components/FeedHeader.tsx`

**Current props:**
```tsx
interface FeedHeaderProps {
  date: Date;
  userName?: string;
  streak: number;
}
```

**Required rewrite:**

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip, useTheme } from 'react-native-paper';

interface FeedHeaderProps {
  date: Date;
  userName?: string;
  streak: number;
}

const FeedHeader: React.FC<FeedHeaderProps> = ({ date, userName, streak }) => {
  const theme = useTheme();

  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const hour = date.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primaryContainer }]}>
      <View style={styles.row}>
        <View style={styles.textBlock}>
          <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer }}>
            {greeting}{userName ? `, ${userName}` : ''}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.75, marginTop: 2 }}>
            {dateStr}
          </Text>
        </View>
        {streak > 0 && (
          <Chip
            icon="fire"
            mode="flat"
            style={{ backgroundColor: theme.colors.secondaryContainer }}
            textStyle={{ color: theme.colors.onSecondaryContainer }}
            accessibilityLabel={`${streak} day streak`}
          >
            {streak} day{streak !== 1 ? 's' : ''}
          </Chip>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textBlock: {
    flex: 1,
    marginRight: 12,
  },
});

export default FeedHeader;
```

---

## Component 2: FeedItemCard

**File:** `mobile/src/components/FeedItemCard.tsx`

**Current props (from types/index.ts):**
```tsx
interface FeedItem {
  id: string;
  type: 'horoscope' | 'tip' | 'blog' | 'remedy';
  title: string;
  summary: string;
  body?: string;
  published_at: string;
  priority: number;
  is_active: boolean;
}
```

**Required rewrite** — each `type` gets a different Card mode:

```tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { FeedItem } from '../types';

interface FeedItemCardProps {
  item: FeedItem;
}

const TYPE_ICONS: Record<FeedItem['type'], string> = {
  horoscope: 'star-crescent',
  tip:       'lightbulb-outline',
  blog:      'book-open-variant',
  remedy:    'flower-outline',
};

const TYPE_LABELS: Record<FeedItem['type'], string> = {
  horoscope: 'Horoscope',
  tip:       'Astro Tip',
  blog:      'Blog',
  remedy:    'Remedy',
};

const FeedItemCard: React.FC<FeedItemCardProps> = ({ item }) => {
  const theme = useTheme();

  // tip and remedy get a tonal (contained) card; horoscope and blog get elevated
  const mode = item.type === 'tip' || item.type === 'remedy' ? 'contained' : 'elevated';
  const cardBg =
    item.type === 'tip'
      ? theme.colors.secondaryContainer
      : item.type === 'remedy'
      ? theme.colors.tertiaryContainer
      : theme.colors.surface;

  return (
    <Card
      mode={mode}
      elevation={mode === 'elevated' ? 1 : undefined}
      style={[styles.card, { backgroundColor: cardBg }]}
      accessibilityLabel={item.title}
    >
      <Card.Title
        title={item.title}
        titleVariant="titleSmall"
        titleStyle={{ color: theme.colors.onSurface }}
        subtitle={item.summary}
        subtitleVariant="bodySmall"
        subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
        subtitleNumberOfLines={2}
        right={() => (
          <Chip
            icon={TYPE_ICONS[item.type]}
            mode="flat"
            style={[styles.typeChip, { backgroundColor: theme.colors.surfaceVariant }]}
            textStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 11 }}
            compact
          >
            {TYPE_LABELS[item.type]}
          </Chip>
        )}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  typeChip: {
    marginRight: 12,
  },
});

export default FeedItemCard;
```

---

## Component 3: AdCard

**File:** `mobile/src/components/AdCard.tsx`

**Required rewrite** — simple outlined card with "Sponsored" badge:

```tsx
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
```

---

## Component 4: RemedyCard

**File:** `mobile/src/components/RemedyCard.tsx`

The current `RemedyCard` receives `date: Date` and computes a daily remedy. Keep all existing remedy-computation logic intact. Only replace the JSX.

If the current `RemedyCard.tsx` has local `REMEDIES` or similar arrays and logic, keep them. Only replace the `return (...)` and `StyleSheet` blocks.

**Required JSX replacement:**

```tsx
// Inside RemedyCard component — replace only the return statement:
return (
  <Card
    mode="contained"
    style={[styles.card, { backgroundColor: theme.colors.tertiaryContainer }]}
    accessibilityLabel={`Remedy of the day: ${remedy.text}`}
  >
    <Card.Content style={styles.content}>
      <Text style={styles.icon}>{remedy.icon ?? '🪔'}</Text>
      <View style={{ flex: 1 }}>
        <Text
          variant="labelSmall"
          style={{ color: theme.colors.onTertiaryContainer, letterSpacing: 1.2, marginBottom: 4 }}
        >
          REMEDY OF THE DAY
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onTertiaryContainer, lineHeight: 18 }}>
          {remedy.text}
        </Text>
      </View>
    </Card.Content>
  </Card>
);
```

**Also add to the RemedyCard's imports:**
```tsx
import { Card, Text, useTheme } from 'react-native-paper';
import { View } from 'react-native';
```

**And add `const theme = useTheme();` inside the component function.**

**StyleSheet:**
```typescript
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  icon: {
    fontSize: 26,
    marginTop: 2,
  },
});
```

---

## Validation

- `FeedHeader` shows greeting, date string, and streak Chip when streak > 0.
- `FeedItemCard` renders tip/remedy cards with tonal container backgrounds.
- `AdCard` shows "Sponsored" chip.
- `RemedyCard` uses `tertiaryContainer` background.
- No hardcoded colors in any of the four files.
