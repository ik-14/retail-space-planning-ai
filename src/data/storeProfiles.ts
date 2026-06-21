import type { StoreProfile } from '../types'

export const storeProfiles: StoreProfile[] = [
  {
    id: 'seaside',
    name: 'Seaside Town',
    description: 'Tourist beach town — suncare, cold drinks, and impulse snacks for summer visitors.',
    categoryWeights: {
      suncare: 0.25,
      beverages: 0.22,
      ice_cream: 0.20,
      snacks: 0.18,
      fresh: 0.10,
      household: 0.05,
    },
  },
  {
    id: 'urban',
    name: 'Urban Center',
    description: 'City convenience store — quick meals, beverages, and essentials for commuters.',
    categoryWeights: {
      beverages: 0.25,
      fresh: 0.22,
      snacks: 0.20,
      household: 0.18,
      ice_cream: 0.10,
      suncare: 0.05,
    },
  },
  {
    id: 'suburban',
    name: 'Suburban Family',
    description: 'Family store — bulk household, fresh produce, and family-size products.',
    categoryWeights: {
      household: 0.25,
      fresh: 0.22,
      beverages: 0.20,
      snacks: 0.18,
      ice_cream: 0.10,
      suncare: 0.05,
    },
  },
]
