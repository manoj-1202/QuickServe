import { motion } from "framer-motion";
import { HOW_IT_WORKS } from "@/lib/constants";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-12 xs:py-16 md:py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-3 xs:px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-8 xs:mb-12 md:mb-16"
        >
          <span className="inline-block px-3 xs:px-4 py-1 xs:py-1.5 bg-accent text-accent-foreground text-xs xs:text-sm font-medium rounded-full mb-3 xs:mb-4">
            Simple Process
          </span>
          <h2 className="section-title text-foreground mb-3 xs:mb-4 text-2xl xs:text-3xl md:text-4xl lg:text-5xl">
            How <span className="text-primary">QuickServee</span> Works
          </h2>
          <p className="section-subtitle mx-auto text-sm xs:text-base md:text-lg">
            Get your electronics fixed in three simple steps. Fast, easy, and reliable service every time.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-6 xs:gap-8 relative"
        >
          {/* Connecting Line (Desktop) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 origin-left"
          />

          {HOW_IT_WORKS.map((item) => (
            <motion.div
              key={item.step}
              variants={itemVariants}
              className="step-card relative z-10"
            >
              <div className="step-number">
                {item.step}
              </div>
              <h3 className="text-lg xs:text-xl font-display font-bold text-foreground mb-2 xs:mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm xs:text-base">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
