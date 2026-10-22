import { Route, Switch } from "wouter";
import { MotionConfig } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import { PAGES } from "./i18n";
import Home from "./pages/Home";
import Philosophy from "./pages/Philosophy";
import FundManager from "./pages/FundManager";
import Structure from "./pages/Structure";
import Documentation from "./pages/Documentation";
import Contact from "./pages/Contact";
import Disclaimer from "./pages/Disclaimer";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        <Route path={PAGES.home.nl} component={Home} />
        <Route path={PAGES.philosophy.nl} component={Philosophy} />
        <Route path="/fondsbeheerder" component={FundManager} />
        <Route path={PAGES.team.nl} component={FundManager} />
        <Route path={PAGES.structure.nl} component={Structure} />
        <Route path={PAGES.documents.nl} component={Documentation} />
        <Route path={PAGES.contact.nl} component={Contact} />
        <Route path={PAGES.disclaimer.nl} component={Disclaimer} />

        <Route path={PAGES.home.en} component={Home} />
        <Route path={PAGES.philosophy.en} component={Philosophy} />
        <Route path={PAGES.team.en} component={FundManager} />
        <Route path={PAGES.structure.en} component={Structure} />
        <Route path={PAGES.documents.en} component={Documentation} />
        <Route path={PAGES.contact.en} component={Contact} />
        <Route path={PAGES.disclaimer.en} component={Disclaimer} />

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <Router />
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
