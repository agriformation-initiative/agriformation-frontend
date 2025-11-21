export type PageType = 'home' | 'about' | 'programs' | 'gallery' | 'volunteer' | 'contact';

export interface NavigationProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export interface PageProps {
  onNavigate: (page: PageType) => void;
}

export interface ProgramData {
  icon: string;
  title: string;
  description: string;
  timeline: string;
  activities: string[];
  impact: string;
  image: string;
}

export interface OpportunityData {
  role: string;
  description: string;
  commitment: string;
}

export interface GalleryImage {
  image: string;
  caption: string;
  span?: string;
}

export interface Testimonial {
  quote: string;
  student: string;
}

export interface StatData {
  value: string;
  label: string;
  description: string;
}

