/**
 * DataFeedService
 * Unified service for querying regulatory data feeds.
 */

export interface SecFiling {
  id: string;
  type: "10-K" | "10-Q" | "8-K" | "Form 4" | "13D" | "13G";
  date: string;
  description: string;
  url: string;
}

export interface RegistryData {
  company_number: string;
  jurisdiction: string;
  status: "Active" | "Dissolved" | "In Liquidation" | "Struck Off";
  incorporation_date: string;
  registered_address: string;
  source: string;
}

const MOCK_SEC_DATA: Record<string, SecFiling[]> = {
  "c1": [
    { id: "s1", type: "10-K", date: "2023-12-15", description: "Annual Report for Volkov Investments", url: "#" },
    { id: "s2", type: "8-K", date: "2024-01-20", description: "Current Report: Change in Directors", url: "#" },
    { id: "s3", type: "13D", date: "2023-11-05", description: "Beneficial Ownership update by Alexander Volkov", url: "#" }
  ],
  "c4": [
    { id: "s4", type: "13G", date: "2023-08-12", description: "Passive ownership stake declaration", url: "#" }
  ]
};

const MOCK_REGISTRY_DATA: Record<string, RegistryData> = {
  "c1": {
    company_number: "BC123456",
    jurisdiction: "British Virgin Islands",
    status: "Active",
    incorporation_date: "2015-03-12",
    registered_address: "Quijano Chambers, P.O. Box 3159, Road Town, Tortola, British Virgin Islands",
    source: "BVI Financial Services Commission"
  },
  "c4": {
    company_number: "CH987654",
    jurisdiction: "Cayman Islands",
    status: "Active",
    incorporation_date: "2018-06-22",
    registered_address: "Walkers Corporate Limited, 190 Elgin Avenue, George Town, KY1-9008, Cayman Islands",
    source: "Cayman Islands General Registry"
  }
};

export const DataFeedService = {
  getSecFilings: async (entityId: string): Promise<SecFiling[]> => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 500));
    return MOCK_SEC_DATA[entityId] || [];
  },

  getRegistryData: async (entityId: string): Promise<RegistryData | null> => {
    await new Promise(r => setTimeout(r, 400));
    return MOCK_REGISTRY_DATA[entityId] || null;
  },

  getRegistryRisk: async (id: string): Promise<{ level: 'low' | 'medium' | 'high'; reason?: string }> => {
    const reg = await DataFeedService.getRegistryData(id)
    if (!reg) return { level: 'low' }
    
    if (reg.status !== 'Active') return { level: 'high', reason: 'Entity status is not Active' }
    // Simulate a risk check
    if (id === 'c1' || id === 'c3') {
      return { level: 'high', reason: 'High-risk jurisdiction with opaque beneficial ownership structure.' }
    }
    return { level: 'low' }
  },

  searchOpenCorporates: async (name: string): Promise<any[]> => {
    // Simple mock search
    return [
      { name: name, jurisdiction: "United Kingdom", company_number: "12345678", status: "Active" }
    ];
  },

  getLiveNews: async (query: string = 'geopolitics sanctions'): Promise<any[]> => {
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    if (!apiKey) return [{ title: "API Key missing - using mock news", description: "Please check .env.local" }];

    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`);
      const data = await response.json();
      return data.articles || [];
    } catch (error) {
      console.error("NewsAPI Error:", error);
      return [];
    }
  },

  getMarketPulse: async (): Promise<any[]> => {
    const apiKey = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY;
    if (!apiKey) return [{ symbol: "MOCK", price: "100.00", change: "+1.2%" }];

    try {
      // Fetching Global Quote for some major indices or related stocks as a proxy for "Market Pulse"
      const symbols = ['SPY', 'GLD', 'USO']; // S&P 500, Gold, Oil
      const results = await Promise.all(symbols.map(async (s) => {
        const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${s}&apikey=${apiKey}`);
        const data = await res.json();
        const quote = data['Global Quote'] || {};
        return {
          symbol: s,
          price: quote['05. price'] || "0.00",
          change: quote['10. change percent'] || "0.00%",
          isDown: (quote['10. change percent'] || "").startsWith('-')
        };
      }));
      return results;
    } catch (error) {
      console.error("AlphaVantage Error:", error);
      return [];
    }
  },

  getSanctionsAlerts: async (): Promise<any[]> => {
    // Simulating a stream of sanctions alerts
    await new Promise(r => setTimeout(r, 1000));
    return [
      { type: 'NEW_DESIGNATION', entity: 'Volkov Maritime SA', regime: 'EU/UK', gravity: 'high', timestamp: new Date().toISOString() },
      { type: 'ASSET_FREEZE', entity: 'Apex Global (Dubai)', source: 'OFAC', gravity: 'critical', timestamp: new Date().toISOString() }
    ];
  }
};
