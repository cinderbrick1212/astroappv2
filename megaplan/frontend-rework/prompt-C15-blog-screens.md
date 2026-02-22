# Prompt 15 — Blog Screens MD3 Rewrite (BlogListScreen + BlogPostScreen)

## Task

Rewrite two files using Material Design 3 Paper components:

1. `mobile/src/screens/BlogListScreen.tsx`
2. `mobile/src/screens/BlogPostScreen.tsx`

All existing logic — data fetching hooks, navigation, pagination — must be preserved.

---

## File 1: BlogListScreen

**File:** `mobile/src/screens/BlogListScreen.tsx`

**All preserved logic:**
```tsx
import { useBlogPosts } from '../hooks/useBlogPosts';
// navigation to 'BlogPost' screen with { id }
// activeCategory state and CATEGORIES array
// fetchNextPage, hasNextPage
```

### Required Implementation

Replace `BlogListScreen.tsx` completely with:

```tsx
import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import {
  Text,
  Card,
  Chip,
  ActivityIndicator,
  Button,
  Divider,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { AppStackParamList } from '../types';

const CATEGORIES = ['All', 'Horoscopes', 'Numerology', 'Vastu', 'Relationships', 'Wellness'];

type Nav = NativeStackNavigationProp<AppStackParamList, 'BlogList'>;

const BlogListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const [activeCategory, setActiveCategory] = React.useState<string | undefined>(undefined);
  const { blogPosts, isLoading, fetchNextPage, hasNextPage } = useBlogPosts(activeCategory);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Category filter chips — horizontal scroll */}
      <View style={[styles.categoryBar, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outlineVariant }]}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const isActive = (item === 'All' && !activeCategory) || item === activeCategory;
            return (
              <Chip
                mode={isActive ? 'flat' : 'outlined'}
                selected={isActive}
                onPress={() => setActiveCategory(item === 'All' ? undefined : item)}
                style={[
                  styles.categoryChip,
                  isActive && { backgroundColor: theme.colors.primaryContainer },
                ]}
                textStyle={{ color: isActive ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant }}
                accessibilityLabel={`Filter by ${item}`}
                accessibilityState={{ selected: isActive }}
              >
                {item}
              </Chip>
            );
          }}
        />
      </View>

      {/* Blog post list */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={blogPosts}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <Card
              mode="elevated"
              elevation={1}
              style={{ backgroundColor: theme.colors.surface }}
              onPress={() => navigation.navigate('BlogPost', { id: item.id })}
              accessibilityLabel={item.title}
            >
              <Card.Title
                title={item.title}
                subtitle={item.excerpt}
                titleVariant="titleSmall"
                subtitleVariant="bodySmall"
                subtitleNumberOfLines={2}
                titleNumberOfLines={2}
                titleStyle={{ color: theme.colors.onSurface }}
                subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
              />
              <Card.Content>
                <View style={styles.metaRow}>
                  {item.author ? (
                    <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                      {item.author}
                    </Text>
                  ) : null}
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {new Date(item.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
                No blog posts available yet.
              </Text>
            </View>
          }
          ListFooterComponent={
            hasNextPage ? (
              <Button
                mode="outlined"
                onPress={() => fetchNextPage()}
                style={styles.loadMoreButton}
                accessibilityLabel="Load more posts"
              >
                Load More
              </Button>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexGrow: 0,
  },
  categoryList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    marginRight: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadMoreButton: {
    marginTop: 8,
  },
});

export default BlogListScreen;
```

---

## File 2: BlogPostScreen

**File:** `mobile/src/screens/BlogPostScreen.tsx`

**All preserved logic:**
```tsx
import { useBlogPost } from '../hooks/useBlogPost';
// route params: { id: string }
// render HTML content (react-native-render-html or similar)
```

### Required Implementation

Replace `BlogPostScreen.tsx` completely with:

```tsx
import React from 'react';
import { StyleSheet, ScrollView, View, Share } from 'react-native';
import {
  Text,
  ActivityIndicator,
  Card,
  Button,
  Chip,
  useTheme,
} from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../types';
import { useBlogPost } from '../hooks/useBlogPost';

type BlogPostRoute = RouteProp<AppStackParamList, 'BlogPost'>;

const BlogPostScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<BlogPostRoute>();
  const { id } = route.params;
  const { post, isLoading } = useBlogPost(id);

  const handleShare = async () => {
    if (!post) return;
    await Share.share({ title: post.title, message: post.title });
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Post not found.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Title */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
          {post.title}
        </Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          {post.author ? (
            <Chip
              icon="account-outline"
              mode="flat"
              compact
              style={{ backgroundColor: theme.colors.secondaryContainer }}
              textStyle={{ color: theme.colors.onSecondaryContainer }}
            >
              {post.author}
            </Chip>
          ) : null}
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 8 }}>
            {new Date(post.published_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
      </View>

      {/* Body text */}
      <Card mode="elevated" elevation={0} style={styles.bodyCard}>
        <Card.Content>
          {/* Render plain excerpt/body text. If react-native-render-html is available, use it here. */}
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, lineHeight: 26 }}>
            {post.excerpt}
          </Text>
          {post.body ? (
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurface, lineHeight: 24, marginTop: 16 }}
            >
              {post.body}
            </Text>
          ) : null}
        </Card.Content>
      </Card>

      {/* Share */}
      <View style={styles.footer}>
        <Button
          mode="outlined"
          icon="share-variant-outline"
          onPress={handleShare}
          accessibilityLabel="Share this post"
        >
          Share
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  bodyCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});

export default BlogPostScreen;
```

---

## Validation

- Blog list renders cards for each post with title, excerpt, author, and date.
- Category filter chips update the active filter correctly.
- "Load More" button appears when `hasNextPage` is true.
- Blog post screen shows title, meta chips, body text, and share button.
- Loading states use `ActivityIndicator`.
- No hardcoded colors.
