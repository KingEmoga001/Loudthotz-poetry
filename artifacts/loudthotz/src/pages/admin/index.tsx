import { useListSubmissions, useApproveSubmission, useRejectSubmission, getListSubmissionsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Clock, Search, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminReviewRoom() {
  const { data: submissions, isLoading } = useListSubmissions();
  const approveMutation = useApproveSubmission();
  const rejectMutation = useRejectSubmission();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleApprove = (id: number) => {
    approveMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Approved", description: "Poem has been published to the gallery." });
        queryClient.invalidateQueries({ queryKey: getListSubmissionsQueryKey() });
      }
    });
  };

  const handleReject = (id: number) => {
    rejectMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Rejected", description: "Submission marked as rejected." });
        queryClient.invalidateQueries({ queryKey: getListSubmissionsQueryKey() });
      }
    });
  };

  const pendingSubmissions = submissions?.filter(s => s.status === 'pending') || [];

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-amber-500" />
            <h1 className="font-display text-4xl font-bold text-amber-500">Review Room</h1>
          </div>
          <p className="font-serif text-xl text-muted-foreground">Curate the voices of Loudthotz.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-3">
            <Clock className="h-4 w-4 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase">Pending</span>
              <span className="font-bold">{pendingSubmissions.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading submissions...</div>
        ) : pendingSubmissions.length === 0 ? (
          <div className="p-24 text-center">
            <CheckCircle2 className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2 text-white/50">Inbox Zero</h3>
            <p className="text-muted-foreground">All submissions have been reviewed.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {pendingSubmissions.map(sub => (
              <div key={sub.id} className="p-8 flex flex-col lg:flex-row gap-8 hover:bg-white/[0.02] transition-colors">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="font-display text-2xl font-bold">{sub.title}</h3>
                    <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10">Pending</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-medium text-white/80">{sub.author}</span>
                    <span>•</span>
                    <span className="uppercase tracking-wider">{sub.country}</span>
                    <span>•</span>
                    <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="font-serif text-lg text-white/60 bg-black/50 p-6 rounded-lg border border-white/5 whitespace-pre-wrap max-h-96 overflow-y-auto custom-scrollbar">
                    {sub.content}
                  </div>
                </div>

                <div className="w-full lg:w-48 flex flex-col gap-3 shrink-0">
                  <Button 
                    onClick={() => handleApprove(sub.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button 
                    onClick={() => handleReject(sub.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    variant="destructive"
                    className="w-full font-bold h-12"
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  
                  <div className="mt-4 space-y-2">
                    <label className="text-xs text-muted-foreground uppercase font-bold">Admin Note (Internal)</label>
                    <Input placeholder="Optional notes..." className="bg-white/5 border-white/10 text-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}