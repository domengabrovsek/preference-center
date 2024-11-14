import { Type } from '@sinclair/typebox';

export const userIdSchema = Type.String({
  format: 'uuid',
  description: 'UUID v4 format identifier of the user',
  examples: ['ba1ad90d-b471-45a1-b5ca-b4a339e16ccf'],
});

export const userEmailSchema = Type.String({
  format: 'email',
  description: 'Valid email address',
  examples: ['user@example.com'],
});

export const consentSchema = Type.Object({
  id: Type.String({
    description: 'Consent identifier',
    enum: ['email_notifications', 'sms_notifications'],
  }),
  enabled: Type.Boolean({
    description: 'Consent status',
  }),
});
