# Mock Data & Store Profiles

## Product Catalog (40 products, 6 categories)

### Beverages (8 products)
| ID | Name | Color | Notes |
|----|------|-------|-------|
| bev-01 | Coca-Cola | #E31837 | Classic red |
| bev-02 | Sparkling Water | #00B4D8 | Light blue |
| bev-03 | Orange Juice | #FF8C00 | Orange |
| bev-04 | Iced Tea | #8B4513 | Brown |
| bev-05 | Energy Drink | #39FF14 | Neon green |
| bev-06 | Lemonade | #FFF44F | Yellow |
| bev-07 | Coconut Water | #F5F5DC | Cream/white |
| bev-08 | Craft Beer 6pk | #DAA520 | Gold |

### Snacks (8 products)
| ID | Name | Color | Notes |
|----|------|-------|-------|
| snk-01 | Salted Chips | #FFD700 | Yellow bag |
| snk-02 | Trail Mix | #8B4513 | Earth brown |
| snk-03 | Chocolate Bar | #3D1C02 | Dark brown |
| snk-04 | Pretzels | #D2691E | Tan |
| snk-05 | Popcorn | #FFFACD | Light yellow |
| snk-06 | Granola Bars | #9ACD32 | Green |
| snk-07 | Beef Jerky | #800000 | Maroon |
| snk-08 | Rice Crackers | #FAEBD7 | Off-white |

### Suncare (6 products)
| ID | Name | Color | Notes |
|----|------|-------|-------|
| sun-01 | SPF 50 Lotion | #FF6B35 | Orange |
| sun-02 | After-Sun Gel | #48CAE4 | Teal |
| sun-03 | SPF 30 Spray | #FDB813 | Bright yellow |
| sun-04 | Lip Balm SPF | #FF69B4 | Pink |
| sun-05 | Kids Sunscreen | #7B2FF7 | Purple |
| sun-06 | Tanning Oil | #CD853F | Tan |

### Household (7 products)
| ID | Name | Color | Notes |
|----|------|-------|-------|
| hsh-01 | Paper Towels | #FFFFFF | White |
| hsh-02 | Dish Soap | #32CD32 | Green |
| hsh-03 | Trash Bags | #2F4F4F | Dark gray |
| hsh-04 | All-Purpose Cleaner | #4169E1 | Blue |
| hsh-05 | Sponges | #FFD700 | Yellow |
| hsh-06 | Laundry Pods | #9370DB | Purple |
| hsh-07 | Air Freshener | #98FB98 | Mint |

### Ice Cream (6 products)
| ID | Name | Color | Notes |
|----|------|-------|-------|
| ice-01 | Vanilla Tub | #FFF8DC | Cream |
| ice-02 | Chocolate Tub | #5C3317 | Dark brown |
| ice-03 | Strawberry Bar | #FF1493 | Pink |
| ice-04 | Mint Choc Chip | #98FF98 | Mint green |
| ice-05 | Ice Lollies 6pk | #FF4500 | Orange-red |
| ice-06 | Sorbet Mango | #FFBF00 | Mango |

### Fresh (5 products)
| ID | Name | Color | Notes |
|----|------|-------|-------|
| frs-01 | Sandwich Pack | #F4A460 | Sandy |
| frs-02 | Fruit Salad | #FF6347 | Red-orange |
| frs-03 | Yogurt 4pk | #FFFAF0 | White |
| frs-04 | Hummus & Dips | #DAA520 | Goldenrod |
| frs-05 | Salad Bowl | #228B22 | Forest green |

---

## Store Profiles

### Seaside Town
> Tourist beach town — summer visitors buying sun essentials, cold drinks, and impulse snacks.

| Category | Weight | Reasoning |
|----------|--------|-----------|
| Suncare | 0.25 | Primary need for beachgoers |
| Beverages | 0.22 | Cold drinks, hydration |
| Ice Cream | 0.20 | Impulse summer treats |
| Snacks | 0.18 | Beach snacks, tourist impulse |
| Fresh | 0.10 | Light meals on the go |
| Household | 0.05 | Minimal — tourists don't buy cleaning supplies |

### Urban Center
> City convenience store — commuters and office workers grabbing quick meals and essentials.

| Category | Weight | Reasoning |
|----------|--------|-----------|
| Beverages | 0.25 | Coffee alternatives, energy, hydration |
| Fresh | 0.22 | Lunch sandwiches, salads |
| Snacks | 0.20 | Desk snacks, quick bites |
| Household | 0.18 | Small apartment essentials |
| Ice Cream | 0.10 | Occasional treat |
| Suncare | 0.05 | Low priority for commuters |

### Suburban Family
> Suburban family store — weekly shops, bulk buys, family-size products.

| Category | Weight | Reasoning |
|----------|--------|-----------|
| Household | 0.25 | Cleaning supplies, bulk |
| Fresh | 0.22 | Family meals, healthy options |
| Beverages | 0.20 | Family-size drinks, juice |
| Snacks | 0.18 | Kids snacks, family sharing |
| Ice Cream | 0.10 | Family treat |
| Suncare | 0.05 | Seasonal only |

---

## Generation Algorithm (Pseudo-code)

```
function generatePlanogram(profile, products, bayCount, shelvesPerBay):
  totalSlots = bayCount * shelvesPerBay * SLOTS_PER_SHELF

  // Calculate slots per category based on weights
  for each category:
    categorySlots[category] = round(profile.weights[category] * totalSlots)

  // Select products per category
  for each category:
    available = products.filter(p => p.category == category)
    needed = categorySlots[category]
    selected = pickWithVariety(available, needed)  // distribute facings evenly

  // Place on shelves (group by category, heavier items lower)
  shelves = sortByWeight(categories)  // household/beverages bottom, light items top
  for each shelf from bottom to top:
    fill with next category's products, assigning facings

  return placements
```

## Shelf Placement Heuristics

- **Bottom shelves**: Heavier/bulkier items (household, beverages)
- **Eye-level shelves** (2nd/3rd from bottom): Highest-margin items (snacks, ice cream)
- **Top shelves**: Lighter/smaller items (suncare, small snacks)
- **Facings**: Higher-weight categories get more facings per product (2-4), lower-weight get 1-2
