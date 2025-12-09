import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";

import StepServico from "./steps/StepServico";
import StepFuncionario from "./steps/StepFuncionario";
import StepDataHora from "./steps/StepDataHora";

import { CheckCircle, XCircle } from "lucide-react";

export default function AgendarPage() {
  const [, setLocation] = useLocation();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    servico: "",
    funcionario: "",
    data: "",
    hora: "",
    observacoes: "",
  });

  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const [erro, setErro] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // =====================================
  // LOGIN
  // =====================================
  useEffect(() => {
    verificarLogin();
  }, []);

  async function verificarLogin() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      toast.error("Você precisa estar logado para agendar.");
      return setLocation("/login");
    }
    setUsuarioLogado(data.user);
  }

  function nextStep() {
    setStep((s) => s + 1);
  }

  function prevStep() {
    setStep((s) => Math.max(1, s - 1));
  }

  function handleChange(e: any) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // =====================================
  // SUBMIT
  // =====================================
  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!usuarioLogado) return;

    setSubmitting(true);

    const { error } = await supabase.from("agendamentos").insert({
      cliente_id: usuarioLogado.id,
      funcionario_id: formData.funcionario,
      servico_id: formData.servico,
      data: formData.data,
      hora: formData.hora,
      status: "Agendado",
      observacoes: formData.observacoes || null,
    });

    if (error) {
      console.error(error);
      toast.error("Erro ao criar agendamento");
      setSubmitting(false);
      setErro(true);
      return;
    }

    toast.success("Agendamento realizado!");
    setSuccess(true);
    setSubmitting(false);

  }

  // =====================================
  // ✅ TELA DE SUCESSO
  // =====================================
  if (success) {
    return (
      <div className="py-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="card">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />

              <h2 className="text-3xl font-bold text-secondary-500 mb-4">
                Agendamento Confirmado!
              </h2>

              <p className="text-gray-600">
                Seu horário foi confirmado com sucesso.
              </p>

              <div className="flex flex-col gap-4 mt-8">
                <button
                  onClick={() => setLocation("/")}
                  className="btn-primary"
                >
                  Voltar à Tela Principal
                </button>

                <button
                  onClick={() => setLocation("/minha-conta/agendamentos")}
                  className="btn-secondary"
                >
                  Acompanhar Meu Agendamento
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-6">
                Você será redirecionado automaticamente em 4 segundos...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================
  // ❌ TELA DE ERRO
  // =====================================
  if (erro) {
    return (
      <div className="py-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="card">
              <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />

              <h2 className="text-3xl font-bold text-secondary-500 mb-4">
                Erro ao Agendar
              </h2>

              <p className="text-gray-600">
                Ocorreu um problema ao tentar salvar seu agendamento.
              </p>

              <div className="flex flex-col gap-4 mt-8">
                <button
                  onClick={() => {
                    setErro(false);
                    setStep(1);
                  }}
                  className="btn-primary"
                >
                  Tentar Novamente
                </button>

                <button
                  onClick={() => setLocation("/")}
                  className="btn-secondary"
                >
                  Voltar à Tela Principal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================
  // INTERFACE PRINCIPAL
  // =====================================
  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-500 mb-4">
            Agendar Horário
          </h1>
          <p className="text-gray-600">
            Escolha o serviço, profissional e horário
          </p>
        </div>

        {/* STEPS 1-2-3 */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= s
                    ? "bg-primary-500 text-white"
                    : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 ${step > s ? "bg-primary-500" : "bg-gray-200"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>

            {step === 1 && (
              <StepServico
                formData={formData}
                handleChange={handleChange}
                nextStep={nextStep}
                prevStep={() => { }} // ✅ Apenas para satisfazer o TypeScript
              />
            )}


            {step === 2 && (
              <StepFuncionario
                formData={formData}
                handleChange={handleChange}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}

            {step === 3 && (
              <StepDataHora
                funcionario={formData.funcionario}
                data={formData.data}
                setData={(d: string) =>
                  setFormData({ ...formData, data: d })
                }
                horario={formData.hora}
                setHorario={(h: string) =>
                  setFormData({ ...formData, hora: h })
                }
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
