import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface RatingStarsProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
  size?: number;
}

/**
 * Interactive star rating component
 */
export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  onRatingChange,
  disabled = false,
  size = 32,
}) => {
  const theme = useTheme();

  const handleStarPress = (starRating: number) => {
    if (!disabled) {
      onRatingChange(starRating);
    }
  };

  const renderStar = (starNumber: number) => {
    const isFilled = starNumber <= rating;
    const starColor = isFilled ? '#FFD700' : theme.colors.outline;

    return (
      <TouchableOpacity
        key={starNumber}
        onPress={() => handleStarPress(starNumber)}
        disabled={disabled}
        style={[
          styles.starContainer,
          {
            opacity: disabled ? 0.6 : 1,
          },
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.star,
            {
              fontSize: size,
              color: starColor,
            },
          ]}
        >
          ★
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(renderStar)}
      </View>
      <Text style={styles.ratingText}>
        {rating > 0 ? `${rating} / 5` : 'Tap to rate'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  starContainer: {
    padding: 4,
    marginHorizontal: 2,
  },
  star: {
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  ratingText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default RatingStars;
