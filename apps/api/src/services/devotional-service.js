import {
  hasDevotionalDispatch,
  listDevotionalSubscribers,
  listRecentDevotionalDispatches,
  saveDevotionalDispatch
} from "../lib/db.js";
import { devotionalConfig } from "../config/devotional.js";
import { generateDevotionalMessage } from "../integrations/openai-responses.js";
import { sendTextMessage } from "../integrations/evolution.js";
import { getActiveEvolutionInstance } from "./evolution-instance-service.js";

function formatInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    date: `${map.year}-${map.month}-${map.day}`,
    time: `${map.hour}:${map.minute}`,
    label: `${map.day}/${map.month}/${map.year} ${map.hour}:${map.minute}`
  };
}

function buildDispatchKey({ date, slot, timezone }) {
  return `${date}|${slot}|${timezone}`;
}

async function sendDevotionalToSubscriber({ subscriber, slot, dispatchKey, messageText }) {
  if (hasDevotionalDispatch({ dispatchKey, phone: subscriber.phone })) {
    return { skipped: true, reason: "already_sent", phone: subscriber.phone };
  }

  const payload = await sendTextMessage({
    phone: subscriber.phone,
    text: messageText
  });

  saveDevotionalDispatch({
    dispatchKey,
    phone: subscriber.phone,
    schedule: slot,
    timezone: subscriber.timezone || devotionalConfig.timezone,
    messageId: payload?.key?.id || null,
    status: "sent",
    payload
  });

  return {
    skipped: false,
    phone: subscriber.phone,
    messageId: payload?.key?.id || null
  };
}

export async function runDevotionalDispatch({ forceSlot = null, targetPhone = null } = {}) {
  const activeSubscribers = listDevotionalSubscribers({ activeOnly: true }).filter((subscriber) =>
    targetPhone ? subscriber.phone === targetPhone : true
  );

  if (activeSubscribers.length === 0) {
    return {
      executed: false,
      reason: "no_active_subscribers",
      results: []
    };
  }

  const now = new Date();
  const results = [];
  const generatedCache = new Map();

  for (const subscriber of activeSubscribers) {
    const timezone = subscriber.timezone || devotionalConfig.timezone;
    const localized = formatInTimeZone(now, timezone);
    const subscriberSchedule =
      Array.isArray(subscriber.schedule) && subscriber.schedule.length > 0
        ? subscriber.schedule
        : devotionalConfig.schedule;
    const slot = forceSlot || localized.time;

    if (!forceSlot && !subscriberSchedule.includes(slot)) {
      results.push({
        skipped: true,
        reason: "outside_schedule",
        phone: subscriber.phone,
        timezone,
        currentTime: localized.time
      });
      continue;
    }

    const messageCacheKey = `${localized.date}|${slot}|${timezone}`;
    let generated = generatedCache.get(messageCacheKey);
    if (!generated) {
      generated = await generateDevotionalMessage({
        slot,
        dateLabel: localized.label
      });
      generatedCache.set(messageCacheKey, generated);
    }

    results.push(
      await sendDevotionalToSubscriber({
        subscriber,
        slot,
        dispatchKey: buildDispatchKey({
          date: localized.date,
          slot,
          timezone
        }),
        messageText: generated.text
      })
    );
  }

  const sentCount = results.filter((item) => !item.skipped).length;
  return {
    executed: sentCount > 0,
    subscriberCount: activeSubscribers.length,
    generatedVariants: Array.from(generatedCache.values()).map((item) => ({
      id: item.id,
      preview: item.text.slice(0, 160)
    })),
    results
  };
}

export function getDevotionalStatus() {
  const now = new Date();
  return {
    enabled: devotionalConfig.enabled,
    timezone: devotionalConfig.timezone,
    schedule: devotionalConfig.schedule,
    activeEvolutionInstance: getActiveEvolutionInstance(),
    now: formatInTimeZone(now, devotionalConfig.timezone),
    subscribers: listDevotionalSubscribers({ activeOnly: false }),
    recentDispatches: listRecentDevotionalDispatches(20)
  };
}
