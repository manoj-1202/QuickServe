import { Phone, MessageCircle, MapPin } from "lucide-react";
import { BUSINESS, PHONE_NUMBERS, WHATSAPP_LINKS, SERVICES } from "@/lib/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-qs-gray-900 text-qs-gray-100 pt-10 xs:pt-12 md:pt-16 pb-6 xs:pb-8">
      <div className="container mx-auto px-3 xs:px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 xs:gap-8 mb-8 xs:mb-10 md:mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 xs:gap-2 mb-3 xs:mb-4">
              <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-lg xs:rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-base xs:text-xl">Q</span>
              </div>
              <span className="font-display font-bold text-base xs:text-lg md:text-xl text-white">
                {BUSINESS.name}
              </span>
            </div>
            <p className="text-qs-gray-500 mb-3 xs:mb-4 text-xs xs:text-sm">
              {BUSINESS.tagline}. One call connects you to trusted electronic service professionals.
            </p>
            <div className="flex gap-2 xs:gap-3">
              <a href={`tel:${PHONE_NUMBERS.primary}`} className="w-8 h-8 xs:w-10 xs:h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Phone className="w-4 h-4 xs:w-5 xs:h-5" />
              </a>
              <a href={WHATSAPP_LINKS.primary} target="_blank" rel="noopener noreferrer" className="w-8 h-8 xs:w-10 xs:h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <MessageCircle className="w-4 h-4 xs:w-5 xs:h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-white mb-3 xs:mb-4 text-sm xs:text-base">Our Services</h4>
            <ul className="space-y-1.5 xs:space-y-2">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <a href="#services" className="text-qs-gray-500 hover:text-primary transition-colors text-xs xs:text-sm">
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-3 xs:mb-4 text-sm xs:text-base">Quick Links</h4>
            <ul className="space-y-1.5 xs:space-y-2">
              <li><a href="#services" className="text-qs-gray-500 hover:text-primary transition-colors text-xs xs:text-sm">Services</a></li>
              <li><a href="#how-it-works" className="text-qs-gray-500 hover:text-primary transition-colors text-xs xs:text-sm">How It Works</a></li>
              <li><a href="#booking" className="text-qs-gray-500 hover:text-primary transition-colors text-xs xs:text-sm">Book a Service</a></li>
              <li><a href="#contact" className="text-qs-gray-500 hover:text-primary transition-colors text-xs xs:text-sm">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 xs:col-span-1">
            <h4 className="font-display font-semibold text-white mb-3 xs:mb-4 text-sm xs:text-base">Contact Info</h4>
            <ul className="space-y-2 xs:space-y-3">
              <li className="flex items-start gap-2 xs:gap-3">
                <Phone className="w-4 h-4 xs:w-5 xs:h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <a href={`tel:${PHONE_NUMBERS.primary}`} className="text-qs-gray-500 hover:text-white transition-colors block text-xs xs:text-sm">{PHONE_NUMBERS.primary}</a>
                  <a href={`tel:${PHONE_NUMBERS.secondary}`} className="text-qs-gray-500 hover:text-white transition-colors block text-xs xs:text-sm">{PHONE_NUMBERS.secondary}</a>
                </div>
              </li>
              <li className="flex items-start gap-2 xs:gap-3">
                <MapPin className="w-4 h-4 xs:w-5 xs:h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-qs-gray-500 text-xs xs:text-sm">{BUSINESS.serviceArea}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-5 xs:pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 xs:gap-3 md:gap-4 text-center md:text-left">
            <p className="text-qs-gray-500 text-[10px] xs:text-xs md:text-sm">
              © {currentYear} {BUSINESS.name}. All rights reserved.
            </p>
            <p className="text-qs-gray-500 text-[10px] xs:text-xs md:text-sm">
              Serving {BUSINESS.location} with trusted electronic services.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
