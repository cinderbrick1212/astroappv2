import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { AppStackParamList } from '../types';

const CATEGORIES = ['All', 'Horoscopes', 'Numerology', 'Vastu', 'Relationships', 'Wellness'];

type Nav = NativeStackNavigationProp<AppStackParamList, 'BlogList'>;

const BlogListScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [activeCategory, setActiveCategory] = React.useState<string | undefined>(undefined);
  const { blogPosts, isLoading, fetchNextPage, hasNextPage } = useBlogPosts(activeCategory);

  return (
    <View style={styles.container}>
      {/* Category filters */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => {
          const isActive = (item === 'All' && !activeCategory) || item === activeCategory;
          return (
            <TouchableOpacity
              style={[styles.categoryPill, isActive && styles.categoryPillActive]}
              onPress={() => setActiveCategory(item === 'All' ? undefined : item)}
            >
              <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
        style={styles.categoryScroll}
      />

      {/* Blog posts */}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={blogPosts}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.blogCard}
              onPress={() => navigation.navigate('BlogPost', { id: item.id })}
            >
              <View style={styles.blogCardContent}>
                <Text style={styles.blogTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.blogExcerpt} numberOfLines={2}>{item.excerpt}</Text>
                <View style={styles.blogMeta}>
                  {item.author && <Text style={styles.blogAuthor}>{item.author}</Text>}
                  <Text style={styles.blogDate}>
                    {new Date(item.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No blog posts available yet.</Text>
            </View>
          }
          ListFooterComponent={
            hasNextPage ? (
              <TouchableOpacity style={styles.loadMoreButton} onPress={() => fetchNextPage()}>
                <Text style={styles.loadMoreText}>Load More</Text>
              </TouchableOpacity>
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
    backgroundColor: colors.background,
  },
  categoryScroll: {
    flexGrow: 0,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryPillText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryPillTextActive: {
    color: colors.textOnPrimary,
  },
  loader: {
    marginTop: spacing.xl,
  },
  listContent: {
    padding: spacing.md,
  },
  blogCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  blogCardContent: {
    padding: spacing.md,
  },
  blogTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: 24,
  },
  blogExcerpt: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  blogMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blogAuthor: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  blogDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  loadMoreButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  loadMoreText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
});

export default BlogListScreen;
