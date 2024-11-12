import type { Consent } from './consent';

export interface User {
  id: string;
  email: string;
  consents: Consent[];
}
