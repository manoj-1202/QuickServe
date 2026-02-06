import { motion } from "framer-motion";
import { Phone, MessageCircle, ArrowRight, CheckCircle } from "lucide-react";
import { BUSINESS, PHONE_NUMBERS, WHATSAPP_LINKS } from "@/lib/constants";
import home from "../assest/home.jpg"

const HeroSection = () => {
  const features = [
    "Verified Professionals",
    "Same Day Service",
    "Affordable Rates",
    "Coimbatore's Trusted Choice",
  ];

  return (
    <section className="relative min-h-[100svh] flex items-center pt-16 xs:pt-20 md:pt-0 overflow-hidden">
      {/* Background Pattern */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${home})` }}
    />

      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      
      {/* Decorative Elements - Hidden on very small screens */}
      <div className="hidden xs:block absolute top-1/4 right-1/4 w-32 xs:w-48 md:w-64 h-32 xs:h-48 md:h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="hidden xs:block absolute bottom-1/4 left-1/4 w-24 xs:w-36 md:w-48 h-24 xs:h-36 md:h-48 bg-primary/5 rounded-full blur-2xl" />

      <div className="container mx-auto px-3 xs:px-4 relative z-10 py-8 xs:py-12 md:py-0">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full mt-6"
            >
              <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs xs:text-sm lg:text-xs xl:text-xs  font-medium text-accent-foreground">
                Serving {BUSINESS.location}
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-4xl font-bold text-white leading-tight mb-6">
              {BUSINESS.name} –{" "}
              <span className="text-primary">Fast & Reliable</span>{" "}
              Electronic Services
            </h1>

            {/* Subtext */}
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-muted-foreground text-white mb-5 xs:mb-8 max-w-xl mx-auto lg:mx-0">
              One Call Connects you to Trusted AC, Washing Machine, Fridge, TV, Electrician, CCTV, and Mobile repair Professionals in Coimbatore.
            </p>

            {/* Features - Scrollable on mobile */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 xs:gap-3 sm:gap-4 mb-5 xs:mb-8 px-1">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm text-white"
                >
                  <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4 text-primary flex-shrink-0" />
                  <span className="whitespace-nowrap">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-2.5 xs:gap-3 sm:gap-4 justify-center lg:justify-start">
              <div className="flex flex-col xs:flex-row gap-2.5 xs:gap-3 sm:gap-4">
                <motion.a
                  href={`tel:${PHONE_NUMBERS.primary}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-hero-primary text-sm xs:text-base sm:text-lg px-4 xs:px-6 sm:px-8 py-3 xs:py-3.5 sm:py-4"
                >
                  <Phone className="w-4 h-4 xs:w-5 xs:h-5" />
                  <span className="hidden xs:inline">Call Now: {PHONE_NUMBERS.primary}</span>
                  <span className="xs:hidden">Call: {PHONE_NUMBERS.primary}</span>
                </motion.a>

                <motion.a
                  href={WHATSAPP_LINKS.primary}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-whatsapp text-sm xs:text-base px-4 xs:px-6 py-3 xs:py-3.5"
                >
                  <MessageCircle className="w-4 h-4 xs:w-5 xs:h-5" />
                  WhatsApp Now
                </motion.a>
              </div>
            </div>

            {/* Secondary Phone */}
            <p className="mt-4 xs:mt-6 text-xs xs:text-sm text-white">
              Or call:{" "}
              <a href={`tel:${PHONE_NUMBERS.secondary}`} className="text-primary hover:underline font-medium">
                {PHONE_NUMBERS.secondary}
              </a>
            </p>
          </motion.div>

          {/* Hero Visual - Hidden on mobile, shown on lg+ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="w-72 xl:w-80 h-80 xl:h-96 bg-gradient-to-br from-primary to-primary/80 rounded-3xl shadow-red p-6 xl:p-8 flex flex-col justify-between text-primary-foreground">
                <div>
                  <div className="w-12 xl:w-16 h-12 xl:h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 xl:mb-6">
                    <Phone className="w-6 xl:w-8 h-6 xl:h-8" />
                  </div>
                  <h3 className="text-xl xl:text-2xl font-bold mb-2">24/7 Support</h3>
                  <p className="text-white/80 text-sm xl:text-base">
                    Get instant help for all your electronic service needs in Coimbatore
                  </p>
                </div>
                <a
                  href="#booking"
                  className="flex items-center gap-2 text-white font-semibold hover:gap-4 transition-all text-sm xl:text-base"
                >
                  Book a Service <ArrowRight className="w-4 xl:w-5 h-4 xl:h-5" />
                </a>
              </div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -right-8 bg-card rounded-2xl shadow-lg p-4 border border-border"
              >
                <div className="flex items-center gap-2 xl:gap-3">
                  <div className="w-8 xl:w-10 h-8 xl:h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 xl:w-5 h-4 xl:h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs xl:text-sm font-semibold">500+</p>
                    <p className="text-[10px] xl:text-xs text-muted-foreground">Happy Customers</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-8 -left-8 bg-card rounded-2xl shadow-lg p-4 border border-border"
              >
                <div className="flex items-center gap-2 xl:gap-3">
                  <div className="w-8 xl:w-10 h-8 xl:h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-sm xl:text-lg">⭐</span>
                  </div>
                  <div>
                    <p className="text-xs xl:text-sm font-semibold">4.9 Rating</p>
                    <p className="text-[10px] xl:text-xs text-muted-foreground">Customer Reviews</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
