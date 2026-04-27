"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Mot de passe trop court (min 8 caractères)");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Erreur lors de la création du compte");
      setLoading(false);
      return;
    }

    // Auto-login after signup (with timeout fallback)
    try {
      const loginResult = await Promise.race([
        signIn("credentials", { email, password, redirect: false }),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
      ]);
      if (loginResult && !(loginResult as { error?: string }).error) {
        router.push("/dashboard/search");
        return;
      }
    } catch {
      // ignore
    }
    router.push("/auth/login?registered=1");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-white">
            🐾 <span className="text-[#FF1654]">Niche</span>Analyze
          </Link>
          <p className="text-gray-400 mt-2 text-sm">Crée ton compte gratuitement</p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <h1 className="text-xl font-bold text-white mb-6">Créer un compte</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@exemple.com"
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF1654] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Mot de passe <span className="text-gray-500 text-xs">(min 8 caractères)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF1654] transition-colors"
              />
              {password.length > 0 && (
                <div className="mt-1.5 flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= 12 ? "bg-emerald-500"
                        : password.length >= 8 ? "bg-amber-400"
                        : "bg-red-500"
                      } ${i >= (password.length >= 12 ? 4 : password.length >= 8 ? 2 : 1) ? "bg-gray-700" : ""}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                className={`w-full px-4 py-3 bg-gray-900 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none transition-colors ${
                  confirm && confirm !== password
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-gray-600 focus:border-[#FF1654]"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FF1654] text-white font-semibold rounded-xl hover:bg-[#e0123f] transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="text-[#FF1654] hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          Gratuit pour toujours • Pas de carte bancaire
        </p>
      </div>
    </div>
  );
}
