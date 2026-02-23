import React, { useEffect, useMemo } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  Chip,
  List,
  Divider,
  useTheme,
} from 'react-native-paper';
import { PhIcon } from '../components/PhIcon';
import { panchangService } from '../services/panchang';
import { useUserProfile } from '../hooks/useUserProfile';
import { analytics } from '../services/analytics';
import { getGrahaContent } from '../data';

const HORA_PLANETS = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'] as const;

const WEEKDAY_RULERS: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury', 4: 'Jupiter', 5: 'Venus', 6: 'Saturn',
};

const getHoraGuidance = (ruler: string): string => {
  const graha = getGrahaContent(ruler.toLowerCase());
  return graha ? graha.karakas.slice(0, 2).join(' / ') : ruler;
};

const HORA_ICONS: Record<string, string> = {
  Sun: 'white-balance-sunny',
  Venus: 'heart-outline',
  Mercury: 'message-text-outline',
  Moon: 'moon-waning-crescent',
  Saturn: 'hammer-wrench',
  Jupiter: 'school-outline',
  Mars: 'sword-cross',
};

interface HoraEntry {
  index: number;
  ruler: string;
  startTime: string;
  endTime: string;
  isDay: boolean;
  isCurrent: boolean;
}

const fmtMinutes = (minutesPastMidnight: number): string => {
  const totalMinutes = Math.round(minutesPastMidnight) % 1440;
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const HoraScreen: React.FC = () => {
  const theme = useTheme();
  const { profile } = useUserProfile();
  const today = new Date();

  const lat = profile?.latitude ?? 28.6;
  const lng = profile?.longitude ?? 77.2;

  useEffect(() => {
    analytics.screenView('Hora');
  }, []);

  const panchang = panchangService.calculatePanchang(today, lat, lng);

  const horas = useMemo<HoraEntry[]>(() => {
    // Parse sunrise/sunset times from panchang strings
    const parsePanchangTime = (timeStr: string): number => {
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return 360; // fallback 6:00 AM
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };

    const sunriseMin = parsePanchangTime(panchang.sunrise);
    const sunsetMin = parsePanchangTime(panchang.sunset);
    const dayLength = sunsetMin - sunriseMin;
    const nightLength = 1440 - dayLength;
    const dayHoraDuration = dayLength / 12;
    const nightHoraDuration = nightLength / 12;

    // First hora of the day is ruled by the weekday ruler
    const dayOfWeek = today.getDay();
    const firstRuler = WEEKDAY_RULERS[dayOfWeek];
    const startIndex = HORA_PLANETS.indexOf(firstRuler as typeof HORA_PLANETS[number]);

    // Current time in minutes past midnight
    const nowMin = today.getHours() * 60 + today.getMinutes();

    const entries: HoraEntry[] = [];
    for (let i = 0; i < 24; i++) {
      const isDay = i < 12;
      const horaStart = isDay
        ? sunriseMin + i * dayHoraDuration
        : sunsetMin + (i - 12) * nightHoraDuration;
      const horaEnd = isDay
        ? sunriseMin + (i + 1) * dayHoraDuration
        : sunsetMin + (i - 11) * nightHoraDuration;

      const rulerIndex = (startIndex + i) % 7;
      const ruler = HORA_PLANETS[rulerIndex];
      const isCurrent = nowMin >= horaStart && nowMin < horaEnd;

      entries.push({
        index: i + 1,
        ruler,
        startTime: fmtMinutes(horaStart),
        endTime: fmtMinutes(horaEnd),
        isDay,
        isCurrent,
      });
    }
    return entries;
  }, [panchang.sunrise, panchang.sunset, today]);

  const currentHora = horas.find(h => h.isCurrent);
  const dayOfWeekName = today.toLocaleDateString('en-IN', { weekday: 'long' });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Hero */}
      <Card
        mode="contained"
        style={[styles.heroCard, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <Card.Content style={styles.heroContent}>
          <Text variant="displaySmall" style={{ textAlign: 'center' }}>⏳</Text>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 8 }}
          >
            Vedic Hora
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 4, opacity: 0.75 }}
          >
            {dayOfWeekName} • Ruler: {WEEKDAY_RULERS[today.getDay()]}
          </Text>
        </Card.Content>
      </Card>

      {/* Sunrise / Sunset Chips */}
      <View style={styles.chipRow}>
        <Chip
          icon="weather-sunset-up"
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
          accessibilityLabel={`Sunrise: ${panchang.sunrise}`}
        >
          Sunrise: {panchang.sunrise}
        </Chip>
        <Chip
          icon="weather-sunset-down"
          mode="flat"
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textStyle={{ color: theme.colors.onSecondaryContainer }}
          accessibilityLabel={`Sunset: ${panchang.sunset}`}
        >
          Sunset: {panchang.sunset}
        </Chip>
      </View>

      {/* Current Hora Highlight */}
      {currentHora && (
        <>
          <List.Subheader style={{ color: theme.colors.primary }}>Current Hora</List.Subheader>
          <Card
            mode="elevated"
            elevation={3}
            style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]}
          >
            <Card.Title
              title={`${currentHora.ruler} Hora`}
              subtitle={`${currentHora.startTime} – ${currentHora.endTime}`}
              titleVariant="titleMedium"
              titleStyle={{ color: theme.colors.onPrimaryContainer }}
              subtitleStyle={{ color: theme.colors.onPrimaryContainer }}
              left={props => (
                <PhIcon name={HORA_ICONS[currentHora.ruler] ?? 'circle'} size={24} color={theme.colors.onPrimaryContainer} />
              )}
            />
            <Card.Content>
              <Chip
                mode="flat"
                compact
                style={{ alignSelf: 'flex-start', backgroundColor: theme.colors.primary }}
                textStyle={{ color: theme.colors.onPrimary }}
              >
                {getHoraGuidance(currentHora.ruler)}
              </Chip>
            </Card.Content>
          </Card>
        </>
      )}

      <Divider style={{ marginVertical: 8 }} />

      {/* Day Horas */}
      <List.Subheader style={{ color: theme.colors.primary }}>Day Horas (Sunrise – Sunset)</List.Subheader>
      {horas.filter(h => h.isDay).map(hora => (
        <Card
          key={hora.index}
          mode={(hora.isCurrent ? 'elevated' : 'outlined') as 'elevated'}
          elevation={hora.isCurrent ? 2 : 0}
          style={[
            styles.card,
            hora.isCurrent ? { backgroundColor: theme.colors.primaryContainer } : undefined,
          ]}
        >
          <List.Item
            title={`${hora.ruler} Hora`}
            description={`${hora.startTime} – ${hora.endTime} • ${getHoraGuidance(hora.ruler)}`}
            titleStyle={{
              color: hora.isCurrent ? theme.colors.onPrimaryContainer : theme.colors.onSurface,
              fontWeight: hora.isCurrent ? '700' : '400',
            }}
            descriptionStyle={{
              color: hora.isCurrent ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant,
            }}
            left={props => (
              <PhIcon name={HORA_ICONS[hora.ruler] ?? 'circle'} size={24} color={hora.isCurrent ? theme.colors.onPrimaryContainer : theme.colors.primary} />
            )}
            accessibilityLabel={`Hora ${hora.index}: ${hora.ruler}, ${hora.startTime} to ${hora.endTime}`}
          />
        </Card>
      ))}

      <Divider style={{ marginVertical: 8 }} />

      {/* Night Horas */}
      <List.Subheader style={{ color: theme.colors.primary }}>Night Horas (Sunset – Sunrise)</List.Subheader>
      {horas.filter(h => !h.isDay).map(hora => (
        <Card
          key={hora.index}
          mode={(hora.isCurrent ? 'elevated' : 'outlined') as 'elevated'}
          elevation={hora.isCurrent ? 2 : 0}
          style={[
            styles.card,
            hora.isCurrent ? { backgroundColor: theme.colors.primaryContainer } : undefined,
          ]}
        >
          <List.Item
            title={`${hora.ruler} Hora`}
            description={`${hora.startTime} – ${hora.endTime} • ${getHoraGuidance(hora.ruler)}`}
            titleStyle={{
              color: hora.isCurrent ? theme.colors.onPrimaryContainer : theme.colors.onSurface,
              fontWeight: hora.isCurrent ? '700' : '400',
            }}
            descriptionStyle={{
              color: hora.isCurrent ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant,
            }}
            left={props => (
              <PhIcon name={HORA_ICONS[hora.ruler] ?? 'circle'} size={24} color={hora.isCurrent ? theme.colors.onPrimaryContainer : theme.colors.primary} />
            )}
            accessibilityLabel={`Hora ${hora.index}: ${hora.ruler}, ${hora.startTime} to ${hora.endTime}`}
          />
        </Card>
      ))}

      <View style={styles.bottomPad} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroCard: {
    margin: 16,
    marginBottom: 0,
  },
  heroContent: {
    paddingVertical: 24,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
    paddingBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  bottomPad: {
    height: 24,
  },
});

export default HoraScreen;
