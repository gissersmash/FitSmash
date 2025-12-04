import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import styles from '../styles/Parametres.module.css';

export default function Parametres() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { name: 'Utilisateur', email: '', avatar: '' });
  const [newName, setNewName] = useState(user.name);
  const [newAvatar, setNewAvatar] = useState(user.avatar || '');
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'fr');
  const [activeTab, setActiveTab] = useState('profile');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    // Load dark mode preference on component mount
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleSaveProfile = () => {
    const updatedUser = { ...user, name: newName, avatar: newAvatar };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    showNotification('Profil mis à jour avec succès !');
  };

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    showNotification(newMode ? 'Mode sombre activé' : 'Mode clair activé');
  };

  const handleChangeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    showNotification(lang === 'fr' ? 'Langue: Français' : 'Language: English');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        showNotification('Veuillez sélectionner une image valide', 'error');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('L\'image est trop volumineuse (max 5MB)', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result);
        setUploadedImage(reader.result);
        showNotification('Image chargée avec succès !');
      };
      reader.readAsDataURL(file);
    }
  };

  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&size=128&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&size=128&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasmine&size=128&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max&size=128&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&size=128&backgroundColor=ffdfbf',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&size=128&backgroundColor=c5e8d9',
    'https://api.dicebear.com/7.x/personas/svg?seed=Felix&size=128&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/personas/svg?seed=Aneka&size=128&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/identicon/svg?seed=custom1&size=128&backgroundColor=1ec287',
    'https://api.dicebear.com/7.x/identicon/svg?seed=custom2&size=128&backgroundColor=3b82f6'
  ];

  return (
    <div className={styles.container}>
      <Sidebar />
      
      {/* Notification Toast */}
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          <i className="bi bi-check-circle-fill me-2"></i>
          {notification.message}
        </div>
      )}

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <i className="bi bi-gear-fill"></i>
            </div>
            <div>
              <h1 className={styles.headerTitle}>Paramètres</h1>
              <p className={styles.headerSubtitle}>Personnalisez votre expérience FitSmash</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tab} ${activeTab === 'profile' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="bi bi-person-circle"></i>
            <span>Profil</span>
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'appearance' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <i className="bi bi-palette"></i>
            <span>Apparence</span>
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'language' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('language')}
          >
            <i className="bi bi-translate"></i>
            <span>Langue</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {/* Profil Tab */}
          {activeTab === 'profile' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Informations du profil</h2>
                <p className={styles.sectionSubtitle}>Modifiez votre avatar et votre nom d'utilisateur</p>
              </div>

              {/* Avatar Selection */}
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                  <i className="bi bi-image me-2"></i>
                  Photo de profil
                </h3>
                <div className={styles.currentAvatar}>
                  <img src={newAvatar || 'https://api.dicebear.com/7.x/identicon/svg?seed=default&size=128'} alt="Avatar actuel" />
                  <div className={styles.currentAvatarInfo}>
                    <span className={styles.currentAvatarLabel}>Avatar actuel</span>
                    <span className={styles.currentAvatarName}>{newName}</span>
                  </div>
                </div>
                
                <div className={styles.avatarGrid}>
                  {avatarOptions.map((avatar, index) => (
                    <div 
                      key={index}
                      className={`${styles.avatarOption} ${newAvatar === avatar ? styles.avatarOptionActive : ''}`}
                      onClick={() => setNewAvatar(avatar)}
                    >
                      <img src={avatar} alt={`Avatar ${index + 1}`} />
                      {newAvatar === avatar && (
                        <div className={styles.avatarCheck}>
                          <i className="bi bi-check-lg"></i>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.customAvatarInput}>
                  <label className={styles.inputLabel}>
                    <i className="bi bi-upload me-2"></i>
                    Importer depuis votre ordinateur
                  </label>
                  <div className={styles.uploadContainer}>
                    <label htmlFor="file-upload" className={styles.uploadButton}>
                      <i className="bi bi-cloud-upload me-2"></i>
                      Choisir une image
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <span className={styles.uploadHint}>JPG, PNG, GIF (max 5MB)</span>
                  </div>
                </div>

                <div className={styles.customAvatarInput}>
                  <label className={styles.inputLabel}>
                    <i className="bi bi-link-45deg me-2"></i>
                    Ou URL personnalisée
                  </label>
                  <input 
                    type="text"
                    className={styles.input}
                    placeholder="https://exemple.com/avatar.jpg"
                    value={newAvatar}
                    onChange={(e) => setNewAvatar(e.target.value)}
                  />
                </div>
              </div>

              {/* Username */}
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                  <i className="bi bi-person-badge me-2"></i>
                  Nom d'utilisateur
                </h3>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Pseudo</label>
                  <input 
                    type="text"
                    className={styles.input}
                    placeholder="Votre pseudo"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
              </div>

              <button className={styles.saveButton} onClick={handleSaveProfile}>
                <i className="bi bi-check-circle me-2"></i>
                Enregistrer les modifications
              </button>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Apparence</h2>
                <p className={styles.sectionSubtitle}>Personnalisez l'interface selon vos préférences</p>
              </div>

              <div className={styles.card}>
                <div className={styles.settingRow}>
                  <div className={styles.settingInfo}>
                    <div className={styles.settingIcon}>
                      <i className="bi bi-moon-stars-fill"></i>
                    </div>
                    <div>
                      <h3 className={styles.settingTitle}>Mode sombre</h3>
                      <p className={styles.settingDescription}>
                        Activez le thème sombre pour réduire la fatigue oculaire
                      </p>
                    </div>
                  </div>
                  <label className={styles.switch}>
                    <input 
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={handleToggleDarkMode}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                {isDarkMode && (
                  <div className={styles.darkModePreview}>
                    <i className="bi bi-info-circle me-2"></i>
                    Le mode sombre est actuellement activé
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Language Tab */}
          {activeTab === 'language' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Langue</h2>
                <p className={styles.sectionSubtitle}>Choisissez votre langue préférée</p>
              </div>

              <div className={styles.card}>
                <div 
                  className={`${styles.languageOption} ${language === 'fr' ? styles.languageOptionActive : ''}`}
                  onClick={() => handleChangeLanguage('fr')}
                >
                  <div className={styles.languageFlag}>🇫🇷</div>
                  <div className={styles.languageInfo}>
                    <div className={styles.languageName}>Français</div>
                    <div className={styles.languageCode}>FR</div>
                  </div>
                  {language === 'fr' && (
                    <div className={styles.languageCheck}>
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                  )}
                </div>

                <div 
                  className={`${styles.languageOption} ${language === 'en' ? styles.languageOptionActive : ''}`}
                  onClick={() => handleChangeLanguage('en')}
                >
                  <div className={styles.languageFlag}>🇬🇧</div>
                  <div className={styles.languageInfo}>
                    <div className={styles.languageName}>English</div>
                    <div className={styles.languageCode}>EN</div>
                  </div>
                  {language === 'en' && (
                    <div className={styles.languageCheck}>
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                  )}
                </div>

                <div className={styles.languageNote}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Note: La traduction complète sera disponible prochainement
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
