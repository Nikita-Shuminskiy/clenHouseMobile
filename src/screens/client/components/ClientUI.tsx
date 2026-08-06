import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/src/shared/use-theme";

export const CLIENT_COLORS = {
  bg: "#FAF7F3",
  card: "#FFFFFF",
  ink: "#272624",
  muted: "#74706A",
  soft: "#F4EFE8",
  line: "#E9DED4",
  primary: "#E85F23",
  primaryDark: "#B94113",
  accent: "#C4945C",
  danger: "#C84A3D",
  success: "#2E7D5B",
};

export const ClientScreen = ({
  children,
  title,
  subtitle,
  right,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
      {children}
    </View>
  );
};

export const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) => <View style={[styles.card, style]}>{children}</View>;

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

export const PrimaryButton = ({
  children,
  onPress,
  disabled,
  loading,
  variant = "primary",
}: {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) => (
  <Pressable
    onPress={disabled || loading ? undefined : onPress}
    style={({ pressed }) => [
      styles.button,
      variant === "secondary" && styles.secondaryButton,
      variant === "ghost" && styles.ghostButton,
      variant === "danger" && styles.dangerButton,
      (disabled || loading) && styles.disabledButton,
      pressed && !disabled && !loading && styles.pressed,
    ]}
  >
    {loading ? (
      <ActivityIndicator color={variant === "secondary" ? CLIENT_COLORS.primary : "#FFFFFF"} />
    ) : (
      <Text
        style={[
          styles.buttonText,
          (variant === "secondary" || variant === "ghost") && styles.secondaryButtonText,
        ]}
      >
        {children}
      </Text>
    )}
  </Pressable>
);

export const Field = ({
  label,
  error,
  multiline,
  ...props
}: TextInputProps & { label: string; error?: string }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor="#98A29A"
        onFocus={(event) => {
          setFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          props.onBlur?.(event);
        }}
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          focused && styles.inputFocused,
          !!error && styles.inputError,
          props.style,
        ]}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export const EmptyState = ({
  title,
  text,
}: {
  title: string;
  text?: string;
}) => (
  <Card style={styles.empty}>
    <Text style={styles.emptyTitle}>{title}</Text>
    {text ? <Text style={styles.emptyText}>{text}</Text> : null}
  </Card>
);

export const StatusPill = ({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger";
}) => (
  <View
    style={[
      styles.pill,
      tone === "success" && styles.pillSuccess,
      tone === "warning" && styles.pillWarning,
      tone === "danger" && styles.pillDanger,
    ]}
  >
    <Text
      style={[
        styles.pillText,
        tone === "success" && styles.pillSuccessText,
        tone === "warning" && styles.pillWarningText,
        tone === "danger" && styles.pillDangerText,
      ]}
    >
      {label}
    </Text>
  </View>
);

export const useClientTheme = () => {
  const theme = useTheme();
  return { ...theme, clientColors: CLIENT_COLORS };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CLIENT_COLORS.bg,
  },
  header: {
    paddingHorizontal: 18,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: "Onest",
    fontWeight: "800",
    fontSize: 24,
    lineHeight: 30,
    color: CLIENT_COLORS.ink,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: "Onest",
    fontSize: 14,
    lineHeight: 20,
    color: "#817B73",
  },
  card: {
    backgroundColor: CLIENT_COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: CLIENT_COLORS.line,
    shadowColor: "#3A2A1E",
    shadowOpacity: 0.055,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 24,
    color: CLIENT_COLORS.ink,
    marginBottom: 10,
  },
  button: {
    minHeight: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: CLIENT_COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: "#FFF3EA",
    borderWidth: 1,
    borderColor: "#F3D6C5",
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  dangerButton: {
    backgroundColor: CLIENT_COLORS.danger,
  },
  disabledButton: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.75,
  },
  buttonText: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 15,
    lineHeight: 20,
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    color: CLIENT_COLORS.primary,
  },
  fieldWrap: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 18,
    color: CLIENT_COLORS.ink,
  },
  input: {
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CLIENT_COLORS.line,
    backgroundColor: "#FCFAF7",
    paddingHorizontal: 14,
    fontFamily: "Onest",
    fontSize: 15,
    lineHeight: 20,
    color: CLIENT_COLORS.ink,
  },
  inputMultiline: {
    minHeight: 84,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  inputFocused: {
    borderColor: CLIENT_COLORS.primary,
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: CLIENT_COLORS.danger,
  },
  errorText: {
    fontFamily: "Onest",
    fontSize: 12,
    lineHeight: 16,
    color: CLIENT_COLORS.danger,
  },
  empty: {
    alignItems: "center",
    gap: 6,
  },
  emptyTitle: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 16,
    color: CLIENT_COLORS.ink,
  },
  emptyText: {
    fontFamily: "Onest",
    fontSize: 14,
    lineHeight: 20,
    color: CLIENT_COLORS.muted,
    textAlign: "center",
  },
  pill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#F1ECE5",
  },
  pillSuccess: {
    backgroundColor: "#E9F5EE",
  },
  pillWarning: {
    backgroundColor: "#FFF0E5",
  },
  pillDanger: {
    backgroundColor: "#FBEAE6",
  },
  pillText: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 16,
    color: CLIENT_COLORS.muted,
  },
  pillSuccessText: {
    color: CLIENT_COLORS.success,
  },
  pillWarningText: {
    color: CLIENT_COLORS.primaryDark,
  },
  pillDangerText: {
    color: CLIENT_COLORS.danger,
  },
});
