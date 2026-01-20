import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";

const TestimonialsSection = () => {
  return (
    <section className="py-12 xs:py-16 md:py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-3 xs:px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 xs:mb-12 md:mb-16"
        >
          <span className="inline-block px-3 xs:px-4 py-1 xs:py-1.5 bg-accent text-accent-foreground text-xs xs:text-sm font-medium rounded-full mb-3 xs:mb-4">
            Customer Reviews
          </span>
          <h2 className="section-title text-foreground mb-3 xs:mb-4 text-2xl xs:text-3xl md:text-4xl lg:text-5xl px-2">
            Trusted by <span className="text-gradient">500+ Customers</span>
          </h2>
          <p className="section-subtitle mx-auto text-sm xs:text-base md:text-lg lg:text-xl px-2">
            See what our customers in Coimbatore have to say about QuickServe.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 md:gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="testimonial-card h-full flex flex-col p-4 xs:p-5 md:p-6">
                {/* Quote Icon */}
                <div className="w-8 h-8 xs:w-10 xs:h-10 bg-accent rounded-lg flex items-center justify-center mb-3 xs:mb-4">
                  <Quote className="w-4 h-4 xs:w-5 xs:h-5 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex gap-0.5 xs:gap-1 mb-3 xs:mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 xs:w-4 xs:h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-muted-foreground mb-4 xs:mb-5 md:mb-6 flex-grow text-xs xs:text-sm md:text-base">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="border-t border-border pt-3 xs:pt-4">
                  <p className="font-semibold text-foreground text-sm xs:text-base">{testimonial.name}</p>
                  <p className="text-xs xs:text-sm text-muted-foreground">{testimonial.location}</p>
                  <span className="inline-block mt-1.5 xs:mt-2 text-[10px] xs:text-xs bg-accent text-accent-foreground px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full">
                    {testimonial.service}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
