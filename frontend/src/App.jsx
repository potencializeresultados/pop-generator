import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Componentes
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CompanyForm from './pages/CompanyForm'
import POPForm from './pages/POPForm'
import POPList from './pages/POPList'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/company/new" element={<CompanyForm />} />
            <Route path="/pop/new" element={<POPForm />} />
            <Route path="/pop/list" element={<POPList />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  )
}

export default App
