import React from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} Gerador de POPs. Todos os direitos reservados.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-white hover:text-gray-300">
              <FaGithub size={24} />
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
