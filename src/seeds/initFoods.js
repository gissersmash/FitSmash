import { sequelize } from '../config/db.js';
import { Food } from '../models/Food.js';

const foodsData = [
  { name: "Poulet grillé", calories: 165, quantity: 100, image_url: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400" },
  { name: "Riz blanc cuit", calories: 130, quantity: 100, image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400" },
  { name: "Pomme", calories: 52, quantity: 100, image_url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400" },
  { name: "Banane", calories: 89, quantity: 100, image_url: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400" },
  { name: "Saumon", calories: 206, quantity: 100, image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400" },
  { name: "Brocoli", calories: 34, quantity: 100, image_url: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400" },
  { name: "Pâtes cuites", calories: 131, quantity: 100, image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400" },
  { name: "Œuf", calories: 155, quantity: 100, image_url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400" },
  { name: "Pain complet", calories: 247, quantity: 100, image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
  { name: "Yaourt nature", calories: 59, quantity: 100, image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400" },
  { name: "Tomate", calories: 18, quantity: 100, image_url: "https://images.unsplash.com/photo-1546470427-e26264d4e1e8?w=400" },
  { name: "Carotte", calories: 41, quantity: 100, image_url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400" },
  { name: "Avocat", calories: 160, quantity: 100, image_url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400" },
  { name: "Amandes", calories: 579, quantity: 100, image_url: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400" },
  { name: "Fromage blanc", calories: 98, quantity: 100, image_url: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400" },
  { name: "Steak bœuf", calories: 250, quantity: 100, image_url: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400" },
  { name: "Lentilles cuites", calories: 116, quantity: 100, image_url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?w=400" },
  { name: "Épinards", calories: 23, quantity: 100, image_url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400" },
  { name: "Orange", calories: 47, quantity: 100, image_url: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400" },
  { name: "Chocolat noir", calories: 546, quantity: 100, image_url: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400" },
  { name: "Thon en boîte", calories: 116, quantity: 100, image_url: "https://images.unsplash.com/photo-1560717845-968823efbee1?w=400" },
  { name: "Quinoa cuit", calories: 120, quantity: 100, image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400" },
  { name: "Patate douce", calories: 86, quantity: 100, image_url: "https://images.unsplash.com/photo-1557844352-761f2565b576?w=400" },
  { name: "Fromage cheddar", calories: 403, quantity: 100, image_url: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400" },
  { name: "Pain blanc", calories: 265, quantity: 100, image_url: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400" }
];

async function initFoods() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie.');

    await Food.sync({ alter: true });
    console.log('✅ Table Food synchronisée.');

    const count = await Food.count();
    console.log(`📊 Nombre d'aliments existants: ${count}`);

    if (count === 0) {
      console.log('🔄 Insertion des aliments de base...');
      await Food.bulkCreate(foodsData);
      console.log(`✅ ${foodsData.length} aliments ajoutés avec succès!`);
    } else {
      console.log('ℹ️ Des aliments existent déjà. Aucune insertion effectuée.');
      console.log('💡 Pour réinitialiser, supprime les aliments ou utilise Food.destroy({ truncate: true })');
    }

    const finalCount = await Food.count();
    console.log(`📊 Total d'aliments dans la base: ${finalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

initFoods();
