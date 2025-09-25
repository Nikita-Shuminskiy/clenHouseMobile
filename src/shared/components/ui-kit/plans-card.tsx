import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';


interface PlansCardProps {
  title: string;
  description: string;
  price: string;
  onSelectPress?: () => void;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

const PlansCard: React.FC<PlansCardProps> = ({
  title,
  description,
  price,
  onSelectPress,
  style,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.plansCard, PlansCardContainerStyles.default, style]}>
        {/* Заголовок */}
        <Text style={[styles.title, PlansCardTitleStyles.default]}>
          {title}
        </Text>

        {/* Основной блок */}
        <View style={[styles.mainBlock, PlansCardMainBlockStyles.default]}>
          {/* Левый блок */}
          <View style={[styles.leftBlock, PlansCardLeftBlockStyles.default]}>
            <Text style={[styles.description, PlansCardDescriptionStyles.default]}>
              {description}
            </Text>
          </View>

          {/* Правый блок с ценой и кнопкой */}
          <View style={styles.rightBlock}>
            {/* Ценовой блок */}
            <View style={[styles.priceBlock, PlansCardPriceBlockStyles.default]}>
              <Text style={[styles.mainPrice, PlansCardMainPriceStyles.default]}>
                {price}
              </Text>
              <Text style={[styles.priceSuffix, PlansCardPriceSuffixStyles.default]}>
                /месяц
              </Text>
            </View>

            {/* Кнопка выбора */}
            {onSelectPress && (
              <TouchableOpacity
                style={styles.selectButton}
                onPress={onSelectPress}
                activeOpacity={0.7}
              >
                <Text style={styles.selectButtonText}>Выбрать</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plansCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  mainBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftBlock: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  description: {
    textAlign: 'left',
  },
  rightBlock: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  priceBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainPrice: {
    textAlign: 'left',
  },
  priceSuffix: {
    textAlign: 'left',
  },
  selectButton: {
    backgroundColor: '#EFF3F8',
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#008FD2',
  },
});

export default PlansCard;
