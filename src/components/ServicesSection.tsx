import { motion } from "framer-motion";
import { Snowflake, Tv, Zap, Camera, Smartphone, Settings, ArrowRight,  WashingMachine,Refrigerator } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const iconMap = {
  Snowflake,
  Tv,
  Zap,
  Camera,
  Smartphone,
  Settings,
  WashingMachine,
  Refrigerator
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-12 xs:py-16 md:py-20 lg:py-28 bg-secondary/30">
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
            Our Services
          </span>
          <h2 className="section-title text-foreground mb-3 xs:mb-4 text-2xl xs:text-3xl md:text-4xl lg:text-5xl px-2">
            Expert Solutions for All Your{" "}
            <span className="text-primary">Electronic Needs</span>
          </h2>
          <p className="section-subtitle mx-auto text-sm xs:text-base md:text-lg lg:text-xl px-2">
            From AC repairs to mobile fixes, QuickServe connects you with verified professionals for every electronic service.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 md:gap-6">
          {SERVICES.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="service-card group h-full p-4 xs:p-5 md:p-6">
                  <div className="service-card-icon w-10 h-10 xs:w-12 xs:h-12 md:w-14 md:h-14 mb-3 xs:mb-4">
                    <IconComponent className="w-5 h-5 xs:w-6 xs:h-6 md:w-7 md:h-7" />
                  </div>
                  <h3 className="text-base xs:text-lg md:text-xl font-display font-bold text-foreground mb-2 xs:mb-3">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 xs:mb-5 md:mb-6 flex-grow text-xs xs:text-sm md:text-base">
                    {service.description}
                  </p>
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-1.5 xs:gap-2 text-primary font-semibold group-hover:gap-2.5 xs:group-hover:gap-3 transition-all text-sm xs:text-base"
                  >
                    Book Now <ArrowRight className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8 xs:mt-10 md:mt-12"
        >
          <a href="#booking">
            <Button size="lg" className="gap-2 text-sm xs:text-base h-10 xs:h-11 md:h-12 px-4 xs:px-6 md:px-8">
              View All Services & Book Now
              <ArrowRight className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
