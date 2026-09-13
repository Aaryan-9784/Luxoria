/**
 * LUXORIA — Vehicles Page Static Configuration Data
 * Luxury brand definitions, categories, and booking step metadata.
 */

// ─── Luxury Brands ──────────────────────────────────────────────────────────
export const LUXURY_BRANDS = [
  { id: 'rolls-royce', name: 'Rolls-Royce', initial: 'RR', subtitle: 'Ultra Luxury', color: '#1B1B3A', description: 'The pinnacle of luxury motoring' },
  { id: 'bentley', name: 'Bentley', initial: 'B', subtitle: 'Grand Touring', color: '#2C5F2D', description: 'Extraordinary journeys since 1919' },
  { id: 'ferrari', name: 'Ferrari', initial: 'F', subtitle: 'Italian Supercar', color: '#DC0000', description: 'The prancing horse legend' },
  { id: 'lamborghini', name: 'Lamborghini', initial: 'L', subtitle: 'Exotic Sports', color: '#DDB321', description: 'Unleash the extraordinary' },
  { id: 'porsche', name: 'Porsche', initial: 'P', subtitle: 'Performance', color: '#B12B28', description: 'There is no substitute' },
  { id: 'mclaren', name: 'McLaren', initial: 'M', subtitle: 'Supercar', color: '#FF8000', description: 'Fearlessly forward' },
  { id: 'aston-martin', name: 'Aston Martin', initial: 'AM', subtitle: 'British Luxury', color: '#006847', description: 'Power, beauty and soul' },
  { id: 'mercedes-maybach', name: 'Mercedes-Maybach', initial: 'MM', subtitle: 'Prestige Class', color: '#231F20', description: 'The ultimate in luxury' },
  { id: 'bmw-m', name: 'BMW M', initial: 'M', subtitle: 'Motorsport', color: '#0066B1', description: 'The most powerful letter in the world' },
  { id: 'audi-rs', name: 'Audi RS', initial: 'RS', subtitle: 'High Performance', color: '#BB0A30', description: 'Vorsprung durch Technik' },
];

// ─── Collections ─────────────────────────────────────────────────────────────
export const COLLECTIONS = [
  {
    id: 'luxury-sedans',
    title: 'Luxury Sedans',
    description: 'Refined elegance meets supreme comfort',
    image: 'https://i.ytimg.com/vi/lzKtgJ7wY2c/maxresdefault.jpg',
    tag: 'Executive Class',
    category: 'sedan',
  },
  {
    id: 'executive-suvs',
    title: 'Executive SUVs',
    description: 'Commanding presence, unmatched versatility',
    image: 'https://media.cdn-jaguarlandrover.com/api/v2/images/120439/w/1600/h/900.jpg',
    tag: 'Prestige SUV',
    category: 'suv',
  },
  {
    id: 'sports-cars',
    title: 'Sports Cars',
    description: 'Pure driving exhilaration',
    image: 'https://robbreport.com/wp-content/uploads/2020/07/6-3.jpg',
    tag: 'High Performance',
    category: 'sports',
  },
  {
    id: 'supercars',
    title: 'Supercars',
    description: 'Beyond extraordinary performance',
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=1200',
    tag: 'Track & Street',
    category: 'sports',
  },
  {
    id: 'hypercars',
    title: 'Hypercars',
    description: 'The absolute pinnacle of automotive engineering',
    image: 'https://www.slashgear.com/img/gallery/10-of-the-most-expensive-hypercars-ever-made-ranked/l-intro-1709668510.jpg',
    tag: 'Pinnacle Series',
    category: 'sports',
  },
  {
    id: 'electric-luxury',
    title: 'Electric Luxury',
    description: 'Sustainable sophistication',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1200',
    tag: 'Next-Gen EV',
    category: 'electric',
  },
  {
    id: 'wedding-collection',
    title: 'Wedding Collection',
    description: 'Make your special day unforgettable',
    image: 'https://calibremag.com/wp-content/uploads/2025/04/Rolls-Royce-Ghost-Series-II-Scotland-2025-CALIBRE-01.webp',
    tag: 'Ceremonial',
    category: 'luxury',
  },
  {
    id: 'chauffeur-collection',
    title: 'Chauffeur Collection',
    description: 'Premium chauffeur-driven experiences',
    image: 'https://www.cityluxchauffeurs.com/assets/images/fleet/s-class/s-class.webp',
    tag: 'Chauffeur-Driven',
    category: 'limousine',
  },
];

// ─── Client Testimonials ─────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Vikramaditya Singhania',
    role: 'Managing Director, Singhania Group',
    photo: '/images/vikramaditya.png',
    vehicle: 'Rolls-Royce Ghost',
    review: 'An absolutely extraordinary experience. The vehicle was immaculate, delivered on time, and the concierge service was beyond any five-star hotel I have visited. Luxoria has redefined luxury vehicle rental in India.',
    location: 'Mumbai, Maharashtra',
    rating: 5,
  },
  {
    id: 2,
    name: 'Ananya Deshmukh',
    role: 'Fashion Director & Curator',
    photo: '/images/ananya.png',
    vehicle: 'Ferrari 296 GTB',
    review: 'From the moment I placed my booking to the doorstep delivery, everything was flawless. The Ferrari was a dream to drive along the coastal highway. Will definitely be using Luxoria for all my future events.',
    location: 'Bengaluru, Karnataka',
    rating: 5,
  },
  {
    id: 3,
    name: 'Rajeshwar Verma',
    role: 'Senior Managing Partner',
    photo: '/images/rajeshwar.png',
    vehicle: 'Bentley Continental GT',
    review: 'The attention to detail is remarkable. Every vehicle in their fleet is maintained to the highest standards. The Bentley was absolutely pristine. Luxoria understands what true luxury mobility means.',
    location: 'New Delhi, NCR',
    rating: 5,
  },
  {
    id: 4,
    name: 'Kavita Reddy',
    role: 'Celebrity Designer',
    photo: '/images/ananya.png',
    vehicle: 'Lamborghini Huracán',
    review: 'I have rented luxury vehicles from services worldwide, and Luxoria stands in a class of its own. The booking process was seamless, and the Huracán was delivered in showroom condition.',
    location: 'Hyderabad, Telangana',
    rating: 5,
  },
  {
    id: 5,
    name: 'Rajiv Malhotra',
    role: 'Tech Entrepreneur & Founder',
    photo: '/images/vikramaditya.png',
    vehicle: 'Porsche 911 Turbo S',
    review: 'Used Luxoria for our grand wedding weekend in Udaipur and it was spectacular. Three luxury vehicles, all delivered on time, all immaculate. The team went above and beyond.',
    location: 'Jaipur, Rajasthan',
    rating: 5,
  },
  {
    id: 6,
    name: 'Priyanka Singhania',
    role: 'Luxury Travel Curator',
    photo: '/images/ananya.png',
    vehicle: 'Mercedes-Maybach S-Class',
    review: 'As someone who reviews luxury experiences for a living, I can confidently say Luxoria delivers an unparalleled service in India. The Maybach was pure opulence on wheels.',
    location: 'Kolkata, West Bengal',
    rating: 5,
  },
];

// ─── Luxury Benefits ─────────────────────────────────────────────────────────
export const BENEFITS = [
  { id: 1, icon: 'ShieldCheck', title: 'Verified Vehicles', description: 'Every vehicle undergoes a rigorous 150-point inspection before joining our fleet.' },
  { id: 2, icon: 'Crown', title: 'VIP Concierge', description: 'Dedicated luxury concierge for personalized vehicle recommendations and bespoke experiences.' },
  { id: 3, icon: 'Headphones', title: '24/7 Support', description: 'Round-the-clock premium support by automotive experts, available whenever you need.' },
  { id: 4, icon: 'MapPin', title: 'Doorstep Delivery', description: 'Complimentary doorstep delivery and pickup at your preferred location, anywhere.' },
  { id: 5, icon: 'Shield', title: 'Fully Insured', description: 'Comprehensive premium insurance coverage for complete peace of mind on every journey.' },
  { id: 6, icon: 'Lock', title: 'Secure Payments', description: 'Bank-grade encryption with multiple payment options including cryptocurrency.' },
  { id: 7, icon: 'UserCheck', title: 'Professional Chauffeurs', description: 'Trained, vetted, and multilingual professional chauffeurs for the ultimate experience.' },
  { id: 8, icon: 'Star', title: 'Premium Customer Care', description: 'Dedicated account manager ensuring every detail of your experience is perfected.' },
];

// ─── Trust & Credibility Stats ───────────────────────────────────────────────
export const TRUST_STATS = [
  { id: 1, value: 500, suffix: '+', label: 'Verified Vendors', icon: 'Building2' },
  { id: 2, value: 50, suffix: '+', label: 'Luxury Brands', icon: 'Award' },
  { id: 3, value: 15000, suffix: '+', label: 'Successful Bookings', icon: 'CheckCircle2' },
  { id: 4, value: 99.2, suffix: '%', label: 'Customer Satisfaction', icon: 'Heart' },
];

// ─── Booking Process Steps ───────────────────────────────────────────────────
export const BOOKING_STEPS = [
  { step: 1, title: 'Browse', description: 'Explore our curated collection of luxury vehicles', icon: 'Search' },
  { step: 2, title: 'Select', description: 'Choose your perfect vehicle and customize your experience', icon: 'MousePointerClick' },
  { step: 3, title: 'Verify', description: 'Quick identity verification for your security', icon: 'ScanFace' },
  { step: 4, title: 'Pay', description: 'Secure payment with multiple premium options', icon: 'CreditCard' },
  { step: 5, title: 'Delivery', description: 'Doorstep delivery at your preferred time and location', icon: 'Truck' },
  { step: 6, title: 'Drive', description: 'Experience the extraordinary on the open road', icon: 'Gauge' },
];

// ─── Sort Options ────────────────────────────────────────────────────────────
export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: '-bookingCount', label: 'Most Popular' },
  { value: '-createdAt', label: 'Newest First' },
  { value: '-rating.average', label: 'Highest Rated' },
  { value: 'pricePerDay', label: 'Price: Low to High' },
  { value: '-pricePerDay', label: 'Price: High to Low' },
];

// ─── Filter Options ──────────────────────────────────────────────────────────
export const FILTER_OPTIONS = {
  brand: ['Ferrari', 'Rolls-Royce', 'McLaren', 'Lamborghini', 'Porsche', 'Bugatti', 'Bentley', 'Aston Martin', 'Mercedes-Maybach', 'BMW M', 'Audi RS'],
  category: ['sports', 'suv', 'luxury', 'sedan', 'convertible', 'electric', 'limousine'],
  transmission: ['automatic', 'manual'],
  fuelType: ['petrol', 'diesel', 'electric', 'hybrid'],
  seats: ['2', '4', '5', '7+'],
  availability: ['available', 'all'],
};

// ─── Hero Statistics ─────────────────────────────────────────────────────────
export const HERO_STATS = [
  { value: 6, suffix: '+', label: 'Luxury Vehicles' },
  { value: 6, suffix: '+', label: 'Premium Brands' },
  { value: 1, suffix: '+', label: 'Confirmed Bookings' },
];
