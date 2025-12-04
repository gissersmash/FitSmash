import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import styles from '../styles/Dashboard.module.css';
import contactStyles from '../styles/Contact.module.css';

export default function Contact() {
  const isAuthenticated = !!localStorage.getItem('token');
  const [username, setUsername] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setFormData(prev => ({ ...prev, name: storedUsername }));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulation de l'envoi
    setSubmitStatus('sending');
    
    setTimeout(() => {
      setSubmitStatus('success');
      
      // Réinitialiser le formulaire après 2 secondes
      setTimeout(() => {
        setFormData({
          name: username || '',
          email: '',
          subject: '',
          message: ''
        });
        setSubmitStatus(null);
      }, 2000);
    }, 1000);
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.content} style={{ maxWidth: '1000px' }}>
        <div className={styles.heroSection}>
          <div>
            <h2 className={styles.heroTitle}>Contactez-nous</h2>
            <p className={styles.heroSubtitle}>Une question ? Une suggestion ? Nous sommes là pour vous aider</p>
          </div>
          <button className={`btn btn-light ${styles.logoutBtn}`} onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>Déconnexion
          </button>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className={contactStyles.contactCard}>
              <div className={contactStyles.cardHeader}>
                <div className={contactStyles.headerIcon}>
                  <i className="bi bi-envelope-heart"></i>
                </div>
                <div>
                  <h3 className={contactStyles.cardTitle}>Envoyez-nous un message</h3>
                  <p className={contactStyles.cardSubtitle}>Nous vous répondrons dans les 24 heures</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className={contactStyles.contactForm}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className={contactStyles.formLabel}>
                      <i className="bi bi-person me-2"></i>Nom complet
                    </label>
                    <input
                      type="text"
                      name="name"
                      className={contactStyles.formInput}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className={contactStyles.formLabel}>
                      <i className="bi bi-envelope me-2"></i>Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className={contactStyles.formInput}
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className={contactStyles.formLabel}>
                      <i className="bi bi-chat-left-text me-2"></i>Sujet
                    </label>
                    <select
                      name="subject"
                      className={contactStyles.formInput}
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="support">Support technique</option>
                      <option value="abonnement">Questions sur l'abonnement</option>
                      <option value="suggestion">Suggestion d'amélioration</option>
                      <option value="bug">Signaler un bug</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className={contactStyles.formLabel}>
                      <i className="bi bi-pencil-square me-2"></i>Message
                    </label>
                    <textarea
                      name="message"
                      className={contactStyles.formTextarea}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Décrivez votre demande en détail..."
                      rows="6"
                      required
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className={contactStyles.submitButton}
                      disabled={submitStatus === 'sending'}
                    >
                      {submitStatus === 'sending' ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Envoi en cours...
                        </>
                      ) : submitStatus === 'success' ? (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Message envoyé !
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Envoyer le message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-4">
            <div className={contactStyles.infoCard}>
              <div className={contactStyles.infoHeader}>
                <i className="bi bi-info-circle"></i>
                <h4>Informations utiles</h4>
              </div>

              <div className={contactStyles.infoItem}>
                <div className={contactStyles.infoIcon}>
                  <i className="bi bi-clock-fill"></i>
                </div>
                <div>
                  <strong>Heures d'ouverture</strong>
                  <p>Lun - Ven : 9h00 - 18h00<br />Sam - Dim : 10h00 - 16h00</p>
                </div>
              </div>

              <div className={contactStyles.infoItem}>
                <div className={contactStyles.infoIcon}>
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <div>
                  <strong>Email</strong>
                  <p>support@fitsmash.com</p>
                </div>
              </div>

              <div className={contactStyles.infoItem}>
                <div className={contactStyles.infoIcon}>
                  <i className="bi bi-telephone-fill"></i>
                </div>
                <div>
                  <strong>Téléphone</strong>
                  <p>+33 1 23 45 67 89</p>
                </div>
              </div>

              <div className={contactStyles.infoItem}>
                <div className={contactStyles.infoIcon}>
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div>
                  <strong>Adresse</strong>
                  <p>42 Avenue des Champs-Élysées<br />75008 Paris, France</p>
                </div>
              </div>
            </div>

            <div className={contactStyles.socialCard}>
              <h4 className={contactStyles.socialTitle}>Suivez-nous</h4>
              <div className={contactStyles.socialIcons}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={`${contactStyles.socialLink} ${contactStyles.socialFacebook}`}>
                  <img src="/images/facebook.png" alt="Facebook" style={{ width: '50px', height: '50px' }} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`${contactStyles.socialLink} ${contactStyles.socialTwitter}`}>
                  <img src="/images/X.png" alt="X (Twitter)" style={{ width: '45px', height: '45px' }} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={`${contactStyles.socialLink} ${contactStyles.socialInstagram}`}>
                  <img src="/images/Instagram_icon.png" alt="Instagram" style={{ width: '50px', height: '50px' }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
