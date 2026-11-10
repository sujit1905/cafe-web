import React, { useEffect, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import CartDrawer from '../components/CartDrawer.jsx';
import TableWelcomeModal from '../components/TableWelcomeModal.jsx';
import { useTable } from '../hooks/useTable.js';

export default function CustomerLayout() {
  const [searchParams] = useSearchParams();
  const { tableNumber, setTableNumber, hasSeenModal, setHasSeenModal } = useTable();
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  useEffect(() => {
    const tableParam = searchParams.get('table');
    const scanParam = searchParams.get('scan');
    if (tableParam) {
      setTableNumber(tableParam);
      if (!hasSeenModal) {
        setIsWelcomeModalOpen(true);
      }
    } else if (scanParam === '1') {
      setIsWelcomeModalOpen(true);
    }
  }, [searchParams, hasSeenModal, setTableNumber]);

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-espresso font-sans selection:bg-terracotta selection:text-white">
      {/* Navigation */}
      <Navbar onOpenTableModal={() => setIsWelcomeModalOpen(true)} />

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Table Welcome Modal */}
      <TableWelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => {
          setIsWelcomeModalOpen(false);
          setHasSeenModal(true);
        }}
        tableNumber={tableNumber}
      />
    </div>
  );
}
