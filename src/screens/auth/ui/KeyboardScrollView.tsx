
import React, { PropsWithChildren } from 'react'
import { StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';

/**
 * На Android включён edge-to-edge: окно не сжимается под клавиатуру, поэтому
 * `height` ничего не поднимал и поля оказывались под ней. Отступ считаем сами
 * на обеих системах.
 */
export const KeyboardScrollView: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior="padding"
    >
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
});