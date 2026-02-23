import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, Platform } from 'react-native';
import { TextInput, List, Surface, useTheme, Button, Text } from 'react-native-paper';
import { City, ICity } from 'country-state-city';

interface Props {
    value: string;
    onSelect: (city: {
        name: string;
        latitude: number;
        longitude: number;
        stateCode: string;
        countryCode: string;
    }) => void;
    label?: string;
    placeholder?: string;
    containerStyle?: any;
}

const CityAutocomplete: React.FC<Props> = ({
    value,
    onSelect,
    label = 'Place of Birth',
    placeholder = 'Search city...',
    containerStyle,
}) => {
    const theme = useTheme();
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<ICity[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchWorldwide, setSearchWorldwide] = useState(false);

    // Sync internal query with external value (e.g. when profile loads)
    useEffect(() => {
        setQuery(value);
    }, [value]);

    // Load and filter cities
    useEffect(() => {
        if (query.length < 2 || !showDropdown) {
            setSuggestions([]);
            return;
        }

        const filterCities = () => {
            // Initially scope to India for performance and relevance, unless worldwide enabled
            const allCities = (searchWorldwide ? City.getAllCities() : City.getCitiesOfCountry('IN')) || [];

            const filtered = allCities.filter(city =>
                city.name.toLowerCase().startsWith(query.toLowerCase())
            ).slice(0, 10); // Limit to top 10 for performance

            setSuggestions(filtered);
        };

        const timer = setTimeout(filterCities, 200);
        return () => clearTimeout(timer);
    }, [query, searchWorldwide, showDropdown]);

    const handleSelect = (item: ICity) => {
        setQuery(item.name);
        setShowDropdown(false);
        onSelect({
            name: item.name,
            latitude: parseFloat(item.latitude || '0'),
            longitude: parseFloat(item.longitude || '0'),
            stateCode: item.stateCode,
            countryCode: item.countryCode,
        });
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                mode="outlined"
                label={label}
                placeholder={placeholder}
                value={query}
                onChangeText={text => {
                    setQuery(text);
                    setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                right={<TextInput.Icon icon={showDropdown ? "chevron-up" : "magnify"} onPress={() => setShowDropdown(!showDropdown)} />}
                style={styles.input}
            />

            {showDropdown && (query.length >= 2 || suggestions.length > 0) && (
                <Surface style={[styles.dropdown, { backgroundColor: theme.colors.elevation.level2 }]} elevation={2}>
                    <FlatList
                        data={suggestions}
                        keyExtractor={(item, index) => `${item.name}-${item.stateCode}-${index}`}
                        renderItem={({ item }) => (
                            <List.Item
                                title={item.name}
                                description={`${item.stateCode}, ${item.countryCode}`}
                                onPress={() => handleSelect(item)}
                                left={props => <List.Icon {...props} icon="map-marker-outline" />}
                            />
                        )}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                {query.length >= 2 && (
                                    <>
                                        <Text variant="bodySmall" style={styles.emptyText}>No matches found in India.</Text>
                                        {!searchWorldwide && (
                                            <Button
                                                mode="text"
                                                compact
                                                onPress={() => setSearchWorldwide(true)}
                                                style={{ marginTop: 4 }}
                                            >
                                                Search Worldwide
                                            </Button>
                                        )}
                                    </>
                                )}
                            </View>
                        )}
                        keyboardShouldPersistTaps="handled"
                        style={{ maxHeight: 250 }}
                    />
                    {suggestions.length > 0 && !searchWorldwide && (
                        <Button
                            mode="text"
                            compact
                            onPress={() => setSearchWorldwide(true)}
                            style={styles.worldwideToggle}
                        >
                            Not finding it? Search Worldwide
                        </Button>
                    )}
                </Surface>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        zIndex: 1000, // Important for dropdown visibility
    },
    input: {
        width: '100%',
    },
    dropdown: {
        position: 'absolute',
        top: 54, // Adjust based on Input height
        left: 0,
        right: 0,
        borderRadius: 4,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    emptyContainer: {
        padding: 16,
        alignItems: 'center',
    },
    emptyText: {
        opacity: 0.7,
    },
    worldwideToggle: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(0,0,0,0.1)',
    }
});

export default CityAutocomplete;
