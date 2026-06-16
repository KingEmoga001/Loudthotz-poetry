import { useState } from "react";
import { useInitiateDonation } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Heart, Globe, BookOpen } from "lucide-react";

export default function Donate() {
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  
  const { toast } = useToast();
  const donateMutation = useInitiateDonation();

  const handleDonate = () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid donation amount.", variant: "destructive" });
      return;
    }

    donateMutation.mutate(
      { data: { amount: finalAmount, name, message } },
      {
        onSuccess: (res) => {
          toast({
            title: "Redirecting to payment...",
            description: "Thank you for supporting Naija Art Initiative.",
          });
          // In a real app, window.location.href = res.paymentUrl
        },
        onError: () => {
          toast({ title: "Error", description: "Could not initiate donation.", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Col - Copy */}
        <div className="space-y-8">
          <Badge className="bg-primary/20 text-primary border-0 px-3 py-1 uppercase tracking-widest text-xs font-bold">
            Support the Arts
          </Badge>
          <h1 className="font-display text-5xl font-bold leading-tight">Keep the Mic On.</h1>
          <p className="font-serif text-2xl text-muted-foreground leading-relaxed">
            Loudthotz Poetry is powered by the Naija Art Initiative. Your contributions 
            directly fund our server costs, live session setups, and compensation for featured African poets.
          </p>
          
          <div className="space-y-6 pt-8">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Global Reach</h3>
                <p className="text-muted-foreground">Connecting Lagos to London, bringing African voices to the world stage.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Print Anthologies</h3>
                <p className="text-muted-foreground">Helping poets see their names in print through our annual publishing grants.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Form */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <div className="relative z-10 space-y-8">
            <div className="grid grid-cols-3 gap-4">
              {[1000, 5000, 10000].map(tier => (
                <Button 
                  key={tier}
                  variant={amount === tier && !customAmount ? "default" : "outline"}
                  className={`h-16 text-xl font-bold ${amount === tier && !customAmount ? "bg-primary text-primary-foreground" : "border-white/10"}`}
                  onClick={() => { setAmount(tier); setCustomAmount(""); }}
                >
                  ₦{tier.toLocaleString()}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Or enter custom amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₦</span>
                <Input 
                  type="number"
                  placeholder="Other amount"
                  className="pl-8 h-14 bg-white/5 border-white/10 text-lg font-bold"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); }}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Name (Optional)</label>
                <Input 
                  placeholder="How should we thank you?"
                  className="h-12 bg-white/5 border-white/10"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Message (Optional)</label>
                <Textarea 
                  placeholder="Leave a note for the poets..."
                  className="min-h-[100px] bg-white/5 border-white/10 resize-none"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>
            </div>

            <Button 
              className="w-full h-16 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleDonate}
              disabled={donateMutation.isPending}
            >
              {donateMutation.isPending ? "Processing..." : (
                <>
                  <Heart className="mr-2 h-5 w-5 fill-current" />
                  Donate ₦{((customAmount ? parseFloat(customAmount) : amount) || 0).toLocaleString()}
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">Secure payment processed via Stripe.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";