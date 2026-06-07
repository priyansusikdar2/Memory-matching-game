// Basic card icon structure
export interface CardIcon {
  value: string;
  name: string;
  category: string;
  emoji: string;
  description?: string;
  tags?: string[];
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic';
}

// Card theme structure
export interface CardTheme {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  icons: CardIcon[];
  difficulty?: 'easy' | 'medium' | 'hard';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  isPremium?: boolean;
}

// Animal theme icons
export const animalIcons: CardIcon[] = [
  { value: '🐶', name: 'dog', category: 'animals', emoji: '🐕', description: 'Loyal and friendly companion', tags: ['pet', 'friendly'], rarity: 'common' },
  { value: '🐱', name: 'cat', category: 'animals', emoji: '🐈', description: 'Independent and curious', tags: ['pet', 'graceful'], rarity: 'common' },
  { value: '🐭', name: 'mouse', category: 'animals', emoji: '🐁', description: 'Small and quick', tags: ['small', 'cute'], rarity: 'common' },
  { value: '🐹', name: 'hamster', category: 'animals', emoji: '🐹', description: 'Fluffy and adorable', tags: ['pet', 'fluffy'], rarity: 'common' },
  { value: '🐰', name: 'rabbit', category: 'animals', emoji: '🐇', description: 'Fast and gentle', tags: ['fluffy', 'fast'], rarity: 'common' },
  { value: '🦊', name: 'fox', category: 'animals', emoji: '🦊', description: 'Cunning and clever', tags: ['wild', 'clever'], rarity: 'uncommon' },
  { value: '🐻', name: 'bear', category: 'animals', emoji: '🐻', description: 'Strong and powerful', tags: ['wild', 'strong'], rarity: 'uncommon' },
  { value: '🐼', name: 'panda', category: 'animals', emoji: '🐼', description: 'Gentle giant', tags: ['rare', 'cute'], rarity: 'rare' },
  { value: '🐨', name: 'koala', category: 'animals', emoji: '🐨', description: 'Sleepy and cute', tags: ['australia', 'cute'], rarity: 'uncommon' },
  { value: '🐯', name: 'tiger', category: 'animals', emoji: '🐯', description: 'Fierce and majestic', tags: ['wild', 'powerful'], rarity: 'rare' },
  { value: '🦁', name: 'lion', category: 'animals', emoji: '🦁', description: 'King of the jungle', tags: ['wild', 'majestic'], rarity: 'rare' },
  { value: '🐮', name: 'cow', category: 'animals', emoji: '🐄', description: 'Gentle farm animal', tags: ['farm', 'gentle'], rarity: 'common' },
  { value: '🐷', name: 'pig', category: 'animals', emoji: '🐖', description: 'Intelligent and social', tags: ['farm', 'smart'], rarity: 'common' },
  { value: '🐸', name: 'frog', category: 'animals', emoji: '🐸', description: 'Amphibious jumper', tags: ['amphibian', 'jumper'], rarity: 'common' },
  { value: '🐙', name: 'octopus', category: 'animals', emoji: '🐙', description: 'Intelligent sea creature', tags: ['ocean', 'smart'], rarity: 'uncommon' },
  { value: '🦋', name: 'butterfly', category: 'animals', emoji: '🦋', description: 'Beautiful and colorful', tags: ['insect', 'beautiful'], rarity: 'uncommon' },
  { value: '🐧', name: 'penguin', category: 'animals', emoji: '🐧', description: 'Flightless bird', tags: ['antarctic', 'cute'], rarity: 'uncommon' },
  { value: '🦄', name: 'unicorn', category: 'animals', emoji: '🦄', description: 'Mythical creature', tags: ['mythical', 'magical'], rarity: 'epic' }
];

// Food theme icons
export const foodIcons: CardIcon[] = [
  { value: '🍎', name: 'apple', category: 'food', emoji: '🍎', description: 'Healthy fruit', tags: ['fruit', 'healthy'], rarity: 'common' },
  { value: '🍕', name: 'pizza', category: 'food', emoji: '🍕', description: 'Delicious Italian dish', tags: ['italian', 'comfort'], rarity: 'common' },
  { value: '🍔', name: 'burger', category: 'food', emoji: '🍔', description: 'Classic fast food', tags: ['fastfood', 'american'], rarity: 'common' },
  { value: '🌮', name: 'taco', category: 'food', emoji: '🌮', description: 'Mexican favorite', tags: ['mexican', 'spicy'], rarity: 'common' },
  { value: '🍣', name: 'sushi', category: 'food', emoji: '🍣', description: 'Japanese delicacy', tags: ['japanese', 'fresh'], rarity: 'uncommon' },
  { value: '🍩', name: 'donut', category: 'food', emoji: '🍩', description: 'Sweet treat', tags: ['dessert', 'sweet'], rarity: 'common' },
  { value: '🍪', name: 'cookie', category: 'food', emoji: '🍪', description: 'Crunchy snack', tags: ['dessert', 'crunchy'], rarity: 'common' },
  { value: '🍫', name: 'chocolate', category: 'food', emoji: '🍫', description: 'Sweet indulgence', tags: ['dessert', 'sweet'], rarity: 'common' },
  { value: '🍦', name: 'ice-cream', category: 'food', emoji: '🍦', description: 'Cold dessert', tags: ['dessert', 'cold'], rarity: 'common' },
  { value: '🍉', name: 'watermelon', category: 'food', emoji: '🍉', description: 'Refreshing fruit', tags: ['fruit', 'refreshing'], rarity: 'common' },
  { value: '🍒', name: 'cherry', category: 'food', emoji: '🍒', description: 'Sweet and tart', tags: ['fruit', 'sweet'], rarity: 'common' },
  { value: '🥑', name: 'avocado', category: 'food', emoji: '🥑', description: 'Creamy superfood', tags: ['fruit', 'healthy'], rarity: 'uncommon' },
  { value: '🥝', name: 'kiwi', category: 'food', emoji: '🥝', description: 'Tangy fruit', tags: ['fruit', 'tropical'], rarity: 'uncommon' },
  { value: '🥥', name: 'coconut', category: 'food', emoji: '🥥', description: 'Tropical nut', tags: ['tropical', 'nut'], rarity: 'uncommon' },
  { value: '🍇', name: 'grapes', category: 'food', emoji: '🍇', description: 'Sweet clusters', tags: ['fruit', 'sweet'], rarity: 'common' }
];

// Sports theme icons
export const sportsIcons: CardIcon[] = [
  { value: '⚽', name: 'soccer', category: 'sports', emoji: '⚽', description: 'World\'s most popular sport', tags: ['ball', 'team'], rarity: 'common' },
  { value: '🏀', name: 'basketball', category: 'sports', emoji: '🏀', description: 'Fast-paced court sport', tags: ['ball', 'indoor'], rarity: 'common' },
  { value: '🏈', name: 'football', category: 'sports', emoji: '🏈', description: 'American gridiron sport', tags: ['ball', 'american'], rarity: 'common' },
  { value: '⚾', name: 'baseball', category: 'sports', emoji: '⚾', description: 'America\'s pastime', tags: ['ball', 'american'], rarity: 'common' },
  { value: '🎾', name: 'tennis', category: 'sports', emoji: '🎾', description: 'Racket sport', tags: ['racket', 'outdoor'], rarity: 'common' },
  { value: '🏐', name: 'volleyball', category: 'sports', emoji: '🏐', description: 'Net and ball sport', tags: ['ball', 'team'], rarity: 'common' },
  { value: '🏓', name: 'table-tennis', category: 'sports', emoji: '🏓', description: 'Fast-paced racket sport', tags: ['racket', 'indoor'], rarity: 'uncommon' },
  { value: '🏸', name: 'badminton', category: 'sports', emoji: '🏸', description: 'Shuttlecock sport', tags: ['racket', 'fast'], rarity: 'uncommon' },
  { value: '🥊', name: 'boxing', category: 'sports', emoji: '🥊', description: 'Combat sport', tags: ['combat', 'gloves'], rarity: 'uncommon' },
  { value: '⛸️', name: 'ice-skating', category: 'sports', emoji: '⛸️', description: 'Graceful ice sport', tags: ['ice', 'winter'], rarity: 'rare' },
  { value: '🎯', name: 'darts', category: 'sports', emoji: '🎯', description: 'Precision throwing', tags: ['precision', 'indoor'], rarity: 'uncommon' },
  { value: '🏊', name: 'swimming', category: 'sports', emoji: '🏊', description: 'Water sport', tags: ['water', 'olympic'], rarity: 'common' },
  { value: '🚴', name: 'cycling', category: 'sports', emoji: '🚴', description: 'Endurance sport', tags: ['bike', 'endurance'], rarity: 'common' },
  { value: '🏋️', name: 'weightlifting', category: 'sports', emoji: '🏋️', description: 'Strength sport', tags: ['strength', 'gym'], rarity: 'uncommon' },
  { value: '🤸', name: 'gymnastics', category: 'sports', emoji: '🤸', description: 'Flexibility and grace', tags: ['flexible', 'olympic'], rarity: 'rare' }
];

// Space theme icons
export const spaceIcons: CardIcon[] = [
  { value: '🌍', name: 'earth', category: 'space', emoji: '🌍', description: 'Our home planet', tags: ['planet', 'home'], rarity: 'common' },
  { value: '🌙', name: 'moon', category: 'space', emoji: '🌙', description: 'Earth\'s satellite', tags: ['moon', 'satellite'], rarity: 'common' },
  { value: '⭐', name: 'star', category: 'space', emoji: '⭐', description: 'Distant sun', tags: ['star', 'bright'], rarity: 'common' },
  { value: '🪐', name: 'saturn', category: 'space', emoji: '🪐', description: 'Ringed planet', tags: ['planet', 'rings'], rarity: 'rare' },
  { value: '🚀', name: 'rocket', category: 'space', emoji: '🚀', description: 'Space vehicle', tags: ['vehicle', 'fast'], rarity: 'uncommon' },
  { value: '👽', name: 'alien', category: 'space', emoji: '👽', description: 'Extraterrestrial life', tags: ['alien', 'scifi'], rarity: 'epic' },
  { value: '🛸', name: 'ufo', category: 'space', emoji: '🛸', description: 'Unidentified flying object', tags: ['ufo', 'mystery'], rarity: 'epic' },
  { value: '🌌', name: 'galaxy', category: 'space', emoji: '🌌', description: 'Star system', tags: ['galaxy', 'beautiful'], rarity: 'rare' },
  { value: '🔭', name: 'telescope', category: 'space', emoji: '🔭', description: 'Observation tool', tags: ['tool', 'observation'], rarity: 'uncommon' },
  { value: '☄️', name: 'comet', category: 'space', emoji: '☄️', description: 'Icy visitor', tags: ['comet', 'space'], rarity: 'rare' },
  { value: '🌠', name: 'shooting-star', category: 'space', emoji: '🌠', description: 'Wish upon a star', tags: ['star', 'wish'], rarity: 'rare' },
  { value: '🛰️', name: 'satellite', category: 'space', emoji: '🛰️', description: 'Orbital device', tags: ['satellite', 'technology'], rarity: 'uncommon' },
  { value: '🧑‍🚀', name: 'astronaut', category: 'space', emoji: '🧑‍🚀', description: 'Space explorer', tags: ['astronaut', 'explorer'], rarity: 'rare' },
  { value: '🛸', name: 'spaceship', category: 'space', emoji: '🛸', description: 'Interstellar vehicle', tags: ['spaceship', 'scifi'], rarity: 'epic' }
];

// Technology theme icons
export const technologyIcons: CardIcon[] = [
  { value: '💻', name: 'laptop', category: 'technology', emoji: '💻', description: 'Portable computer', tags: ['computer', 'portable'], rarity: 'common' },
  { value: '📱', name: 'smartphone', category: 'technology', emoji: '📱', description: 'Mobile device', tags: ['phone', 'mobile'], rarity: 'common' },
  { value: '🎮', name: 'gamepad', category: 'technology', emoji: '🎮', description: 'Gaming controller', tags: ['gaming', 'controller'], rarity: 'common' },
  { value: '🖥️', name: 'desktop', category: 'technology', emoji: '🖥️', description: 'Desktop computer', tags: ['computer', 'desktop'], rarity: 'common' },
  { value: '🤖', name: 'robot', category: 'technology', emoji: '🤖', description: 'Artificial intelligence', tags: ['robot', 'ai'], rarity: 'rare' },
  { value: '📡', name: 'satellite-dish', category: 'technology', emoji: '📡', description: 'Communication device', tags: ['communication', 'signal'], rarity: 'uncommon' },
  { value: '🔋', name: 'battery', category: 'technology', emoji: '🔋', description: 'Power source', tags: ['power', 'energy'], rarity: 'common' },
  { value: '💾', name: 'floppy-disk', category: 'technology', emoji: '💾', description: 'Retro storage', tags: ['retro', 'storage'], rarity: 'uncommon' },
  { value: '📀', name: 'dvd', category: 'technology', emoji: '📀', description: 'Optical disc', tags: ['disc', 'media'], rarity: 'common' },
  { value: '🎥', name: 'camera', category: 'technology', emoji: '🎥', description: 'Video recording', tags: ['camera', 'video'], rarity: 'common' }
];

// Fantasy theme icons
export const fantasyIcons: CardIcon[] = [
  { value: '🐉', name: 'dragon', category: 'fantasy', emoji: '🐉', description: 'Mythical fire-breathing creature', tags: ['mythical', 'dragon'], rarity: 'epic' },
  { value: '🧙', name: 'wizard', category: 'fantasy', emoji: '🧙', description: 'Magic user', tags: ['magic', 'wizard'], rarity: 'rare' },
  { value: '🧝', name: 'elf', category: 'fantasy', emoji: '🧝', description: 'Pointy-eared being', tags: ['elf', 'fantasy'], rarity: 'rare' },
  { value: '🧛', name: 'vampire', category: 'fantasy', emoji: '🧛', description: 'Undead creature', tags: ['vampire', 'undead'], rarity: 'rare' },
  { value: '🧟', name: 'zombie', category: 'fantasy', emoji: '🧟', description: 'Walking dead', tags: ['zombie', 'undead'], rarity: 'uncommon' },
  { value: '🦇', name: 'bat', category: 'fantasy', emoji: '🦇', description: 'Night creature', tags: ['bat', 'night'], rarity: 'common' },
  { value: '🔮', name: 'crystal-ball', category: 'fantasy', emoji: '🔮', description: 'Divination tool', tags: ['magic', 'divination'], rarity: 'rare' },
  { value: '⚔️', name: 'sword', category: 'fantasy', emoji: '⚔️', description: 'Medieval weapon', tags: ['weapon', 'medieval'], rarity: 'uncommon' },
  { value: '🛡️', name: 'shield', category: 'fantasy', emoji: '🛡️', description: 'Protective gear', tags: ['shield', 'protection'], rarity: 'common' },
  { value: '🏰', name: 'castle', category: 'fantasy', emoji: '🏰', description: 'Fortified structure', tags: ['castle', 'medieval'], rarity: 'uncommon' }
];

// Emoji theme icons (basic)
export const emojiIcons: CardIcon[] = [
  { value: '😀', name: 'grinning', category: 'emojis', emoji: '😀', description: 'Happy face', tags: ['happy', 'smile'], rarity: 'common' },
  { value: '😂', name: 'joy', category: 'emojis', emoji: '😂', description: 'Tears of joy', tags: ['laugh', 'joy'], rarity: 'common' },
  { value: '😍', name: 'love', category: 'emojis', emoji: '😍', description: 'Heart eyes', tags: ['love', 'heart'], rarity: 'common' },
  { value: '🥺', name: 'pleading', category: 'emojis', emoji: '🥺', description: 'Pleading face', tags: ['sad', 'cute'], rarity: 'uncommon' },
  { value: '😎', name: 'cool', category: 'emojis', emoji: '😎', description: 'Cool sunglasses', tags: ['cool', 'sunglasses'], rarity: 'common' },
  { value: '🤔', name: 'thinking', category: 'emojis', emoji: '🤔', description: 'Thinking face', tags: ['thinking', 'ponder'], rarity: 'common' },
  { value: '😴', name: 'sleeping', category: 'emojis', emoji: '😴', description: 'Sleepy face', tags: ['sleep', 'tired'], rarity: 'common' },
  { value: '🥳', name: 'party', category: 'emojis', emoji: '🥳', description: 'Party face', tags: ['party', 'celebration'], rarity: 'uncommon' }
];

// Holiday theme icons
export const holidayIcons: CardIcon[] = [
  { value: '🎄', name: 'christmas-tree', category: 'holidays', emoji: '🎄', description: 'Christmas tree', tags: ['christmas', 'holiday'], rarity: 'rare' },
  { value: '🎅', name: 'santa', category: 'holidays', emoji: '🎅', description: 'Santa Claus', tags: ['christmas', 'santa'], rarity: 'rare' },
  { value: '🦌', name: 'reindeer', category: 'holidays', emoji: '🦌', description: 'Santa\'s helper', tags: ['christmas', 'reindeer'], rarity: 'uncommon' },
  { value: '🎃', name: 'pumpkin', category: 'holidays', emoji: '🎃', description: 'Halloween pumpkin', tags: ['halloween', 'pumpkin'], rarity: 'uncommon' },
  { value: '👻', name: 'ghost', category: 'holidays', emoji: '👻', description: 'Spooky ghost', tags: ['halloween', 'spooky'], rarity: 'common' },
  { value: '🕯️', name: 'candle', category: 'holidays', emoji: '🕯️', description: 'Candle light', tags: ['light', 'candle'], rarity: 'common' },
  { value: '🥚', name: 'easter-egg', category: 'holidays', emoji: '🥚', description: 'Easter egg', tags: ['easter', 'egg'], rarity: 'uncommon' },
  { value: '🐇', name: 'easter-bunny', category: 'holidays', emoji: '🐇', description: 'Easter bunny', tags: ['easter', 'bunny'], rarity: 'rare' }
];

// Combined basic icons array (original set)
export const cardIcons: CardIcon[] = [
  { value: '🐶', name: 'dog', category: 'animals', emoji: '🐕', description: 'Loyal companion', tags: ['pet'], rarity: 'common' },
  { value: '🐱', name: 'cat', category: 'animals', emoji: '🐈', description: 'Curious feline', tags: ['pet'], rarity: 'common' },
  { value: '🐭', name: 'mouse', category: 'animals', emoji: '🐁', description: 'Tiny rodent', tags: ['small'], rarity: 'common' },
  { value: '🐹', name: 'hamster', category: 'animals', emoji: '🐹', description: 'Fluffy pet', tags: ['pet'], rarity: 'common' },
  { value: '🐰', name: 'rabbit', category: 'animals', emoji: '🐇', description: 'Hopping friend', tags: ['fluffy'], rarity: 'common' },
  { value: '🦊', name: 'fox', category: 'animals', emoji: '🦊', description: 'Clever creature', tags: ['wild'], rarity: 'uncommon' },
  { value: '🐻', name: 'bear', category: 'animals', emoji: '🐻', description: 'Forest giant', tags: ['wild'], rarity: 'uncommon' },
  { value: '🐼', name: 'panda', category: 'animals', emoji: '🐼', description: 'Bamboo eater', tags: ['rare'], rarity: 'rare' },
  { value: '🐨', name: 'koala', category: 'animals', emoji: '🐨', description: 'Tree dweller', tags: ['australia'], rarity: 'uncommon' },
  { value: '🐯', name: 'tiger', category: 'animals', emoji: '🐯', description: 'Striped hunter', tags: ['wild'], rarity: 'rare' },
  { value: '🦁', name: 'lion', category: 'animals', emoji: '🦁', description: 'Jungle king', tags: ['wild'], rarity: 'rare' },
  { value: '🐮', name: 'cow', category: 'animals', emoji: '🐄', description: 'Farm animal', tags: ['farm'], rarity: 'common' }
];

// All themes collection
export const cardThemes: CardTheme[] = [
  {
    id: 'animals',
    name: 'Animals',
    description: 'Cute and friendly animals from around the world',
    icon: '🐾',
    category: 'animals',
    icons: animalIcons,
    difficulty: 'easy',
    colorScheme: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: 'from-purple-100 to-pink-100'
    },
    isPremium: false
  },
  {
    id: 'food',
    name: 'Food & Drinks',
    description: 'Delicious meals and tasty treats',
    icon: '🍕',
    category: 'food',
    icons: foodIcons,
    difficulty: 'easy',
    colorScheme: {
      primary: '#EF4444',
      secondary: '#F59E0B',
      accent: '#10B981',
      background: 'from-red-100 to-orange-100'
    },
    isPremium: false
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Exciting sports and athletic activities',
    icon: '⚽',
    category: 'sports',
    icons: sportsIcons,
    difficulty: 'medium',
    colorScheme: {
      primary: '#3B82F6',
      secondary: '#06B6D4',
      accent: '#8B5CF6',
      background: 'from-blue-100 to-cyan-100'
    },
    isPremium: false
  },
  {
    id: 'space',
    name: 'Space',
    description: 'Explore the cosmos and beyond',
    icon: '🚀',
    category: 'space',
    icons: spaceIcons,
    difficulty: 'medium',
    colorScheme: {
      primary: '#6366F1',
      secondary: '#A855F7',
      accent: '#EC4899',
      background: 'from-indigo-100 to-purple-100'
    },
    isPremium: true
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Modern gadgets and devices',
    icon: '💻',
    category: 'technology',
    icons: technologyIcons,
    difficulty: 'medium',
    colorScheme: {
      primary: '#10B981',
      secondary: '#14B8A6',
      accent: '#06B6D4',
      background: 'from-green-100 to-teal-100'
    },
    isPremium: false
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'Mythical creatures and magical beings',
    icon: '🐉',
    category: 'fantasy',
    icons: fantasyIcons,
    difficulty: 'hard',
    colorScheme: {
      primary: '#8B5CF6',
      secondary: '#A855F7',
      accent: '#D946EF',
      background: 'from-purple-100 to-pink-100'
    },
    isPremium: true
  },
  {
    id: 'emojis',
    name: 'Emojis',
    description: 'Express yourself with emojis',
    icon: '😀',
    category: 'emojis',
    icons: emojiIcons,
    difficulty: 'easy',
    colorScheme: {
      primary: '#FBBF24',
      secondary: '#F59E0B',
      accent: '#EF4444',
      background: 'from-yellow-100 to-orange-100'
    },
    isPremium: false
  },
  {
    id: 'holidays',
    name: 'Holidays',
    description: 'Celebrate special occasions',
    icon: '🎄',
    category: 'holidays',
    icons: holidayIcons,
    difficulty: 'medium',
    colorScheme: {
      primary: '#EF4444',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: 'from-red-100 to-green-100'
    },
    isPremium: true
  }
];

// Helper function to get icons by category
export const getIconsByCategory = (category: string): CardIcon[] => {
  switch (category) {
    case 'animals':
      return animalIcons;
    case 'food':
      return foodIcons;
    case 'sports':
      return sportsIcons;
    case 'space':
      return spaceIcons;
    case 'technology':
      return technologyIcons;
    case 'fantasy':
      return fantasyIcons;
    case 'emojis':
      return emojiIcons;
    case 'holidays':
      return holidayIcons;
    default:
      return cardIcons;
  }
};

// Helper function to get random icons
export const getRandomIcons = (count: number, category?: string): CardIcon[] => {
  const sourceIcons = category ? getIconsByCategory(category) : cardIcons;
  const shuffled = [...sourceIcons];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

// Helper function to get theme by ID
export const getThemeById = (themeId: string): CardTheme | undefined => {
  return cardThemes.find(theme => theme.id === themeId);
};

// Helper function to get premium themes
export const getPremiumThemes = (): CardTheme[] => {
  return cardThemes.filter(theme => theme.isPremium);
};

// Helper function to get free themes
export const getFreeThemes = (): CardTheme[] => {
  return cardThemes.filter(theme => !theme.isPremium);
};

// Helper function to get themes by difficulty
export const getThemesByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): CardTheme[] => {
  return cardThemes.filter(theme => theme.difficulty === difficulty);
};

// Export all themes and utilities
export default {
  cardIcons,
  animalIcons,
  foodIcons,
  sportsIcons,
  spaceIcons,
  technologyIcons,
  fantasyIcons,
  emojiIcons,
  holidayIcons,
  cardThemes,
  getIconsByCategory,
  getRandomIcons,
  getThemeById,
  getPremiumThemes,
  getFreeThemes,
  getThemesByDifficulty
};