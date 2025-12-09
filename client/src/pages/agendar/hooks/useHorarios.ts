import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function toDateLocal(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function useHorarios(funcionarioId: string, data: string) {
  const [horarios, setHorarios] = useState<string[]>([]);
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  function mapearDia(diaBr: string) {
    const mapa: Record<string, string> = {
      "segunda-feira": "segunda",
      "terça-feira": "terca",
      "terca-feira": "terca",
      "quarta-feira": "quarta",
      "quinta-feira": "quinta",
      "sexta-feira": "sexta",
      sábado: "sabado",
      sabado: "sabado",
      domingo: "domingo",
    };

    const key = diaBr
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return mapa[key] || key;
  }

  useEffect(() => {
    if (!funcionarioId || !data) return;

    async function fetchAll() {
      setLoading(true);

      const { data: funcs } = await supabase
        .from("funcionarios")
        .select("horarios")
        .eq("id", funcionarioId)
        .maybeSingle();

      if (funcs?.horarios) {
        const diaBr = toDateLocal(data).toLocaleDateString("pt-BR", {
          weekday: "long",
        });

        const chave = mapearDia(diaBr);

        setHorarios(funcs.horarios[chave] || []);
      }

      const { data: agendados } = await supabase
        .from("agendamentos")
        .select("hora")
        .eq("funcionario_id", funcionarioId)
        .eq("data", data)
        .neq("status", "Cancelado");

      if (agendados) {
        const formatados = agendados.map((a: any) => a.hora.slice(0, 5));
        setHorariosOcupados(formatados);
      }

      setLoading(false);
    }

    fetchAll();
  }, [funcionarioId, data]);

  return {
    horarios,
    horariosOcupados,
    loading,
  };
}
