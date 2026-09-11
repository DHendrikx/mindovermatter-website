/*
 * De site staat bewust in "stille" modus: alleen de holding page is bereikbaar.
 * De volledige site staat geparkeerd in src/site-full/ — die map wordt nergens
 * geïmporteerd en zit daarom niet in de gebouwde bundel. Zie
 * src/site-full/README.md voor het weer aanzetten.
 */
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Holding from "./pages/Holding";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Holding} />
      {/* Oude fondspagina's bestaan niet meer: alles terug naar de homepage. */}
      <Route>
        <Redirect to="/" replace />
      </Route>
    </Switch>
  );
}

/*
 * De <MotionConfig reducedMotion="user"> wrapper is weg zolang de site stil
 * staat: de holding page animeert niet, en zo blijft framer-motion volledig
 * uit de bundel. Zet hem terug samen met de volledige site.
 */
function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}

export default App;
