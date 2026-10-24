export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: string;
  status: 'idle' | 'working' | 'resting';
  taskProgress: number;
  outputCount: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'revenue' | 'error';
}

export interface RevenueStream {
  id: string;
  name: string;
  type: string;
  earnings: number;
  visitors: number;
  clicks: number;
  conversions: number;
  conversionRate: number;
  active: boolean;
  status: string;
  config?: Record<string, any>;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  seoScore: number;
  keywords: string[];
  date: string;
  category: string;
  affiliateBanner: {
    productName: string;
    productPrice: string;
    affiliateUrl: string;
  } | null;
  views: number;
  clicks: number;
  earnings: number;
}

export interface DigitalProduct {
  id: string;
  title: string;
  description: string;
  content?: string;
  price: number;
  sales: number;
  earnings: number;
  category: string;
  pages: number;
  buyLink?: string;
  stripeId?: string;
  priceId?: string;
}

export interface Transaction {
  id: string;
  timestamp: string;
  productName: string;
  amount: number;
  streamName: string;
  country: string;
}

export interface MicroService {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  status: 'healthy' | 'error' | 'deploying';
  pricingType: 'subscription' | 'pay_as_you_go';
  pricePerCall: number;
  monthlyPrice: number;
  callsCount: number;
  earnings: number;
  uptime: number;
  subscribersCount: number;
  stripeId?: string;
  priceId?: string;
}

export interface Incident {
  id: string;
  serviceId: string;
  serviceName: string;
  errorMessage: string;
  timestamp: string;
  status: 'resolved' | 'active';
  resolutionLog?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: string;
}

export interface PlatformConfig {
  niche: string;
  language: string;
  adsensePubId: string;
  amazonAffiliateTag: string;
  youtubeChannelId?: string;
  youtubeApiKey?: string;
  googleCloudProjectId?: string;
  amazonAccessKeyId?: string;
  amazonSecretKey?: string;
  stripeActive: boolean;
  autoPilotEnabled: boolean;
  generationTone: string;
  generationDensity?: string;
  targetAudience?: string;
  minCommission?: number;
  autoHealEnabled?: boolean;
  edgeCacheEnabled?: boolean;
  modelType?: string;
  selectedChannels?: string[];
}

export interface Invoice {
  id: string;
  invoiceNum: string;
  date: string;
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  url: string;
  status: 'archived' | 'pending';
}

export interface AutoFineConfig {
  enabled: boolean;
  stripeTaxEnabled: boolean;
  meteredBillingMode: 'api_calls' | 'bandwidth' | 'flat';
  activePayoutSchedule: 'daily' | 'weekly' | 'instantly';
  telegramWebhook: string;
  discordWebhook: string;
  arbitrageStrategy: 'aggressive' | 'steady' | 'conservative';
  payoutThreshold: number;
  lastPayoutDate: string;
  accountingVault: Invoice[];
  totalPayoutsSecured: number;
  autoReinvestEnabled: boolean;
  reinvestPercentage: number;
  
  // Real service integrations (Liaison Réelle)
  realStripeKey?: string;
  realStripeWebhookSecret?: string;
  realTelegramToken?: string;
  realTelegramChatId?: string;
  realDiscordWebhook?: string;
  realBankHolder?: string;
  realBankTransit?: string;
  realBankInst?: string;
  realBankAccount?: string;
  realBTCAddress?: string;
}

export interface ScrapedLead {
  id: string;
  name: string;
  email: string;
  company: string;
  source: 'LinkedIn' | 'GoogleMaps' | 'IndieHackers' | 'GitHub';
  industry: string;
  date: string;
  status: 'scraped' | 'pitched' | 'contacted' | 'converted';
  pitchSentiment?: string;
  valueProposed?: number;
}

export interface FourPillarsConfig {
  enabled: boolean;
  leadScraperEnabled: boolean;
  leadScraperVelocity: 'normal' | 'aggressive';
  targetIndustries: string[];
  targetCountries: string[];
  scrapedLeads: ScrapedLead[];
  seoFunnelEnabled: boolean;
  targetKeywords: string[];
  upsellServiceName: string;
  backlinkExchangeEnabled: boolean;
  articleTargetLength: 'short' | 'medium' | 'deep';
  stripeGatewayEnabled: boolean;
  customStripePricingUrl: string;
  monthlySubscriptionPrice: number;
  autoDiscountCode: string;
  autoDiscountPercent: number;
  socialBotEnabled: boolean;
  telegramChatId: string;
  telegramToken: string;
  discordWebhook: string;
  botFrequency: 'realtime' | 'hourly' | 'daily';
  lastLogPushed?: string;
}

export interface PlatformState {
  metrics: {
    totalRevenue: number;
    mrr: number;
    totalVisitors: number;
    conversionRate: number;
    activeChannels: number;
  };
  streams: RevenueStream[];
  agents: Agent[];
  logs: LogEntry[];
  articles: Article[];
  products: DigitalProduct[];
  transactions: Transaction[];
  config: PlatformConfig;
  microServices: MicroService[];
  incidents: Incident[];
  chatHistory: ChatMessage[];
  adminChatHistory?: ChatMessage[];
  autoFineConfig?: AutoFineConfig;
  isPaused?: boolean;
  isLiveSyncActive?: boolean;
  autonomyLevel?: number; // 1-5 Swiss-Army automation levels
  engineVelocity?: number;      // 1-100x high-velocity performance tuning
  currency?: 'CAD' | 'USD' | 'EUR' | 'GBP' | 'BTC';
  swissEliteProtocol?: 'cascade' | 'aggressive' | 'wholesale' | 'arbitrage';
  swissVelocityMultiplier?: number;
  swissReinvestShare?: number;
  swissAutoPilotInterval?: number;
  swissHedgeBtcEnabled?: boolean;
  swissSafetyLockEnabled?: boolean;
  swissPlumeTargetMarket?: string;
  swissPlumeArticleFormat?: string;
  swissPlumeTone?: string;
  swissSeoMetadataFormat?: string;
  swissSeoIndexSpeed?: string;
  swissMakerProductTheme?: string;
  swissMakerPricingFactor?: string;
  swissMercatoAmazonStrategy?: string;
  swissMercatoCheckoutSpeed?: string;
  swissComptableCompliance?: string;
  swissComptableLogFormat?: string;
  swissTresorierHedgeThreshold?: number;
  swissTresorierPaymentGateway?: string;
  fourPillarsConfig?: FourPillarsConfig;
  adminPasswordHash?: string; // bcrypt hash for admin authentication
}
