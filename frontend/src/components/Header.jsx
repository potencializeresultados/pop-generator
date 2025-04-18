import React from 'react'
import { Link } from 'react-router-dom'
import { FaFileAlt, FaBuilding } from 'react-icons/fa'

const Header = () => {
  return (
    <header className="header">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <FaFileAlt className="mr-2" />
            Gerador de POPs
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-gray-200">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/company/new" className="hover:text-gray-200">
                  Nova Empresa
                </Link>
              </li>
              <li>
                <Link to="/pop/new" className="hover:text-gray-200">
                  Novo POP
                </Link>
              </li>
              <li>
                <Link to="/pop/list" className="hover:text-gray-200">
                  Listar POPs
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
