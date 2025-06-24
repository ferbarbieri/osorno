import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "@/pages/Dashboard";
import MyData from "@/pages/MyData";
import AskData from "@/pages/AskData";
import Analytics from "@/pages/Analytics";
import Marketplace from "@/pages/Marketplace";
import DatasetDetails from "@/pages/DatasetDetails";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/mydata" component={MyData} />
      <Route path="/askdata" component={AskData} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/dataset/:id" component={DatasetDetails} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
