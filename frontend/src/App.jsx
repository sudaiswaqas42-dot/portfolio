import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
import PageMotion from './components/PageMotion';
import ThemeFilters from './components/ThemeFilters';
import RefreshIntro from './components/RefreshIntro';
import Home from './pages/Home';
import About from './pages/About';
import Work from './pages/Work';
import Login from './pages/Login';
import AdminEditor from './pages/AdminEditor';
import './styles.css';
function Layout(){
  const {pathname}=useLocation();
  const admin=/^\/(admin|login)/.test(pathname);
  return <>{!admin&&<><ThemeFilters/><RefreshIntro key={pathname}/><Navbar/><Cursor key={pathname}/></>}<Routes>
    <Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/work" element={<Work/>}/>
    <Route path="/login" element={<Login/>}/><Route path="/admin" element={<AdminEditor/>}/>
    <Route path="/index.html" element={<Navigate to="/" replace/>}/><Route path="/about.html" element={<Navigate to="/about" replace/>}/><Route path="/work.html" element={<Navigate to="/work" replace/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes><PageMotion/></>;
}
export default function App(){return <PortfolioProvider><BrowserRouter><Layout/></BrowserRouter></PortfolioProvider>}
