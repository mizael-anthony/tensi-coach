# TensiCoach 🩺✨

**TensiCoach** est une application web mobile-first en français, MVP de coach IA pour le suivi et la prévention de l'hypertension artérielle.

Conçue dans un style médical accessible, épuré et rassurant (palette blanc, bleu profond et vert menthe), l'application permet de suivre sa pression artérielle, de comprendre l'impact direct de son mode de vie (sommeil, sel, activité, stress) et de générer un rapport imprimable pour son médecin traitant.

---

## 🚀 Fonctionnalités Principales

1. **Accueil Dynamique :**
   - Affichage en grand format de la dernière mesure avec classification ESH / HAS et calcul automatique de la Pression Artérielle Moyenne (PAM) et de la Pression Pulsée (PP).
   - Moyennes comparatives sur 7, 30 et 60 jours (globale, matin et soir selon le protocole de la Haute Autorité de Santé).
   - Tendance d'évolution tensionnelle en temps réel (en baisse, stable ou en hausse).
   - Score d'habitudes cardio-protectrices sur 100 points avec jauge visuelle.
   - Micro-conseil bien-être quotidien.

2. **Journal des Mesures & Graphiques :**
   - **Ajout express en moins de 3 interactions** grâce aux préréglages 1 clic (120/80, 125/82, 135/86, 142/92) et aux boutons pas-à-pas ergonomiques.
   - Courbe interactive d'évolution (SVG réactif) avec seuils de référence (Normale 120/80, Seuil d'HTA 140/90).
   - Filtrage temporel (7j, 30j, 60j, tout) et filtrage par moment (Matin, Soir, Midi) ou niveau de tension.
   - Consultation et suppression de mesures avec boîte de confirmation.

3. **Coach IA & Mode Local de Secours :**
   - Analyse préventive intelligente par **Gemini 3.8 Flash** via un serveur d'API sécurisé (aucun secret ni clé API exposé au navigateur).
   - Envoi exclusif de statistiques consolidées et anonymisées (aucune donnée nominative).
   - **Mode local autonome :** si la clé Gemini n'est pas configurée ou en cas de perte de connexion, un moteur expert clinique local prend le relais de façon transparente.
   - Chat interactif en français avec suggestions de questions rapides (sel, sommeil, protocole HAS, stress).

4. **Suivi des Habitudes :**
   - Suivi quotidien des 5 piliers : Sommeil (heures & qualité), Pas du jour, Niveau de stress (1 à 5), Consommation de sel (faible, modérée, élevée) et Activité physique.
   - Mise en évidence concrète des corrélations observées sur les 60 jours (ex : impact d'une nuit courte sur la mesure du matin).

5. **Rapport Médical & Export :**
   - Relevé d'auto-mesure formaté selon les critères attendus par les cardiologues et médecins généralistes (règle des 3 mesures HAS, écart-type, dispersion, tableau des dernières mesures).
   - Impression et export PDF immédiat via `window.print()` avec feuille de style dédiée au format A4 (`@media print`).
   - Export brut des données au format CSV (compatible Microsoft Excel) ou JSON.

6. **Profil & Sécurité Médicale :**
   - Profil utilisateur de démonstration (Thomas, 32 ans).
   - Configuration d'horaires de rappel personnalisés (matin et soir).
   - Boutons de réinitialisation des 60 jours de démonstration ou de purge des données locales.
   - Page dédiée à l'avertissement médical, aux normes ESH et à la politique de confidentialité locale.

---

## 🛡️ Sécurité Médicale & Déontologie

- **Aucun diagnostic :** L'application ne mesure pas directement la tension, ne pose aucun diagnostic et n'ajuste aucun traitement médicamenteux.
- **Protocole d'urgence :** Toute mesure avec **SYS &ge; 180 mmHg** ou **DIA &ge; 120 mmHg** déclenche immédiatement une alerte visuelle claire avec conduite à tenir (contrôle au repos sous 5 minutes, appel du 15 / 112 en cas de symptômes cardiovasculaires ou neurologiques).
- **Alerte hypotension :** Avertissement prudent si SYS &lt; 90 ou DIA &lt; 60 mmHg.
- **Mention permanente :** « *TensiCoach ne remplace pas un avis médical. En cas de valeurs très élevées, de malaise ou de symptômes, consultez un professionnel de santé.* »
- **Confidentialité absolue :** Données stockées localement sur le terminal (`localStorage`).

---

## 🛠️ Installation & Lancement

### Prérequis
- Node.js (version 18 ou supérieure)
- npm

### 1. Cloner ou ouvrir le projet
```bash
git clone <url-du-depot>
cd tensicoach
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement (Optionnel)
Créez un fichier `.env` à la racine si vous souhaitez activer l'IA Gemini :
```env
# Clé API Google Gemini (optionnel, le mode local fonctionne automatiquement sans clé)
GEMINI_API_KEY="VOTRE_CLE_GEMINI"
PORT=3000
```

### 4. Lancer le serveur de développement
```bash
npm run dev
```
L'application démarre sur [http://localhost:3000](http://localhost:3000).

### 5. Compiler pour la production
```bash
npm run build
npm start
```

---

## 📂 Architecture Technique

- **Frontend :** React 19, TypeScript, Tailwind CSS v4, Lucide Icons.
- **Backend :** Express, `@google/genai` (SDK officiel), Vite Dev Middleware.
- **Stockage :** LocalStorage avec initialisation automatique du jeu de 60 jours cohérents.
- **Accessibilité & Mobile :** Bottom bar tactile, navigation adaptée aux petits écrans et responsive desktop.
