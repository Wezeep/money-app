/**
 * Wezeep backend API client for send money flows (P2P and Worldwide).
 * Set EXPO_PUBLIC_API_BASE_URL or use default for local backend.
 */

const DEFAULT_BASE_URL = "http://localhost:8080";

export function getApiBaseUrl(): string {
  if (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL.replace(/\/$/, "");
  }
  return DEFAULT_BASE_URL;
}

/** Get auth token for API calls (e.g. from AsyncStorage / auth context). */
export async function getAuthToken(): Promise<string | null> {
  try {
    const { default: AsyncStorage } = await import("@react-native-async-storage/async-storage");
    return await AsyncStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

export type TransactionStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "DRAFT";

export type TransferType = "P2P" | "INTERNATIONAL";

export interface TransactionResponse {
  id: string;
  transferType: TransferType;
  senderId: string;
  senderName: string;
  senderWezeepId?: string;
  recipientId?: string;
  recipientName: string;
  recipientWezeepId?: string;
  recipientPhone?: string;
  recipientCountryCode?: string;
  amountSent: string;
  sentCurrency: string;
  amountReceived: string;
  receivedCurrency: string;
  exchangeRate?: string;
  transactionFee?: string;
  paymentMethod: string;
  deliveryMethod: string;
  status: TransactionStatus;
  reference?: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
  tags?: string[];
}

export interface SendP2PRequest {
  recipientId?: string;
  contactId?: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  notes?: string;
  tags?: string[];
}

export interface SendWorldwideRequest {
  recipientName: string;
  recipientPhone: string;
  countryCode: string;
  sendAmount: string;
  sendCurrency: string;
  receiveAmount: string;
  receiveCurrency: string;
  paymentMethod: string;
  deliveryMethod: string;
  notes?: string;
}

/** Options for API fetch; body is a JSON-serializable object (not RequestInit.body). */
export interface ApiFetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: object;
}

async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const base = getApiBaseUrl();
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body != null ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.message ?? json.error ?? text;
    } catch {
      // use text as message
    }
    throw new Error(message || `HTTP ${res.status}`);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

/** Map UI payment method id to backend value. */
export function mapPaymentMethodForApi(uiPaymentId: string): string {
  if (uiPaymentId.startsWith("wallet-")) return "WEEZEEP_WALLET";
  if (uiPaymentId === "card") return "CARD";
  if (uiPaymentId === "bank") return "BANK";
  return uiPaymentId || "WEEZEEP_WALLET";
}

export const transactionsApi = {
  sendP2P: (body: SendP2PRequest) =>
    apiFetch<TransactionResponse>("/api/transactions/send/p2p", {
      method: "POST",
      body: {
        ...body,
        paymentMethod: mapPaymentMethodForApi(body.paymentMethod),
      },
    }),

  sendWorldwide: (body: SendWorldwideRequest) =>
    apiFetch<TransactionResponse>("/api/transactions/send/worldwide", {
      method: "POST",
      body: {
        ...body,
        paymentMethod: mapPaymentMethodForApi(body.paymentMethod),
      },
    }),

  getTransaction: (id: string) =>
    apiFetch<TransactionResponse>(`/api/transactions/${id}`, { method: "GET" }),
};

// --- Auth ---
export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  wezeepId: string;
  homeCountry: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  userId: string;
  email: string;
  wezeepId: string;
}

export const authApi = {
  login: (body: AuthRequest) => apiFetch<AuthResponse>("/api/auth/login", { method: "POST", body }),
  register: (body: RegisterRequest) => apiFetch<AuthResponse>("/api/auth/register", { method: "POST", body }),
  refresh: (refreshToken: string) =>
    apiFetch<AuthResponse>(`/api/auth/refresh?refreshToken=${encodeURIComponent(refreshToken)}`, { method: "POST" }),
};

// --- User ---
export interface UserResponse {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  wezeepId: string;
  homeCountry: string;
  profileCompleted: boolean;
  wallets?: { currency: string; balance: string }[];
}

export const usersApi = {
  me: () => apiFetch<UserResponse>("/api/users/me", { method: "GET" }),
};

// --- Money requests ---
export interface CreateMoneyRequestRequest {
  recipientId?: string;
  contactId?: string;
  amount: string;
  currency: string;
  isFixedAmount?: boolean;
  notes?: string;
}

export interface MoneyRequestResponse {
  id: string;
  requesterId: string;
  requesterName: string;
  recipientId: string;
  recipientName: string;
  amount: string;
  currency: string;
  status: string;
  shareableLink?: string;
  createdAt: string;
}

export const moneyRequestsApi = {
  create: (body: CreateMoneyRequestRequest) => apiFetch<MoneyRequestResponse>("/api/money-requests", { method: "POST", body }),
  getSent: () => apiFetch<MoneyRequestResponse[]>("/api/money-requests/sent", { method: "GET" }),
  getReceived: () => apiFetch<MoneyRequestResponse[]>("/api/money-requests/received", { method: "GET" }),
  getById: (id: string) => apiFetch<MoneyRequestResponse>(`/api/money-requests/${id}`, { method: "GET" }),
  fulfill: (id: string) => apiFetch<MoneyRequestResponse>(`/api/money-requests/${id}/fulfill`, { method: "POST" }),
};

// --- Split bills ---
export interface CreateSplitBillRequest {
  title: string;
  totalAmount: string;
  currency: string;
  isEqualSplit: boolean;
  notes?: string;
  participants: { userId?: string; contactId?: string; amount?: string }[];
}

export interface SplitBillResponse {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  totalAmount: string;
  currency: string;
  isEqualSplit: boolean;
  status: string;
  groupLink?: string;
  participants: { id: string; userId: string; userName: string; amount: string; paidAmount: string; status: string }[];
}

export const splitBillsApi = {
  create: (body: CreateSplitBillRequest) => apiFetch<SplitBillResponse>("/api/split-bills", { method: "POST", body }),
  getCreated: () => apiFetch<SplitBillResponse[]>("/api/split-bills", { method: "GET" }),
  getParticipating: () => apiFetch<SplitBillResponse[]>("/api/split-bills/participating", { method: "GET" }),
  payMyShare: (splitBillId: string, participantId: string) =>
    apiFetch<SplitBillResponse>(`/api/split-bills/${splitBillId}/pay?participantId=${participantId}`, { method: "POST" }),
};

// --- Bill vendors & payments ---
export interface BillVendorResponse {
  id: string;
  name: string;
  category: string;
  icon?: string;
  color?: string;
}

export interface CreateBillPaymentRequest {
  vendorId: string;
  amount: string;
  currency: string;
  frequency: string;
  notes?: string;
}

export interface BillPaymentResponse {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: string;
  currency: string;
  frequency: string;
  status: string;
  reference?: string;
  createdAt: string;
}

export const billVendorsApi = {
  getAll: () => apiFetch<BillVendorResponse[]>("/api/bill-vendors", { method: "GET" }),
};

export const billPaymentsApi = {
  create: (body: CreateBillPaymentRequest) => apiFetch<BillPaymentResponse>("/api/bill-payments", { method: "POST", body }),
  getMyPayments: () => apiFetch<BillPaymentResponse[]>("/api/bill-payments", { method: "GET" }),
};

// --- Wallets ---
export interface WalletResponse {
  id: string;
  currency: string;
  balance: string;
}

export const walletsApi = {
  getAll: () => apiFetch<WalletResponse[]>("/api/wallets", { method: "GET" }),
};

// --- Contacts (for P2P/request money recipient resolution) ---
export interface ContactResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  wezeepId?: string;
  phoneNumber?: string;
  email?: string;
  avatarUrl?: string;
}

export const contactsApi = {
  getList: () => apiFetch<ContactResponse[]>("/api/contacts", { method: "GET" }),
};
