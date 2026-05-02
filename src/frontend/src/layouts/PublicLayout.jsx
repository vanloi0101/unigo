import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingAction from '../components/FloatingAction';
import BottomNav from '../components/BottomNav';

export default function PublicLayout() {
  return (
    <div className="bg-brand-light text-brand-text antialiased">
      <Header />
      <main className="pb-[72px] md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <FloatingAction />
      <BottomNav />
    </div>
  );
}
