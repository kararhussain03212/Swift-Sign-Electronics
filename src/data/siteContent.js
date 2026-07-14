// Fallback site content (navbar/footer) — mirrors the current live seed data.
// Used only if the API is unreachable, so the site never renders blank/broken.

export const DEFAULT_SITE_SETTINGS = {
  brand_name: 'Swift Sign',
  brand_subtitle: 'Electronics',
  footer_description:
    'Empowering engineers, scholars, and makers with premium components, customizable final year projects, and diagnostic laboratory tools.',
  contact_phone: '+92 333 8399480',
  contact_email: 'info@it.swiftsignbm.com',
  contact_address: 'Office 22, 4th Floor, Pakland city center, I-8 Markaz, Islamabad, Pakistan.',
  copyright_text: 'Swift Sign Electronics. All rights reserved.',
  designed_by_text: 'swiftsign',
  designed_by_url: 'https://it.swiftsignbm.com/',
  topbar_messages: [
    { text: '100% Genuine Electronic Components' },
    { text: 'Nationwide Fast Delivery' },
    { text: 'Tech Support: +92 333 8399480' },
  ],
};

export const DEFAULT_NAV_LINKS = [
  { id: 1, link_key: 'home', label: 'Home', url: '/' },
  { id: 2, link_key: 'products', label: 'Products', url: '/products' },
  { id: 3, link_key: 'blogs', label: 'Blog', url: '/blog' },
  { id: 4, link_key: 'contact', label: 'Contact', url: '/contact' },
];

export const DEFAULT_FOOTER_LINK_GROUPS = [
  {
    id: 1,
    title: 'Quick Links',
    links: [
      { id: 1, label: 'Home Page', url: '/' },
      { id: 2, label: 'About Us', url: '#about' },
      { id: 3, label: 'Contact Us', url: '/contact' },
      { id: 4, label: 'Support & FAQs', url: '#faq' },
    ],
  },
  {
    id: 2,
    title: 'Legal Information',
    links: [
      { id: 5, label: 'Terms & Conditions', url: '/terms-and-conditions' },
      { id: 6, label: 'Privacy Policy', url: '/privacy-policy' },
      { id: 7, label: 'Return Policy', url: '/return-policy' },
      { id: 8, label: 'Shipping Policy', url: '/shipping-policy' },
    ],
  },
];

export const DEFAULT_SOCIAL_LINKS = [
  { id: 1, platform: 'github', url: 'https://github.com/' },
  { id: 2, platform: 'discord', url: 'https://discord.com/' },
  { id: 3, platform: 'twitter', url: 'https://twitter.com/' },
  { id: 4, platform: 'linkedin', url: 'https://linkedin.com/' },
];

export const DEFAULT_CONTACT_PAGE = {
  hero_badge: 'GET IN TOUCH',
  hero_heading: 'Contact',
  hero_highlight: 'Swift Sign Electronics',
  hero_description: "Questions about our products? Bulk orders? Feedback? We're here for you — always.",
  form_title: 'Send Us A Message',
  name_placeholder: 'Full Name',
  email_placeholder: 'Email Address',
  phone_placeholder: 'Phone Number',
  subject_placeholder: 'Subject',
  message_placeholder: 'Your Message',
  submit_button_text: 'Send Message',
  availability_text: 'Available Mon - Sat, 9am - 6pm',
  contact_heading: "We'd love to hear from you",
  contact_description: 'Reach out through any channel below and our dedicated team will respond promptly.',
  whatsapp_number: '+92 333 8399480',
  phone_number: '+92 333 8399480',
  email: 'info@swiftsigngeneraltrading.com',
  address: 'Office 22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan',
  google_map_url: 'https://maps.google.com/?q=Office+22,+4th+Floor,+Pakland+City+Center,+I-8+Markaz,+Islamabad,+Pakistan',
  locations: [{
    address: 'Office 22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan',
    google_map_url: 'https://maps.google.com/?q=Office+22,+4th+Floor,+Pakland+City+Center,+I-8+Markaz,+Islamabad,+Pakistan',
  }],
  facebook_url: '#',
  instagram_url: '#',
  youtube_url: '#',
  tiktok_url: '#',
};

export const DEFAULT_BLOG_PAGE_SETTINGS = {
  blog_hero_title: 'Tech Articles &',
  blog_hero_title_accent: 'Electronics Guides',
  blog_hero_description:
    'Expert-written guides on microcontrollers, firmware development, robotics, IoT, and custom PCB routing design.',
  blog_search_placeholder: 'Search articles...',
};

export const DEFAULT_BLOG_CATEGORIES = [
  { id: 1, name: 'IoT', slug: 'iot' },
  { id: 2, name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
  { id: 3, name: 'Robotics', slug: 'robotics' },
  { id: 4, name: 'Smart Home', slug: 'smart-home' },
  { id: 5, name: 'Hardware Design', slug: 'hardware-design' },
  { id: 6, name: 'Firmware Development', slug: 'firmware-development' },
];
