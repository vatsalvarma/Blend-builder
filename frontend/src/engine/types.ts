export type Axis = 'Fruity'|'Flowery'|'Sweet'|'Nutty'|'Spicy'|'Tangy'|'Strong'|'Bitter'|'Roasted';
export type Flavor = Record<Axis, number>;            // each 0..10
export type RoastIdx = 0|1|2|3;                       // light, medium, medium-dark, dark
export type BeanType = 'Arabica'|'Robusta'|'Liberica';

export interface Origin {
  id: string;            // 'kaapi','coorg_arabica'... never changes once live
  name: string; flag: string;   // flag = ISO country code, UI converts to emoji
  tag: string;                  // one-line taste story
  type: BeanType; grade?: string;   // 'AA','Cherry AA','Screen 17+'
  color: string;                // chip colour
  flavor: Flavor;               // measured at LIGHT roast (index 0)
  pricePerKg: number;           // rupees, ROASTED coffee sold to cafe. 0 = unknown, hide money
  inStock: boolean;
}
export type Ratios = Record<string, number>;          // origin id -> %, sum = 100
export interface BlendInput { selectedIds: string[]; ratios: Ratios; roastIdx: RoastIdx; }
export interface AxisValue { axis: Axis; value: number; }

export type ServeStyle = 'kaapi'|'espresso'|'pourover'|'mixed';
export type MachineId = 'none'|'single'|'hx'|'double';
export type GrinderId = 'blade'|'entry'|'commercial';
export interface Machine { id: MachineId; label: string; stability: number; }   // 0 = no machine
export interface Grinder { id: GrinderId; label: string; clarity: number; }
export interface FitResult { fit: number; label: string; notes: string[]; }
export interface Verdict { text: string; }

export interface Answers {
  audience: 'students'|'corporate'|'families'|'premium';
  region: 'south'|'north'|'west'|'east';
  price: 'budget'|'mid'|'premium';
  style: ServeStyle; machine: MachineId; grinder: GrinderId;
}
export type Variant = 'signature'|'house'|'value';
export interface Suggestion extends BlendInput {
  variant: Variant; variantName: string;   // 'The Signature'
  blendName: string;                       // 'South Indian Boardroom Blend' <- apply THIS to builder
  why: string; machine: MachineId; grinder: GrinderId; style: ServeStyle; advantages: string[];
}
export interface Roles {
  robustaSouth: string; robustaBudget: string; robustaDefault: string;
  steadyArabica: string; steadyPremium: string;
  starPremium: string; starAudiencePremium: string; starSouth: string; starDefault: string;
  forgivingStar: string; baseWest: string; baseEast: string; baseDefault: string;
}
export interface Settings {
  showAI: boolean; showMenuFit: boolean; featuredBlendIds: string[]; roles: Roles;
  doseGrams: Record<ServeStyle, number>;   // 0 = ask owner
  salesWhatsApp: string;                   // digits incl. country code; empty = skip WhatsApp step
  sampleSizesGrams: number[];
  flightPackGrams: number;                 // Upgrade A
  reorderLeadDays: number; freshDays: number;   // Upgrade B
}
export interface SavedBlend extends BlendInput { id: string; name: string; serveStyle: ServeStyle; createdAt: number; }

export type OrderStatus = 'new'|'contacted'|'shipped'|'feedback'|'closed';
export type FeedbackVerdict = 'perfect'|'too-bitter'|'too-weak'|'too-sour'|'flat';
export type FlightCode = 'A'|'B'|'C';
export interface FlightItem extends BlendInput { code: FlightCode; blendName: string; variant?: Variant; }
export interface Feedback { verdict: FeedbackVerdict; comment?: string; at: number; rank?: FlightCode[]; }  // rank = best first

export type CurrentProfile = 'commodity_filter'|'commodity_espresso'|'light_arabica';
export type Complaint = 'too-bitter'|'too-weak'|'too-sour'|'flat'|'burnt'|'price-only';
export interface MatchResult extends BlendInput { label: string; distance: number; fit: number; pricePerKg: number|null; }

export interface Supply extends BlendInput {
  id: string; orderId: string; cafeName: string; contactName: string; phone: string;
  blendName: string; serveStyle: ServeStyle; kg: number; deliveredAt: number; roastedAt: number;
  cupsPerDay: number; doseGrams: number; remindedAt?: number;
}
export interface AuditEntry { id: string; who: string; what: string; before: unknown; after: unknown; at: number; }
export interface Order extends BlendInput {
  id: string; blendName: string; serveStyle: ServeStyle;
  cafeName: string; contactName: string; phone: string; city: string;
  sampleGrams: number; consentAt: number; notes?: string;
  status: OrderStatus; createdAt: number; feedback?: Feedback;
  outcome?: 'won'|'lost';
  flight?: FlightItem[];                       // Upgrade A; top-level blend fields = item A
  switchFrom?: { profile: CurrentProfile; complaints: Complaint[]; currentPricePerKg?: number }; // Upgrade C
}
