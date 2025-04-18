import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaSpinner, FaDownload, FaEye } from 'react-icons/fa';

const API_URL = 'http://localhost:8000';

const POPForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [generatedPOP, setGeneratedPOP] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Carregar lista de empresas
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${API_URL}/companies/`);
        setCompanies(response.data);
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
        toast.error('Não foi possível carregar a lista de empresas');
      }
    };

    fetchCompanies();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setProgress(10);
    
    try {
      const formData = new FormData();
      
      // Adicionar todos os campos do formulário ao FormData
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      
      setProgress(30);
      
      // Enviar dados para o backend
      const response = await axios.post(`${API_URL}/pops/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setProgress(80);
      
      setGeneratedPOP(response.data);
      toast.success('POP gerado com sucesso!');
      
      // Obter URL de pré-visualização da capa
      if (response.data.id) {
        try {
          const previewResponse = await axios.get(`${API_URL}/preview-cover/${data.company_id}`, {
            responseType: 'blob'
          });
          setPreviewUrl(URL.createObjectURL(previewResponse.data));
        } catch (previewError) {
          console.error('Erro ao gerar pré-visualização:', previewError);
        }
      }
      
      setProgress(100);
    } catch (error) {
      console.error('Erro ao gerar POP:', error);
      toast.error('Erro ao gerar POP. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedPOP || !generatedPOP.id) return;
    
    try {
      const response = await axios.get(`${API_URL}/download/${generatedPOP.id}`, {
        responseType: 'blob'
      });
      
      // Criar URL para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${generatedPOP.procedure_name}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao baixar documento:', error);
      toast.error('Erro ao baixar o documento');
    }
  };

  const handlePreviewCover = async () => {
    const companyId = document.getElementById('company_id').value;
    if (!companyId) {
      toast.warning('Selecione uma empresa para visualizar a capa');
      return;
    }
    
    try {
      const response = await axios.get(`${API_URL}/preview-cover/${companyId}`, {
        responseType: 'blob'
      });
      setPreviewUrl(URL.createObjectURL(response.data));
      setShowPreview(true);
    } catch (error) {
      console.error('Erro ao gerar pré-visualização:', error);
      toast.error('Erro ao gerar pré-visualização da capa');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Criar Novo POP</h1>
      
      {generatedPOP ? (
        <div className="card mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">POP Gerado com Sucesso!</h2>
            
            {previewUrl && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Pré-visualização da Capa</h3>
                <img src={previewUrl} alt="Capa do POP" className="max-h-60 mx-auto border" />
              </div>
            )}
            
            <button 
              onClick={handleDownload} 
              className="btn-primary flex items-center mx-auto"
            >
              <FaDownload className="mr-2" />
              Baixar Documento
            </button>
            
            <button 
              onClick={() => setGeneratedPOP(null)} 
              className="btn-outline mt-4 mx-auto"
            >
              Criar Outro POP
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label className="form-label">Empresa *</label>
              <select
                id="company_id"
                className="input-field w-full"
                {...register('company_id', { required: 'Empresa é obrigatória' })}
              >
                <option value="">Selecione uma empresa</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {errors.company_id && (
                <p className="text-red-500 text-sm mt-1">{errors.company_id.message}</p>
              )}
              
              <button 
                type="button" 
                onClick={handlePreviewCover}
                className="btn-outline mt-2 text-sm"
              >
                <FaEye className="inline mr-1" /> Pré-visualizar capa
              </button>
              
              {showPreview && previewUrl && (
                <div className="mt-2 p-2 border rounded">
                  <img src={previewUrl} alt="Pré-visualização da capa" className="max-h-40 mx-auto" />
                  <button 
                    type="button" 
                    onClick={() => setShowPreview(false)}
                    className="text-sm text-red-600 block mx-auto mt-2"
                  >
                    Fechar pré-visualização
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label className="form-label">Nome do Procedimento *</label>
                <input
                  type="text"
                  className="input-field w-full"
                  {...register('procedure_name', { required: 'Nome do procedimento é obrigatório' })}
                />
                {errors.procedure_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.procedure_name.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="form-label">Código POP *</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex.: FIS.01"
                  {...register('pop_code', { required: 'Código POP é obrigatório' })}
                />
                {errors.pop_code && (
                  <p className="text-red-500 text-sm mt-1">{errors.pop_code.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="form-label">Departamento *</label>
                <input
                  type="text"
                  className="input-field w-full"
                  {...register('department', { required: 'Departamento é obrigatório' })}
                />
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="form-label">Periodicidade *</label>
                <select
                  className="input-field w-full"
                  {...register('periodicity', { required: 'Periodicidade é obrigatória' })}
                >
                  <option value="">Selecione</option>
                  <option value="Mensal">Mensal</option>
                  <option value="Diário">Diário</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Bimestral">Bimestral</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Anual">Anual</option>
                  <option value="Eventual">Eventual</option>
                </select>
                {errors.periodicity && (
                  <p className="text-red-500 text-sm mt-1">{errors.periodicity.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="form-label">Data Início *</label>
                <input
                  type="date"
                  className="input-field w-full"
                  {...register('start_date', { required: 'Data de início é obrigatória' })}
                />
                {errors.start_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="form-label">Data Meta</label>
                <input
                  type="date"
                  className="input-field w-full"
                  {...register('target_date')}
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label">Data Legal</label>
                <input
                  type="date"
                  className="input-field w-full"
                  {...register('legal_date')}
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label">Competência *</label>
                <select
                  className="input-field w-full"
                  {...register('competence', { required: 'Competência é obrigatória' })}
                >
                  <option value="">Selecione</option>
                  <option value="Mês Anterior">Mês Anterior</option>
                  <option value="Mês Atual">Mês Atual</option>
                  <option value="Mês Seguinte">Mês Seguinte</option>
                  <option value="2 meses antes">2 meses antes</option>
                  <option value="3 meses antes">3 meses antes</option>
                  <option value="Ano Atual">Ano Atual</option>
                  <option value="Ano Anterior">Ano Anterior</option>
                </select>
                {errors.competence && (
                  <p className="text-red-500 text-sm mt-1">{errors.competence.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="form-label">Regime Tributário *</label>
                <select
                  className="input-field w-full"
                  {...register('tax_regime', { required: 'Regime tributário é obrigatório' })}
                >
                  <option value="">Selecione</option>
                  <option value="Simples Nacional">Simples Nacional</option>
                  <option value="Lucro Presumido">Lucro Presumido</option>
                  <option value="Lucro Real">Lucro Real</option>
                  <option value="Terceiro Setor">Terceiro Setor</option>
                  <option value="MEI">MEI</option>
                  <option value="Doméstica">Doméstica</option>
                  <option value="Todos">Todos</option>
                </select>
                {errors.tax_regime && (
                  <p className="text-red-500 text-sm mt-1">{errors.tax_regime.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="form-label">Complexidade *</label>
                <select
                  className="input-field w-full"
                  {...register('complexity', { required: 'Complexidade é obrigatória' })}
                >
                  <option value="">Selecione</option>
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                </select>
                {errors.complexity && (
                  <p className="text-red-500 text-sm mt-1">{errors.complexity.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="form-label">Responsável *</label>
                <select
                  className="input-field w-full"
                  {...register('responsible', { required: 'Responsável é obrigatório' })}
                >
                  <option value="">Selecione</option>
                  <option value="Auxiliar">Auxiliar</option>
                  <option value="Assistente">Assistente</option>
                  <option value="Analista">Analista</option>
                  <option value="Coordenador">Coordenador</option>
                  <option value="Gerente">Gerente</option>
                </select>
                {errors.responsible && (
                  <p className="text-red-500 text-sm mt-1">{errors.responsible.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="form-label">Rotina Automática/Lote *</label>
                <select
                  className="input-field w-full"
                  {...register('automatic_routine', { required: 'Campo obrigatório' })}
                >
                  <option value="">Selecione</option>
                  <option value="Existe">Existe</option>
                  <option value="Não Existe">Não Existe</option>
                </select>
                {errors.automatic_routine && (
                  <p className="text-red-500 text-sm mt-1">{errors.automatic_routine.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="form-label">Tempo Médio Estimado *</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="hh:mm"
                  {...register('estimated_time', { 
                    required: 'Tempo estimado é obrigatório',
                    pattern: {
                      value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                      message: 'Formato inválido. Use hh:mm'
                    }
                  })}
                />
                {errors.estimated_time && (
                  <p className="text-red-500 text-sm mt-1">{errors.estimated_time.message}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="form-label">Descrição *</label>
              <p className="text-sm text-gray-600 mb-2">
                Cada etapa deve começar com verbo no infinitivo e terminar com ponto e vírgula (;)
              </p>
              <textarea
                className="input-field w-full h-64"
                {...register('description', { required: 'Descrição é obrigatória' })}
                placeholder="Acessar o sistema de captura de notas fiscais;
Selecionar a opção de importação de XML;
Verificar se todos os documentos foram importados corretamente;"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
            
            {loading && (
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-600 h-2.5 rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Gerando documento... {progress}%
                </p>
              </div>
            )}
            
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="btn-primary flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  'Gerar POP'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default POPForm;
