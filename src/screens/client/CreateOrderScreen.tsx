import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Controller, useForm, useWatch } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router } from "expo-router";
import { toast } from "sonner-native";
import {
  useAddressSearch,
  useAddressSupportCheck,
  useCreateCustomerOrder,
  useCreateOrderPayment,
  useCustomerSubscription,
  useOrderPrice,
  useSaveAddress,
  useSavedAddresses,
} from "@/src/modules/customer/hooks";
import {
  AddressDetails,
  AddressSuggestion,
  PaymentMethod,
  SubscriptionStatus,
} from "@/src/modules/customer/types";
import {
  Card,
  CLIENT_COLORS,
  ClientScreen,
  Field,
  PrimaryButton,
  SectionTitle,
  StatusPill,
} from "./components/ClientUI";
import { formatMoney } from "./components/OrderSummaryCard";

type OrderForm = {
  addressQuery: string;
  description: string;
  notes: string;
  date: string;
  time: string;
  numberPackages: string;
  paymentMethod: PaymentMethod;
  building: string;
  buildingBlock: string;
  entrance: string;
  floor: string;
  apartment: string;
  domophone: string;
};

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const createScheduledAt = (date?: string, time?: string) => {
  const dateValue = date?.trim();
  const timeValue = time?.trim();
  if (!dateValue || !timeValue) return undefined;
  const candidate = new Date(`${dateValue}T${timeValue}:00`);
  if (Number.isNaN(candidate.getTime())) return undefined;
  return candidate.toISOString();
};

const getAddressLabel = (address?: AddressSuggestion | null) =>
  address?.display || address?.value || address?.unrestricted_value || "";

const CreateOrderScreen = () => {
  const [selectedAddress, setSelectedAddress] =
    React.useState<AddressSuggestion | null>(null);
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | undefined>();
  const [supportable, setSupportable] = React.useState<boolean | null>(null);
  const { data: subscription } = useCustomerSubscription();
  const hasActiveSubscription = subscription?.status === SubscriptionStatus.ACTIVE;
  const { data: savedAddresses } = useSavedAddresses();
  const saveAddress = useSaveAddress();
  const supportCheck = useAddressSupportCheck();
  const createOrder = useCreateCustomerOrder();
  const createPayment = useCreateOrderPayment();

  const form = useForm<OrderForm>({
    defaultValues: {
      addressQuery: "",
      description: "",
      notes: "",
      date: "",
      time: "",
      numberPackages: "2",
      paymentMethod: hasActiveSubscription ? "subscription" : "online",
      building: "",
      buildingBlock: "",
      entrance: "",
      floor: "",
      apartment: "",
      domophone: "",
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (hasActiveSubscription) {
      form.setValue("paymentMethod", "subscription");
      form.setValue("numberPackages", "2");
    }
  }, [form, hasActiveSubscription]);

  const addressQuery = useWatch({ control: form.control, name: "addressQuery" });
  const paymentMethod = useWatch({ control: form.control, name: "paymentMethod" });
  const numberPackagesRaw = useWatch({ control: form.control, name: "numberPackages" });
  const numberPackages = toNumber(numberPackagesRaw) ?? 2;
  const addressSearch = useAddressSearch(addressQuery);
  const priceQuery = useOrderPrice({
    numberPackages,
    addressId: selectedAddressId,
  });

  const selectAddress = async (address: AddressSuggestion, savedId?: string) => {
    setSelectedAddress(address);
    setSelectedAddressId(savedId);
    setSupportable(null);
    form.setValue("addressQuery", getAddressLabel(address), { shouldValidate: true });
    try {
      const isSupportable = await supportCheck.mutateAsync(address);
      setSupportable(isSupportable);
      if (!isSupportable) {
        toast.error("Адрес вне зоны обслуживания");
      }
    } catch {
      setSupportable(null);
    }
  };

  const buildAddressDetails = (data: OrderForm): AddressDetails => ({
    ...(toNumber(data.building) && { building: toNumber(data.building) }),
    ...(data.buildingBlock.trim() && { buildingBlock: data.buildingBlock.trim() }),
    ...(data.entrance.trim() && { entrance: data.entrance.trim() }),
    ...(toNumber(data.floor) && { floor: toNumber(data.floor) }),
    ...(toNumber(data.apartment) && { apartment: toNumber(data.apartment) }),
    ...(data.domophone.trim() && { domophone: data.domophone.trim() }),
  });

  const onSubmit = async (data: OrderForm) => {
    if (!selectedAddress) {
      toast.error("Выберите адрес из списка");
      return;
    }
    if (supportable === false) {
      toast.error("Этот адрес вне зоны обслуживания");
      return;
    }

    const addressDetails = buildAddressDetails(data);
    let addressId = selectedAddressId;

    if (!addressId) {
      try {
        const saved = await saveAddress.mutateAsync({
          address: selectedAddress,
          addressDetails,
          isPrimary: savedAddresses?.length === 0,
          isSupportableArea: supportable ?? true,
        });
        addressId = saved.id;
      } catch {
        // Заказ можно создать и без сохранения адреса.
      }
    }

    const order = await createOrder.mutateAsync({
      address: getAddressLabel(selectedAddress),
      ...(addressId && { addressId }),
      addressDetails,
      description: data.description.trim(),
      notes: data.notes.trim(),
      paymentMethod: data.paymentMethod,
      numberPackages,
      ...(createScheduledAt(data.date, data.time) && {
        scheduledAt: createScheduledAt(data.date, data.time),
      }),
      ...(selectedAddress.geo_lat && selectedAddress.geo_lon && {
        coordinates: {
          geo_lat: selectedAddress.geo_lat,
          geo_lon: selectedAddress.geo_lon,
        },
      }),
    });

    if (data.paymentMethod === "subscription" && hasActiveSubscription) {
      toast.success("Заказ создан", {
        description: "Оплата пройдет по активной подписке.",
      });
      router.replace("/(client-tabs)/orders" as any);
      return;
    }

    const payment = await createPayment.mutateAsync({
      orderId: order.id,
      amount: order.price,
    });

    router.replace({
      pathname: "/(client)/payment",
      params: {
        paymentId: payment.paymentId,
        paymentUrl: payment.paymentUrl,
        type: "order",
        orderId: order.id,
      },
    } as any);
  };

  return (
    <ClientScreen title="Новый заказ" subtitle="Адрес, время, пакеты и оплата">
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={28}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.formCard}>
          <SectionTitle>Адрес</SectionTitle>
          {savedAddresses?.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.savedList}>
                {savedAddresses.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => item.address && selectAddress(item.address, item.id)}
                    style={styles.savedAddress}
                  >
                    <Text style={styles.savedAddressText} numberOfLines={2}>
                      {getAddressLabel(item.address)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          ) : null}

          <Controller
            control={form.control}
            name="addressQuery"
            rules={{ required: "Адрес обязателен" }}
            render={({ field, fieldState }) => (
              <Field
                label="Адрес"
                value={field.value}
                onChangeText={(value) => {
                  field.onChange(value);
                  setSelectedAddress(null);
                  setSelectedAddressId(undefined);
                  setSupportable(null);
                }}
                placeholder="Начните вводить адрес"
                error={fieldState.error?.message}
              />
            )}
          />

          {addressSearch.isFetching ? (
            <ActivityIndicator color={CLIENT_COLORS.primary} />
          ) : addressSearch.data?.length && !selectedAddress ? (
            <View style={styles.suggestions}>
              {addressSearch.data.slice(0, 5).map((address, index) => (
                <Pressable
                  key={`${address.value}-${index}`}
                  style={styles.suggestion}
                  onPress={() => selectAddress(address)}
                >
                  <Text style={styles.suggestionText}>{getAddressLabel(address)}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {supportable !== null ? (
            <StatusPill
              label={supportable ? "Адрес обслуживается" : "Вне зоны"}
              tone={supportable ? "success" : "danger"}
            />
          ) : null}
        </Card>

        <Card style={styles.formCard}>
          <SectionTitle>Детали</SectionTitle>
          <View style={styles.grid}>
            {(["building", "buildingBlock", "entrance", "floor", "apartment", "domophone"] as const).map((name) => (
              <Controller
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <Field
                    label={{
                      building: "Дом",
                      buildingBlock: "Корпус",
                      entrance: "Подъезд",
                      floor: "Этаж",
                      apartment: "Квартира",
                      domophone: "Домофон",
                    }[name]}
                    value={field.value}
                    onChangeText={field.onChange}
                    keyboardType={["building", "floor", "apartment"].includes(name) ? "numeric" : "default"}
                  />
                )}
              />
            ))}
          </View>

          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <Field
                label="Описание"
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Например: коробки после переезда"
                multiline
              />
            )}
          />

          <Controller
            control={form.control}
            name="notes"
            render={({ field }) => (
              <Field
                label="Комментарий"
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Что важно знать курьеру"
                multiline
              />
            )}
          />
        </Card>

        <Card style={styles.formCard}>
          <SectionTitle>Время и оплата</SectionTitle>
          <View style={styles.grid}>
            <Controller
              control={form.control}
              name="date"
              render={({ field }) => (
                <Field
                  label="Дата"
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="2026-08-10"
                />
              )}
            />
            <Controller
              control={form.control}
              name="time"
              render={({ field }) => (
                <Field
                  label="Время"
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="11:00"
                />
              )}
            />
          </View>

          <Controller
            control={form.control}
            name="numberPackages"
            render={({ field }) => (
              <Field
                label="Количество пакетов"
                value={field.value}
                onChangeText={field.onChange}
                keyboardType="number-pad"
                editable={!hasActiveSubscription || paymentMethod !== "subscription"}
              />
            )}
          />

          <View style={styles.paymentTabs}>
            <Pressable
              onPress={() => form.setValue("paymentMethod", "online")}
              style={[
                styles.paymentTab,
                paymentMethod === "online" && styles.paymentTabActive,
              ]}
            >
              <Text style={[
                styles.paymentTabText,
                paymentMethod === "online" && styles.paymentTabTextActive,
              ]}>
                Онлайн
              </Text>
            </Pressable>
            <Pressable
              onPress={() => hasActiveSubscription && form.setValue("paymentMethod", "subscription")}
              style={[
                styles.paymentTab,
                paymentMethod === "subscription" && styles.paymentTabActive,
                !hasActiveSubscription && styles.paymentTabDisabled,
              ]}
            >
              <Text style={[
                styles.paymentTabText,
                paymentMethod === "subscription" && styles.paymentTabTextActive,
              ]}>
                Подписка
              </Text>
            </Pressable>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Итого</Text>
            <Text style={styles.totalValue}>
              {paymentMethod === "subscription"
                ? "По подписке"
                : priceQuery.isLoading
                  ? "Считаем..."
                  : formatMoney(priceQuery.data?.priceInKopecks)}
            </Text>
          </View>
        </Card>

        <PrimaryButton
          loading={createOrder.isPending || createPayment.isPending || saveAddress.isPending}
          onPress={form.handleSubmit(onSubmit)}
        >
          {paymentMethod === "subscription" ? "Создать заказ" : "Создать и оплатить"}
        </PrimaryButton>
      </KeyboardAwareScrollView>
    </ClientScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 120,
    gap: 12,
  },
  formCard: {
    gap: 12,
  },
  savedList: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 2,
  },
  savedAddress: {
    width: 170,
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CLIENT_COLORS.line,
    backgroundColor: CLIENT_COLORS.warmPanel,
    padding: 10,
    justifyContent: "center",
  },
  savedAddressText: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 18,
    color: CLIENT_COLORS.ink,
  },
  suggestions: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: CLIENT_COLORS.line,
  },
  suggestion: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: CLIENT_COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: CLIENT_COLORS.line,
  },
  suggestionText: {
    fontFamily: "Onest",
    fontSize: 14,
    lineHeight: 20,
    color: CLIENT_COLORS.ink,
  },
  grid: {
    gap: 12,
  },
  paymentTabs: {
    flexDirection: "row",
    gap: 8,
  },
  paymentTab: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: CLIENT_COLORS.line,
    backgroundColor: CLIENT_COLORS.card,
  },
  paymentTabActive: {
    borderColor: CLIENT_COLORS.primary,
    backgroundColor: CLIENT_COLORS.soft,
  },
  paymentTabDisabled: {
    opacity: 0.42,
  },
  paymentTabText: {
    fontFamily: "Onest",
    fontWeight: "700",
    color: CLIENT_COLORS.muted,
  },
  paymentTabTextActive: {
    color: CLIENT_COLORS.primary,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: CLIENT_COLORS.line,
    paddingTop: 12,
  },
  totalLabel: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 15,
    color: CLIENT_COLORS.muted,
  },
  totalValue: {
    fontFamily: "Onest",
    fontWeight: "800",
    fontSize: 20,
    color: CLIENT_COLORS.primaryDark,
  },
});

export default CreateOrderScreen;
