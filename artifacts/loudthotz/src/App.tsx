import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/home";
import PoemsGallery from "@/pages/poems/index";
import PoemReader from "@/pages/poems/[id]";
import SubmitPoem from "@/pages/submit";
import LiveReadings from "@/pages/live";
import Books from "@/pages/books";
import Donate from "@/pages/donate";
import Prize from "@/pages/prize";
import Membership from "@/pages/membership";
import Poets from "@/pages/poets";
import ArchivePage from "@/pages/archive";
import About from "@/pages/about";
import AdminPanel from "@/pages/admin/index";
import AdminLogin from "@/pages/admin/login";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Admin routes — no AppLayout wrapper (standalone CMS) */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminPanel} />

      {/* Public routes */}
      <Route>
        <AppLayout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/poems" component={PoemsGallery} />
            <Route path="/poem/:id" component={PoemReader} />
            <Route path="/submit" component={SubmitPoem} />
            <Route path="/live" component={LiveReadings} />
            <Route path="/books" component={Books} />
            <Route path="/donate" component={Donate} />
            <Route path="/prize" component={Prize} />
            <Route path="/membership" component={Membership} />
            <Route path="/poets" component={Poets} />
            <Route path="/archive" component={ArchivePage} />
            <Route path="/about" component={About} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
