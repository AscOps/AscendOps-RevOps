import { ResultEntry } from '../types';

export const parseAdsTxt = (content: string): ResultEntry[] => {
  if (!content || typeof content !== 'string') {
    return [];
  }

  const lines = content.split('\n');
  const results: ResultEntry[] = [];

  for (let line of lines) {
    // Remove comments
    const commentIndex = line.indexOf('#');
    if (commentIndex !== -1) {
      line = line.substring(0, commentIndex);
    }

    // Skip empty lines
    line = line.trim();
    if (!line) continue;

    // Parse the line
    const parts = line.split(',').map(part => part.trim());
    
    if (parts.length >= 3) {
      const [domain, publisherId, relationship, ...rest] = parts;
      
      results.push({
        domain,
        publisherId,
        relationship: relationship.toUpperCase(),
        type: rest[0] || '',
        sourceUrl: 'ads.txt'
      });
    }
  }

  return results;
};

export const parseSellersJson = (data: any): ResultEntry[] => {
  if (!data || !data.sellers || !Array.isArray(data.sellers)) {
    return [];
  }

  const results: ResultEntry[] = [];

  for (const seller of data.sellers) {
    if (seller.domain) {
      results.push({
        domain: seller.domain,
        name: seller.name || '',
        sellerId: seller.seller_id || '',
        type: seller.is_passthrough === true ? 'Passthrough' : 'Direct',
        relationship: seller.is_passthrough === true ? 'RESELLER' : 'DIRECT',
        sourceUrl: 'sellers.json'
      });
    }
  }

  return results;
};