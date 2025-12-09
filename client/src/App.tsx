import { useEffect } from "react";
import { Route, Switch } from "wouter";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminRoute, UserRoute } from "@/components/ProtectedRoute";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import ServicosPage from "@/pages/ServicosPage";
import AgendamentoPage from "@/pages/agendar/AgendarPage";
import LoginPage from "@/pages/LoginPage";
import PainelPage from "@/pages/PainelPage";
import NotFoundPage from "@/pages/NotFoundPage";

import MinhaContaPage from "@/pages/user/MinhaContaPage";
import MeusAgendamentosPage from "@/pages/user/MeusAgendamentosPage";
import MeusDadosPage from "@/pages/user/MeusDadosPage";
import PagamentosPage from "@/pages/user/PagamentosPage";
import AssinaturasPage from "@/pages/user/AssinaturasPage";
import HistoricoCortesPage from "@/pages/user/HistoricoCortesPage";

/* ✅ NOVA PÁGINA */
import CompletarCadastroPage from "@/pages/user/CompletarCadastroPage";

function App() {
  useEffect(() => {
    console.log("SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log(
      "SUPABASE_KEY:",
      import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 20)
    );
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Toaster position="top-right" />

        <Switch>
          {/* LOGIN */}
          <Route path="/login" component={LoginPage} />

          {/* ✅ COMPLETAR CADASTRO */}
          <Route
            path="/completar-cadastro"
            component={CompletarCadastroPage}
          />

          {/* PAINEL ADMIN — PROTEGIDO */}
          <Route
            path="/painel"
            component={() => <AdminRoute component={PainelPage} />}
          />
          <Route
            path="/painel/:rest*"
            component={() => <AdminRoute component={PainelPage} />}
          />

          {/* ÁREA DO CLIENTE — PROTEGIDA */}
          <Route
            path="/minha-conta"
            component={() => <UserRoute component={MinhaContaPage} />}
          />
          <Route
            path="/minha-conta/agendamentos"
            component={() => <UserRoute component={MeusAgendamentosPage} />}
          />
          <Route
            path="/minha-conta/dados"
            component={() => <UserRoute component={MeusDadosPage} />}
          />
          <Route
            path="/minha-conta/pagamentos"
            component={() => <UserRoute component={PagamentosPage} />}
          />
          <Route
            path="/minha-conta/assinaturas"
            component={() => <UserRoute component={AssinaturasPage} />}
          />
          <Route
            path="/minha-conta/historico"
            component={() => <UserRoute component={HistoricoCortesPage} />}
          />

          {/* SITE PÚBLICO */}
          <Route>
            <Header />
            <main className="flex-grow">
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/servicos" component={ServicosPage} />
                <Route path="/agendamento" component={AgendamentoPage} />
                <Route component={NotFoundPage} />
              </Switch>
            </main>
            <Footer />
          </Route>
        </Switch>
      </div>
    </AuthProvider>
  );
}

export default App;
