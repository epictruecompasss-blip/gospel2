/**
 * Centralized assets for the Books landing page.
 * All book covers, logos, and illustrations can be swapped here.
 * Book images support transparent PNGs with subtle shadows and glow.
 */

export interface BookCover {
  id: string;
  title: string;
  subtitle: string;
  age: 'Kids' | 'Teen' | 'Adult';
  accent: string; // hex
  cover: string;  // image URL (transparent PNG recommended)
}

export const heroBooks: BookCover[] = [
  {
    id: 'kids',
    title: 'Kids',
    subtitle: 'Ages 6–12',
    age: 'Kids',
    accent: '#F59E0B',
    cover: '/images/books/every_offering_pointed_to_him(kids_version) copy 2.webp',
  },
  {
    id: 'teen',
    title: 'Teen',
    subtitle: 'Ages 13–18',
    age: 'Teen',
    accent: '#3B82F6',
    cover: '/images/books/every_offering_pointed_to_him(teen_version) copy 2.webp',
  },
  {
    id: 'adult',
    title: 'Adult',
    subtitle: 'Ages 19+',
    age: 'Adult',
    accent: '#D4AF37',
    cover: '/images/books/every_offering_pointed_to_him(adult_version) copy 2.webp',
  },
];

export interface EditionPrice {
  age: 'Kids' | 'Teen' | 'Adult';
  label: string;
  usd: string;
  kes: string;
}

export interface Collection {
  id: string;
  volume: string;
  title: string;
  scripture: string;
  days: number;
  description: string;
  cover: string;
  editions: {
    kids: { cover: string; usd: string; kes: string };
    teen: { cover: string; usd: string; kes: string };
    adult: { cover: string; usd: string; kes: string };
  };
}

export const collections: Collection[] = [
  {
    id: 'series-1',
    volume: 'Series 1',
    title: 'I AM — 120 Names of Jesus',
    scripture: 'Discovering Who Jesus Is',
    days: 120,
    description: 'A 120-day journey through the names and titles of Jesus — from the Bread of Life to the King of Kings — revealing who He is and what that means for your daily life.',
    cover: '/images/books/he_was_always_the_answer(adult_version).png',
    editions: {
      kids: { cover: '/images/books/he_was_always_the_answer(kids_version).png', usd: '$8', kes: 'KES 1,080' },
      teen: { cover: '/images/books/he_was_always_the_answer(teen_version).png', usd: '$10', kes: 'KES 1,350' },
      adult: { cover: '/images/books/he_was_always_the_answer(adult_version).png', usd: '$12', kes: 'KES 1,600' },
    },
  },
  {
    id: 'series-2',
    volume: 'Series 2',
    title: 'Full of Grace and Truth — 120 Gospel Encounters',
    scripture: 'Meeting Jesus in the Gospels',
    days: 120,
    description: 'A 120-day journey through 120 life-changing encounters with Jesus in the Gospels — each one a fresh meeting with the One who is full of grace and truth.',
    cover: '/images/books/everywhere_i_look_its_him(adult_version) copy 2.webp',
    editions: {
      kids: { cover: '/images/books/everywhere_i_look_its_him(kids_version) copy 2.webp', usd: '$8', kes: 'KES 1,080' },
      teen: { cover: '/images/books/everywhere_i_look_its_him(teen_version).webp', usd: '$10', kes: 'KES 1,350' },
      adult: { cover: '/images/books/everywhere_i_look_its_him(adult_version) copy 2.webp', usd: '$12', kes: 'KES 1,600' },
    },
  },
  {
    id: 'series-3',
    volume: 'Series 3 — Coming Soon',
    title: 'He Entered Before He Came — 50 Days in Joshua',
    scripture: 'The Captain of the Lord\'s Army',
    days: 50,
    description: 'A 50-day journey through the book of Joshua, revealing the Captain who entered the story long before He walked the roads of Galilee.',
    cover: '/images/books/every_offering_pointed_to_him(adult_version) copy 2.webp',
    editions: {
      kids: { cover: '/images/books/every_offering_pointed_to_him(kids_version) copy 2.webp', usd: '$8', kes: 'KES 1,080' },
      teen: { cover: '/images/books/every_offering_pointed_to_him(teen_version) copy 2.webp', usd: '$10', kes: 'KES 1,350' },
      adult: { cover: '/images/books/every_offering_pointed_to_him(adult_version) copy 2.webp', usd: '$12', kes: 'KES 1,600' },
    },
  },
];

export interface AgeCard {
  id: string;
  age: string;
  range: string;
  features: string[];
  cover: string;
}

export const ageCards: AgeCard[] = [
  {
    id: 'kids-card',
    age: 'Kids',
    range: 'Age 6–12',
    features: ['Bright illustrations', 'Simple explanations', 'Fun activities', 'Family discussion'],
    cover: '/images/books/every_offering_pointed_to_him(kids_version) copy 2.webp',
  },
  {
    id: 'teen-card',
    age: 'Teen',
    range: 'Age 13–18',
    features: ['Faith in today\'s world', 'Reflection', 'Questions', 'Life application'],
    cover: '/images/books/every_offering_pointed_to_him(teen_version) copy 2.webp',
  },
  {
    id: 'adult-card',
    age: 'Adult',
    range: 'Age 19+',
    features: ['Rich theology', 'Prayer', 'Daily transformation', 'Church study'],
    cover: '/images/books/every_offering_pointed_to_him(adult_version) copy 2.webp',
  },
];

export interface Feature {
  id: string;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    id: 'christ-centered',
    title: 'Christ-Centered',
    description: 'Every devotional reveals Jesus — from the first page of Genesis to the last amen of Revelation.',
  },
  {
    id: 'scripture-first',
    title: 'Scripture First',
    description: "God's Word explains God's Word. We let Scripture interpret Scripture, always.",
  },
  {
    id: 'beautiful-design',
    title: 'Beautiful Design',
    description: 'Premium artwork, a premium reading experience, and premium printing worthy of the message.',
  },
  {
    id: 'built-for-families',
    title: 'Built for Families',
    description: 'Parents, kids, teens, small groups, and churches — one journey, every generation.',
  },
];

export const timeline: string[] = [
  'Series 1: I AM', 'Series 2: Grace & Truth', 'Series 3: Joshua',
];

export const checklist: string[] = [
  'Daily devotional',
  'Prayer',
  'Reflection',
  'Scripture',
  'Christ Connection',
  'Family Friendly',
  'Deep Theology',
];

export interface PriceTier {
  id: string;
  name: string;
  tagline: string;
  highlight?: boolean;
  prices: { currency: string; amount: string }[];
  formats: string[];
}

export const pdfPricing: PriceTier[] = [
  {
    id: 'adult-pdf',
    name: 'Adult Edition',
    tagline: 'Ages 19+',
    prices: [
      { currency: 'USD', amount: '$12' },
      { currency: 'KES', amount: '1,600' },
      { currency: 'NGN', amount: '19,000' },
      { currency: 'GHS', amount: '170' },
      { currency: 'ZAR', amount: '220' },
      { currency: 'UGX', amount: '45,000' },
      { currency: 'TZS', amount: '32,000' },
    ],
    formats: ['PDF'],
  },
  {
    id: 'teen-pdf',
    name: 'Teen Edition',
    tagline: 'Ages 13–18',
    prices: [
      { currency: 'USD', amount: '$10' },
      { currency: 'KES', amount: '1,350' },
      { currency: 'NGN', amount: '16,000' },
      { currency: 'GHS', amount: '142' },
      { currency: 'ZAR', amount: '185' },
      { currency: 'UGX', amount: '37,000' },
      { currency: 'TZS', amount: '27,000' },
    ],
    formats: ['PDF'],
  },
  {
    id: 'kids-pdf',
    name: 'Kids Edition',
    tagline: 'Ages 6–12',
    prices: [
      { currency: 'USD', amount: '$8' },
      { currency: 'KES', amount: '1,080' },
      { currency: 'NGN', amount: '12,800' },
      { currency: 'GHS', amount: '114' },
      { currency: 'ZAR', amount: '148' },
      { currency: 'UGX', amount: '30,000' },
      { currency: 'TZS', amount: '21,000' },
    ],
    formats: ['PDF'],
  },
  {
    id: 'family-bundle',
    name: 'Complete Family Bundle',
    tagline: 'All 3 editions',
    highlight: true,
    prices: [
      { currency: 'USD', amount: '$25' },
      { currency: 'KES', amount: '3,350' },
      { currency: 'NGN', amount: '40,000' },
      { currency: 'GHS', amount: '356' },
      { currency: 'ZAR', amount: '460' },
      { currency: 'UGX', amount: '94,000' },
      { currency: 'TZS', amount: '68,000' },
    ],
    formats: ['PDF'],
  },
];

export interface BulkTier {
  id: string;
  quantity: string;
  discount: string;
  note?: string;
}

export const bulkPricing: BulkTier[] = [
  { id: 'b1', quantity: '5–20 family bundles', discount: '20% off' },
  { id: 'b2', quantity: '21–50 family bundles', discount: '30% off' },
  { id: 'b3', quantity: '51+ family bundles', discount: '40% off', note: 'Contact inhimdaily.org for invoice' },
];

export const freeEntryPoints: { id: string; title: string; description: string }[] = [
  {
    id: 'f1',
    title: '7-Day Sampler PDF',
    description: 'A free 7-day sampler of every volume — yours to keep, no sign-up required.',
  },
  {
    id: 'f2',
    title: 'Day 1 of Every Book',
    description: 'Read the first day of every book free on inhimdaily.org, no account needed.',
  },
  {
    id: 'f3',
    title: 'YouVersion Reading Plan',
    description: 'A free reading plan on YouVersion — the top of the acquisition funnel.',
  },
];

export interface HowToDayMovement {
  id: string;
  title: string;
  description: string;
}

export const dailyMovements: HowToDayMovement[] = [
  {
    id: 'see-jesus',
    title: 'See Jesus First',
    description:
      'The passage is read through the lens of Christ. You will not start with practical application — you will start with the Person the passage points toward.',
  },
  {
    id: 'what-isnt',
    title: "What This Isn't",
    description:
      'Good reading also knows what the text is not doing, which protects you from misreading it in either direction.',
  },
  {
    id: 'ordinary-day',
    title: 'What This Looks Like in an Ordinary Day',
    description:
      'The Christ you see in the text is meant to change how you live, not just what you believe.',
  },
  {
    id: 'conversation',
    title: 'Your Conversation With God',
    description:
      'Journal prompts, reflection questions, and prayer space that take the day’s insight into personal encounter.',
  },
  {
    id: 'deep-reflection',
    title: 'Deep Reflection Questions',
    description:
      'For those who want to go further into the theological and personal weight of what the passage contains.',
  },
];

export interface HowToTip {
  id: string;
  title: string;
  description: string;
}

export const howToTips: HowToTip[] = [
  {
    id: 'read-order',
    title: 'Read in Order',
    description:
      'Each day builds on what has come before. You do not need to know the Bible well to begin — no theology degree or years of church experience required. You need only the willingness to look at what the text actually says, and let the One you find there change you.',
  },
  {
    id: 'do-not-rush',
    title: 'Do Not Rush',
    description:
      'The journal space is not decorative. The questions are not optional extras. Slow reading that produces genuine encounter is worth more than fast reading that produces only information.',
  },
  {
    id: 'come-back',
    title: 'Come Back',
    description:
      'If life interrupts and you miss a day or a week, come back where you left off. This is not a race and there is no judgment for stopping and starting. The Person you are reading toward is patient.',
  },
];

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote: 'The first devotional that helped our entire family study together.',
    author: 'The Garcia Family',
  },
  {
    id: 't2',
    quote: 'My teenagers actually look forward to reading.',
    author: 'Marcus T.',
  },
  {
    id: 't3',
    quote: 'Beautiful enough for a coffee table. Deep enough for Bible study.',
    author: 'Pastor Elena R.',
  },
  {
    id: 't4',
    quote: 'My kids ask for the next chapter before bedtime every single night.',
    author: 'The Okafor Family',
  },
  {
    id: 't5',
    quote: 'I have never seen my teens so engaged with Scripture. It is a gift.',
    author: 'Daniel & Sofia M.',
  },
];
