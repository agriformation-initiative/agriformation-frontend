export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  tag: string;
  // Add all the optional properties your component uses
  description?: string;
  originalPrice?: number;
  badge?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  features?: string[];
  ingredients?: string[];
  howToUse?: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "V-Tight Gel",
    category: "Tightening",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
    tag: "Bestseller",
    description: "Premium intimate tightening gel designed to enhance natural lubrication and restore elasticity. Formulated with natural botanicals for sensitive skin.",
    originalPrice: 59.99,
    badge: "Bestseller",
    rating: 4.8,
    reviews: 1247,
    inStock: true,
    features: [
      "Natural botanical formula",
      "pH balanced for intimate use",
      "Quick absorption",
      "Dermatologist tested",
      "Suitable for sensitive skin"
    ],
    ingredients: [
      "Aloe Vera",
      "Hyaluronic Acid",
      "Vitamin E",
      "Chamomile Extract",
      "Rose Oil"
    ],
    howToUse: "Apply a small amount to clean, dry skin twice daily. Gently massage until fully absorbed. For best results, use consistently for 4-6 weeks."
  },
  {
    id: 2,
    name: "Intimate Serum",
    category: "Care",
    price: 32.99,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    tag: "New",
    description: "Nourishing serum for intimate area care, providing hydration and comfort with a gentle, effective formula.",
    originalPrice: 39.99,
    badge: "New",
    rating: 4.6,
    reviews: 892,
    inStock: true,
    features: [
      "Deep hydration",
      "Soothing formula",
      "Non-irritating",
      "Fast absorbing",
      "Clinically tested"
    ],
    ingredients: [
      "Jojoba Oil",
      "Shea Butter",
      "Calendula",
      "Vitamin B5",
      "Coconut Extract"
    ],
    howToUse: "Use once daily on clean skin. Apply sparingly and massage gently. Avoid contact with mucous membranes."
  },
  {
    id: 3,
    name: "Kegel Exercise Set",
    category: "Wellness",
    price: 56.99,
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=400&fit=crop",
    tag: "Popular",
    description: "Complete pelvic floor exercise system with guided training for intimate wellness and strength.",
    badge: "Popular",
    rating: 4.9,
    reviews: 1563,
    inStock: true,
    features: [
      "Smart sensor technology",
      "App connectivity",
      "Progress tracking",
      "Medical grade materials",
      "Water resistant"
    ],
    howToUse: "Follow the guided app instructions for daily exercises. Start with beginner level and gradually increase intensity."
  },
  {
    id: 4,
    name: "Revitalizing Cream",
    category: "Enhancement",
    price: 38.99,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    tag: "",
    description: "Advanced cream formula for intimate skin revitalization and tone improvement.",
    originalPrice: 49.99,
    rating: 4.5,
    reviews: 734,
    inStock: false,
    features: [
      "Tone improvement",
      "Skin firming",
      "Moisture retention",
      "Natural ingredients",
      "Safe for daily use"
    ],
    ingredients: [
      "Argan Oil",
      "Collagen",
      "Green Tea Extract",
      "Evening Primrose",
      "Lavender Oil"
    ],
    howToUse: "Apply to clean skin morning and evening. Massage in circular motions until absorbed. Use for minimum 8 weeks for visible results."
  }
];