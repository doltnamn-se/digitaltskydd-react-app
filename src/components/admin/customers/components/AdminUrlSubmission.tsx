
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface AdminUrlSubmissionProps {
  customerId: string;
}

export const AdminUrlSubmission = ({ customerId }: AdminUrlSubmissionProps) => {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsSubmitting(true);
    try {
      // Initialize status history
      const timestamp = new Date().toISOString();
      const initialStatus = {
        status: 'received',
        timestamp: timestamp
      };

      const { error } = await supabase
        .from('removal_urls')
        .insert({
          customer_id: customerId,
          url: url.trim(),
          status: 'received',
          display_in_incoming: true,
          status_history: [initialStatus]
        });

      if (error) throw error;

      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ['customer-data', customerId] });
      
      toast({
        title: "Success",
        description: "URL added successfully",
      });
      
      setUrl("");
    } catch (error) {
      console.error('Error adding URL:', error);
      toast({
        title: "Error",
        description: "Could not add URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <div className="flex gap-2">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to add"
          className="flex-1"
          required
        />
        <Button 
          type="submit" 
          disabled={isSubmitting}
          size="sm"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
};
