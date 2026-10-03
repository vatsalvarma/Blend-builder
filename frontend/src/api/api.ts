import type {  Origin, Settings, Order, Feedback, AuditEntry, Supply, OrderStatus, FlightCode  } from '../engine/types';

export type NewOrder = Omit<Order,'id'|'status'|'createdAt'|'feedback'|'outcome'>;

export interface Api {
  getOrigins(opts?:{includeOutOfStock?:boolean}): Promise<Origin[]>;
  getSettings(): Promise<Settings>;
  createOrder(o: NewOrder): Promise<Order>;
  getFeedbackTarget(orderId:string, token:string): Promise<{blendName:string; flightCodes?:FlightCode[]}|null>; 
  submitFeedback(orderId:string, token:string, f:Omit<Feedback,'at'>): Promise<void>;
  
  // admin
  login(username:string, password:string): Promise<void>;
  saveOrigins(list:Origin[]): Promise<void>;  
  saveSettings(s:Settings): Promise<void>;
  listOrders(page?:number): Promise<Order[]>;
  setOrderStatus(id:string, status:OrderStatus): Promise<{feedbackToken?:string}>; 
  setOrderOutcome(id:string, outcome:'won'|'lost'): Promise<void>;
  listAudit(page?:number): Promise<AuditEntry[]>;
  listSupplies(): Promise<Supply[]>; 
  createSupply(s:Omit<Supply,'id'>): Promise<Supply>; 
  markReminded(id:string): Promise<void>;
}
