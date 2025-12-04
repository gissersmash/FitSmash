import axios from 'axios';

export default function FoodManagement({ 
  showAddForm, 
  setShowAddForm, 
  newFood, 
  setNewFood, 
  foods, 
  setFoods, 
  foodsLoading, 
  setFoodsLoading,
  onFoodAdd,
  styles 
}) {

  const fetchFoodsFromApi = async () => {
    try {
      setFoodsLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/foods', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : (res.data.foods || res.data.data || []);
      setFoods(data);
    } catch (err) {
      // Erreur silencieuse
    } finally {
      setFoodsLoading(false);
    }
  };

  const createNewFood = async (e) => {
    e.preventDefault();
    if (!newFood.name || !newFood.calories) {
      alert('⚠️ Nom et calories sont obligatoires');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: newFood.name,
        calories: Number(newFood.calories),
        proteins: Number(newFood.proteins) || 0,
        carbs: Number(newFood.carbs) || 0,
        fats: Number(newFood.fats) || 0,
        image: newFood.image || null
      };
      const res = await axios.post('http://localhost:4000/api/foods', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const created = res.data && (res.data.food || res.data.data || res.data);
      setFoods(prev => [created, ...prev]);
      setNewFood({ name: '', calories: '', proteins: '', carbs: '', fats: '', image: '' });
      setShowAddForm(false);
      
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white; padding: 16px 24px; border-radius: 12px;
        box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4); z-index: 10000;
        display: flex; align-items: center; gap: 12px; font-weight: 600;
        animation: slideIn 0.3s ease-out;
      `;
      notification.innerHTML = `
        <i class="bi bi-plus-circle-fill" style="font-size: 20px;"></i>
        <span>Nouvel aliment "${payload.name}" créé avec succès !</span>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    } catch (err) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white; padding: 16px 24px; border-radius: 12px;
        box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4); z-index: 10000;
        display: flex; align-items: center; gap: 12px; font-weight: 600;
        animation: slideIn 0.3s ease-out;
      `;
      notification.innerHTML = `
        <i class="bi bi-x-circle-fill" style="font-size: 20px;"></i>
        <span>Erreur lors de la création de l'aliment</span>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
      }, 4000);
    }
  };

  return (
    <div className={styles.foodsCard}>
      <div className={styles.foodsHeader}>
        <h5 className={styles.foodsTitle}>
          <i className={`bi bi-basket me-2 ${styles.chartIcon}`}></i>Mes aliments
        </h5>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn btn-sm ${styles.loadBtn}`}
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ background: showAddForm ? '#16a970' : undefined }}
          >
            <i className={`bi ${showAddForm ? 'bi-x-lg' : 'bi-plus-circle'} me-2`}></i>
            {showAddForm ? 'Annuler' : 'Créer aliment'}
          </button>
          <button className={`btn btn-sm me-2 ${styles.loadBtn}`} onClick={fetchFoodsFromApi} disabled={foodsLoading}>
            {foodsLoading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Chargement...</>
            ) : (
              <><i className="bi bi-arrow-clockwise me-2"></i>Charger liste</>
            )}
          </button>
          {foods.length > 0 && (
            <button className={`btn btn-sm btn-outline-secondary ${styles.closeBtn}`} onClick={() => setFoods([])}>
              <i className="bi bi-x-lg me-1"></i>Fermer
            </button>
          )}
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={createNewFood} style={{
          background: 'linear-gradient(135deg, #e8f4f0 0%, #f0fdf4 100%)',
          padding: '24px', borderRadius: '16px', marginBottom: '24px', border: '2px solid #1ec287'
        }}>
          <h6 style={{ color: '#1ec287', fontWeight: 'bold', marginBottom: '16px' }}>
            <i className="bi bi-plus-square me-2"></i>Créer un nouvel aliment
          </h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px', display: 'block' }}>
                Nom de l'aliment *
              </label>
              <input type="text" className="form-control" placeholder="Ex: Poulet grillé"
                value={newFood.name} onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                required style={{ borderRadius: '10px', border: '2px solid #e0e0e0' }}
              />
            </div>
            <div className="col-md-6">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px', display: 'block' }}>
                Calories (kcal) *
              </label>
              <input type="number" className="form-control" placeholder="Ex: 165"
                value={newFood.calories} onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
                required style={{ borderRadius: '10px', border: '2px solid #e0e0e0' }}
              />
            </div>
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px', display: 'block' }}>
                Protéines (g)
              </label>
              <input type="number" className="form-control" placeholder="Ex: 31"
                value={newFood.proteins} onChange={(e) => setNewFood({...newFood, proteins: e.target.value})}
                style={{ borderRadius: '10px', border: '2px solid #e0e0e0' }}
              />
            </div>
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px', display: 'block' }}>
                Glucides (g)
              </label>
              <input type="number" className="form-control" placeholder="Ex: 0"
                value={newFood.carbs} onChange={(e) => setNewFood({...newFood, carbs: e.target.value})}
                style={{ borderRadius: '10px', border: '2px solid #e0e0e0' }}
              />
            </div>
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px', display: 'block' }}>
                Lipides (g)
              </label>
              <input type="number" className="form-control" placeholder="Ex: 3.6"
                value={newFood.fats} onChange={(e) => setNewFood({...newFood, fats: e.target.value})}
                style={{ borderRadius: '10px', border: '2px solid #e0e0e0' }}
              />
            </div>
            <div className="col-md-12">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px', display: 'block' }}>
                URL de l'image (optionnel)
              </label>
              <input type="url" className="form-control" placeholder="https://exemple.com/image.jpg"
                value={newFood.image} onChange={(e) => setNewFood({...newFood, image: e.target.value})}
                style={{ borderRadius: '10px', border: '2px solid #e0e0e0' }}
              />
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <button type="submit" className={`btn ${styles.loadBtn}`} style={{ padding: '10px 24px' }}>
              <i className="bi bi-check-circle me-2"></i>Créer et ajouter
            </button>
            <button type="button" className="btn btn-outline-secondary"
              onClick={() => { setShowAddForm(false); setNewFood({ name: '', calories: '', proteins: '', carbs: '', fats: '', image: '' }); }}
              style={{ padding: '10px 24px', borderRadius: '10px' }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {foods.length === 0 && !showAddForm ? (
        <div className={styles.emptyState}>
          <i className={`bi bi-inbox ${styles.emptyIcon}`}></i>
          <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '15px' }}>Aucun aliment disponible</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className={`btn btn-sm ${styles.loadBtn}`} onClick={() => setShowAddForm(true)}>
              <i className="bi bi-plus-circle me-2"></i>Créer un aliment
            </button>
            <span style={{ color: '#999', alignSelf: 'center' }}>ou</span>
            <button className={`btn btn-sm ${styles.loadBtn}`} onClick={fetchFoodsFromApi}>
              <i className="bi bi-arrow-clockwise me-2"></i>Charger ma liste
            </button>
          </div>
        </div>
      ) : foods.length > 0 ? (
        <div className={styles.foodsList}>
          <div className="row g-3">
            {foods.map((f, idx) => (
              <div key={f.id || idx} className="col-md-6">
                <div className={styles.foodItem}>
                  {f.image ? (
                    <img src={f.image} alt={f.name} className={styles.foodImage} />
                  ) : (
                    <div className={styles.foodImagePlaceholder}>
                      <i className={`bi bi-image ${styles.foodImageIcon}`}></i>
                    </div>
                  )}
                  <div className={styles.foodInfo}>
                    <h6 className={styles.foodName}>{f.name ?? f.nom ?? f.title}</h6>
                    <p className={styles.foodCalories}>{f.calories ?? f.kcal ?? "-"} kcal</p>
                  </div>
                  <button className={`btn btn-sm ${styles.addBtn}`} onClick={() => onFoodAdd(f)}>
                    <i className="bi bi-plus-lg me-1"></i>Ajouter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
