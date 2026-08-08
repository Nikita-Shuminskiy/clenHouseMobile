import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { DoneIcon } from '../../icons/icons/done-icon';
import { HARVEST_COLORS } from '../../harvest-theme';

interface CheckBoxProps {
  isActive?: boolean;
  onClick?: () => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({ onClick, isActive = false }) => {
  const activeClass = isActive ? styles.active : {};
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onClick} style={[styles.wrapper, activeClass]}>
      {isActive ? (
        <DoneIcon width={12} height={8} color={String(colors.orange)} />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: HARVEST_COLORS.bone,
  },
  active: {
    borderColor: HARVEST_COLORS.flame,
  },
});
export default CheckBox;
