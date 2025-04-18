import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { SketchPicker } from 'react-color';
import axios from 'axios';
import { FaUpload, FaSpinner } from 'react-icons/fa';

const API_URL = 'http://localhost:8000';

const CompanyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#FF0000');
  const [secondaryColor, setSecondaryColor] = useState('#000000');
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!logoFile) {
      toast.error('Por favor, faça upload do logotipo da empresa');
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('company_name', data.companyName);
      formData.append('primary_color', primaryColor);
      formData.append('secondary_color', secondaryColor);
      formData.append('logo', logoFile);

      const response = await axios.post(`${API_URL}/companies/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Empresa cadastrada com sucesso!');
      setLogoPreview(null);
      setLogoFile(null);
      // Redirecionar ou limpar formulário
    } catch (error) {
      console.error('Erro ao cadastrar empresa:', error);
      toast.error('Erro ao cadastrar empresa. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Cadastrar Nova Empresa</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label className="form-label">Nome da Empresa *</label>
            <input
              type="text"
              className="input-field w-full"
              {...register('companyName', { required: 'Nome da empresa é obrigatório' })}
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="form-label">Cor Primária *</label>
              <div className="relative">
                <div 
                  className="h-10 w-full rounded border border-gray-300 flex items-center px-3 cursor-pointer"
                  onClick={() => setShowPrimaryPicker(!showPrimaryPicker)}
                >
                  <div className="h-6 w-6 rounded mr-2" style={{ backgroundColor: primaryColor }}></div>
                  <span>{primaryColor}</span>
                </div>
                {showPrimaryPicker && (
                  <div className="absolute z-10 mt-1">
                    <div 
                      className="fixed inset-0" 
                      onClick={() => setShowPrimaryPicker(false)}
                    ></div>
                    <SketchPicker 
                      color={primaryColor} 
                      onChange={(color) => setPrimaryColor(color.hex)} 
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="form-label">Cor Secundária *</label>
              <div className="relative">
                <div 
                  className="h-10 w-full rounded border border-gray-300 flex items-center px-3 cursor-pointer"
                  onClick={() => setShowSecondaryPicker(!showSecondaryPicker)}
                >
                  <div className="h-6 w-6 rounded mr-2" style={{ backgroundColor: secondaryColor }}></div>
                  <span>{secondaryColor}</span>
                </div>
                {showSecondaryPicker && (
                  <div className="absolute z-10 mt-1">
                    <div 
                      className="fixed inset-0" 
                      onClick={() => setShowSecondaryPicker(false)}
                    ></div>
                    <SketchPicker 
                      color={secondaryColor} 
                      onChange={(color) => setSecondaryColor(color.hex)} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="form-label">Logotipo da Empresa *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {logoPreview ? (
                <div className="mb-4">
                  <img src={logoPreview} alt="Logo Preview" className="max-h-40 mx-auto" />
                </div>
              ) : (
                <div className="text-gray-500 mb-4">
                  <FaUpload className="mx-auto text-3xl mb-2" />
                  <p>Arraste e solte ou clique para selecionar</p>
                  <p className="text-sm">PNG, JPG ou JPEG (máx. 2MB)</p>
                </div>
              )}
              
              <input
                type="file"
                id="logo"
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={handleLogoChange}
              />
              <label 
                htmlFor="logo" 
                className="btn-outline inline-block cursor-pointer"
              >
                {logoPreview ? 'Alterar Logotipo' : 'Selecionar Logotipo'}
              </label>
            </div>
          </div>

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
                'Cadastrar Empresa'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;
