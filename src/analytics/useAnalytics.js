import { logEvent } from "./analyticsClient";

export function useAnalytics(adminId) {
  return {
    track(event, metadata = {}) {
      return logEvent(event, metadata, adminId);
    },
  };
}
