import React from 'react';
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';


interface AvatarProps {
  type?: AvatarType;
  initials?: string;
  image?: ImageSourcePropType;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Avatar: React.FC<AvatarProps> = ({
  type = 'none',
  initials,
  image,
  style,
  textStyle,
}) => {
  // Получаем стили для выбранного типа
  const containerStyleFromType = AvatarContainerStyles[type];
  const textStyleFromType = AvatarTextStyles[type];

  return (
    <View style={[styles.container, containerStyleFromType, style]}>
      {image ? (
        <Image source={image} style={styles.image} />
      ) : initials ? (
        <Text style={[styles.text, textStyleFromType, textStyle]}>
          {initials}
        </Text>
      ) : (
        <Text style={[styles.text, textStyleFromType, textStyle]}>
          АБ
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Avatar;
