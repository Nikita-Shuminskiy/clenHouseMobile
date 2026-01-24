import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Animated } from 'react-native';
import { OrderStatus } from '@/src/modules/orders/types/orders';
import useTheme from '@/src/shared/use-theme/use-theme';

interface OrderStatusSelectProps {
  selectedStatus?: OrderStatus;
  onStatusChange: (status?: OrderStatus) => void;
}

const OrderStatusSelect: React.FC<OrderStatusSelectProps> = ({ selectedStatus, onStatusChange }) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  const statusOptions = [
    { value: undefined, label: 'В работе' }, // ASSIGNED + IN_PROGRESS
    { value: OrderStatus.ASSIGNED, label: 'Назначенные' },
    { value: OrderStatus.IN_PROGRESS, label: 'В процессе' },
    { value: OrderStatus.DONE, label: 'Завершенные' },
    { value: OrderStatus.CANCELED, label: 'Отмененные' },
  ];

  const selectedLabel = statusOptions.find(opt => opt.value === selectedStatus)?.label || 'В работе';

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(300);
    }
  }, [modalVisible]);

  const handleSelect = (status?: OrderStatus) => {
    onStatusChange(status);
    setModalVisible(false);
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.selectButton,
          {
            backgroundColor: colors.grey100,
            borderColor: colors.grey200,
          },
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.selectButtonText,
            { color: colors.grey900 },
          ]}
        >
          {selectedLabel}
        </Text>
        <Text style={[styles.arrow, { color: colors.muted }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <Animated.View
            style={[
              styles.modalOverlayAnimated,
              {
                opacity: fadeAnim,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.modalContent,
              { backgroundColor: colors.white },
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.grey900 }]}>
                Выберите статус
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Text style={[styles.closeButtonText, { color: colors.muted }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            >
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value || 'all'}
                  style={[
                    styles.optionItem,
                    selectedStatus === option.value && {
                      backgroundColor: 'rgba(255, 94, 0, 0.15)',
                    },
                  ]}
                  onPress={() => handleSelect(option.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: selectedStatus === option.value
                          ? colors.primary500
                          : colors.grey900,
                        fontWeight: selectedStatus === option.value ? '600' : '400',
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selectedStatus === option.value && (
                    <Text style={[styles.checkmark, { color: colors.primary500 }]}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  selectButtonText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  arrow: {
    fontSize: 10,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlayAnimated: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 32,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '300',
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  optionText: {
    fontFamily: 'Onest',
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderStatusSelect;

