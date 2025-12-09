import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function FinanceiroPage() {
  const [periodo, setPeriodo] = useState('mes')

  const resumo = {
    entradas: 4580.00,
    saidas: 1250.00,
    saldo: 3330.00
  }

  const transacoes = [
    { id: 1, descricao: 'Corte - Joao Silva', tipo: 'entrada', valor: 45, data: '2024-12-05' },
    { id: 2, descricao: 'Barba - Pedro Santos', tipo: 'entrada', valor: 35, data: '2024-12-05' },
    { id: 3, descricao: 'Compra de produtos', tipo: 'saida', valor: 250, data: '2024-12-04' },
    { id: 4, descricao: 'Corte + Barba - Carlos Lima', tipo: 'entrada', valor: 70, data: '2024-12-04' },
    { id: 5, descricao: 'Conta de luz', tipo: 'saida', valor: 180, data: '2024-12-03' },
    { id: 6, descricao: 'Pomada Modeladora x3', tipo: 'entrada', valor: 135, data: '2024-12-03' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="input-field"
          >
            <option value="hoje">Hoje</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mes</option>
            <option value="ano">Este Ano</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Entradas</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                R$ {resumo.entradas.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Saidas</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                R$ {resumo.saidas.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Saldo</p>
              <p className={`text-3xl font-bold mt-1 ${resumo.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                R$ {resumo.saldo.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-secondary-500 mb-6">Ultimas Transacoes</h3>
        
        <div className="space-y-4">
          {transacoes.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  t.tipo === 'entrada' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {t.tipo === 'entrada' 
                    ? <ArrowUpRight className="h-5 w-5 text-green-600" />
                    : <ArrowDownRight className="h-5 w-5 text-red-600" />
                  }
                </div>
                <div>
                  <p className="font-medium text-secondary-500">{t.descricao}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(t.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <span className={`font-bold ${t.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                {t.tipo === 'entrada' ? '+' : '-'} R$ {t.valor.toFixed(2).replace('.', ',')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
