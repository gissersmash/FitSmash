import { sequelize } from "../config/db.js";
import { Food } from "../models/Food.js";

const defaultFoods = [
  { name: "Pomme", calories: 52, quantity: 1, user_id: 3, image_url: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200" },
  { name: "Banane", calories: 89, quantity: 1, user_id: 3, image_url: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=200" },
  { name: "Poulet grillé", calories: 165, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200" },
  { name: "Riz blanc", calories: 130, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200" },
  { name: "Pâtes", calories: 131, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200" },
  { name: "Saumon", calories: 208, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200" },
  { name: "Œuf", calories: 155, quantity: 1, user_id: 3, image_url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200" },
  { name: "Pain complet", calories: 247, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200" },
  { name: "Yaourt nature", calories: 59, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200" },
  { name: "Lait", calories: 42, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200" },
  { name: "Brocoli", calories: 34, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200" },
  { name: "Carotte", calories: 41, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200" },
  { name: "Tomate", calories: 18, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1546470427-227a36e41ae1?w=200" },
  { name: "Avocat", calories: 160, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200" },
  { name: "Steak de bœuf", calories: 250, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=200" },
  { name: "Thon en conserve", calories: 132, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200" },
  { name: "Amandes", calories: 579, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1508747703725-719777637510?w=200" },
  { name: "Pain blanc", calories: 265, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=200" },
  { name: "Fromage blanc", calories: 47, quantity: 100, user_id: 3, image_url: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200" },
  { name: "Orange", calories: 47, quantity: 1, user_id: 3, image_url: "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=200" }
];

async function seedFoods() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion DB établie");
    
    // Synchronise la table
    await Food.sync({ alter: true });
    console.log("✅ Table Food synchronisée");
    
    // Compte les aliments existants pour l'utilisateur 3
    const count = await Food.count({ where: { user_id: 3 } });
    console.log(`📊 Nombre d'aliments pour l'utilisateur 3 : ${count}`);
    
    if (count === 0) {
      console.log("🌱 Insertion des aliments de base...");
      await Food.bulkCreate(defaultFoods);
      console.log(`✅ ${defaultFoods.length} aliments insérés avec succès pour l'utilisateur 3 !`);
    } else {
      console.log("⚠️ Des aliments existent déjà pour cet utilisateur. Insertion annulée.");
      console.log("💡 Pour réinitialiser, supprime manuellement les données de la table 'foods' pour user_id=3");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seeding :", error);
    process.exit(1);
  }
}

seedFoods();
