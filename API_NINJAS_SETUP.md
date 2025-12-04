# Configuration de l'API Ninjas

## Obtenir votre clé API

1. Allez sur https://api-ninjas.com/register
2. Créez un compte gratuit
3. Connectez-vous et allez dans votre profil
4. Copiez votre clé API (API Key)

## Configuration

1. Ouvrez le fichier `backend/.env`
2. Remplacez `YOUR_API_KEY_HERE` par votre clé API :

```env
API_NINJAS_KEY=votre_cle_api_ici
```

3. Redémarrez le backend :

```bash
cd backend
docker-compose restart
```

## Utilisation

### Rechercher des activités

L'application vous permet maintenant de rechercher parmi des centaines d'activités physiques :

1. Allez dans **Tableau de Suivi** > **Activités Physiques**
2. Utilisez la barre de recherche en haut du formulaire
3. Tapez le nom d'une activité en **anglais** (ex: running, swimming, cycling, basketball)
4. Sélectionnez l'activité dans les résultats
5. Les calories sont calculées automatiquement en fonction de votre poids et de la durée

### Exemples d'activités disponibles

- **Cardio** : running, jogging, walking, cycling, swimming
- **Sports** : basketball, football, tennis, volleyball, badminton
- **Fitness** : weight lifting, yoga, pilates, aerobics, zumba
- **Combat** : boxing, martial arts, karate, judo
- **Autres** : dancing, hiking, skiing, rock climbing

## API Endpoints

### Rechercher des activités

```
GET /api/activities/search?query=running&weight=70&duration=30
```

**Paramètres :**
- `query` (requis) : Nom de l'activité en anglais
- `weight` (optionnel) : Poids en kg (défaut: 70)
- `duration` (optionnel) : Durée en minutes (défaut: 60)

**Réponse :**
```json
{
  "activities": [
    {
      "name": "Running, 5 mph (12 minute mile)",
      "calories_per_hour": 472,
      "duration_minutes": 30,
      "total_calories": 236
    }
  ],
  "count": 1
}
```

### Ajouter une activité

```
POST /api/activities
```

**Body :**
```json
{
  "name": "Running, 5 mph (12 minute mile)",
  "duration": 30,
  "weight": 70,
  "date": "2025-12-04",
  "notes": "Morning run"
}
```

L'API calcule automatiquement les calories brûlées via API Ninjas, ou utilise le système MET local si l'API n'est pas disponible.

## Limitations du plan gratuit

- **5,000 requêtes/mois** avec le plan gratuit
- Pour plus de requêtes, consultez https://api-ninjas.com/pricing

## Fallback

Si l'API Ninjas n'est pas disponible ou si la clé n'est pas configurée, l'application utilise automatiquement le système MET local avec 50+ activités prédéfinies en français.
