import React, { createContext, useState, useEffect, useContext } from 'react';

export const TableContext = createContext(null);

export const TableProvider = ({ children }) => {
  const [tableNumber, setTableNumberState] = useState(() => {
    return localStorage.getItem('brew_bite_table') || '';
  });

  const [customerPhone, setCustomerPhoneState] = useState(() => {
    return localStorage.getItem('brew_bite_phone') || '';
  });

  const [hasSeenModal, setHasSeenModal] = useState(() => {
    return sessionStorage.getItem('brew_bite_seen_table_modal') === 'true';
  });

  // Check URL params for table on load or route changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, []);

  const setTableNumber = (num) => {
    const cleanNum = (num || '').toString().trim();
    setTableNumberState(cleanNum);
    if (cleanNum) {
      localStorage.setItem('brew_bite_table', cleanNum);
    } else {
      localStorage.removeItem('brew_bite_table');
    }
  };

  const setCustomerPhone = (phone) => {
    const cleanPhone = (phone || '').toString().trim();
    setCustomerPhoneState(cleanPhone);
    if (cleanPhone) {
      localStorage.setItem('brew_bite_phone', cleanPhone);
    } else {
      localStorage.removeItem('brew_bite_phone');
    }
  };

  const markModalSeen = (seen = true) => {
    setHasSeenModal(seen);
    sessionStorage.setItem('brew_bite_seen_table_modal', seen ? 'true' : 'false');
  };

  const clearTable = () => {
    setTableNumberState('');
    localStorage.removeItem('brew_bite_table');
    markModalSeen(false);
  };

  return (
    <TableContext.Provider
      value={{
        tableNumber,
        setTableNumber,
        customerPhone,
        setCustomerPhone,
        hasSeenModal,
        setHasSeenModal: markModalSeen,
        clearTable,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};
