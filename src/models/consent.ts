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

export interface ConsentEventHistory {
  id: string;
  consents: ConsentEventHistoryRecord[];
}

export interface ConsentEventHistoryRecord {
  email_notifications: boolean;
  sms_notifications: boolean;
  created_at: Date;
}
