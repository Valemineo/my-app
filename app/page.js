'use client'
import React, { useState } from 'react';
import { Search, Download, FileSpreadsheet, Building2, Users, MapPin } from 'lucide-react';

const LeadSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const stats = {
    total: "63.328.558",
    estados: {
      AC: "148.547",
      AL: "607.395",
      AM: "671.726",
      AP: "142.344",
      BA: "2.748.553",
      CE: "1.247.859",
      DF: "989.734",
      ES: "754.283"
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setSearchResults(null);
    setLoading(true);

    if (selectedFilter === 'cnpj') {
      const cnpj = searchTerm.replace(/\D/g, ''); // Remove caracteres especiais

      if (cnpj.length === 14) {
        try {
          const response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`);
          if (!response.ok) {
            throw new Error('Erro na busca. Verifique o CNPJ e tente novamente.');
          }

          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error("Erro na requisição:", error);
          setError("Erro na busca. Verifique o CNPJ e tente novamente.");
        } finally {
          setLoading(false);
        }
      } else {
        setError('Por favor, insira um CNPJ válido com 14 dígitos.');
        setLoading(false);
      }
    } else {
      setError('Apenas a busca por CNPJ está implementada no momento.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              <span className="text-2xl font-light">LeadSearch</span>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">Preços</button>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">Login</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-light text-gray-800 mb-6">Encontre empresas em nossa base de dados</h1>
          <p className="text-xl text-gray-600 mb-12">Acesse informações detalhadas de milhões de empresas brasileiras</p>
        </div>

        <div className="text-center mb-16 animate-fade-in">
          <div className="text-6xl font-bold text-blue-600 mb-4">{stats.total}</div>
          <div className="text-2xl text-gray-600 font-light">EMPRESAS CADASTRADAS</div>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className={`bg-white rounded-xl shadow-lg transition-all duration-200 ${isSearchFocused ? 'shadow-xl ring-2 ring-blue-500' : ''}`}>
            <form onSubmit={handleSearch} className="p-2">
              <div className="flex gap-2 px-4 py-2 border-b">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedFilter === 'todos' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setSelectedFilter('todos')}
                >
                  Todos
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedFilter === 'cnpj' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setSelectedFilter('cnpj')}
                >
                  CNPJ
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedFilter === 'razao' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setSelectedFilter('razao')}
                >
                  Razão Social
                </button>
              </div>
              
              <div className="flex gap-2 p-2">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Digite sua busca aqui..."
                    className="w-full px-6 py-4 text-lg border border-gray-300 text-gray-800 rounded-lg focus:outline-none"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
                </div>
                <button
                  type="submit"
                  className="px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                  {loading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {searchResults && (
          <div className="container mx-auto px-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto text-gray-800">
              <h2 className="text-2xl font-semibold mb-4">{searchResults.razao_social || 'Razão Social não disponível'}</h2>
              <p><strong>CNPJ:</strong> {searchResults.cnpj || 'CNPJ não disponível'}</p>
              <p><strong>Endereço:</strong> {`${searchResults.logradouro || ''}, ${searchResults.numero || ''}, ${searchResults.municipio || ''} - ${searchResults.uf || ''}`}</p>
              <p><strong>Atividade Principal:</strong> {searchResults.atividade_principal?.[0]?.text || 'Atividade Principal não disponível'}</p>
            </div>
          </div>
        )}


          {/* Cards de Recursos */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FileSpreadsheet className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Exportação em Massa</h3>
            <p className="text-gray-600">
              Exporte dados em diversos formatos para análise detalhada
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Dados Completos</h3>
            <p className="text-gray-600">
              Informações detalhadas sobre sócios e administradores
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Filtro por Localização</h3>
            <p className="text-gray-600">
              Encontre empresas por estado, cidade ou região
            </p>
          </div>
        </div>

        {/* Seção Estados */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            Distribuição por Estado
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(stats.estados).map(([estado, quantidade]) => (
              <div key={estado} className="bg-white/60 p-4 rounded-lg hover:bg-white transition-colors">
                <div className="text-sm text-gray-600 mb-1">{estado}</div>
                <div className="text-xl font-semibold text-gray-800">
                  {quantidade}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-flex items-center gap-2 font-medium transition-colors">
            <Download className="h-5 w-5" />
            Baixar Amostra Grátis
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Sobre</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Quem Somos</li>
                <li>Nossa API</li>
                <li>Preços</li>
                <li>Contato</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Base de Dados</li>
                <li>Integrações</li>
                <li>Documentação</li>
                <li>Suporte</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Termos de Uso</li>
                <li>Privacidade</li>
                <li>Cookies</li>
                <li>Licenças</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Redes Sociais</h3>
              <ul className="space-y-2 text-gray-600">
                <li>LinkedIn</li>
                <li>Twitter</li>
                <li>Instagram</li>
                <li>Facebook</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-gray-600">
            © 2024 LeadSearch. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LeadSearchPage;

