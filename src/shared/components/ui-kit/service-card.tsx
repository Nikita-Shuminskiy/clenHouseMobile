import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';


interface ServiceCardProps {
  title: string;
  price: string;
  unit: string;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  price,
  unit,
  style,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.serviceCard, ServiceCardContainerStyles.default, style]}>
        {/* Заголовок */}
        <Text style={[styles.title, ServiceCardTitleStyles.default]}>
          {title}
        </Text>

        {/* Ценовой блок */}
        <View style={[styles.priceBlock, ServiceCardPriceBlockStyles.default]}>
          <Text style={[styles.mainPrice, ServiceCardMainPriceStyles.default]}>
            {price}
          </Text>
          <Text style={[styles.priceSuffix, ServiceCardPriceSuffixStyles.default]}>
            /{unit}
          </Text>
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
  serviceCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
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
});

export default ServiceCard;
