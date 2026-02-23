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
