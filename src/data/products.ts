import type { Product } from '../types'

export const products: Product[] = [
  // Beverages (8)
  { id: 'bev-01', name: 'Coca-Cola', category: 'beverages', color: '#E31837', width: 1, height: 1.2, depth: 0.8 },
  { id: 'bev-02', name: 'Sparkling Water', category: 'beverages', color: '#00B4D8', width: 1, height: 1.2, depth: 0.8 },
  { id: 'bev-03', name: 'Orange Juice', category: 'beverages', color: '#FF8C00', width: 1, height: 1.3, depth: 0.8 },
  { id: 'bev-04', name: 'Iced Tea', category: 'beverages', color: '#8B4513', width: 1, height: 1.2, depth: 0.8 },
  { id: 'bev-05', name: 'Energy Drink', category: 'beverages', color: '#39FF14', width: 1, height: 1.1, depth: 0.8 },
  { id: 'bev-06', name: 'Lemonade', category: 'beverages', color: '#FFF44F', width: 1, height: 1.2, depth: 0.8 },
  { id: 'bev-07', name: 'Coconut Water', category: 'beverages', color: '#F5F5DC', width: 1, height: 1.1, depth: 0.8 },
  { id: 'bev-08', name: 'Craft Beer 6pk', category: 'beverages', color: '#DAA520', width: 1.5, height: 1.0, depth: 1.0 },

  // Snacks (8)
  { id: 'snk-01', name: 'Salted Chips', category: 'snacks', color: '#FFD700', width: 1, height: 1.4, depth: 0.6 },
  { id: 'snk-02', name: 'Trail Mix', category: 'snacks', color: '#8B4513', width: 1, height: 1.0, depth: 0.7 },
  { id: 'snk-03', name: 'Chocolate Bar', category: 'snacks', color: '#3D1C02', width: 0.8, height: 0.8, depth: 0.5 },
  { id: 'snk-04', name: 'Pretzels', category: 'snacks', color: '#D2691E', width: 1, height: 1.2, depth: 0.6 },
  { id: 'snk-05', name: 'Popcorn', category: 'snacks', color: '#FFFACD', width: 1.2, height: 1.5, depth: 0.8 },
  { id: 'snk-06', name: 'Granola Bars', category: 'snacks', color: '#9ACD32', width: 1, height: 0.8, depth: 0.6 },
  { id: 'snk-07', name: 'Beef Jerky', category: 'snacks', color: '#800000', width: 0.8, height: 1.2, depth: 0.5 },
  { id: 'snk-08', name: 'Rice Crackers', category: 'snacks', color: '#FAEBD7', width: 1, height: 1.0, depth: 0.6 },

  // Suncare (6)
  { id: 'sun-01', name: 'SPF 50 Lotion', category: 'suncare', color: '#FF6B35', width: 0.8, height: 1.0, depth: 0.5 },
  { id: 'sun-02', name: 'After-Sun Gel', category: 'suncare', color: '#48CAE4', width: 0.8, height: 1.1, depth: 0.5 },
  { id: 'sun-03', name: 'SPF 30 Spray', category: 'suncare', color: '#FDB813', width: 0.7, height: 1.2, depth: 0.5 },
  { id: 'sun-04', name: 'Lip Balm SPF', category: 'suncare', color: '#FF69B4', width: 0.4, height: 0.5, depth: 0.3 },
  { id: 'sun-05', name: 'Kids Sunscreen', category: 'suncare', color: '#7B2FF7', width: 0.8, height: 1.0, depth: 0.5 },
  { id: 'sun-06', name: 'Tanning Oil', category: 'suncare', color: '#CD853F', width: 0.7, height: 1.1, depth: 0.5 },

  // Household (7)
  { id: 'hsh-01', name: 'Paper Towels', category: 'household', color: '#FFFFFF', width: 1.5, height: 1.5, depth: 1.2 },
  { id: 'hsh-02', name: 'Dish Soap', category: 'household', color: '#32CD32', width: 0.8, height: 1.2, depth: 0.6 },
  { id: 'hsh-03', name: 'Trash Bags', category: 'household', color: '#2F4F4F', width: 1, height: 1.3, depth: 0.8 },
  { id: 'hsh-04', name: 'All-Purpose Cleaner', category: 'household', color: '#4169E1', width: 0.8, height: 1.4, depth: 0.6 },
  { id: 'hsh-05', name: 'Sponges', category: 'household', color: '#FFD700', width: 0.8, height: 0.6, depth: 0.5 },
  { id: 'hsh-06', name: 'Laundry Pods', category: 'household', color: '#9370DB', width: 1.2, height: 1.0, depth: 1.0 },
  { id: 'hsh-07', name: 'Air Freshener', category: 'household', color: '#98FB98', width: 0.6, height: 1.0, depth: 0.5 },

  // Ice Cream (6)
  { id: 'ice-01', name: 'Vanilla Tub', category: 'ice_cream', color: '#FFF8DC', width: 1.2, height: 0.8, depth: 1.0 },
  { id: 'ice-02', name: 'Chocolate Tub', category: 'ice_cream', color: '#5C3317', width: 1.2, height: 0.8, depth: 1.0 },
  { id: 'ice-03', name: 'Strawberry Bar', category: 'ice_cream', color: '#FF1493', width: 0.8, height: 0.6, depth: 0.5 },
  { id: 'ice-04', name: 'Mint Choc Chip', category: 'ice_cream', color: '#98FF98', width: 1.2, height: 0.8, depth: 1.0 },
  { id: 'ice-05', name: 'Ice Lollies 6pk', category: 'ice_cream', color: '#FF4500', width: 1.2, height: 1.0, depth: 0.8 },
  { id: 'ice-06', name: 'Sorbet Mango', category: 'ice_cream', color: '#FFBF00', width: 1.0, height: 0.8, depth: 0.8 },

  // Fresh (5)
  { id: 'frs-01', name: 'Sandwich Pack', category: 'fresh', color: '#F4A460', width: 1, height: 0.6, depth: 0.8 },
  { id: 'frs-02', name: 'Fruit Salad', category: 'fresh', color: '#FF6347', width: 1, height: 0.7, depth: 0.8 },
  { id: 'frs-03', name: 'Yogurt 4pk', category: 'fresh', color: '#FFFAF0', width: 1.2, height: 0.7, depth: 0.8 },
  { id: 'frs-04', name: 'Hummus & Dips', category: 'fresh', color: '#DAA520', width: 1, height: 0.5, depth: 0.8 },
  { id: 'frs-05', name: 'Salad Bowl', category: 'fresh', color: '#228B22', width: 1, height: 0.6, depth: 0.8 },
]
