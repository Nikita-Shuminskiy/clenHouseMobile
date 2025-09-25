import React from 'react';
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';


interface ClubCardProps {
  title: string;
  address: string;
  price: string;
  photo: ImageSourcePropType;
  badgeText?: string;
  badgeIcon?: React.ComponentType<any>;
  onHeartPress?: () => void;
  onBookPress?: () => void;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

const ClubCard: React.FC<ClubCardProps> = ({
  title,
  address,
  price,
  photo,
  badgeText,
  badgeIcon,
  onHeartPress,
  onBookPress,
  style,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.clubCard, ClubCardContainerStyles.default, style]}>
        {/* Фото блок */}
        <View style={[styles.photoBlock, PhotoBlockStyles.default]}>
          <Image source={photo} style={styles.photo} />
          
          {/* Badge */}
          {badgeText && (
            <View style={styles.badgeContainer}>
              {badgeIcon && React.createElement(badgeIcon, { style: styles.badgeIcon })}
              <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
          )}
          
          {/* Кнопка сердца */}
          {onHeartPress && (
            <TouchableOpacity
              style={styles.heartButton}
              onPress={onHeartPress}
              activeOpacity={0.7}
            >
              <HeartIcon style={styles.heartIcon} />
            </TouchableOpacity>
          )}
        </View>

        {/* Контент блок */}
        <View style={[styles.contentBlock, ContentBlockStyles.default]}>
          {/* Заголовок и адрес */}
          <View style={[styles.titleAddress, TitleAddressStyles.default]}>
            <Text style={[styles.title, TitleStyles.default]}>
              {title}
            </Text>
            <Text style={[styles.address, AddressStyles.default]}>
              {address}
            </Text>
          </View>

          {/* Цена */}
          <View style={[styles.priceBlock, PriceBlockStyles.default]}>
            <Text style={[styles.mainPrice, MainPriceStyles.default]}>
              {price}
            </Text>
            <Text style={[styles.priceSuffix, PriceSuffixStyles.default]}>
              /сутки
            </Text>
          </View>

          {/* Кнопка бронирования */}
          {onBookPress && (
            <TouchableOpacity
              style={styles.bookButton}
              onPress={onBookPress}
              activeOpacity={0.7}
            >
              <Text style={styles.bookButtonText}>Забронировать</Text>
            </TouchableOpacity>
          )}
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
  clubCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#EFF3F8',
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  badgeIcon: {
    width: 16,
    height: 16,
    color: '#7D8EAA',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7D8EAA',
  },
  heartButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EFF3F8',
    borderRadius: 100,
    padding: 8,
  },
  heartIcon: {
    width: 20,
    height: 20,
    color: '#A1B0CA',
  },
  contentBlock: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleAddress: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'left',
  },
  address: {
    textAlign: 'left',
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
  bookButton: {
    backgroundColor: '#EFF3F8',
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#008FD2',
  },
});

export default ClubCard;
