import { Route, Switch } from "wouter";
import { MotionConfig } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
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
        <Route path="/" component={Home} />
        <Route path="/filosofie" component={Philosophy} />
        <Route path="/fondsbeheerder" component={FundManager} />
        <Route path="/team" component={FundManager} />
        <Route path="/structuur" component={Structure} />
        <Route path="/documentatie" component={Documentation} />
        <Route path="/contact" component={Contact} />
        <Route path="/disclaimer" component={Disclaimer} />
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
