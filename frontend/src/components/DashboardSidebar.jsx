import { Carousel } from "react-bootstrap";

export default function DashboardSidebar({ totalCalories, objectif, foodEntriesCount, pct }) {
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  
  return (
    <div style={{ 
      flex: '1 1 35%', 
      maxWidth: '380px', 
      minWidth: '320px',
      paddingTop: '100px',
      paddingBottom: '40px'
    }}>
      
      {/* Carte Statistiques du jour */}
      <div style={{
        background: 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)',
        borderRadius: '24px',
        padding: '24px',
        color: 'white',
        boxShadow: '0 8px 32px rgba(30, 194, 135, 0.35)',
        marginBottom: '24px',
        minHeight: '280px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <i className="bi bi-calendar-check" style={{ fontSize: '24px', marginRight: '12px' }}></i>
          <div>
            <h5 style={{ margin: 0, fontWeight: 'bold' }}>Aujourd'hui</h5>
            <p style={{ margin: 0, fontSize: '13px', opacity: 0.95, marginTop: '4px' }}>{formattedDate}</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '12px',
            padding: '12px 16px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>Calories consommées</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {totalCalories} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>/ {objectif}</span>
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '12px',
            padding: '12px 16px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>Aliments enregistrés</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{foodEntriesCount}</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '12px',
            padding: '12px 16px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>Progression</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{Math.round(pct)}%</div>
          </div>
        </div>
      </div>

      {/* Bannière Motivation avec Image */}
      <div style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        borderRadius: '24px',
        padding: '0',
        boxShadow: '0 8px 32px rgba(240, 147, 251, 0.25)',
        marginBottom: '24px',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '295px'
      }}>
        <Carousel interval={3500} controls={false} indicators={true}>
          <Carousel.Item>
            <img 
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop" 
              alt="Healthy food"
              style={{ width: '100%', height: '180px', objectFit: 'cover', opacity: 0.9 }}
            />
            <div style={{ padding: '20px', color: 'white', minHeight: '115px' }}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                <i className="bi bi-heart-fill me-2"></i>Restez motivé !
              </h5>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                Chaque petit pas compte. Votre santé est votre plus grande richesse.
              </p>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <img 
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop" 
              alt="Fitness motivation"
              style={{ width: '100%', height: '180px', objectFit: 'cover', opacity: 0.9 }}
            />
            <div style={{ padding: '20px', color: 'white', minHeight: '115px' }}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                <i className="bi bi-trophy-fill me-2"></i>Dépassez vos limites !
              </h5>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                Votre seul adversaire, c'est vous-même. Chaque jour est une nouvelle opportunité.
              </p>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <img 
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop" 
              alt="Healthy eating"
              style={{ width: '100%', height: '180px', objectFit: 'cover', opacity: 0.9 }}
            />
            <div style={{ padding: '20px', color: 'white', minHeight: '115px' }}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                <i className="bi bi-star-fill me-2"></i>Nourrissez votre corps !
              </h5>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                Une alimentation saine est le carburant de votre réussite. Vous méritez le meilleur !
              </p>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <img 
              src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=300&fit=crop" 
              alt="Running motivation"
              style={{ width: '100%', height: '180px', objectFit: 'cover', opacity: 0.9 }}
            />
            <div style={{ padding: '20px', color: 'white', minHeight: '115px' }}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                <i className="bi bi-lightning-charge-fill me-2"></i>L'énergie est en vous !
              </h5>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                Bougez, respirez, vivez pleinement. Votre corps vous remerciera !
              </p>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop" 
              alt="Yoga wellness"
              style={{ width: '100%', height: '180px', objectFit: 'cover', opacity: 0.9 }}
            />
            <div style={{ padding: '20px', color: 'white', minHeight: '115px' }}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                <i className="bi bi-peace me-2"></i>Équilibre et harmonie !
              </h5>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                Prenez soin de votre corps et de votre esprit. L'équilibre est la clé du succès.
              </p>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop" 
              alt="Healthy smoothie"
              style={{ width: '100%', height: '180px', objectFit: 'cover', opacity: 0.9 }}
            />
            <div style={{ padding: '20px', color: 'white' }}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                <i className="bi bi-cup-straw me-2"></i>Chaque choix compte !
              </h5>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                Transformez vos habitudes, transformez votre vie. Vous êtes sur la bonne voie !
              </p>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <img 
              src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop" 
              alt="Fresh vegetables"
              style={{ width: '100%', height: '180px', objectFit: 'cover', opacity: 0.9 }}
            />
            <div style={{ padding: '20px', color: 'white' }}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                <i className="bi bi-emoji-smile-fill me-2"></i>La santé commence ici !
              </h5>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                Des aliments frais, une vie épanouie. Continuez ce chemin formidable !
              </p>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <img 
              src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop" 
              alt="Gym training"
              style={{ width: '100%', height: '180px', objectFit: 'cover', opacity: 0.9 }}
            />
            <div style={{ padding: '20px', color: 'white' }}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                <i className="bi bi-fire me-2"></i>Enflammez votre potentiel !
              </h5>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                La persévérance est votre super pouvoir. Ne lâchez rien, vous êtes incroyable !
              </p>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Carte Citation Inspirante */}
      <div style={{
        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        borderRadius: '24px',
        padding: '28px 24px',
        boxShadow: '0 8px 32px rgba(252, 182, 159, 0.25)',
        marginBottom: '24px',
        border: '1px solid rgba(255, 154, 118, 0.3)',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <i className="bi bi-quote" style={{ fontSize: '36px', color: '#d97757' }}></i>
        </div>
        <p style={{ 
          fontSize: '15px', 
          fontStyle: 'italic', 
          textAlign: 'center', 
          color: '#5a3825',
          lineHeight: '1.7',
          marginBottom: '12px',
          fontWeight: '500'
        }}>
          "Prendre soin de son corps, c'est prendre soin de son esprit"
        </p>
        <p style={{ 
          fontSize: '12px', 
          textAlign: 'center', 
          color: '#8b5e3c',
          fontWeight: '600',
          margin: 0
        }}>
          — Votre coach FitSmash
        </p>
      </div>

      {/* Carte Conseils Nutrition avec Image */}
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '0',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        marginBottom: '24px',
        minHeight: '320px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          padding: '18px 24px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <i className="bi bi-lightbulb-fill" style={{ fontSize: '22px', marginRight: '12px' }}></i>
            <h5 style={{ margin: 0, fontWeight: 'bold' }}>Astuces Bien-être</h5>
          </div>
        </div>
        <Carousel interval={4000} controls={false} indicators={true} style={{ background: '#f9fafb' }}>
          <Carousel.Item>
            <div style={{ padding: '20px' }}>
              <img 
                src="https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=300&h=150&fit=crop" 
                alt="Hydratation"
                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }}
              />
              <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: '1.6', minHeight: '60px' }}>
                <strong>Hydratation :</strong> Buvez au moins 1.5L d'eau par jour pour optimiser votre métabolisme et favoriser l'élimination des toxines.
              </p>
            </div>
          </Carousel.Item>
          
          <Carousel.Item>
            <div style={{ padding: '20px' }}>
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=150&fit=crop" 
                alt="Sommeil"
                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }}
              />
              <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: '1.6', minHeight: '60px' }}>
                <strong>Sommeil réparateur :</strong> Visez 7-9 heures de sommeil par nuit. Un bon repos améliore votre humeur, votre concentration et votre métabolisme.
              </p>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div style={{ padding: '20px' }}>
              <img 
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=150&fit=crop" 
                alt="Exercice"
                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }}
              />
              <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: '1.6', minHeight: '60px' }}>
                <strong>Activité physique :</strong> 30 minutes de marche quotidienne réduisent le stress, améliorent votre santé cardiovasculaire et boostent votre énergie.
              </p>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div style={{ padding: '20px' }}>
              <img 
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=150&fit=crop" 
                alt="Méditation"
                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }}
              />
              <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: '1.6', minHeight: '60px' }}>
                <strong>Méditation :</strong> Prenez 10 minutes par jour pour méditer. Cela réduit l'anxiété, améliore la concentration et favorise le bien-être mental.
              </p>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div style={{ padding: '20px' }}>
              <img 
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=300&h=150&fit=crop" 
                alt="Fruits et légumes"
                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }}
              />
              <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: '1.6', minHeight: '60px' }}>
                <strong>Alimentation variée :</strong> Consommez 5 portions de fruits et légumes par jour. Les antioxydants protègent vos cellules et renforcent votre immunité.
              </p>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div style={{ padding: '20px' }}>
              <img 
                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=150&fit=crop" 
                alt="Nature"
                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }}
              />
              <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: '1.6', minHeight: '60px' }}>
                <strong>Contact avec la nature :</strong> Passez du temps à l'extérieur chaque jour. L'air frais et la lumière naturelle améliorent votre humeur et votre vitalité.
              </p>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
}
