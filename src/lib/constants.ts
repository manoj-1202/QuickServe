// QuickServe Business Information
export const BUSINESS = {
  name: "QuickServe",
  tagline: "Fast & Reliable Electronic Services in Coimbatore",
  location: "Coimbatore, Tamil Nadu",
  serviceArea: "Coimbatore & Nearby Areas",
  hours: "Mon-Sat: 8:00 AM - 8:00 PM | Sun: 9:00 AM - 6:00 PM",
};

export const PHONE_NUMBERS = {
  primary: "6383338383",
  secondary: "7448383350",
};

export const WHATSAPP_LINKS = {
  primary: `https://wa.me/91${PHONE_NUMBERS.primary}`,
  secondary: `https://wa.me/91${PHONE_NUMBERS.secondary}`,
};

export const SERVICES = [
  {
    id: "ac-service",
    name: "AC Service & Repair",
    description: "Expert AC installation, servicing, gas refilling, and repair for all brands including split, window, and central AC systems.",
    icon: "Snowflake",
  },
    {
    id: "washing-machine-service",
    name: "Washing Machine Service & Repair",
    description: "Professional washing machine installation, servicing, and repair for all brands including top-load, front-load, and fully automatic models.",
    icon: "WashingMachine",
  },
  {
    id: "fridge-service",
    name: "Fridge Service & Repair",
    description: "Expert refrigerator installation, servicing, and repair for all brands including single-door, double-door, and side-by-side models.",
    icon: "Refrigerator",
  },
  {
    id: "tv-repair",
    name: "TV Repair",
    description: "Professional repair services for LED, LCD, OLED, and Smart TVs. Panel repairs, board replacements, and software updates.",
    icon: "Tv",
  },
  {
    id: "electrical",
    name: "Electrical Services",
    description: "Licensed electricians for wiring, switchboard installation, fault finding, and all electrical repairs.",
    icon: "Zap",
  },
  {
    id: "cctv",
    name: "CCTV Installation",
    description: "Complete CCTV solutions including installation, maintenance, DVR setup, and remote viewing configuration.",
    icon: "Camera",
  },
  {
    id: "mobile-laptop",
    name: "Mobile & Laptop Repair",
    description: "Expert repair for smartphones, tablets, and laptops. Screen replacement, battery service, and data recovery.",
    icon: "Smartphone",
  },
  {
    id: "other",
    name: "Other Electronics",
    description: "Washing machines, refrigerators, microwave ovens, and other home appliances service and repair.",
    icon: "Settings",
  },
] as const;

export const SERVICE_OPTIONS = SERVICES.map((s) => s.name);

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "RS Puram, Coimbatore",
    rating: 5,
    text: "QuickServe sent a technician within 2 hours of my call. My AC is working perfectly now. Highly recommended!",
    service: "AC Service",
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Gandhipuram, Coimbatore",
    rating: 5,
    text: "Very professional service. The CCTV installation was done neatly and they explained everything clearly.",
    service: "CCTV Installation",
  },
  {
    id: 3,
    name: "Mohammed Ali",
    location: "Peelamedu, Coimbatore",
    rating: 5,
    text: "Fixed my TV in no time. Fair pricing and honest service. Will definitely use QuickServe again.",
    service: "TV Repair",
  },
  {
    id: 4,
    name: "Lakshmi Devi",
    location: "Saibaba Colony, Coimbatore",
    rating: 5,
    text: "The electrician was very skilled and completed the wiring work safely. Thank you QuickServe!",
    service: "Electrical Services",
  },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Choose Your Service",
    description: "Select from our range of electronic services - AC, TV, Electrical, CCTV, or Mobile/Laptop repair.",
  },
  {
    step: 2,
    title: "Contact Us",
    description: "Call, WhatsApp, or submit a booking request online. We're available 7 days a week.",
  },
  {
    step: 3,
    title: "Get It Fixed",
    description: "QuickServe connects you with a trusted, verified technician who arrives at your doorstep.",
  },
];
