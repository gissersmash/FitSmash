import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import styles from '../styles/Dashboard.module.css';
import abStyles from '../styles/Abonnement.module.css';

export default function Abonnement() {
  const isAuthenticated = !!localStorage.getItem('token');
  const [username, setUsername] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  const plans = [
    {
      id: 1,
      name: "Starter",
      price: "9.99",
      period: "mois",
      color: "#3b82f6",
      popular: false,
      icon: "bi-rocket-takeoff",
      description: "Pour débuter votre parcours santé",
      features: [
        "Suivi nutritionnel de base",
        "Graphiques de progression",
        "Base de données d'aliments",
        "Support par email",
        "Accès application mobile"
      ]
    },
    {
      id: 2,
      name: "Premium",
      price: "19.99",
      period: "mois",
      color: "#1ec287",
      popular: true,
      icon: "bi-gem",
      description: "Le choix idéal pour des résultats optimaux",
      features: [
        "Tout du plan Starter",
        "Plans de repas personnalisés",
        "Suivi d'activité physique avancé",
        "Coach nutritionnel virtuel IA",
        "Recettes santé exclusives",
        "Support prioritaire 24/7",
        "Analyses nutritionnelles détaillées"
      ]
    },
    {
      id: 3,
      name: "Elite",
      price: "39.99",
      period: "mois",
      color: "#8b5cf6",
      popular: false,
      icon: "bi-trophy",
      description: "L'excellence pour atteindre vos objectifs",
      features: [
        "Tout du plan Premium",
        "Coaching personnel dédié",
        "Programmes fitness sur mesure",
        "Consultation nutritionniste (1/mois)",
        "Suivi en temps réel",
        "Rapports mensuels détaillés",
        "Accès communauté VIP",
        "Garantie résultats ou remboursé"
      ]
    },
    {
      id: 4,
      name: "Famille",
      price: "49.99",
      period: "mois",
      color: "#f59e0b",
      popular: false,
      icon: "bi-people",
      description: "Pour toute la famille en bonne santé",
      features: [
        "Jusqu'à 5 profils utilisateurs",
        "Plans de repas familiaux",
        "Suivi nutritionnel pour chacun",
        "Recettes adaptées aux enfants",
        "Tableau de bord familial",
        "Challenges famille motivants",
        "Support multi-utilisateurs",
        "Économie de 30% vs abonnements séparés"
      ]
    }
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    alert(`🎉 Vous avez sélectionné le plan ${plan.name} à ${plan.price}€/${plan.period}.\n\nFonctionnalité de paiement à venir !`);
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.content} style={{ maxWidth: '1200px' }}>
        <div className={styles.heroSection}>
          <div>
            <h2 className={styles.heroTitle}>Nos Abonnements</h2>
            <p className={styles.heroSubtitle}>Choisissez le plan qui correspond à vos objectifs santé et fitness</p>
          </div>
          <button className={`btn btn-light ${styles.logoutBtn}`} onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>Déconnexion
          </button>
        </div>

        <div className={abStyles.promoBanner}>
          <div className={abStyles.promoBadge}>
            🎉 OFFRE SPÉCIALE - 30 jours d'essai gratuit
          </div>
          <h3 className={abStyles.promoTitle}>
            Transformez votre vie dès aujourd'hui
          </h3>
          <p className={abStyles.promoSubtitle}>
            Rejoignez plus de 10,000 membres qui ont déjà atteint leurs objectifs avec FitSmash
          </p>
        </div>

        <div className="row g-4 mb-4">
          {plans.map((plan) => (
            <div key={plan.id} className="col-lg-3 col-md-6">
              <div 
                className={`${abStyles.planCard} ${plan.popular ? abStyles.planCardPopular : ''}`}
                style={{
                  boxShadow: plan.popular ? `0 12px 48px ${plan.color}40` : undefined,
                  borderColor: plan.popular ? plan.color : undefined
                }}
              >
                {plan.popular && <div className={abStyles.popularBadge}>POPULAIRE</div>}

                <div className={abStyles.planHeader} style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)` }}>
                  <div className={abStyles.planIcon}>
                    <i className={`bi ${plan.icon}`}></i>
                  </div>
                  <h3 className={abStyles.planName}>{plan.name}</h3>
                  <p className={abStyles.planDescription}>{plan.description}</p>
                  <div className={abStyles.planPrice}>{plan.price}€</div>
                  <div className={abStyles.planPeriod}>par {plan.period}</div>
                </div>

                <div className={abStyles.planContent}>
                  <ul className={abStyles.featuresList}>
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className={abStyles.featureItem}>
                        <i className={`bi bi-check-circle-fill ${abStyles.featureIcon}`} style={{ color: plan.color }}></i>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={abStyles.planFooter}>
                  <button 
                    className={`btn ${abStyles.selectButton} ${plan.popular ? abStyles.selectButtonPopular : abStyles.selectButtonRegular}`}
                    onClick={() => handleSelectPlan(plan)}
                    style={{
                      background: plan.popular ? `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)` : undefined,
                      color: plan.popular ? 'white' : plan.color,
                      borderColor: plan.popular ? 'transparent' : plan.color,
                      boxShadow: plan.popular ? `0 4px 12px ${plan.color}40` : undefined
                    }}
                  >
                    {plan.popular ? 'Choisir ce plan' : 'Sélectionner'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className={abStyles.guaranteeCard}>
              <div className={abStyles.sectionHeader}>
                <div className={`${abStyles.sectionIcon} ${abStyles.sectionIconBlue}`}>
                  <i className="bi bi-shield-check"></i>
                </div>
                <h4 className={`${abStyles.sectionTitle} ${abStyles.sectionTitleBlue}`}>
                  Nos Garanties
                </h4>
              </div>
              
              <div className={abStyles.infoBoxContainer}>
                <div className={`${abStyles.infoItem} ${abStyles.infoItemBlue}`}>
                  <div className={abStyles.infoItemContent}>
                    <i className={`bi bi-check-circle-fill ${abStyles.infoItemIcon}`}></i>
                    <div>
                      <strong className={abStyles.infoItemTitle}>Satisfait ou remboursé</strong>
                      <p className={abStyles.infoItemText}>30 jours d'essai sans engagement</p>
                    </div>
                  </div>
                </div>
                <div className={`${abStyles.infoItem} ${abStyles.infoItemBlue}`}>
                  <div className={abStyles.infoItemContent}>
                    <i className={`bi bi-check-circle-fill ${abStyles.infoItemIcon}`}></i>
                    <div>
                      <strong className={abStyles.infoItemTitle}>Paiement sécurisé</strong>
                      <p className={abStyles.infoItemText}>Transactions cryptées SSL</p>
                    </div>
                  </div>
                </div>
                <div className={`${abStyles.infoItem} ${abStyles.infoItemBlue}`}>
                  <div className={abStyles.infoItemContent}>
                    <i className={`bi bi-check-circle-fill ${abStyles.infoItemIcon}`}></i>
                    <div>
                      <strong className={abStyles.infoItemTitle}>Résiliation facile</strong>
                      <p className={abStyles.infoItemText}>Annulez en un clic, sans frais</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className={abStyles.faqCard}>
              <div className={abStyles.sectionHeader}>
                <div className={`${abStyles.sectionIcon} ${abStyles.sectionIconOrange}`}>
                  <i className="bi bi-question-circle"></i>
                </div>
                <h4 className={`${abStyles.sectionTitle} ${abStyles.sectionTitleOrange}`}>
                  Questions Fréquentes
                </h4>
              </div>
              
              <div className={abStyles.infoBoxContainer}>
                <div className={abStyles.faqItem}>
                  <strong className={abStyles.faqQuestion}>Puis-je changer de plan ?</strong>
                  <p className={abStyles.faqAnswer}>Oui, vous pouvez upgrader ou downgrader à tout moment.</p>
                </div>
                <div className={abStyles.faqItem}>
                  <strong className={abStyles.faqQuestion}>Y a-t-il un engagement ?</strong>
                  <p className={abStyles.faqAnswer}>Non, tous nos abonnements sont sans engagement.</p>
                </div>
                <div className={abStyles.faqItem}>
                  <strong className={abStyles.faqQuestion}>Support technique disponible ?</strong>
                  <p className={abStyles.faqAnswer}>Oui, email 7j/7 pour tous, chat 24/7 pour Premium et Elite.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
