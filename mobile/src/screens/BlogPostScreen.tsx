import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useBlogPost } from '../hooks/useBlogPost';
import { AppStackParamList } from '../types';
import { analytics } from '../services/analytics';

type BlogPostRoute = RouteProp<AppStackParamList, 'BlogPost'>;

const BlogPostScreen: React.FC = () => {
  const route = useRoute<BlogPostRoute>();
  const { id } = route.params;
  const { blogPost, isLoading, error } = useBlogPost(id);

  useEffect(() => {
    analytics.blogPostViewed(id);
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !blogPost) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Could not load blog post. Please try again.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{blogPost.title}</Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          {blogPost.author ? (
            <Text style={styles.author}>By {blogPost.author}</Text>
          ) : null}
          <Text style={styles.date}>
            {new Date(blogPost.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Categories */}
        {blogPost.categories && blogPost.categories.length > 0 && (
          <View style={styles.categoriesRow}>
            {blogPost.categories.map(cat => (
              <View key={cat} style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{cat}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Body */}
        <Text style={styles.body}>{blogPost.body}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
    lineHeight: 34,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  author: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  date: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  categoryTag: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  categoryTagText: {
    fontSize: 12,
    color: colors.textOnPrimary,
    fontWeight: '500',
  },
  body: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 26,
  },
});

export default BlogPostScreen;
