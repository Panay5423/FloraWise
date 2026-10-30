export interface SamplePlant {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  note: string;
  commonAilmentPrompt: string;
}

export const SAMPLE_PLANTS: SamplePlant[] = [
  {
    id: 'monstera',
    name: 'Monstera Deliciosa',
    category: 'Houseplant',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    note: 'Swiss Cheese Plant with fenestrated leaves. Check for yellowing edges.',
    commonAilmentPrompt: 'Lower leaves show slight yellowing along tips. Please check if it is overwatering or light deficiency.'
  },
  {
    id: 'fiddle_leaf_fig',
    name: 'Fiddle Leaf Fig',
    category: 'Tree / Indoor',
    imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    note: 'Ficus lyrata with large violin-shaped leaves. Sensitive to draft.',
    commonAilmentPrompt: 'A few dark brown spots appeared on the middle leaves. Check for root stress or humidity shock.'
  },
  {
    id: 'snake_plant',
    name: 'Sansevieria (Snake Plant)',
    category: 'Succulent / Hardy',
    imageUrl: 'https://images.unsplash.com/photo-1593482892290-f54927ae1eb6?auto=format&fit=crop&w=800&q=80',
    note: 'Extremely resilient air-purifying plant with upright variegated spears.',
    commonAilmentPrompt: 'Plant looks strong and upright, need guidance on winter watering reduction and potting soil.'
  },
  {
    id: 'peace_lily',
    name: 'Peace Lily (Spathiphyllum)',
    category: 'Flowering Indoor',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80',
    note: 'Classic indoor plant with white spathes. Can show dramatic wilting when thirsty.',
    commonAilmentPrompt: 'Leaves are starting to droop and flower tips are turning brown. What is the immediate revival step?'
  },
  {
    id: 'tomato_plant',
    name: 'Garden Tomato Plant',
    category: 'Edible / Vegetable Garden',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    note: 'Vigorous solanaceous plant. Watch for early blight, blossom end rot, and hornworms.',
    commonAilmentPrompt: 'Small spots on lower foliage. Need pruning and calcium balance advice for fruit setting.'
  },
  {
    id: 'lavender',
    name: 'English Lavender',
    category: 'Herb / Perennial',
    imageUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=800&q=80',
    note: 'Aromatic woody perennial that needs full sun and lean, alkaline soil.',
    commonAilmentPrompt: 'Woody base with less flowering this season. How should I prune back without killing the crown?'
  }
];
