import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/home";
import PoemsGallery from "@/pages/poems/index";
import PoemReader from "@/pages/poems/[id]";
import SubmitPoem from "@/pages/submit";
import LiveReadings from "@/pages/live";
import Books from "@/pages/books";
import Donate from "@/pages/donate";
import AdminReviewRoom from "@/pages/admin/index";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/poems" component={PoemsGallery} />
        <Route path="/poem/:id" component={PoemReader} />
        <Route path="/submit" component={SubmitPoem} />
        <Route path="/live" component={LiveReadings} />
        <Route path="/books" component={Books} />
        <Route path="/donate" component={Donate} />
        <Route path="/admin" component={AdminReviewRoom} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;