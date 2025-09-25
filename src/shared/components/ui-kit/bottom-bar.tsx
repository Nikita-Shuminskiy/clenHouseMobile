import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';


interface BottomBarProps {
  mainPrice: string;
  secondaryPrice: string;
  buttonText: string;
  onButtonPress?: () => void;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

const BottomBar: React.FC<BottomBarProps> = ({
  mainPrice,
  secondaryPrice,
  buttonText,
  onButtonPress,
  style,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.bottomBar, BottomBarContainerStyles.default, style]}>
        {/* Ценовой блок */}
        <View style={[styles.priceBlock, PriceBlockStyles.default]}>
          <View style={styles.priceRow}>
            <Text style={[styles.mainPrice, MainPriceStyles.default]}>
              {mainPrice}
            </Text>
            <Text style={[styles.priceSuffix, SecondaryPriceStyles.default]}>
              /сутки
            </Text>
          </View>
          <Text style={[styles.secondaryPrice, SecondaryPriceStyles.default]}>
            {secondaryPrice}
          </Text>
        </View>

        {/* Кнопка */}
        <TouchableOpacity
          style={[styles.button, BottomBarButtonStyles.default]}
          onPress={onButtonPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, BottomBarButtonTextStyles.default]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBlock: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mainPrice: {
    textAlign: 'left',
  },
  priceSuffix: {
    textAlign: 'left',
  },
  secondaryPrice: {
    textAlign: 'left',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
});

export default BottomBar;
