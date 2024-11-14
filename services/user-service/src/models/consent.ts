export interface Consent {
  id: 'email_notifications' | 'sms_notifications';
  enabled: boolean;
}

export interface ConsentEvent {
  id: string;
  user: {
    id: string;
  };
  consents: {
    email_notifications: boolean;
    sms_notifications: boolean;
  };
}
