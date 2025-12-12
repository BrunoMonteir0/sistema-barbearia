import { Agendamento } from "./agendamentos.types"

/* Datas sem bug UTC */
export function hojeStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`
}

export function somarDias(dias: number) {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`
}

/* Badge inteligente */
export function getBadge(ag: Agendamento) {
  const agora = new Date()
  const horaAg = new Date(`${ag.data}T${ag.hora}`)
  const diffMin = (horaAg.getTime() - agora.getTime()) / 60000

  if (diffMin < -5)
    return { label: "Atrasado", classe: "bg-red-100 text-red-600" }

  if (Math.abs(diffMin) <= 5)
    return { label: "Agora", classe: "bg-blue-100 text-blue-600" }

  if (diffMin <= 60)
    return { label: "Em breve", classe: "bg-yellow-100 text-yellow-600" }

  return null
}
