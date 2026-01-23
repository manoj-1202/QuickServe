import { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Menu, X } from "lucide-react";
import { BUSINESS, PHONE_NUMBERS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#services")

  // Scroll Active 
    useEffect(() => {
      const handleScroll = () => {
        navLinks.forEach((link) => {
          const section = document.querySelector(link.href)
          if (!section) return

          const rect = section.getBoundingClientRect()
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveLink(link.href)
          }
        })
      }

      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }, [])


  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#booking", label: "Book Now" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">Q</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              {BUSINESS.name}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setActiveLink(link.href)}
              className={`text-sm font-medium transition-colors ${
                activeLink === link.href
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </a>

            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a href={`tel:${PHONE_NUMBERS.primary}`}>
              <Button variant="default" size="sm" className="gap-2">
                <Phone className="w-4 h-4" />
                Call Now
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="md:hidden bg-background border-t border-border"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()

                setActiveLink(link.href)
                setIsMenuOpen(false)

                setTimeout(() => {
                  const section = document.querySelector(link.href)
                  if (section) {
                    const yOffset = -100
                    const y =
                      section.getBoundingClientRect().top +
                      window.pageYOffset +
                      yOffset

                    window.scrollTo({ top: y, behavior: "smooth" })
                  }
                }, 300) // wait for menu animation
              }}
              className={`text-base font-medium transition-colors py-2 ${
                activeLink === link.href
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </a>
          ))}
              <a href={`tel:${PHONE_NUMBERS.primary}`} className="mt-2">
                <Button variant="default" className="w-full gap-2">
                  <Phone className="w-4 h-4" />
                  Call {PHONE_NUMBERS.primary}
                </Button>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

