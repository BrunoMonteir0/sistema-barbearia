import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    nome: string
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  nivel: "Administrador" | "Funcionario" | "Cliente";
  foto: string | null;
}

const mockProfile: UserProfile = {
  id: "demo-user",
  nome: "Admin Demo",
  email: "admin@demo.com",
  nivel: "Administrador",
  foto: null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(!isSupabaseConfigured);

  useEffect(() => {
    console.log("🔧 isSupabaseConfigured =", isSupabaseConfigured);

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        console.log("👤 Sessão carregada - Usuário:", session.user.id);
        fetchProfile(session.user.id);
      }

      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        console.log("🔄 AuthChange - Usuário:", session.user.id);
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    console.log("📡 Buscando perfil do usuário:", userId);

    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nome, email, nivel, foto")
      .eq("id", userId)
      .single();

    if (error) {
      console.warn("⚠ Erro ao buscar perfil:", error);
      return;
    }

    console.log("🟢 Perfil carregado:", data);
    setProfile(data as UserProfile);
  }

  async function signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      console.log("⚠ Modo DEMO ativado");
      setUser({ id: "demo-user", email } as User);
      setProfile(mockProfile);
      setIsDemo(true);
      return { error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return { error };

    console.log("🔐 Login realizado, carregando perfil...");

    setSession(data.session);
    setUser(data.user);

    if (data.user) {
      await fetchProfile(data.user.id);
    }

    return { error: null };
  }

  async function signUp(email: string, password: string, nome: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome } }
    });

    if (!error && data.user) {
      console.log("🆕 Novo usuário criado:", data.user.id);
      console.log("⚠ Nivel será CLIENTE (regra atual)");

      await supabase.from("usuarios").insert({
        id: data.user.id,
        nome,
        email,
        cpf: "",
        senha_hash: "",
        nivel: "Cliente",
        ativo: true,
        atendimento: false
      });
    }

    return { error };
  }

  async function signOut() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isDemo,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
