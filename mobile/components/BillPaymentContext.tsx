import React, { createContext, useContext, useState, ReactNode } from "react";

type BillPaymentContextType = {
  paymentType: "one-time" | "recurring";
  setPaymentType: (type: "one-time" | "recurring") => void;
  selectedVendor: {
    id: string;
    name: string;
    category: string;
    icon: string;
  } | null;
  setSelectedVendor: (vendor: any) => void;
  resetBillPayment: () => void;
};

const BillPaymentContext = createContext<BillPaymentContextType | undefined>(
  undefined
);

export function BillPaymentProvider({ children }: { children: ReactNode }) {
  const [paymentType, setPaymentType] = useState<"one-time" | "recurring">(
    "one-time"
  );
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const resetBillPayment = () => {
    setPaymentType("one-time");
    setSelectedVendor(null);
  };

  return (
    <BillPaymentContext.Provider
      value={{
        paymentType,
        setPaymentType,
        selectedVendor,
        setSelectedVendor,
        resetBillPayment,
      }}
    >
      {children}
    </BillPaymentContext.Provider>
  );
}

export function useBillPaymentContext() {
  const context = useContext(BillPaymentContext);
  if (context === undefined) {
    throw new Error(
      "useBillPaymentContext must be used within a BillPaymentProvider"
    );
  }
  return context;
}

// Alias for convenience
export const useBillPayment = useBillPaymentContext;
