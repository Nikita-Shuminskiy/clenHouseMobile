import type { VerifyTelegramRequest } from '../types';
import { TELEGRAM_MOBILE_DEEP_LINK } from '../constants/telegram';

const getOptionalString = (record: Record<string, unknown>, key: string) => {
  const value = record[key];
  return typeof value === 'string' && value.trim() ? value : undefined;
};

export const parseTelegramPayload = (
  value: unknown,
): VerifyTelegramRequest | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;
  const id = Number(record.id);
  const authDate = Number(record.auth_date);
  const firstName = getOptionalString(record, 'first_name');
  const hash = getOptionalString(record, 'hash');

  if (!Number.isFinite(id) || !Number.isFinite(authDate) || !firstName || !hash) {
    return null;
  }

  return {
    id,
    first_name: firstName,
    last_name: getOptionalString(record, 'last_name'),
    username: getOptionalString(record, 'username'),
    photo_url: getOptionalString(record, 'photo_url'),
    auth_date: authDate,
    hash,
    adToken: getOptionalString(record, 'adToken'),
  };
};

export const parseTelegramPayloadFromUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return parseTelegramPayload(Object.fromEntries(parsedUrl.searchParams));
  } catch {
    return null;
  }
};

export const buildTelegramMobileDeepLink = (searchParams: URLSearchParams) => {
  const query = searchParams.toString();
  return query ? `${TELEGRAM_MOBILE_DEEP_LINK}?${query}` : TELEGRAM_MOBILE_DEEP_LINK;
};
