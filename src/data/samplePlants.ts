export interface SamplePlant {
  id: string;
  name: string;
  hindiName?: string;
  category: string;
  imageUrl: string;
  note: string;
  commonAilmentPrompt: string;
}

export const SAMPLE_PLANTS: SamplePlant[] = [
  {
    id: 'tulsi',
    name: 'Holy Basil (Tulsi)',
    hindiName: 'तुलसी (Tulsi)',
    category: 'Sacred Medicinal Herb',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    note: 'Ocimum tenuiflorum. Revered medicinal herb with aromatic leaves.',
    commonAilmentPrompt: 'Leaves are turning blackish and dropping during cold weather. How should I protect my Tulsi and revive green growth?'
  },
  {
    id: 'money_plant',
    name: 'Money Plant (Golden Pothos)',
    hindiName: 'मनी प्लांट (Money Plant)',
    category: 'Indoor Climber / Air Purifying',
    imageUrl: 'https://images.unsplash.com/photo-1596724806899-73d8a572c68f?auto=format&fit=crop&w=800&q=80',
    note: 'Epipremnum aureum. Hardy trailing vine growing in water or soil.',
    commonAilmentPrompt: 'Leaves are getting smaller in size and tips are turning brown. How do I make the vines bushy and vibrant with a moss stick?'
  },
  {
    id: 'curry_leaf',
    name: 'Curry Leaf (Kadi Patta)',
    hindiName: 'कढ़ी पत्ता (Kadi Patta)',
    category: 'Aromatic Kitchen Tree',
    imageUrl: 'https://images.unsplash.com/photo-1598880940080-ff9a29891b85?auto=format&fit=crop&w=800&q=80',
    note: 'Murraya koenigii. Fragrant compound leaves prized in culinary dishes.',
    commonAilmentPrompt: 'Foliage looks pale yellow with green veins (chlorosis) and growth has slowed down. What organic fertilizer or buttermilk remedy works best?'
  },
  {
    id: 'monstera',
    name: 'Monstera Deliciosa',
    hindiName: 'मॉन्स्टेरा (Swiss Cheese)',
    category: 'Tropical Houseplant',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    note: 'Swiss Cheese Plant with fenestrated leaves. Check for yellowing edges.',
    commonAilmentPrompt: 'Lower leaves show slight yellowing along tips. Please check if it is overwatering or light deficiency.'
  },
  {
    id: 'snake_plant',
    name: 'Sansevieria (Snake Plant)',
    hindiName: 'स्नेक प्लांट',
    category: 'Succulent / Hardy',
    imageUrl: 'https://images.unsplash.com/photo-1593482892290-f54927ae1eb6?auto=format&fit=crop&w=800&q=80',
    note: 'Extremely resilient air-purifying plant with upright variegated spears.',
    commonAilmentPrompt: 'Plant looks strong and upright, need guidance on winter watering reduction and potting soil.'
  },
  {
    id: 'aloe_vera',
    name: 'Aloe Vera (Ghritkumari)',
    hindiName: 'एलोवेरा (घृतकुमारी)',
    category: 'Healing Succulent',
    imageUrl: 'https://images.unsplash.com/photo-1567689574548-89c0a6b63116?auto=format&fit=crop&w=800&q=80',
    note: 'Aloe barbadensis. Plump gel-filled spears that need minimal water and sunny spot.',
    commonAilmentPrompt: 'Spears are turning mushy and brownish at the base. Is it root rot from overwatering, and can I propagate healthy leaves?'
  },
  {
    id: 'peace_lily',
    name: 'Peace Lily (Spathiphyllum)',
    hindiName: 'पीस लिली',
    category: 'Flowering Indoor',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80',
    note: 'Classic indoor plant with white spathes. Can show dramatic wilting when thirsty.',
    commonAilmentPrompt: 'Leaves are starting to droop and flower tips are turning brown. What is the immediate revival step?'
  },
  {
    id: 'fiddle_leaf_fig',
    name: 'Fiddle Leaf Fig',
    hindiName: 'फ़िडल लीफ़ फ़िग',
    category: 'Architectural Indoor Tree',
    imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    note: 'Ficus lyrata with large violin-shaped leaves. Sensitive to draft.',
    commonAilmentPrompt: 'A few dark brown spots appeared on the middle leaves. Check for root stress or humidity shock.'
  }
];
