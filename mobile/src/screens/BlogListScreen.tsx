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
