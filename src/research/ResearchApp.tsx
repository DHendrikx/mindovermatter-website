/*
 * Interne omgeving van Mind over Matter: Analyst Research.
 * Alleen bereikbaar via /research met het teamwachtwoord. Deze code wordt lazy
 * geladen en zit dus niet in de bundel van de publieke holdingpagina.
 */
import { useCallback, useEffect, useState } from "react";
import { Link, Route, Switch, useRoute } from "wouter";
import { LogOut } from "lucide-react";
import { getSession, logout, type SessionInfo } from "./api";
import LoginScreen from "./LoginScreen";
import ResearchHome from "./ResearchHome";
import ReportPage from "./ReportPage";
import "./research.css";

function SetupNotice({ session }: { session: SessionInfo }) {
  const setup = session.setup;
  if (!setup) return null;
  const notes: string[] = [];
  if (!setup.anthropic) notes.push("ANTHROPIC_API_KEY ontbreekt: nieuwe analyses kunnen nog niet draaien.");
  if (setup.storage === "missing") notes.push("Er is geen opslag gekoppeld (Upstash Redis).");
  if (setup.storage === "file") notes.push("Lokale ontwikkelmodus: rapporten staan in .data/research/ op deze computer.");
  if (!notes.length) return null;
  return (
    <div className="container pt-4 no-print">
      <div className="rounded-lg border border-[oklch(0.75_0.15_70_/_40%)] bg-[oklch(0.75_0.15_70_/_8%)] px-4 py-3 text-sm text-[oklch(0.85_0.08_80)]">
        {notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </div>
    </div>
  );
}

function Header({ onLogout }: { onLogout: () => void }) {
  const [onHome] = useRoute("/");
  return (
    <header className="border-b border-[oklch(0.25_0.02_250_/_60%)] bg-[oklch(0.11_0.02_250)] no-print">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img src="/logos/mom-logo-white.svg" alt="" className="h-7" />
            <span className="hidden sm:inline text-base font-semibold tracking-tight">Mind over Matter</span>
          </Link>
          <nav aria-label="Interne navigatie">
            <Link
              href="/"
              aria-current={onHome ? "page" : undefined}
              className="relative px-1 py-2 text-sm font-medium text-[oklch(0.82_0.17_195)] transition-colors hover:text-[oklch(0.88_0.13_195)]"
            >
              Analyst Research
              <span className="absolute left-1 right-1 -bottom-[13px] h-0.5 bg-[oklch(0.82_0.17_195)]" aria-hidden="true" />
            </Link>
          </nav>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[oklch(0.75_0.01_250)] hover:text-foreground hover:bg-[oklch(0.20_0.02_250)] transition-colors"
        >
          <LogOut size={16} aria-hidden="true" />
          <span>Uitloggen</span>
        </button>
      </div>
    </header>
  );
}

export default function ResearchApp() {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setSession(await getSession());
      setFailed(null);
    } catch (e) {
      setFailed(e instanceof Error ? e.message : "De interne omgeving is niet bereikbaar.");
    }
  }, []);

  useEffect(() => {
    document.title = "Intern · Mind over Matter";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    void load();
    return () => {
      robots.remove();
      document.title = "Mind over Matter";
    };
  }, [load]);

  const handleLogout = async () => {
    await logout().catch(() => undefined);
    await load();
  };

  if (failed) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-foreground p-6">
        <p className="text-muted-foreground">{failed}</p>
      </div>
    );
  }

  if (!session) {
    return <div className="min-h-screen bg-background" aria-busy="true" />;
  }

  if (!session.authenticated) {
    return <LoginScreen configured={session.configured} onLoggedIn={load} />;
  }

  return (
    <div className="research-app min-h-screen bg-background text-foreground">
      <Header onLogout={handleLogout} />
      <SetupNotice session={session} />
      <main>
        <Switch>
          <Route path="/" component={ResearchHome} />
          <Route path="/:id">{(params) => <ReportPage id={params.id} />}</Route>
        </Switch>
      </main>
    </div>
  );
}
