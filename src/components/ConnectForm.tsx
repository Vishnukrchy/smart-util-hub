
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ConnectFormProps {}

const defaultValues = {
  name: "",
  email: "",
  message: "",
};

export const ConnectForm: React.FC<ConnectFormProps> = () => {
  const [values, setValues] = useState(defaultValues);
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Save to Supabase
    const { error } = await supabase.from("contact_requests").insert([
      {
        name: values.name,
        email: values.email,
        message: values.message,
      },
    ]);

    if (error) {
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your message. Please try again.",
      });
      setLoading(false);
      return;
    }

    // Call Edge Function to send email (implementation provided separately)
    try {
      await fetch("/functions/send-connect-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } catch {
      // Silently fail email, since the DB is the main target
    }

    toast({
      title: "Thank you for reaching out!",
      description: "Your message was sent successfully. You'll get a response soon.",
    });
    setValues(defaultValues);
    setLoading(false);
  };

  return (
    <Card className="max-w-lg mx-auto mt-12 shadow-lg border bg-background">
      <CardHeader>
        <CardTitle className="text-2xl">Connect with Developer</CardTitle>
        <p className="text-muted-foreground mt-2 text-base">
          Have a question or want to collaborate? Fill out the form below and I'll be in touch!
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4 mt-2" onSubmit={onSubmit}>
          <div>
            <label htmlFor="name" className="block font-medium mb-1">Name</label>
            <Input
              id="name"
              name="name"
              required
              value={values.name}
              onChange={onChange}
              disabled={loading}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-1">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={values.email}
              onChange={onChange}
              disabled={loading}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="message" className="block font-medium mb-1">Message</label>
            <Textarea
              id="message"
              name="message"
              required
              value={values.message}
              onChange={onChange}
              disabled={loading}
              placeholder="Your message..."
              rows={4}
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
