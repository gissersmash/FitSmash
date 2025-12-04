import Activity from '../models/Activity.js';
import axios from 'axios';

const API_NINJAS_KEY = process.env.API_NINJAS_KEY || 'YOUR_API_KEY_HERE';
const API_NINJAS_URL = 'https://api.api-ninjas.com/v1/caloriesburned';

// Fonction pour récupérer les calories brûlées depuis l'API Ninjas
async function fetchCaloriesBurnedFromAPI(activity, weight, duration) {
  try {
    const weightInPounds = Math.round(weight * 2.20462); // Convertir kg en pounds
    const response = await axios.get(API_NINJAS_URL, {
      params: {
        activity: activity,
        weight: weightInPounds,
        duration: duration
      },
      headers: {
        'X-Api-Key': API_NINJAS_KEY
      }
    });

    if (response.data && response.data.length > 0) {
      return {
        success: true,
        data: response.data[0], // Prendre le premier résultat
        allResults: response.data
      };
    }
    
    return { success: false, message: 'Aucune activité trouvée' };
  } catch (error) {
    console.error('Erreur API Ninjas:', error.message);
    return { success: false, message: error.message };
  }
}

// Valeurs MET pour différentes activités (Metabolic Equivalent of Task)
// MET = nombre de calories brûlées par kg de poids corporel par heure
export const activityMET = {
  // Cardio
  'Course à pied (8 km/h)': 8.0,
  'Course à pied (10 km/h)': 10.0,
  'Course à pied (12 km/h)': 12.5,
  'Marche rapide (5 km/h)': 3.5,
  'Marche normale (4 km/h)': 3.0,
  'Vélo (16 km/h)': 6.0,
  'Vélo (20 km/h)': 8.0,
  'Vélo (25 km/h)': 10.0,
  'Natation (modéré)': 6.0,
  'Natation (intense)': 10.0,
  'Natation (crawl)': 11.0,
  
  // Fitness
  'Musculation (modéré)': 3.5,
  'Musculation (intense)': 6.0,
  'CrossFit': 8.0,
  'Yoga': 2.5,
  'Pilates': 3.0,
  'Zumba': 7.0,
  'Aérobic': 6.5,
  'HIIT': 9.0,
  'Corde à sauter': 12.0,
  'Burpees': 8.0,
  
  // Sports collectifs
  'Football': 7.0,
  'Basketball': 6.5,
  'Tennis': 7.0,
  'Volleyball': 4.0,
  'Badminton': 5.5,
  'Rugby': 8.0,
  'Handball': 8.0,
  
  // Sports de combat
  'Boxe (entraînement)': 9.0,
  'Boxe (combat)': 12.0,
  'MMA': 10.0,
  'Judo': 7.0,
  'Karaté': 10.0,
  
  // Autres
  'Danse': 4.5,
  'Escalade': 8.0,
  'Rameur': 7.0,
  'Elliptique': 5.0,
  'Stepper': 6.0,
  'Tapis de course': 8.0,
  'Vélo d\'appartement': 6.0,
  'Randonnée': 5.5,
  'Ski': 7.0,
  'Skateboard': 5.0,
  'Roller': 7.0
};

// Calculer les calories brûlées : (MET × poids en kg × durée en heures)
export function calculateCaloriesBurned(metValue, weightKg, durationMinutes) {
  return Math.round(metValue * weightKg * (durationMinutes / 60));
}

// GET /api/activities - Récupérer les activités de l'utilisateur
export async function getActivities(req, res) {
  try {
    const userId = req.user.id;
    const activities = await Activity.findAll({
      where: { user_id: userId },
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });
    
    return res.json({ activities });
  } catch (e) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

// POST /api/activities - Ajouter une activité
export async function addActivity(req, res) {
  try {
    const userId = req.user.id;
    const { name, duration, weight, date, notes } = req.body;
    
    if (!name || !duration) {
      return res.status(400).json({ message: "Nom et durée requis" });
    }
    
    const userWeight = weight || 70; // Poids par défaut 70kg
    let caloriesBurned;
    let metValue;
    let activityName = name;
    
    // Essayer d'abord avec l'API Ninjas
    const apiResult = await fetchCaloriesBurnedFromAPI(name, userWeight, duration);
    
    if (apiResult.success) {
      caloriesBurned = Math.round(apiResult.data.total_calories);
      metValue = parseFloat((apiResult.data.calories_per_hour / userWeight).toFixed(2));
      activityName = apiResult.data.name;
    } else {
      // Fallback sur le système MET local
      metValue = activityMET[name];
      if (!metValue) {
        return res.status(400).json({ 
          message: "Activité non reconnue. Essayez un nom d'activité en anglais (ex: running, swimming, cycling)",
          suggestion: "Utilisez l'API pour rechercher des activités disponibles"
        });
      }
      caloriesBurned = calculateCaloriesBurned(metValue, userWeight, duration);
    }
    
    const activity = await Activity.create({
      user_id: userId,
      name: activityName,
      duration,
      calories_burned: caloriesBurned,
      met_value: metValue,
      date: date || new Date().toISOString().split('T')[0],
      notes
    });
    
    return res.status(201).json({ 
      activity,
      message: `${activityName} ajouté : ${caloriesBurned} kcal brûlées`,
      source: apiResult.success ? 'API Ninjas' : 'MET local'
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

// DELETE /api/activities/:id - Supprimer une activité
export async function deleteActivity(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const activity = await Activity.findOne({
      where: { id, user_id: userId }
    });
    
    if (!activity) {
      return res.status(404).json({ message: "Activité non trouvée" });
    }
    
    await activity.destroy();
    return res.json({ message: "Activité supprimée" });
  } catch (e) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

// GET /api/activities/types - Récupérer la liste des activités disponibles
export async function getActivityTypes(req, res) {
  try {
    const activities = Object.keys(activityMET).map(name => ({
      name,
      met: activityMET[name],
      category: getCategoryForActivity(name)
    }));
    
    return res.json({ activities });
  } catch (e) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

// GET /api/activities/search - Rechercher des activités via l'API Ninjas
export async function searchActivities(req, res) {
  try {
    const { query, weight, duration } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: "Paramètre 'query' requis" });
    }
    
    const userWeight = weight || 70;
    const activityDuration = duration || 60;
    
    // Essayer d'abord avec l'API Ninjas si la clé est configurée
    if (API_NINJAS_KEY && API_NINJAS_KEY !== 'YOUR_API_KEY_HERE') {
      const result = await fetchCaloriesBurnedFromAPI(query, userWeight, activityDuration);
      
      if (result.success) {
        return res.json({ 
          activities: result.allResults,
          count: result.allResults.length,
          source: 'API Ninjas'
        });
      }
    }
    
    // Fallback : recherche dans les activités locales
    const queryLower = query.toLowerCase();
    const matchingActivities = Object.keys(activityMET)
      .filter(name => name.toLowerCase().includes(queryLower))
      .map(name => {
        const metValue = activityMET[name];
        const caloriesPerHour = Math.round(metValue * userWeight);
        const totalCalories = Math.round((caloriesPerHour * activityDuration) / 60);
        
        return {
          name: name,
          calories_per_hour: caloriesPerHour,
          duration_minutes: activityDuration,
          total_calories: totalCalories
        };
      });
    
    if (matchingActivities.length > 0) {
      return res.json({ 
        activities: matchingActivities,
        count: matchingActivities.length,
        source: 'Local MET'
      });
    } else {
      return res.status(404).json({ 
        message: "Aucune activité trouvée",
        suggestion: "Essayez avec un autre terme (ex: course, natation, vélo, football)"
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

function getCategoryForActivity(name) {
  if (name.includes('Course') || name.includes('Marche') || name.includes('Vélo') || name.includes('Natation')) {
    return 'Cardio';
  }
  if (name.includes('Musculation') || name.includes('CrossFit') || name.includes('Yoga') || name.includes('Pilates') || name.includes('HIIT')) {
    return 'Fitness';
  }
  if (name.includes('Football') || name.includes('Basketball') || name.includes('Tennis') || name.includes('Volleyball')) {
    return 'Sports collectifs';
  }
  if (name.includes('Boxe') || name.includes('MMA') || name.includes('Judo') || name.includes('Karaté')) {
    return 'Sports de combat';
  }
  return 'Autres';
}
