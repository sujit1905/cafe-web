import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import { connectDB } from '../config/db.js';

// Ensure environment variables are loaded
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const sampleMenuItems = [
  // ─── 1. COFFEE (6 items) ──────────────────────────────────────────
  {
    name: 'Spanish Latte (Café con Leche)',
    description: 'Silky espresso shaken with sweetened condensed milk and steamed whole milk, topped with a dusting of organic Ceylon cinnamon.',
    category: 'Coffee',
    price: 5.25,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 4,
    tags: ['Signature', 'Sweet', 'Bestseller'],
  },
  {
    name: 'Flat White Reserve',
    description: 'Expertly pulled double ristretto of single-origin beans folded with velvety microfoam in a 6oz ceramic cup.',
    category: 'Coffee',
    price: 4.75,
    image: 'https://images.unsplash.com/photo-1495474472589-7f7f3a6d7377?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 4,
    tags: ['Espresso', 'Microfoam', 'Artisan'],
  },
  {
    name: 'Ethiopian Yirgacheffe Pour Over',
    description: 'Hand-dripped single origin brew with tasting notes of wild bergamot, delicate jasmine blossoms, and sweet peach nectar.',
    category: 'Coffee',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 6,
    tags: ['Single Origin', 'V60', 'Specialty'],
  },
  {
    name: 'Cardamom Spiced Latte',
    description: 'House specialty: slow-steeped green cardamom and cinnamon quill infused with bold espresso and clover honey.',
    category: 'Coffee',
    price: 5.75,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 5,
    tags: ['Spiced', 'House Special', 'Aromatic'],
  },
  {
    name: 'Iced Madagascar Vanilla Latte',
    description: 'Chilled double shot of espresso poured over organic milk and house-made bourbon vanilla bean syrup with crystal ice.',
    category: 'Coffee',
    price: 5.25,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 3,
    tags: ['Iced', 'Vanilla', 'Refreshing'],
  },
  {
    name: 'Cortado Tradicional',
    description: 'Equal parts robust espresso and lightly textured warm milk, designed to cut acidity while delivering full cocoa aroma.',
    category: 'Coffee',
    price: 4.25,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 3,
    tags: ['Cortado', 'Espresso', 'Classic'],
  },

  // ─── 2. TEA (6 items) ─────────────────────────────────────────────
  {
    name: 'Kashmiri Saffron Kahwa',
    description: 'Exquisite green tea leaves slow-simmered with crushed green cardamom, cinnamon, Kashmiri saffron strands, and slivered almonds.',
    category: 'Tea',
    price: 5.25,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 6,
    tags: ['Royal', 'Saffron', 'Winter Warmth'],
  },
  {
    name: 'Authentic Adrak Masala Chai',
    description: 'Bold Assam Orthodox CTC tea boiled with freshly grated ginger, crushed cardamom, cloves, whole milk, and raw turbinado sugar.',
    category: 'Tea',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 5,
    tags: ['Comfort', 'Desi Chai', 'Spiced'],
  },
  {
    name: 'Kyoto Ceremonial Matcha Latte',
    description: 'Stone-ground Uji green tea matcha whisked with bamboo chasen, served over oat milk with subtle agave sweetness.',
    category: 'Tea',
    price: 5.75,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 4,
    tags: ['Matcha', 'Antioxidant', 'Oat Milk'],
  },
  {
    name: 'Jasmine Blossom Green Tea',
    description: 'Fragrant spring-harvest green tea leaves naturally scented under night-blooming fresh jasmine flowers.',
    category: 'Tea',
    price: 4.25,
    image: 'https://images.unsplash.com/photo-1556679908-b5e73b40f1c4?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 4,
    tags: ['Floral', 'Detox', 'Herbal'],
  },
  {
    name: 'Earl Grey Reserve with Blue Cornflowers',
    description: 'High-elevation Ceylon black tea infused with natural cold-pressed Italian bergamot oil and wild cornflower petals.',
    category: 'Tea',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 4,
    tags: ['Citrus', 'Black Tea', 'Classic'],
  },
  {
    name: 'Chamomile Lavender Herbal Infusion',
    description: 'Naturally caffeine-free Egyptian whole chamomile flowers paired with soothing French Provence lavender buds.',
    category: 'Tea',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 5,
    tags: ['Caffeine-Free', 'Relaxing', 'Sleep'],
  },

  // ─── 3. COLD BEVERAGES (6 items) ──────────────────────────────────
  {
    name: 'Alphonso Mango Passion Cooler',
    description: 'Handcrafted tropical cooler combining sweet Ratnagiri Alphonso mango pulp, real passion fruit seeds, sparkling water, and fresh mint.',
    category: 'Cold Beverages',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1623429883486-af8f3f9ace89?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 3,
    tags: ['Mocktail', 'Tropical', 'Bestseller'],
  },
  {
    name: 'Fresh Strawberry Basil Lemonade',
    description: 'Crushed sweet strawberries and bruised Genovese basil leaves shaken with freshly squeezed Meyer lemons and chilled sparkling soda.',
    category: 'Cold Beverages',
    price: 5.25,
    image: 'https://images.unsplash.com/photo-1527156231393-7b6fbcef9930?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 3,
    tags: ['Refreshing', 'Berry', 'Iced'],
  },
  {
    name: 'Sparkling Espresso Tonic',
    description: 'Double espresso poured over chilled artisanal Mediterranean tonic water with aromatic crushed ice and expressed grapefruit peel.',
    category: 'Cold Beverages',
    price: 5.75,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 3,
    tags: ['Effervescent', 'Espresso', 'Signature'],
  },
  {
    name: 'Nitro Cold Brew Cascade',
    description: '18-hour cold steeped single-origin beans infused with pure nitrogen for a velvety stout-like head and naturally sweet finish.',
    category: 'Cold Beverages',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 2,
    tags: ['Smooth', 'Nitro', 'Zero Sugar'],
  },
  {
    name: 'Lotus Biscoff Thick Frappé',
    description: 'Creamy cold espresso blended with authentic Belgian Biscoff spread, crushed spiced cookies, vanilla ice cream, and whipped cream.',
    category: 'Cold Beverages',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 5,
    tags: ['Biscoff', 'Decadent', 'Frappe'],
  },
  {
    name: 'Peach Apricot Iced Tea',
    description: 'Slow-brewed Nilgiri black tea infused with real sun-ripened peach slices, apricot puree, and sprigs of fresh rosemary.',
    category: 'Cold Beverages',
    price: 4.75,
    image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 3,
    tags: ['Fruity', 'Light', 'Iced Tea'],
  },

  // ─── 4. DESSERTS (6 items) ────────────────────────────────────────
  {
    name: 'Lotus Biscoff Baked Cheesecake',
    description: 'Decadent New York-style baked cheesecake with a spiced biscuit crust, drenched in melted caramelized Biscoff spread.',
    category: 'Desserts',
    price: 6.95,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 2,
    tags: ['Cheesecake', 'Biscoff', 'Best Seller'],
  },
  {
    name: 'Swedish Cardamom Bun (Kardemummabulle)',
    description: 'Traditional braided Swedish pastry rolled with freshly ground green cardamom butter, baked golden with crunchy pearl sugar.',
    category: 'Desserts',
    price: 4.25,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 2,
    tags: ['Bakery', 'Cardamom', 'Artisan'],
  },
  {
    name: '70% Valrhona Dark Chocolate Mousse',
    description: 'Silky French dark chocolate mousse garnished with Belgian chocolate curls, Dutch cocoa powder, and crunchy Maldon sea salt flakes.',
    category: 'Desserts',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 2,
    tags: ['Chocolate', 'Gluten-Free', 'Indulgent'],
  },
  {
    name: 'Artisanal Tiramisu al Mascarpone',
    description: 'Layers of espresso-soaked Italian savoiardi ladyfingers and whipped egg-rich mascarpone cream dusted with dark cocoa.',
    category: 'Desserts',
    price: 6.75,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 2,
    tags: ['Italian', 'Coffee Infused', 'Classic'],
  },
  {
    name: 'Belgian Liege Waffle with Berries',
    description: 'Warm caramelized pearl sugar waffle served fresh with organic berry compote, chantilly cream, and 100% pure Canadian maple syrup.',
    category: 'Desserts',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 6,
    tags: ['Waffle', 'Maple', 'Warm'],
  },
  {
    name: 'Warm Red Velvet Molten Lava Cake',
    description: 'Gourmet cocoa red velvet sponge cake that erupts with warm melted white chocolate cream cheese center upon slicing.',
    category: 'Desserts',
    price: 6.95,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 5,
    tags: ['Molten', 'Warm', 'Chef Special'],
  },

  // ─── 5. SNACKS (6 items) ──────────────────────────────────────────
  {
    name: 'Double-Baked Almond Croissant',
    description: 'Flaky pure French butter croissant filled with rich almond frangipane cream, topped with sliced toasted almonds and powdered sugar.',
    category: 'Snacks',
    price: 4.95,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 3,
    tags: ['Pastry', 'Almond', 'French'],
  },
  {
    name: 'Wild Forest Mushroom Bruschetta',
    description: 'Charred artisan sourdough rubbed with garlic olive oil, piled with sautéed porcini and cremini mushrooms, fresh thyme, and shaved parmesan.',
    category: 'Snacks',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 7,
    tags: ['Vegetarian', 'Sourdough', 'Savory'],
  },
  {
    name: 'Truffle & Herb Parmesan Fries',
    description: 'Crispy skin-on Idaho potato fries tossed with white truffle oil, roasted rosemary, grated Grana Padano, and roasted garlic aioli dip.',
    category: 'Snacks',
    price: 6.75,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 6,
    tags: ['Truffle', 'Crispy', 'Shareable'],
  },
  {
    name: 'Sundried Tomato & Pesto Sourdough Panini',
    description: 'Warm grilled sourdough sandwich with buffalo mozzarella, basil pine nut pesto, oven-dried cherry tomatoes, and aged balsamic glaze.',
    category: 'Snacks',
    price: 8.95,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 7,
    tags: ['Panini', 'Pesto', 'Hot Pressed'],
  },
  {
    name: 'Paneer & Caramelized Onion Brioche Roll',
    description: 'Spiced herb-tossed paneer chunks layered with slow-caramelized onions, mint coriander relish, and melted smoked gouda on a brioche roll.',
    category: 'Snacks',
    price: 8.25,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 6,
    tags: ['Paneer', 'Warm', 'Spiced'],
  },
  {
    name: 'Greek Spinach & Feta Filo Pie',
    description: 'Golden crispy filo pastry layered with organic baby spinach, tangy Greek feta, dill, pine nuts, and lemon zest.',
    category: 'Snacks',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 5,
    tags: ['Filo', 'Feta', 'Mediterranean'],
  },

  // ─── 6. BREAKFAST (6 items) ───────────────────────────────────────
  {
    name: 'Signature Smashed Avocado Toast',
    description: 'Thick-cut country sourdough layered with Hass avocado mash, Persian feta, organic heirloom cherry tomatoes, dukkah, and chili flakes.',
    category: 'Breakfast',
    price: 9.75,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 7,
    tags: ['Avocado', 'Superfood', 'Top Rated'],
  },
  {
    name: 'Organic Greek Yogurt Granola Bowl',
    description: 'Velvety Greek honey yogurt topped with house-roasted pecan coconut granola, fresh strawberries, wild blueberries, and organic chia seeds.',
    category: 'Breakfast',
    price: 8.25,
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 4,
    tags: ['Healthy', 'High Protein', 'Berries'],
  },
  {
    name: 'Brioche French Toast with Caramelized Bananas',
    description: 'Golden griddled brioche soaked in Madagascar vanilla egg batter, topped with flambéed brown sugar bananas, toasted pecans, and maple cream.',
    category: 'Breakfast',
    price: 9.95,
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 8,
    tags: ['Brunch', 'Sweet', 'Decadent'],
  },
  {
    name: 'Gourmet Smoked Turkey & Bacon Club',
    description: 'Triple-decker toasted sourdough with smoked turkey breast, crispy bacon, aged cheddar, butterhead lettuce, and garlic sun-dried tomato aioli.',
    category: 'Breakfast',
    price: 11.25,
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6998dab43?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 9,
    tags: ['Hearty', 'Club', 'Bacon'],
  },
  {
    name: 'Classic Shakshuka with Feta & Sourdough',
    description: 'Two organic eggs poached in a rich, spiced San Marzano tomato, bell pepper, and cumin sauce, finished with Greek feta and toasted sourdough.',
    category: 'Breakfast',
    price: 10.50,
    image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 10,
    tags: ['Eggs', 'Skillet', 'Warm Brunch'],
  },
  {
    name: 'Amazonian Acai Superfood Bowl',
    description: 'Pure organic acai blended with frozen wild berries and banana, crowned with toasted coconut flakes, kiwi, chia, and raw forest honey.',
    category: 'Breakfast',
    price: 9.50,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 5,
    tags: ['Acai', 'Vegan', 'Refreshing'],
  },
];

/**
 * Seed an empty database with the admin account, menu items, and demo orders.
 */
export const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const existingCounts = await Promise.all([
      User.countDocuments(),
      MenuItem.countDocuments(),
      Order.countDocuments(),
    ]);

    if (existingCounts.some((count) => count > 0)) {
      console.log('[Seed] Existing data detected; skipping to protect current records.');
      return;
    }

    // 1. Create Default Admin User
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured before seeding.');
    }

    const adminUser = new User({
      name: 'Brew & Bite Admin',
      email: adminEmail,
      password: adminPassword, // Will be hashed via pre-save hook
      role: 'admin',
    });

    await adminUser.save();
    console.log(`[Seed] Created default admin user: ${adminEmail}`);

    // 2. Create 36 Realistic Menu Items
    const createdItems = await MenuItem.insertMany(sampleMenuItems);
    console.log(`[Seed] Created ${createdItems.length} menu items across 6 categories:`);

    const categoriesCount = sampleMenuItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    Object.entries(categoriesCount).forEach(([cat, count]) => {
      console.log(`  - ${cat}: ${count} items`);
    });

    // 3. Create Sample Real Table Orders for Client Demo (Pending, Preparing, Ready, Completed)
    const spanishLatte = createdItems.find((i) => i.name.includes('Spanish Latte')) || createdItems[0];
    const avoToast = createdItems.find((i) => i.name.includes('Avocado Toast')) || createdItems[1];
    const biscoffCake = createdItems.find((i) => i.name.includes('Biscoff')) || createdItems[2];
    const flatWhite = createdItems.find((i) => i.name.includes('Flat White')) || createdItems[3];
    const truffleFries = createdItems.find((i) => i.name.includes('Truffle')) || createdItems[4];
    const mangoCooler = createdItems.find((i) => i.name.includes('Mango')) || createdItems[5];
    const matchaLatte = createdItems.find((i) => i.name.includes('Matcha')) || createdItems[6];
    const waffle = createdItems.find((i) => i.name.includes('Waffle')) || createdItems[7];

    const sampleOrders = [
      {
        orderNumber: 'BB-20261110-1011',
        customerName: 'Aarav Sharma',
        customerPhone: '+91 98201 12345',
        customerEmail: 'aarav.sharma@example.com',
        orderType: 'Dine-in',
        tableNumber: 'T04',
        notes: 'Extra hot Spanish Latte, mild cinnamon please',
        items: [
          {
            menuItem: spanishLatte._id,
            name: spanishLatte.name,
            price: spanishLatte.price,
            quantity: 2,
            subtotal: spanishLatte.price * 2,
          },
          {
            menuItem: avoToast._id,
            name: avoToast.name,
            price: avoToast.price,
            quantity: 1,
            subtotal: avoToast.price * 1,
          },
        ],
        subtotal: spanishLatte.price * 2 + avoToast.price,
        tax: parseFloat(((spanishLatte.price * 2 + avoToast.price) * 0.05).toFixed(2)),
        totalAmount: parseFloat(((spanishLatte.price * 2 + avoToast.price) * 1.05).toFixed(2)),
        status: 'Preparing',
      },
      {
        orderNumber: 'BB-20261110-1012',
        customerName: 'Rhea Sengupta',
        customerPhone: '+91 98334 54321',
        customerEmail: 'rhea.s@example.com',
        orderType: 'Dine-in',
        tableNumber: 'T02',
        notes: 'Serve dessert together with coffee',
        items: [
          {
            menuItem: flatWhite._id,
            name: flatWhite.name,
            price: flatWhite.price,
            quantity: 1,
            subtotal: flatWhite.price,
          },
          {
            menuItem: biscoffCake._id,
            name: biscoffCake.name,
            price: biscoffCake.price,
            quantity: 1,
            subtotal: biscoffCake.price,
          },
        ],
        subtotal: flatWhite.price + biscoffCake.price,
        tax: parseFloat(((flatWhite.price + biscoffCake.price) * 0.05).toFixed(2)),
        totalAmount: parseFloat(((flatWhite.price + biscoffCake.price) * 1.05).toFixed(2)),
        status: 'Pending',
      },
      {
        orderNumber: 'BB-20261110-1013',
        customerName: 'Vikram Malhotra',
        customerPhone: '+91 99100 87654',
        customerEmail: 'vikram.m@example.com',
        orderType: 'Dine-in',
        tableNumber: 'T07',
        notes: 'Garlic aioli on the side',
        items: [
          {
            menuItem: truffleFries._id,
            name: truffleFries.name,
            price: truffleFries.price,
            quantity: 2,
            subtotal: truffleFries.price * 2,
          },
          {
            menuItem: mangoCooler._id,
            name: mangoCooler.name,
            price: mangoCooler.price,
            quantity: 2,
            subtotal: mangoCooler.price * 2,
          },
        ],
        subtotal: truffleFries.price * 2 + mangoCooler.price * 2,
        tax: parseFloat(((truffleFries.price * 2 + mangoCooler.price * 2) * 0.05).toFixed(2)),
        totalAmount: parseFloat(((truffleFries.price * 2 + mangoCooler.price * 2) * 1.05).toFixed(2)),
        status: 'Ready',
      },
      {
        orderNumber: 'BB-20261110-1014',
        customerName: 'Ananya Verma',
        customerPhone: '+91 97111 23456',
        customerEmail: 'ananya.v@example.com',
        orderType: 'Dine-in',
        tableNumber: 'T09',
        notes: 'Warm waffle well',
        items: [
          {
            menuItem: matchaLatte._id,
            name: matchaLatte.name,
            price: matchaLatte.price,
            quantity: 1,
            subtotal: matchaLatte.price,
          },
          {
            menuItem: waffle._id,
            name: waffle.name,
            price: waffle.price,
            quantity: 1,
            subtotal: waffle.price,
          },
        ],
        subtotal: matchaLatte.price + waffle.price,
        tax: parseFloat(((matchaLatte.price + waffle.price) * 0.05).toFixed(2)),
        totalAmount: parseFloat(((matchaLatte.price + waffle.price) * 1.05).toFixed(2)),
        status: 'Confirmed',
      },
      {
        orderNumber: 'BB-20261110-1015',
        customerName: 'Karan Mehra',
        customerPhone: '+91 98450 67890',
        customerEmail: '',
        orderType: 'Takeaway',
        tableNumber: undefined,
        notes: 'Package separately for travel',
        items: [
          {
            menuItem: spanishLatte._id,
            name: spanishLatte.name,
            price: spanishLatte.price,
            quantity: 1,
            subtotal: spanishLatte.price,
          },
        ],
        subtotal: spanishLatte.price,
        tax: parseFloat((spanishLatte.price * 0.05).toFixed(2)),
        totalAmount: parseFloat((spanishLatte.price * 1.05).toFixed(2)),
        status: 'Completed',
      },
    ];

    await Order.insertMany(sampleOrders);
    console.log(`[Seed] Created ${sampleOrders.length} live table orders for testing & dashboard preview!`);

    console.log('[Seed] Database seeding completed successfully! ✨');
    return { adminUser, menuItemsCount: createdItems.length, ordersCount: sampleOrders.length };
  } catch (error) {
    console.error(`[Seed Error] Seeding failed: ${error.message}`);
    throw error;
  }
};

// Check if running directly via CLI
const isDirectCall =
  process.argv[1] &&
  (process.argv[1].endsWith('seed.js') ||
    process.argv[1].includes(path.join('utils', 'seed.js')));

if (isDirectCall) {
  seedData()
    .then(() => {
      console.log('[Seed CLI] Disconnecting from database...');
      return mongoose.disconnect();
    })
    .then(() => {
      console.log('[Seed CLI] Process exiting with success.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed CLI] Error encountered:', err);
      process.exit(1);
    });
}

export default seedData;
