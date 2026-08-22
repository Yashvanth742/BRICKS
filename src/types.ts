export type BricsNation = 'India' | 'China' | 'Brazil' | 'South Africa' | 'Russia' | 'UAE' | 'Egypt';

export type LanguageCode = 'en' | 'hi' | 'zh' | 'pt' | 'ru' | 'ar';

export interface BricsCorridor {
  id: string;
  name: string;
  nations: BricsNation[];
  center: [number, number]; // [lat, lng]
  zoom: number;
  description: string;
  primarySources: string[];
  currentAvgAqi: number;
  status: 'Critical' | 'Warning' | 'Moderate' | 'Good';
  crossBorderRisk: 'High' | 'Medium' | 'Low';
}

export interface Hotspot {
  id: string;
  title: string;
  corridorId: string;
  location: [number, number];
  country: BricsNation;
  type: 'Agricultural Stubble Fire' | 'Unsanctioned Smelter' | 'Cross-Border Smog Plume' | 'Port/Ship Emissions' | 'Coal Power Cluster';
  severity: 'Critical' | 'High' | 'Moderate';
  pm25: number;
  no2: number;
  so2: number;
  detectedAt: string;
  satelliteVerified: boolean;
  citizenReportCount: number;
  affectedNeighbors: BricsNation[];
  plumeDirection: string; // e.g. "NW to SE towards Punjab border"
}

export interface SensorNode {
  id: string;
  name: string;
  country: BricsNation;
  location: [number, number];
  pm25: number;
  pm10: number;
  no2: number;
  temp: number;
  humidity: number;
  windSpeed: number;
  windDir: number; // degrees
  lastUpdated: string;
}

export interface CitizenReport {
  id: string;
  timestamp: string;
  country: BricsNation;
  locationName: string;
  coordinates: [number, number];
  imageUrl?: string;
  rawText: string;
  language: LanguageCode;
  detectedCategory: string;
  confidenceScore: number;
  estimatedPm25: number;
  geminiAnalysis?: GeminiVisionResult;
  status: 'Verified' | 'Pending Review' | 'Flagged';
}

export interface GeminiVisionResult {
  detectedSources: string[];
  smokeOpacity: 'Heavy' | 'Moderate' | 'Light';
  estimatedAqiImpact: number;
  healthRiskLevel: 'Hazardous' | 'Unhealthy' | 'Sensitive' | 'Moderate';
  recommendedIntervention: string;
  aiExplanation: string;
}

export interface FederatedNode {
  country: BricsNation;
  institution: string;
  modelType: string;
  localDataPoints: number;
  currentLoss: number;
  accuracy: number;
  epsilonPrivacy: number; // Differential privacy parameter
  status: 'Training' | 'Aggregating' | 'Synced';
  lastSync: string;
  contributedWeights: number; // MB
}

export interface ForecastPoint {
  hour: string;
  pm25: number;
  no2: number;
  so2: number;
  whoLimit: number;
  predictedSpike: boolean;
}

export interface GeminiAlertBrief {
  id: string;
  timestamp: string;
  corridor: string;
  riskLevel: 'EMERGENCY RED' | 'WARNING ORANGE' | 'ADVISORY YELLOW';
  title: string;
  summary: string;
  affectedBricsNations: BricsNation[];
  rootCauses: string[];
  suggestedActions: {
    authority: string;
    action: string;
    priority: 'Immediate' | 'Within 6 Hours' | 'Within 24 Hours';
  }[];
  diplomaticProtocolTriggered: string;
}
