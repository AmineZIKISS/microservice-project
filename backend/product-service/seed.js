const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// ---------------------------------------------------------------------------
// Moroccan Artisan Products — Seed Data
// Categories: Tapis, Céramique, Bijoux, Cuir, Cuisine, Décoration, Beauté, Mode
// ---------------------------------------------------------------------------
const products = [
  {
    name: 'Tapis Beni Ouarain',
    price: 1200,
    category: 'Tapis',
    image: 'https://placehold.co/400x400?text=Tapis+Beni+Ouarain',
    description:
      'Tapis berbère en laine pure, tissé à la main dans les montagnes du Moyen Atlas. Motifs géométriques traditionnels noir et blanc.',
    inStock: true,
  },
  {
    name: 'Tapis Azilal Coloré',
    price: 950,
    category: 'Tapis',
    image: 'https://placehold.co/400x400?text=Tapis+Azilal',
    description:
      'Tapis artisanal aux couleurs vives, tissé par les femmes de la région d\'Azilal. Chaque pièce est unique.',
    inStock: true,
  },
  {
    name: 'Tajine Terre Cuite Décoré',
    price: 150,
    category: 'Céramique',
    image: 'https://placehold.co/400x400?text=Tajine',
    description:
      'Tajine traditionnel en terre cuite avec motifs peints à la main. Idéal pour une cuisson lente et savoureuse.',
    inStock: true,
  },
  {
    name: 'Assiettes Fassi (Lot de 4)',
    price: 280,
    category: 'Céramique',
    image: 'https://placehold.co/400x400?text=Assiettes+Fassi',
    description:
      'Lot de 4 assiettes en céramique de Fès, décorées de motifs bleus traditionnels. Fabriquées artisanalement.',
    inStock: true,
  },
  {
    name: 'Vase Safi Émaillé',
    price: 320,
    category: 'Céramique',
    image: 'https://placehold.co/400x400?text=Vase+Safi',
    description:
      'Vase en céramique émaillée de Safi, aux teintes turquoise et doré. Pièce décorative authentique.',
    inStock: false,
  },
  {
    name: 'Collier Berbère en Argent',
    price: 450,
    category: 'Bijoux',
    image: 'https://placehold.co/400x400?text=Collier+Berbere',
    description:
      'Collier en argent massif avec motifs berbères gravés. Bijou traditionnel du sud marocain.',
    inStock: true,
  },
  {
    name: 'Bracelet Amazigh Émaillé',
    price: 220,
    category: 'Bijoux',
    image: 'https://placehold.co/400x400?text=Bracelet+Amazigh',
    description:
      'Bracelet artisanal en argent avec émail coloré. Inspiré des symboles Amazighs ancestraux.',
    inStock: true,
  },
  {
    name: 'Babouches Cuir de Fès',
    price: 180,
    category: 'Cuir',
    image: 'https://placehold.co/400x400?text=Babouches+Fes',
    description:
      'Babouches traditionnelles en cuir tannées naturellement dans les tanneries de Fès. Cousu main.',
    inStock: true,
  },
  {
    name: 'Pouf Marocain en Cuir',
    price: 350,
    category: 'Cuir',
    image: 'https://placehold.co/400x400?text=Pouf+Cuir',
    description:
      'Pouf rond en cuir véritable brodé à la main. Garniture non incluse. Parfait comme assise ou décoration.',
    inStock: true,
  },
  {
    name: 'Sac Besace Cuir Tanné',
    price: 420,
    category: 'Cuir',
    image: 'https://placehold.co/400x400?text=Sac+Besace',
    description:
      'Sac besace en cuir de chèvre tanné végétal. Fabriqué à la main dans le souk de Marrakech.',
    inStock: true,
  },
  {
    name: 'Théière Argentée Traditionnelle',
    price: 380,
    category: 'Cuisine',
    image: 'https://placehold.co/400x400?text=Theiere+Argentee',
    description:
      'Théière marocaine en maillechort argenté, gravée de motifs floraux. Indispensable pour le thé à la menthe.',
    inStock: true,
  },
  {
    name: 'Plateau à Thé en Cuivre',
    price: 500,
    category: 'Cuisine',
    image: 'https://placehold.co/400x400?text=Plateau+Cuivre',
    description:
      'Grand plateau ciselé en cuivre, idéal pour le service à thé traditionnel marocain.',
    inStock: true,
  },
  {
    name: 'Lanterne en Cuivre Découpé',
    price: 290,
    category: 'Décoration',
    image: 'https://placehold.co/400x400?text=Lanterne+Cuivre',
    description:
      'Lanterne marocaine en cuivre finement découpé à la main. Projette de magnifiques ombres sur les murs.',
    inStock: true,
  },
  {
    name: 'Miroir Cadre Bois Sculpté',
    price: 340,
    category: 'Décoration',
    image: 'https://placehold.co/400x400?text=Miroir+Bois',
    description:
      'Miroir avec cadre en bois de thuya sculpté à la main. Origine : Essaouira.',
    inStock: true,
  },
  {
    name: 'Huile d\'Argan Bio 100ml',
    price: 180,
    category: 'Beauté',
    image: 'https://placehold.co/400x400?text=Huile+Argan',
    description:
      'Huile d\'argan cosmétique 100% bio, pressée à froid. Hydrate la peau et nourrit les cheveux.',
    inStock: true,
  },
  {
    name: 'Savon Noir Beldi à l\'Eucalyptus',
    price: 75,
    category: 'Beauté',
    image: 'https://placehold.co/400x400?text=Savon+Beldi',
    description:
      'Savon noir traditionnel à l\'eucalyptus pour le hammam. Exfolie et purifie la peau en douceur.',
    inStock: true,
  },
  {
    name: 'Djellaba Homme en Laine',
    price: 600,
    category: 'Mode',
    image: 'https://placehold.co/400x400?text=Djellaba+Homme',
    description:
      'Djellaba traditionnelle en laine tissée. Confortable et élégante, parfaite pour les saisons fraîches.',
    inStock: false,
  },
  {
    name: 'Caftan Femme Brodé',
    price: 850,
    category: 'Mode',
    image: 'https://placehold.co/400x400?text=Caftan+Femme',
    description:
      'Caftan marocain brodé à la main avec fils dorés. Pièce festive d\'exception.',
    inStock: true,
  },
];

// ---------------------------------------------------------------------------
// Seed function
// ---------------------------------------------------------------------------
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas for seeding');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert seed data
    const inserted = await Product.insertMany(products);
    console.log(`🌱 Successfully seeded ${inserted.length} products`);

    // Show categories
    const categories = await Product.distinct('category');
    console.log(`📂 Categories: ${categories.join(', ')}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
