'use client';
import Header from '@/components/main-page/header/Header';
import './globals.css';
import Section1 from '@/components/main-page/section1/Section1';
import Footer from '@/components/main-page/footer/Footer';

export default function Home() {

  return (
      <div className="flex flex-col">
        <div className="header"><Header/></div>
        <div className="section1"><Section1/></div>
        <div className="footer"><Footer/></div>
    </div>
  );
}