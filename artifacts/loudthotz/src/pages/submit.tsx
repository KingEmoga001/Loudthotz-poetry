import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateSubmission } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PenTool, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  author: z.string().min(1, "Pen name or real name is required").max(50),
  country: z.string().min(1, "Country is required").max(50),
  content: z.string().min(10, "Poem is too short. Please provide at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export default function SubmitPoem() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const createSubmission = useCreateSubmission();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      country: "",
      content: "",
    },
  });

  function onSubmit(values: FormValues) {
    createSubmission.mutate(
      { data: values },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast({
            title: "Submission successful",
            description: "Your poem has been sent to our curators for review.",
          });
        },
        onError: () => {
          toast({
            title: "Submission failed",
            description: "There was a problem submitting your poem. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
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
            Your words are safe with us. Our editorial team will review your submission shortly. 
            You will be notified once a decision is made.
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
      <div className="mb-12 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-4">
          <PenTool className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-display text-4xl font-bold">Submit Your Work</h1>
        <p className="font-serif text-xl text-muted-foreground max-w-2xl mx-auto">
          We are looking for raw, electric voices. Send us your best spoken-word pieces, 
          lyrical essays, or free verse.
        </p>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground uppercase tracking-wider text-xs">Pen Name / Real Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Wole Soyinka" className="bg-white/5 border-white/10 h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground uppercase tracking-wider text-xs">Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Nigeria" className="bg-white/5 border-white/10 h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground uppercase tracking-wider text-xs">Title of Piece</FormLabel>
                  <FormControl>
                    <Input placeholder="Untitled" className="bg-white/5 border-white/10 h-12 font-display text-lg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
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
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={createSubmission.isPending}
            >
              {createSubmission.isPending ? "Submitting..." : "Send to Curators"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}