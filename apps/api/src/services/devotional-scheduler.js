import { devotionalConfig } from "../config/devotional.js";
import { runDevotionalDispatch } from "./devotional-service.js";

let schedulerHandle = null;
let lastTick = "";

export function startDevotionalScheduler() {
  if (!devotionalConfig.enabled || schedulerHandle) {
    return;
  }

  schedulerHandle = setInterval(async () => {
    const now = new Date();
    const currentMinute = new Intl.DateTimeFormat("sv-SE", {
      timeZone: devotionalConfig.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(now);

    if (currentMinute === lastTick) {
      return;
    }
    lastTick = currentMinute;

    try {
      await runDevotionalDispatch();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[devotional] scheduler error", error);
    }
  }, devotionalConfig.tickSeconds * 1000);
}
