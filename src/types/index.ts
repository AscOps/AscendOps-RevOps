export interface ResultEntry {
  domain: string;
  name?: string;
  publisherId?: string;
  sellerId?: string;
  relationship?: string;
  type?: string;
  sourceUrl?: string;
  [key: string]: any; // Allow for additional properties
}