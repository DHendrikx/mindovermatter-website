/*
 * Geparkeerd: de volledige site zoals die live stond op mindovermatter.fund.
 *
 * Deze map wordt door niets geïmporteerd en zit daarom NIET in de gebouwde
 * bundel — de inhoud is niet op te vragen door bezoekers. Zie README.md in
 * deze map voor het opnieuw aanzetten zodra de brokerrelatie rond is.
 */
import { Route, Switch } from "wouter";
import ScrollToTop from "@/components/ScrollToTop";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Philosophy from "./pages/Philosophy";
import FundManager from "./pages/FundManager";
import Structure from "./pages/Structure";
import Documentation from "./pages/Documentation";
import Contact from "./pages/Contact";
import Disclaimer from "./pages/Disclaimer";
import NotFound from "./pages/NotFound";

export default function FullSiteRouter() {
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
