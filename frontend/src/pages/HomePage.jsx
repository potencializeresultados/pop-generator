import React from 'react'
import { Link } from 'react-router-dom'
import { FaFileAlt, FaPlus, FaList } from 'react-icons/fa'

const HomePage = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Gerador de POPs</h1>
        <p className="text-xl text-gray-700 max-w-2xl">
          Crie Procedimentos Operacionais Padrão (POPs) de forma rápida e eficiente para sua empresa.
          Preencha o formulário, escolha as cores e obtenha um documento profissional em segundos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <FaBuilding className="text-red-600 text-5xl mb-4" />
            <h2 className="text-2xl font-bold mb-2">Cadastre sua Empresa</h2>
            <p className="mb-6 text-gray-600">
              Adicione sua empresa com logotipo e cores personalizadas para criar POPs com sua identidade visual.
            </p>
            <Link to="/company/new" className="btn-primary">
              Nova Empresa
            </Link>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <FaFileAlt className="text-red-600 text-5xl mb-4" />
            <h2 className="text-2xl font-bold mb-2">Crie um POP</h2>
            <p className="mb-6 text-gray-600">
              Preencha o formulário com os detalhes do procedimento e gere um documento DOCX formatado automaticamente.
            </p>
            <Link to="/pop/new" className="btn-primary">
              Novo POP
            </Link>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <FaList className="text-red-600 text-5xl mb-4" />
            <h2 className="text-2xl font-bold mb-2">Gerencie seus POPs</h2>
            <p className="mb-6 text-gray-600">
              Visualize, baixe e gerencie todos os POPs criados anteriormente em um só lugar.
            </p>
            <Link to="/pop/list" className="btn-primary">
              Listar POPs
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16 p-8 bg-gray-100 rounded-lg max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Por que usar o Gerador de POPs?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-red-600">Padronização</h3>
            <p>Garanta que todos os procedimentos sigam o mesmo formato e estrutura.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-red-600">Economia de Tempo</h3>
            <p>Reduza o tempo gasto na formatação manual de documentos.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-red-600">Identidade Visual</h3>
            <p>Aplique as cores e o logotipo da sua empresa em todos os documentos.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-red-600">Organização</h3>
            <p>Mantenha todos os seus POPs organizados e facilmente acessíveis.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
