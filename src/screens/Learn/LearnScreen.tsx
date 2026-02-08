/**
 * Learn Screen
 * Academy / Educational content feed
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme';
import Card from '../../components/Card';
import { learnContent, Video } from '../../data/learnContent';

export default function LearnScreen() {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', 'Technique', 'Recipe', 'Science', 'Q&A'];

    const filteredContent = selectedCategory === 'All'
        ? learnContent
        : learnContent.filter(v => v.category === selectedCategory);

    const featuredVideo = learnContent.find(v => v.featured);
    const listData = featuredVideo
        ? filteredContent.filter(v => v.id !== featuredVideo.id)
        : filteredContent;

    const handleVideoPress = (youtubeId: string) => {
        // Try to open in YouTube app, fall back to browser
        const appUrl = `vnd.youtube://${youtubeId}`;
        const webUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

        Linking.canOpenURL(appUrl).then((supported) => {
            if (supported) {
                return Linking.openURL(appUrl);
            } else {
                return Linking.openURL(webUrl);
            }
        }).catch((err) => console.error('An error occurred', err));
    };

    const renderVideoItem = ({ item }: { item: Video }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleVideoPress(item.youtubeId)}
            style={styles.videoItem}
        >
            <Card variant="elevated" padding="none" style={styles.card}>
                <View style={styles.thumbnailContainer}>
                    <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                    <View style={styles.playButton}>
                        <Icon name="play" size={32} color={theme.colors.white} />
                    </View>
                    <View style={styles.durationBadge}>
                        <Text style={styles.durationText}>{item.duration}</Text>
                    </View>
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.metaRow}>
                        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                            <Text style={styles.categoryText}>{item.category}</Text>
                        </View>
                        <Text style={styles.dateText}>{formatDate(item.publishDate)}</Text>
                    </View>
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                </View>
            </Card>
        </TouchableOpacity>
    );

    const renderHeader = () => (
        <View>
            {featuredVideo && selectedCategory === 'All' && (
                <View style={styles.featuredContainer}>
                    <Text style={styles.sectionTitle}>Featured</Text>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => handleVideoPress(featuredVideo.youtubeId)}
                    >
                        <Card variant="glass" padding="none" style={styles.featuredCard}>
                            <Image source={{ uri: featuredVideo.thumbnail }} style={styles.featuredThumbnail} />
                            <View style={styles.featuredOverlay}>
                                <View style={styles.playButtonLarge}>
                                    <Icon name="play" size={48} color={theme.colors.white} />
                                </View>
                            </View>
                            <View style={styles.featuredContent}>
                                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(featuredVideo.category), alignSelf: 'flex-start', marginBottom: 8 }]}>
                                    <Text style={styles.categoryText}>{featuredVideo.category}</Text>
                                </View>
                                <Text style={styles.featuredTitle}>{featuredVideo.title}</Text>
                                <Text style={styles.featuredDescription} numberOfLines={2}>{featuredVideo.description}</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setSelectedCategory(cat)}
                            style={[
                                styles.filterChip,
                                selectedCategory === cat && styles.filterChipActive
                            ]}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedCategory === cat && styles.filterTextActive
                            ]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <Text style={styles.sectionTitle}>Latest Videos</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={listData}
                renderItem={renderVideoItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

// Helpers
function getCategoryColor(category: string) {
    switch (category) {
        case 'Technique': return theme.colors.primary[500];
        case 'Recipe': return theme.colors.success.main;
        case 'Science': return theme.colors.info.main;
        default: return theme.colors.text.secondary;
    }
}

function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.paper,
    },
    listContent: {
        padding: theme.spacing.md,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: theme.typography.sizes.lg,
        fontFamily: theme.typography.fonts.heading,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
        marginTop: theme.spacing.sm,
    },
    // Featured
    featuredContainer: {
        marginBottom: theme.spacing.lg,
    },
    featuredCard: {
        overflow: 'hidden',
    },
    featuredThumbnail: {
        width: '100%',
        height: 200,
        backgroundColor: theme.colors.background.subtle,
    },
    featuredOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
    featuredContent: {
        padding: theme.spacing.lg,
    },
    featuredTitle: {
        fontSize: theme.typography.sizes.xl,
        fontFamily: theme.typography.fonts.heading,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    featuredDescription: {
        fontSize: theme.typography.sizes.base,
        fontFamily: theme.typography.fonts.regular,
        color: theme.colors.text.secondary,
    },

    // ListItem
    videoItem: {
        marginBottom: theme.spacing.md,
    },
    card: {
        overflow: 'hidden',
    },
    thumbnailContainer: {
        position: 'relative',
        height: 160, // Smaller than featured
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.background.subtle,
    },
    playButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -24,
        marginTop: -24,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButtonLarge: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    durationText: {
        color: theme.colors.white,
        fontSize: theme.typography.sizes.xs,
        fontWeight: 'bold',
    },
    cardContent: {
        padding: theme.spacing.md,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    categoryText: {
        color: theme.colors.white,
        fontSize: theme.typography.sizes.xs,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    dateText: {
        fontSize: theme.typography.sizes.xs,
        color: theme.colors.text.disabled,
    },
    title: {
        fontSize: theme.typography.sizes.lg,
        fontFamily: theme.typography.fonts.semibold,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    description: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.text.secondary,
    },

    // Filters
    filterContainer: {
        marginBottom: theme.spacing.lg,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: theme.colors.secondary[100],
        marginRight: 8,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
    },
    filterChipActive: {
        backgroundColor: theme.colors.primary[500],
        borderColor: theme.colors.primary[500],
    },
    filterText: {
        fontSize: theme.typography.sizes.sm,
        fontWeight: '600',
        color: theme.colors.text.secondary,
    },
    filterTextActive: {
        color: theme.colors.white,
    },
});
