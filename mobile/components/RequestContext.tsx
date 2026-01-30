import React, { createContext, useContext, useState, ReactNode } from 'react';

type Contact = {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  isWezeepUser: boolean;
  country: string;
};

type RequestContextType = {
  selectedContacts: Contact[];
  setSelectedContacts: (contacts: Contact[]) => void;
  requestDetails: {
    requestType: 'same' | 'custom';
    requestGeo: 'international' | 'local-p2p' | '';
    amount: string;
    currency: string;
    message: string;
    customAmounts: { [key: string]: string };
    customCurrencies: { [key: string]: string };
    customMessages: { [key: string]: string };
    customRequestGeo: { [key: string]: 'international' | 'local-p2p' | '' };
  };
  setRequestDetails: (details: any) => void;
  resetRequest: () => void;
};

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: ReactNode }) {
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [requestDetails, setRequestDetails] = useState({
    requestType: 'same' as 'same' | 'custom',
    requestGeo: '' as 'international' | 'local-p2p' | '',
    amount: '',
    currency: 'USD',
    message: '',
    customAmounts: {},
    customCurrencies: {},
    customMessages: {},
    customRequestGeo: {},
  });

  const resetRequest = () => {
    setSelectedContacts([]);
    setRequestDetails({
      requestType: 'same',
      requestGeo: '',
      amount: '',
      currency: 'USD',
      message: '',
      customAmounts: {},
      customCurrencies: {},
      customMessages: {},
      customRequestGeo: {},
    });
  };

  return (
    <RequestContext.Provider
      value={{
        selectedContacts,
        setSelectedContacts,
        requestDetails,
        setRequestDetails,
        resetRequest,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequestContext() {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequestContext must be used within a RequestProvider');
  }
  return context;
}