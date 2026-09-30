import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { login } from "./api";

export default function LoginScreen({
  configured,
  onLoggedIn,
}: {
  configured: boolean;
  onLoggedIn: () => void;
}) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!password) return;
    setBusy(true);
    setError(null);
    try {
      await login(password);
      setPassword("");
      onLoggedIn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Inloggen mislukt.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background text-foreground px-4">
      <form onSubmit={submit} className="glass-card w-full max-w-sm rounded-xl p-8">
        <div className="mb-6 flex items-center gap-3">
          <img src="/logos/mom-logo-white.svg" alt="" className="h-8" />
          <span className="font-semibold">Mind over Matter</span>
        </div>
        <h1 className="mb-1 text-xl font-bold">Interne omgeving</h1>
        <p className="mb-6 text-sm text-muted-foreground">Log in met het teamwachtwoord.</p>

        {!configured && (
          <p className="mb-4 rounded-md bg-[oklch(0.75_0.15_70_/_10%)] px-3 py-2 text-sm text-[oklch(0.85_0.08_80)]">
            Deze omgeving is nog niet ingesteld: RESEARCH_PASSWORD en RESEARCH_SESSION_SECRET ontbreken.
          </p>
        )}

        <label htmlFor="research-password" className="mb-2 block text-sm font-medium">
          Wachtwoord
        </label>
        <div className="relative mb-4">
          <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="research-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[oklch(0.30_0.02_250)] bg-[oklch(0.11_0.02_250)] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[oklch(0.82_0.17_195_/_60%)] focus-visible:ring-2 focus-visible:ring-[oklch(0.82_0.17_195_/_40%)]"
          />
        </div>

        {error && (
          <p role="alert" className="mb-4 text-sm text-[oklch(0.75_0.16_25)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !password || !configured}
          className="w-full rounded-lg bg-[oklch(0.82_0.17_195)] py-2.5 text-sm font-semibold text-[oklch(0.13_0.025_250)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Bezig…" : "Inloggen"}
        </button>
      </form>
    </div>
  );
}
