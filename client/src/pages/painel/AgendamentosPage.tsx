import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Clock } from "lucide-react";

/* ============================
   Interfaces
============================= */
interface Agendamento {
  id: string;
  data: string;
  hora: string;
  status: string;
  cliente: { nome: string; telefone: string };
  servico: { nome: string; preco: number };
  funcionario: { usuario: { nome: string } } | null;
}

interface Funcionario {
  id: string;
  usuario: { nome: string };
}

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  /* Filtros */
  const statusOptions = ["Todos", "Agendado", "Confirmado", "Concluido", "Cancelado"];
  const [statusFiltro, setStatusFiltro] = useState("Todos");
  const [funcFiltro, setFuncFiltro] = useState("Todos");
  const [ordenarPor, setOrdenarPor] = useState("data");

  /* Período */
  const [periodo, setPeriodo] = useState("todos");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  /* Paginação */
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  const [totalAgendamentos, setTotalAgendamentos] = useState(0);

  /* Inicial */
  useEffect(() => {
    fetchFuncionarios();
  }, []);

  useEffect(() => {
    fetchAgendamentos();
  }, [statusFiltro, funcFiltro, periodo, dataInicio, dataFim, ordenarPor, pagina]);

  /* ============================
     Funcionários
  ============================= */
  async function fetchFuncionarios() {
    if (!isSupabaseConfigured) return;

    const { data } = await supabase
      .from("funcionarios")
      .select("id, usuario:usuarios(nome)");

    if (data) {
      const mapped = data.map((f: any) => ({
        id: f.id,
        usuario: { nome: Array.isArray(f.usuario) ? f.usuario[0]?.nome : f.usuario?.nome }
      }));
      setFuncionarios(mapped);
    }
  }

  /* ============================
     ✅ DATA LOCAL SEM UTC BUG
  ============================= */
  function hojeStr() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function somarDias(dias: number) {
    const d = new Date();
    d.setDate(d.getDate() + dias);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  /* ============================
     ✅ INTERVALO TOTALMENTE CORRIGIDO
  ============================= */
  function calcularIntervalo() {
    const hoje = hojeStr();
    let inicio: string | null = null;
    let fim: string | null = null;

    switch (periodo) {
      case "todos":
        inicio = hoje;
        break;

      case "hoje":
        inicio = hoje;
        fim = hoje;
        break;

      case "7dias":
        inicio = hoje;
        fim = somarDias(7);
        break;

      case "30dias":
        inicio = hoje;
        fim = somarDias(30);
        break;

      case "semanal": {
        const d = new Date();
        const diasRestantes = 6 - d.getDay();
        inicio = hoje;
        fim = somarDias(diasRestantes);
        break;
      }

      case "mensal": {
        const d = new Date();
        const ano = d.getFullYear();
        const mes = d.getMonth();
        const ultimoDia = new Date(ano, mes + 1, 0).getDate();
        inicio = hoje;
        fim = `${ano}-${String(mes + 1).padStart(2, "0")}-${ultimoDia}`;
        break;
      }

      case "anual": {
        const ano = new Date().getFullYear();
        inicio = hoje;
        fim = `${ano}-12-31`;
        break;
      }

      case "custom":
        inicio = dataInicio || null;
        fim = dataFim || null;
        break;
    }

    return { inicio, fim };
  }

  /* ============================
     Buscar agendamentos
  ============================= */
  async function fetchAgendamentos() {
    if (!isSupabaseConfigured) return;

    const { inicio, fim } = calcularIntervalo();

    let query = supabase
      .from("agendamentos")
      .select(`
        id,
        data,
        hora,
        status,
        cliente_id,
        servico:servicos(nome, preco),
        funcionario:funcionarios(usuario:usuarios(nome))
      `)
      .order("data", { ascending: true })
      .order("hora", { ascending: true });

    if (inicio) query.gte("data", inicio);
    if (fim) query.lte("data", fim);
    if (statusFiltro !== "Todos") query.eq("status", statusFiltro);
    if (funcFiltro !== "Todos") query.eq("funcionario_id", funcFiltro);

    const { data: raw } = await query;

    if (!raw || raw.length === 0) {
      setAgendamentos([]);
      setTotalAgendamentos(0);
      return;
    }

    const ids = raw.map((a: any) => a.cliente_id);

    const { data: clientes } = await supabase
      .from("usuarios")
      .select("id, nome, telefone")
      .in("id", ids);

    const clienteMap = new Map();
    clientes?.forEach((c) => clienteMap.set(c.id, c));

    const joined: Agendamento[] = raw.map((a: any) => {
      const serv = Array.isArray(a.servico) ? a.servico[0] : a.servico;
      const func = Array.isArray(a.funcionario) ? a.funcionario[0] : a.funcionario;
      const cli = clienteMap.get(a.cliente_id) || { nome: "", telefone: "" };

      return {
        id: a.id,
        data: a.data,
        hora: a.hora,
        status: a.status,
        cliente: { nome: cli.nome, telefone: cli.telefone },
        servico: serv,
        funcionario: func ? { usuario: { nome: func.usuario?.nome ?? "" } } : null,
      };
    });

    if (ordenarPor === "profissional") {
      joined.sort((a, b) =>
        (a.funcionario?.usuario.nome ?? "").localeCompare(
          b.funcionario?.usuario.nome ?? ""
        )
      );
    }

    setTotalAgendamentos(joined.length);

    const start = (pagina - 1) * porPagina;
    setAgendamentos(joined.slice(start, start + porPagina));
  }

  /* ============================
     Update Status
  ============================= */
  async function updateStatus(id: string, status: string) {
    await supabase.from("agendamentos").update({ status }).eq("id", id);
    fetchAgendamentos();
  }

  /* ============================
     Badges inteligentes
  ============================= */
  function getBadge(ag: Agendamento) {
    const agora = new Date();
    const horaAg = new Date(`${ag.data}T${ag.hora}`);
    const diffMin = (horaAg.getTime() - agora.getTime()) / 60000;

    if (diffMin < -5)
      return { label: "Atrasado", classe: "bg-red-100 text-red-600" };

    if (Math.abs(diffMin) <= 5)
      return { label: "Agora", classe: "bg-blue-100 text-blue-600" };

    if (diffMin <= 60)
      return { label: "Em breve", classe: "bg-yellow-100 text-yellow-600" };

    return null;
  }

  /* ============================
     Render
  ============================= */
  return (
    <div className="w-full">
      <div className="flex justify-between mb-6 items-center">
        <h2 className="text-2xl font-semibold text-secondary-500">Agendamentos</h2>
        <span className="text-gray-600 text-sm">
          {totalAgendamentos} resultado(s)
        </span>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap gap-4 mb-6">
        {/* Período */}
        <div className="flex flex-col">
          <label className="admin-label">Período</label>
          <select
            value={periodo}
            onChange={(e) => {
              setPeriodo(e.target.value);
              setPagina(1);
            }}
            className="admin-select w-48"
          >
            <option value="todos">Próximos</option>
            <option value="hoje">Hoje</option>
            <option value="7dias">Próximos 7 dias</option>
            <option value="30dias">Próximos 30 dias</option>
            <option value="semanal">Resto da semana</option>
            <option value="mensal">Resto do mês</option>
            <option value="anual">Resto do ano</option>
            <option value="custom">Intervalo personalizado</option>
          </select>
        </div>

        {periodo === "custom" && (
          <>
            <div className="flex flex-col">
              <label className="admin-label">Início</label>
              <input
                type="date"
                className="admin-input"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="admin-label">Fim</label>
              <input
                type="date"
                className="admin-input"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Status */}
        <div className="flex flex-col">
          <label className="admin-label">Status</label>
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="admin-select w-48"
          >
            {statusOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Funcionário */}
        <div className="flex flex-col">
          <label className="admin-label">Profissional</label>
          <select
            value={funcFiltro}
            onChange={(e) => setFuncFiltro(e.target.value)}
            className="admin-select w-48"
          >
            <option value="Todos">Todos</option>
            {funcionarios.map((f) => (
              <option key={f.id} value={f.id}>
                {f.usuario.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenar */}
        <div className="flex flex-col">
          <label className="admin-label">Ordenar por</label>
          <select
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value)}
            className="admin-select w-48"
          >
            <option value="data">Data</option>
            <option value="profissional">Profissional</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {agendamentos.map((ag) => {
          const badge = getBadge(ag);
          const isPast = new Date(`${ag.data}T${ag.hora}`) < new Date();

          return (
            <div
              key={ag.id}
              className={`bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-5 gap-4 transition ${isPast ? "opacity-50" : ""}`}
            >
              {/* Horário */}
              <div className="flex items-center gap-4">
                <div className="bg-red-100 text-red-500 p-3 rounded-full">
                  <Clock className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-secondary-500">
                    {ag.hora}
                  </h3>
                  <p className="text-gray-500 capitalize text-sm leading-tight">
                    {ag.data.split("-").reverse().join("/")}
                  </p>



                  {badge && (
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${badge.classe}`}>
                      {badge.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Cliente */}
              <div>
                <p className="font-semibold text-secondary-500 mb-1">Cliente</p>
                <p className="text-gray-600">{ag.cliente.nome}</p>
                <p className="text-gray-500 text-sm">{ag.cliente.telefone}</p>
              </div>

              {/* Serviço */}
              <div>
                <p className="font-semibold text-secondary-500 mb-1">Serviço</p>
                <p className="text-gray-600">{ag.servico.nome}</p>
                <p className="text-primary-500 font-bold text-sm">
                  R$ {ag.servico.preco.toFixed(2).replace(".", ",")}
                </p>
              </div>

              {/* Profissional */}
              <div>
                <p className="font-semibold text-secondary-500 mb-1">Profissional</p>
                <p className="text-gray-600">
                  {ag.funcionario?.usuario.nome || "—"}
                </p>
              </div>

              {/* Status + Ações */}
              <div className="flex flex-col items-start md:items-end gap-2">
                <span
                  className={`px-3 py-1 text-sm rounded-full w-fit ${ag.status === "Concluido"
                    ? "bg-blue-100 text-blue-600"
                    : ag.status === "Cancelado"
                      ? "bg-red-100 text-red-600"
                      : ag.status === "Confirmado"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {ag.status}
                </span>

                <p className="text-xs text-gray-400 font-medium mt-1">Ações</p>

                <div className="flex items-center gap-2 mt-1">
                  {ag.status === "Agendado" && (
                    <>
                      <button
                        onClick={() => updateStatus(ag.id, "Confirmado")}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        Confirmar
                      </button>

                      <button
                        onClick={() => updateStatus(ag.id, "Cancelado")}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  )}

                  {ag.status === "Confirmado" && (
                    <button
                      onClick={() => updateStatus(ag.id, "Concluido")}
                      className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-xs font-medium"
                    >
                      Concluir Corte
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={pagina === 1}
          onClick={() => setPagina((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>

        <span className="text-gray-600">Página {pagina}</span>

        <button
          onClick={() => setPagina((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
