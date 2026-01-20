import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Menu, X, MessageCircle } from "lucide-react";
import { BUSINESS, PHONE_NUMBERS, WHATSAPP_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#booking", label: "Book Now" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-3 xs:px-4">
        <div className="flex items-center justify-between h-14 xs:h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-1.5 xs:gap-2">
            <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-lg xs:rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-base xs:text-xl">Q</span>
            </div>
            <span className="font-display font-bold text-base xs:text-lg sm:text-xl text-foreground">
              {BUSINESS.name}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <a href={`tel:${PHONE_NUMBERS.primary}`}>
              <Button variant="default" size="sm" className="gap-2 text-xs lg:text-sm">
                <Phone className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                <span className="hidden lg:inline">{PHONE_NUMBERS.primary}</span>
                <span className="lg:hidden">Call Now</span>
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-1.5 xs:p-2 text-foreground -mr-1"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5 xs:w-6 xs:h-6" /> : <Menu className="w-5 h-5 xs:w-6 xs:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <nav className="container mx-auto px-3 xs:px-4 py-3 xs:py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm xs:text-base font-medium text-foreground hover:text-primary transition-colors py-2.5 xs:py-3 border-b border-border/50 last:border-0"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 pt-3 xs:pt-4">
                <a href={`tel:${PHONE_NUMBERS.primary}`} className="flex-1">
                  <Button variant="default" size="sm" className="w-full gap-2 h-10 xs:h-11 text-sm">
                    <Phone className="w-4 h-4" />
                    Call Now
                  </Button>
                </a>
                <a href={WHATSAPP_LINKS.primary} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-2 h-10 xs:h-11 text-sm border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
