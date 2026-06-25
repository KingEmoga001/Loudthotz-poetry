import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { submitPoem, useSiteSettings } from "@/lib/firestore";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PenTool, CheckCircle2, ExternalLink, CreditCard, Globe } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  author: z.string().min(1, "Pen name or real name is required").max(50),
  country: z.string().min(1, "Country is required").max(50),
  content: z.string().min(10, "Poem is too short. Please provide at least 10 characters."),
  paymentRef: z.string().min(3, "Please enter your payment transaction ID / reference."),
});

type FormValues = z.infer<typeof formSchema>;

function PayButton({
  href, label, fee, icon: Icon,
}: {
  href: string; label: string; fee: string; icon: typeof CreditCard;
}) {
  const configured = href && href.startsWith("http");
  if (!configured) {
    return (
      <div className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-white/[0.02] opacity-60">
        <Icon className="h-5 w-5 text-gray-500" />
        <span className="text-xs font-semibold text-gray-400">{fee}</span>
        <span className="text-[10px] text-gray-600 text-center">{label}</span>
        <span className="text-[10px] text-amber-500/80 font-semibold">Coming Soon</span>
      </div>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group">
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-xs font-bold text-white">{fee}</span>
      <span className="text-[10px] text-gray-400 text-center">{label}</span>
      <ExternalLink className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

export default function SubmitPoem() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: s } = useSiteSettings();

  const pageHeading = s?.submitPageHeading || "Submit Your Work";
  const pageSubtext = s?.submitPageSubtext || "We are looking for raw, electric voices. Send us your best poems, lyrical essays, or free verse.";
  const feeNGN = s?.submitFeeNGN || "₦3,999.99";
  const feeUSD = s?.submitFeeUSD || "$6";
  const paystackLink = s?.submitPaystackLink || "";
  const foreignPayLink = s?.submitForeignPayLink || "";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", author: "", country: "", content: "", paymentRef: "" },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      await submitPoem(values);
      setSubmitted(true);
      toast({ title: "Submission successful", description: "Your poem has been sent to our curators for review." });
    } catch {
      toast({ title: "Submission failed", description: "There was a problem submitting your poem. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-12 flex flex-col items-center">
          <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold mb-4">Piece Received.</h1>
          <p className="font-serif text-xl text-muted-foreground mb-8">
            Your words are safe with us. Our editorial team will review your submission and payment reference shortly.
          </p>
          <Button onClick={() => { form.reset(); setSubmitted(false); }} variant="outline" className="border-white/10">
            Submit Another Piece
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="mb-10 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-4">
          <PenTool className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-display text-4xl font-bold">{pageHeading}</h1>
        <p className="font-serif text-xl text-muted-foreground max-w-2xl mx-auto">
          {pageSubtext}
        </p>
      </div>

      {/* Payment gate */}
      <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Step 1 — Pay the Submission Fee</p>
        <p className="text-sm text-gray-400 mb-5">
          Poem submissions require a one-time fee. Choose the payment option for your region, complete the payment,
          then copy your <span className="text-white font-semibold">Transaction ID</span> and paste it into the form below.
        </p>
        <div className="flex gap-3 mb-4">
          <PayButton href={paystackLink} label="Nigeria — Paystack" fee={feeNGN} icon={CreditCard} />
          <PayButton href={foreignPayLink} label="International — Card / Gateway" fee={feeUSD} icon={Globe} />
        </div>
        <p className="text-[10px] text-gray-600 text-center">
          Prices are set by admin and may change. Submissions without a valid payment reference will be disqualified.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-10">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Step 2 — Fill the Submission Form</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="author" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground uppercase tracking-wider text-xs">Pen Name / Real Name</FormLabel>
                  <FormControl><Input placeholder="e.g. Wole Soyinka" className="bg-white/5 border-white/10 h-12" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground uppercase tracking-wider text-xs">Country</FormLabel>
                  <FormControl><Input placeholder="e.g. Nigeria" className="bg-white/5 border-white/10 h-12" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground uppercase tracking-wider text-xs">Title of Piece</FormLabel>
                <FormControl><Input placeholder="Untitled" className="bg-white/5 border-white/10 h-12 font-display text-lg" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="paymentRef" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground uppercase tracking-wider text-xs">Payment Transaction ID *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Paste your Paystack or gateway transaction ID here"
                    className="bg-primary/5 border-primary/20 h-12 focus:border-primary/40"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-white/30">
                  Found in your payment receipt or confirmation email. Required to validate your submission.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground uppercase tracking-wider text-xs">The Poem</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your verses here..."
                    className="min-h-[400px] bg-white/5 border-white/10 font-serif text-lg leading-relaxed resize-y p-6"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-white/40">
                  Formatting (line breaks, stanzas) will be preserved exactly as typed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" className="w-full h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
              {loading ? "Submitting..." : "Send to Curators"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
