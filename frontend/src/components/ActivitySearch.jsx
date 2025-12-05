import { useState } from 'react';
import axios from 'axios';

const ActivitySearch = ({ onActivitySelect, weight = 70, duration = 60 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Veuillez entrer un nom d\'activité');
      return;
    }

    setIsSearching(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:4000/api/activities/search`,
        {
          params: {
            query: searchQuery,
            weight: weight,
            duration: duration
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSearchResults(response.data.activities || []);
      
      if (response.data.activities.length === 0) {
        setError('Aucune activité trouvée. Essayez en anglais (ex: running, swimming, cycling)');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la recherche');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectActivity = (activity) => {
    onActivitySelect({
      name: activity.name,
      caloriesPerHour: activity.calories_per_hour,
      totalCalories: activity.total_calories,
      duration: activity.duration_minutes
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher une activité (ex: running, swimming, cycling)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              padding: '10px 40px 10px 15px',
              fontSize: '14px'
            }}
          />
          <i className="bi bi-search" style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6b7280',
            fontSize: '18px'
          }}></i>
        </div>
        <button
          className="btn"
          onClick={handleSearch}
          disabled={isSearching}
          style={{
            background: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontWeight: '600',
            fontSize: '14px',
            minWidth: '120px'
          }}
        >
          {isSearching ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Recherche...
            </>
          ) : (
            <>
              <i className="bi bi-search me-2"></i>
              Rechercher
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="alert alert-warning" style={{ fontSize: '13px', padding: '10px', marginBottom: '15px' }}>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {searchResults.length > 0 && (
        <div style={{
          background: '#f9fafb',
          borderRadius: '12px',
          padding: '15px',
          marginTop: '15px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <h6 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
            <i className="bi bi-list-ul me-2"></i>
            {searchResults.length} activité(s) trouvée(s)
          </h6>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {searchResults.map((activity, index) => (
              <div
                key={index}
                onClick={() => handleSelectActivity(activity)}
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '12px 15px',
                  cursor: 'pointer',
                  border: '2px solid #e5e7eb',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#f97316';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#111827', marginBottom: '4px' }}>
                    {activity.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    <i className="bi bi-clock me-1"></i>
                    {activity.duration_minutes} min
                    <span style={{ margin: '0 8px' }}>•</span>
                    <i className="bi bi-speedometer2 me-1"></i>
                    {activity.calories_per_hour} kcal/h
                  </div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontWeight: '700',
                  fontSize: '14px'
                }}>
                  <i className="bi bi-fire me-1"></i>
                  {Math.round(activity.total_calories)} kcal
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ActivitySearch;
