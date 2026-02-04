import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle, Phone, MessageCircle } from "lucide-react";
import { z } from "zod";
import { SERVICE_OPTIONS, PHONE_NUMBERS, WHATSAPP_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const bookingSchema = z.object({
  customerName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  phoneNumber: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  location: z.string().trim().min(3, "Please enter your area/location").max(200, "Location too long"),
  service: z.string().min(1, "Please select a service"),
  problemDescription: z.string().trim().max(1000, "Description too long").optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BookingForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: "",
    phoneNumber: "",
    location: "",
    service: "",
    problemDescription: "",
    preferredDate: "",
    preferredTime: "",
  });

  const handleChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BookingFormData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof BookingFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("bookings").insert({
        customer_name: formData.customerName.trim(),
        phone_number: formData.phoneNumber.trim(),
        location: formData.location.trim(),
        service: formData.service,
        problem_description: formData.problemDescription?.trim() || null,
        preferred_date: formData.preferredDate || null,
        preferred_time: formData.preferredTime || null,
      });

      if (error) {
        throw error;
      }

      // nodemailer
          await fetch("http://localhost:5000/send-booking-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
        service: formData.service,
        problemDescription: formData.problemDescription,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
      }),
    });


      // Send email notification to admin
      try {
        await supabase.functions.invoke("send-booking-notification", {
          body: {
            adminEmail: "manojpolevault1202@gmail.com",
            customerName: formData.customerName.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            location: formData.location.trim(),
            service: formData.service,
            problemDescription: formData.problemDescription?.trim(),
            preferredDate: formData.preferredDate,
            preferredTime: formData.preferredTime,
          },
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the booking if email fails
      }


      setIsSuccess(true);
      toast({
        title: "Booking Submitted!",
        description: "We'll contact you shortly to confirm your service appointment.",
      });

      // Reset form
      setFormData({
        customerName: "",
        phoneNumber: "",
        location: "",
        service: "",
        problemDescription: "",
        preferredDate: "",
        preferredTime: "",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try calling us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="booking" className="py-12 xs:py-16 md:py-20 lg:py-28 bg-accent/30">
        <div className="container mx-auto px-3 xs:px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center bg-card rounded-2xl xs:rounded-3xl p-5 xs:p-8 md:p-12 shadow-card border border-border"
          >
            <div className="w-14 h-14 xs:w-16 xs:h-16 md:w-20 md:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 xs:mb-6">
              <CheckCircle className="w-7 h-7 xs:w-8 xs:h-8 md:w-10 md:h-10 text-emerald-600" />
            </div>
            <h3 className="text-lg xs:text-xl md:text-2xl font-display font-bold text-foreground mb-3 xs:mb-4">
              Booking Received!
            </h3>
            <p className="text-muted-foreground mb-5 xs:mb-6 md:mb-8 text-sm xs:text-base">
              Thank you for choosing QuickServe. Our team will contact you within 30 minutes to confirm your service appointment.
            </p>
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 md:gap-4 justify-center">
              <a href={`tel:${PHONE_NUMBERS.primary}`}>
                <Button variant="outline" className="gap-2 w-full xs:w-auto h-9 xs:h-10 text-xs xs:text-sm">
                  <Phone className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                  Call: {PHONE_NUMBERS.primary}
                </Button>
              </a>
              <Button onClick={() => setIsSuccess(false)} className="gap-2 h-9 xs:h-10 text-xs xs:text-sm">
                Submit Another Request
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-12 xs:py-16 md:py-20 lg:py-28 bg-accent/30">
      <div className="container mx-auto px-3 xs:px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Book a Service
            </span>
            <h2 className="section-title text-foreground mb-4">
              Schedule Your{" "}
              <span className="text-primary">Service Visit</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Fill out the form and our team will get back to you within 30 minutes. Or reach us instantly via phone or WhatsApp.
            </p>

            <div className="space-y-4">
              <a
                href={`tel:${PHONE_NUMBERS.primary}`}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Call Us Directly</p>
                  <p className="text-sm text-muted-foreground">{PHONE_NUMBERS.primary} / {PHONE_NUMBERS.secondary}</p>
                </div>
              </a>

              <a
                href={WHATSAPP_LINKS.primary}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-emerald-300 transition-colors"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">WhatsApp Us</p>
                  <p className="text-sm text-muted-foreground">Quick response guaranteed</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-3xl p-6 md:p-8 shadow-card border border-border"
            >
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.customerName}
                    onChange={(e) => handleChange("customerName", e.target.value)}
                    className={`input-focus ${errors.customerName ? "border-destructive" : ""}`}
                  />
                  {errors.customerName && (
                    <p className="text-sm text-destructive mt-1">{errors.customerName}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    className={`input-focus ${errors.phoneNumber ? "border-destructive" : ""}`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Area / Location in Coimbatore *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., RS Puram, Gandhipuram, Peelamedu"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className={`input-focus ${errors.location ? "border-destructive" : ""}`}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive mt-1">{errors.location}</p>
                  )}
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select Service *
                  </label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => handleChange("service", value)}
                  >
                    <SelectTrigger className={`input-focus ${errors.service ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_OPTIONS.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.service && (
                    <p className="text-sm text-destructive mt-1">{errors.service}</p>
                  )}
                </div>

                {/* Problem Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Describe the Problem
                  </label>
                  <Textarea
                    placeholder="Tell us about the issue you're facing..."
                    value={formData.problemDescription}
                    onChange={(e) => handleChange("problemDescription", e.target.value)}
                    className="input-focus min-h-[100px]"
                  />
                </div>

                {/* Date & Time Row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preferred Date
                    </label>
                    <Input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleChange("preferredDate", e.target.value)}
                      className="input-focus"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preferred Time
                    </label>
                    <Select
                      value={formData.preferredTime}
                      onValueChange={(value) => handleChange("preferredTime", value)}
                    >
                      <SelectTrigger className="input-focus">
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                        <SelectItem value="evening">Evening (4 PM - 8 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Booking Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
