import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

export function AdminRoute({ component: Component }: any) {
    const [, setLocation] = useLocation();
    const [allowed, setAllowed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function check() {
            const user = (await supabase.auth.getUser()).data.user;

            console.log("🔍 AdminRoute → usuário logado:", user?.id);

            if (!user) {
                setLocation("/login");
                return;
            }

            const { data } = await supabase
                .from("usuarios")
                .select("nivel")
                .eq("id", user.id)
                .maybeSingle();

            console.log("🔍 AdminRoute → nível encontrado:", data?.nivel);

            if (!data) {
                setLocation("/login");
                return;
            }

            if (data.nivel === "Administrador" || data.nivel === "Funcionario") {
                setAllowed(true);
            } else {
                console.warn("⛔ Bloqueado na AdminRoute → redirecionando para /minha-conta");
                setLocation("/minha-conta");
            }

            setLoading(false);
        }

        check();
    }, []);

    if (loading) return null;
    if (!allowed) return null;

    return <Component />;
}

export function UserRoute({ component: Component }: any) {
    const [, setLocation] = useLocation();
    const [allowed, setAllowed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function check() {
            const user = (await supabase.auth.getUser()).data.user;

            console.log("🔍 UserRoute → usuário logado:", user?.id);

            if (!user) {
                setLocation("/login");
                return;
            }

            const { data } = await supabase
                .from("usuarios")
                .select("nivel")
                .eq("id", user.id)
                .maybeSingle();

            console.log("🔍 UserRoute → nível encontrado:", data?.nivel);

            if (!data) {
                setLocation("/login");
                return;
            }

            if (data.nivel === "Cliente") {
                setAllowed(true);
            } else {
                console.warn("⛔ Bloqueado na UserRoute → redirecionando para /painel");
                setLocation("/painel");
            }

            setLoading(false);
        }

        check();
    }, []);

    if (loading) return null;
    if (!allowed) return null;

    return <Component />;
}
