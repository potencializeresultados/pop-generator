import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaDownload, FaSpinner, FaSearch, FaTrash } from 'react-icons/fa';

const API_URL = 'http://localhost:8000';

const POPList = () => {
  const [pops, setPops] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Carregar POPs e empresas em paralelo
        const [popsResponse, companiesResponse] = await Promise.all([
          axios.get(`${API_URL}/pops/`),
          axios.get(`${API_URL}/companies/`)
        ]);
        
        setPops(popsResponse.data);
        setCompanies(companiesResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Não foi possível carregar a lista de POPs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async (popId) => {
    setDownloadingId(popId);
    
    try {
      const response = await axios.get(`${API_URL}/download/${popId}`, {
        responseType: 'blob'
      });
      
      // Encontrar o POP para usar seu nome no arquivo
      const pop = pops.find(p => p.id === popId);
      const fileName = pop ? `${pop.procedure_name}.docx` : `pop-${popId}.docx`;
      
      // Criar URL para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Download iniciado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar documento:', error);
      toast.error('Erro ao baixar o documento');
    } finally {
      setDownloadingId(null);
    }
  };

  // Filtrar POPs com base na pesquisa e filtro de empresa
  const filteredPops = pops.filter(pop => {
    const matchesSearch = searchTerm === '' || 
      pop.procedure_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pop.pop_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pop.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = filterCompany === '' || pop.company_id.toString() === filterCompany;
    
    return matchesSearch && matchesCompany;
  });

  // Encontrar nome da empresa pelo ID
  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Empresa não encontrada';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">POPs Gerados</h1>
      
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="input-field w-full pl-10"
                placeholder="Buscar por nome, código ou departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="md:w-64">
            <select
              className="input-field w-full"
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
            >
              <option value="">Todas as empresas</option>
              {companies.map(company => (
                <option key={company.id} value={company.id.toString()}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-red-600 text-4xl" />
            <span className="ml-3 text-lg">Carregando POPs...</span>
          </div>
        ) : filteredPops.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Nenhum POP encontrado</p>
            <p className="mt-2">Tente ajustar os filtros ou criar um novo POP</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome do Procedimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPops.map(pop => (
                  <tr key={pop.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pop.pop_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pop.procedure_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pop.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCompanyName(pop.company_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(pop.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDownload(pop.id)}
                        className="text-red-600 hover:text-red-900 mr-3"
                        disabled={downloadingId === pop.id}
                      >
                        {downloadingId === pop.id ? (
                          <FaSpinner className="animate-spin inline" />
                        ) : (
                          <FaDownload className="inline" />
                        )}
                        <span className="ml-1">Baixar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default POPList;
