import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import { toast } from "sonner-native";
import {
  useCreateScheduledOrder,
  useCreateSubscriptionByPlan,
  useCreateSubscriptionPayment,
  useCustomerSubscription,
  useDeleteScheduledOrder,
  useScheduledOrders,
  useSubscriptionPlans,
  useToggleScheduledOrder,
} from "@/src/modules/customer/hooks";
import {
  ScheduleFrequency,
  ScheduledOrderPayload,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/src/modules/customer/types";
import {
  Card,
  CLIENT_COLORS,
  ClientScreen,
  EmptyState,
  Field,
  PrimaryButton,
  SectionTitle,
  StatusPill,
} from "./components/ClientUI";
import { formatMoney } from "./components/OrderSummaryCard";

type ScheduleForm = {
  address: string;
  preferredTime: string;
  startDate: string;
  notes: string;
};

const ClientSubscriptionScreen = () => {
  const { data: subscription, isLoading: isSubscriptionLoading } =
    useCustomerSubscription();
  const { data: plans, isLoading: isPlansLoading } = useSubscriptionPlans();
  const { data: schedules, isLoading: isSchedulesLoading } = useScheduledOrders();
  const createByPlan = useCreateSubscriptionByPlan();
  const createPayment = useCreateSubscriptionPayment();
  const createSchedule = useCreateScheduledOrder();
  const toggleSchedule = useToggleScheduledOrder();
  const deleteSchedule = useDeleteScheduledOrder();
  const form = useForm<ScheduleForm>({
    defaultValues: {
      address: "",
      preferredTime: "10:00",
      startDate: new Date().toISOString().slice(0, 10),
      notes: "",
    },
  });

  const active = subscription?.status === SubscriptionStatus.ACTIVE;

  const handlePlanPress = async (plan: SubscriptionPlan) => {
    const created = await createByPlan.mutateAsync(plan.id);
    const payment = await createPayment.mutateAsync({
      subscriptionId: created.id,
      subscriptionType: plan.type,
      planId: plan.id,
    });

    if (payment.status === "success" || !payment.paymentUrl) {
      toast.success("Подписка активирована");
      return;
    }

    router.push({
      pathname: "/(client)/payment",
      params: {
        paymentId: payment.paymentId,
        paymentUrl: payment.paymentUrl,
        type: "subscription",
      },
    } as any);
  };

  const handleCreateSchedule = async (data: ScheduleForm) => {
    if (!active) {
      toast.error("Расписание доступно только с активной подпиской");
      return;
    }
    const payload: ScheduledOrderPayload = {
      address: data.address.trim(),
      frequency: ScheduleFrequency.WEEKLY,
      preferredTime: data.preferredTime.trim(),
      startDate: new Date(`${data.startDate}T00:00:00`).toISOString(),
      notes: data.notes.trim(),
    };
    await createSchedule.mutateAsync(payload);
    form.reset({
      address: "",
      preferredTime: "10:00",
      startDate: new Date().toISOString().slice(0, 10),
      notes: "",
    });
    toast.success("Расписание создано");
  };

  return (
    <ClientScreen
      title="Подписка"
      subtitle="Тарифы и регулярный вывоз"
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.label}>Текущая подписка</Text>
              {isSubscriptionLoading ? (
                <ActivityIndicator color={CLIENT_COLORS.primary} />
              ) : subscription ? (
                <>
                  <Text style={styles.title}>
                    {active ? "Активна" : "Ожидает оплаты"}
                  </Text>
                  <Text style={styles.text}>
                    {subscription.ordersLimit === -1
                      ? "Безлимитные заказы"
                      : `${subscription.usedOrders ?? 0}/${subscription.ordersLimit ?? 0} заказов`}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.title}>Пока нет подписки</Text>
                  <Text style={styles.text}>Выберите тариф или оплачивайте разово.</Text>
                </>
              )}
            </View>
            <StatusPill label={active ? "active" : "online"} tone={active ? "success" : "warning"} />
          </View>
        </Card>

        <View>
          <SectionTitle>Тарифы</SectionTitle>
          {isPlansLoading ? (
            <ActivityIndicator color={CLIENT_COLORS.primary} />
          ) : plans?.length ? (
            <View style={styles.list}>
              {plans.map((plan) => (
                <Card key={plan.id} style={styles.plan}>
                  <View style={styles.row}>
                    <View style={styles.flex}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <Text style={styles.text}>{plan.description}</Text>
                    </View>
                    {plan.popular ? <StatusPill label="popular" tone="success" /> : null}
                  </View>
                  <Text style={styles.planPrice}>
                    {formatMoney(plan.finalPriceInKopecks ?? plan.priceInKopecks)}
                  </Text>
                  {plan.features?.slice(0, 4).map((feature) => (
                    <Text key={feature} style={styles.feature}>• {feature}</Text>
                  ))}
                  <PrimaryButton
                    loading={createByPlan.isPending || createPayment.isPending}
                    onPress={() => handlePlanPress(plan)}
                  >
                    Выбрать тариф
                  </PrimaryButton>
                </Card>
              ))}
            </View>
          ) : (
            <EmptyState title="Тарифы не найдены" />
          )}
        </View>

        <View>
          <SectionTitle>Регулярные заказы</SectionTitle>
          <Card style={styles.card}>
            <Controller
              control={form.control}
              name="address"
              rules={{ required: "Адрес обязателен" }}
              render={({ field, fieldState }) => (
                <Field
                  label="Адрес"
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="Адрес для регулярного вывоза"
                  error={fieldState.error?.message}
                />
              )}
            />
            <View style={styles.grid}>
              <Controller
                control={form.control}
                name="preferredTime"
                render={({ field }) => (
                  <Field label="Время" value={field.value} onChangeText={field.onChange} />
                )}
              />
              <Controller
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <Field label="Старт" value={field.value} onChangeText={field.onChange} />
                )}
              />
            </View>
            <Controller
              control={form.control}
              name="notes"
              render={({ field }) => (
                <Field
                  label="Комментарий"
                  value={field.value}
                  onChangeText={field.onChange}
                  multiline
                />
              )}
            />
            <PrimaryButton
              disabled={!active}
              loading={createSchedule.isPending}
              onPress={form.handleSubmit(handleCreateSchedule)}
            >
              Создать расписание
            </PrimaryButton>
          </Card>

          {isSchedulesLoading ? (
            <ActivityIndicator color={CLIENT_COLORS.primary} />
          ) : schedules?.length ? (
            <View style={styles.list}>
              {schedules.map((schedule) => (
                <Card key={schedule.id} style={styles.card}>
                  <View style={styles.row}>
                    <View style={styles.flex}>
                      <Text style={styles.planName}>{schedule.address}</Text>
                      <Text style={styles.text}>
                        {schedule.frequency}, {schedule.preferredTime ?? "без времени"}
                      </Text>
                    </View>
                    <StatusPill
                      label={schedule.isActive ? "active" : "paused"}
                      tone={schedule.isActive ? "success" : "warning"}
                    />
                  </View>
                  <View style={styles.actionsRow}>
                    <PrimaryButton
                      variant="secondary"
                      onPress={() =>
                        toggleSchedule.mutate({
                          id: schedule.id,
                          isActive: schedule.isActive,
                        })
                      }
                    >
                      {schedule.isActive ? "Пауза" : "Включить"}
                    </PrimaryButton>
                    <PrimaryButton
                      variant="danger"
                      onPress={() => deleteSchedule.mutate(schedule.id)}
                    >
                      Удалить
                    </PrimaryButton>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <EmptyState
              title="Расписаний нет"
              text="Создайте регулярный вывоз после подключения подписки."
            />
          )}
        </View>
      </ScrollView>
    </ClientScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 120,
    gap: 14,
  },
  card: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  flex: {
    flex: 1,
  },
  label: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 12,
    color: CLIENT_COLORS.accent,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 4,
    fontFamily: "Onest",
    fontWeight: "800",
    fontSize: 19,
    color: CLIENT_COLORS.ink,
  },
  text: {
    marginTop: 4,
    fontFamily: "Onest",
    fontSize: 14,
    lineHeight: 20,
    color: CLIENT_COLORS.muted,
  },
  list: {
    gap: 10,
  },
  plan: {
    gap: 12,
    backgroundColor: CLIENT_COLORS.warmPanel,
  },
  planName: {
    fontFamily: "Onest",
    fontWeight: "800",
    fontSize: 17,
    color: CLIENT_COLORS.ink,
  },
  planPrice: {
    fontFamily: "Onest",
    fontWeight: "900",
    fontSize: 26,
    color: CLIENT_COLORS.primaryDark,
  },
  feature: {
    fontFamily: "Onest",
    fontSize: 14,
    lineHeight: 20,
    color: CLIENT_COLORS.ink,
  },
  grid: {
    gap: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
});

export default ClientSubscriptionScreen;
