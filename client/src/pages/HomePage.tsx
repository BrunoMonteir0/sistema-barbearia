import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Calendar, Scissors, Star, Clock, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Config {
  nome: string;
  texto_hero: string | null;
  texto_sobre: string | null;
  banner_url: string | null;
  logo_url: string | null;
  imagem_sobre_url: string | null;
  imagem_banner_index_url: string | null;
  whatsapp: string | null;
}

interface Servico {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  imagem: string | null;
  duracao_minutos?: number;
}

export default function HomePage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);

  useEffect(() => {
    fetchConfig();
    fetchServicos();
  }, []);

  async function fetchConfig() {
    const { data } = await supabase.from("config").select("*").single();
    if (data) setConfig(data);
  }

  async function fetchServicos() {
    const { data } = await supabase
      .from("servicos")
      .select("*")
      .eq("ativo", true)
      .order("nome");

    if (data) setServicos(data);
  }

  const features = [
    {
      icon: Scissors,
      title: "Cortes Modernos",
      description: "Estilos atuais e clássicos para todos os gostos",
    },
    {
      icon: Star,
      title: "Profissionais Qualificados",
      description: "Equipe especializada em cuidados masculinos",
    },
    {
      icon: Clock,
      title: "Agendamento Online",
      description: "Marque seu horário de forma prática e rápida",
    },
    {
      icon: Award,
      title: "Cartão Fidelidade",
      description: "Acumule pontos e ganhe serviços gratuitos",
    },
  ];

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center text-secondary-500">
        Carregando...
      </div>
    );
  }

  return (
    <div>

      {/* ================= HERO ================= */}
      <section
        className="relative h-[600px] bg-secondary-800 overflow-hidden"
        style={{
          backgroundImage: config.banner_url ? `url(${config.banner_url})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl text-white">

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {config.texto_hero || (
                <>
                  Estilo e <span className="text-primary-400">Precisão</span> em Cada Corte
                </>
              )}
            </h1>

            <p className="text-xl mb-8 text-gray-200">
              {config.texto_sobre ||
                "Experiência de alto nível em cuidados masculinos — ambiente moderno, atendimento premium."}
            </p>

            <div className="flex gap-4">
              <Link href="/agendamento" className="btn-primary flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Agendar Agora
              </Link>

              {config.whatsapp && (
                <a
                  href={`https://wa.me/${config.whatsapp?.replace(/\D/g, "")}`}
                  target="_blank"
                  className="btn-secondary"
                >
                  WhatsApp
                </a>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ================= BANNER DA HOME ================= */}
      {config.imagem_banner_index_url && (
        <section
          className="h-[300px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${config.imagem_banner_index_url})`,
          }}
        ></section>
      )}

      {/* ================= FEATURES ================= */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-500 mb-4">Por que nos escolher?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Uma experiência completa em cuidados masculinos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-500 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SERVIÇOS ================= */}
      <section className="py-20">
        <div className="container mx-auto px-4">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-500 mb-4">Nossos Serviços</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conheça nossos principais serviços.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicos.map((s) => (
              <div key={s.id} className="card group overflow-hidden p-0">

                {/* Imagem do serviço */}
                <div className="h-80 bg-gray-200 overflow-hidden rounded-t-xl relative">
                  {s.imagem ? (
                    <img
                      src={s.imagem}
                      alt={s.nome}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center">
                      <Scissors className="h-16 w-16 text-white/50" />
                    </div>
                  )}

                  {s.duracao_minutos && (
                    <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {s.duracao_minutos} min
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary-500 mb-2">
                    {s.nome}
                  </h3>

                  <p className="text-2xl font-bold text-primary-500 mb-4">
                    R$ {s.preco.toFixed(2).replace(".", ",")}
                  </p>

                  <Link
                    href={`/agendamento?servico=${s.id}`}
                    className="btn-primary w-full text-center block"
                  >
                    Agendar
                  </Link>
                </div>

              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/servicos" className="btn-secondary inline-flex items-center gap-2">
              Ver Todos os Serviços
            </Link>
          </div>

        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="py-20 bg-secondary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para um novo visual?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Agende seu horário agora mesmo e experimente a experiência completa da nossa barbearia.
          </p>

          <Link href="/agendamento" className="btn-primary inline-flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Agendar Horário
          </Link>
        </div>
      </section>

    </div>
  );
}
