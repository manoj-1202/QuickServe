import { motion } from "framer-motion";
import { HOW_IT_WORKS } from "@/lib/constants";

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-12 xs:py-16 md:py-20 lg:py-28 bg-background">
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
            Simple Process
          </span>
          <h2 className="section-title text-foreground mb-3 xs:mb-4 text-2xl xs:text-3xl md:text-4xl lg:text-5xl px-2">
            How <span className="text-gradient">QuickServe</span> Works
          </h2>
          <p className="section-subtitle mx-auto text-sm xs:text-base md:text-lg lg:text-xl px-2">
            Get your electronics fixed in three simple steps. Fast, easy, and reliable service every time.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xs:gap-8 md:gap-6 lg:gap-8 relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 lg:top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          {HOW_IT_WORKS.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="step-card relative z-10 p-4 xs:p-5 md:p-6"
            >
              <div className="step-number w-10 h-10 xs:w-12 xs:h-12 md:w-14 md:h-14 text-base xs:text-lg md:text-xl mb-3 xs:mb-4">
                {item.step}
              </div>
              <h3 className="text-base xs:text-lg md:text-xl font-display font-bold text-foreground mb-2 xs:mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-xs xs:text-sm md:text-base">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
