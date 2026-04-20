import { body } from "express-validator";

export const settingsValidator = [
  body("theme").optional().isIn(["light", "dark", "system"]),
  body("notificationPreferences.push").optional().isBoolean(),
  body("notificationPreferences.email").optional().isBoolean(),
  body("notificationPreferences.marketing").optional().isBoolean(),
  body("security.biometricLock").optional().isBoolean(),
  body("security.loginAlerts").optional().isBoolean(),
  body("security.trustedDeviceMode").optional().isBoolean()
];
