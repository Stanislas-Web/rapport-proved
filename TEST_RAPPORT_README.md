# 🧪 Guide de Test - Rapport d'Activité

## 🎯 Objectif
Tester la création d'un rapport d'activité avec **toutes les sections** pour vérifier que les données sont bien sauvegardées et affichées.

---

## ✅ Sections à Tester

### 1. **Sections Principales**
- ✅ Introduction
- ✅ Paramètres Clés
- ✅ Personnel
- ✅ Amélioration Qualité
- ✅ Réalisations
- ✅ Gouvernance (voir détails ci-dessous)
- ✅ Éducation en Situation d'Urgence
- ✅ Autres Problèmes
- ✅ Conclusion

### 2. **Sous-sections Gouvernance à Vérifier**
- ✅ Mise en Œuvre SSEF
- ✅ Inspections Administratives C2B
- ✅ Comités Provinciaux (4 comités)
- ✅ Rémunération Personnel
- ✅ Vulgarisation Instructions
- ⚠️  **Formations Gestionnaires** (peut être remplie mais ne s'affiche pas)
- ⚠️  **Commentaire Formations** (peut être rempli mais ne s'affiche pas)
- ✅ Groupes d'Aides Psychopédagogiques
- ⚠️  **Acquisitions de Matériels** (s'affiche si données existent en base)
- ✅ Infrastructure des Bureaux

### 3. **Sous-sections Éducation Urgence à Vérifier**
- ✅ Plan & Stock de Contingence
- ✅ Catastrophes Naturelles
- ✅ Destruction SDC
- ✅ Solutions Locales
- ⚠️  **Réunions Cluster Education** (peut être remplie mais ne s'affiche pas)
- ✅ Recommandations (partiel)
- ⚠️  **Formation Enseignants ESU** (peut être remplie mais ne s'affiche pas)

---

## 🔑 ÉTAPE 1 : Récupérer ton Token

### Option A : Via l'API (Recommandé pour les tests)

Exécute cette commande dans ton terminal :

```bash
# Se connecter et récupérer le token
curl -X POST https://www.edu-nc.site/api/v1/proved/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "+243899312592",
    "motDePasse": "1234"
  }' | jq -r '.token' > token.txt

# Afficher le token
cat token.txt

# Stocker le token dans une variable pour l'utiliser dans les commandes suivantes
export TOKEN=$(cat token.txt)
echo "Token stocké: ${TOKEN:0:20}..."
```

**Si tu n'as pas `jq` installé:**
```bash
# macOS
brew install jq

# Ou sans jq, récupère manuellement le token de la réponse
curl -X POST https://www.edu-nc.site/api/v1/proved/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "+243899312592",
    "motDePasse": "1234"
  }'
```

### Option B : Via le Navigateur

1. Ouvre ton application dans le navigateur
2. Connecte-toi si nécessaire
3. Ouvre la Console (F12 → onglet Console)
4. Tape cette commande :
   ```javascript
   localStorage.getItem('token')
   ```
5. Copie le token affiché (sans les guillemets `"`)

---

## 🧪 ÉTAPE 2 : Test avec CURL

### Option A : Script Complet (Recommandé)

**📝 Basé sur les données réelles de rapport_data_filled.json**

**Si tu as utilisé l'Option A de l'étape 1 (token dans variable):**

```bash
# Utilise la variable $TOKEN définie précédemment
curl -X POST "https://www.edu-nc.site/api/v1/rapport-activite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @rapport_data_filled.json | jq '.' > response.json

echo "✅ Rapport créé! Voir response.json pour les détails"
cat response.json | jq '.data._id'
```

**Ou copie cette commande en remplaçant `YOUR_TOKEN_HERE` par ton token :**

```bash
curl -X POST "https://www.edu-nc.site/api/v1/rapport-activite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
  "identificationProved": "6970af4de0355a44bca8a5b9",
  "annee": "2024-2025",
  "statut": "brouillon",
  "introduction": "Le rapport d activité de la Province Educationnelle du Kwango5 présente les principales réalisations et défis rencontrés au cours de l année scolaire 2024-2025.",
  
  "parametresCles": {
    "nombreEcolesClasses": {
      "niveauPrescolaire": {
        "espaceCommunautaireEveil": { "nombreEcoles": 15, "nombreClasses": 38 },
        "maternel": { "nombreEcoles": 28, "nombreClasses": 65 },
        "prePrimaire": { "nombreEcoles": 22, "nombreClasses": 48 },
        "special": { "nombreEcoles": 4, "nombreClasses": 12 }
      },
      "niveauPrimaire": {
        "enseignementSpecial": { "nombreEcoles": 6, "totalClassesSpecialesPrim": 18, "classesPlethoriques": 0 },
        "enseignementPrimaire": { "nombreEcoles": 145, "totalClassesPrimaire": 870, "classesPlethoriques": 42 }
      },
      "niveauSecondaire": {
        "enseignementSpecial": { "nombreEcoles": 5, "totalClassesSpecialesSec": 15 },
        "enseignementSecondaire": {
          "nombreEcoles": 78,
          "premierCycle": { "classes7emeCTEB": 156, "classes8emeCTEB": 148 },
          "deuxiemeCycle": { "totalClassesHumanites": 312 },
          "totalClasses1er2emeCycle": 616
        }
      }
    }
  },

  "gouvernance": {
    "miseEnOeuvreSSEF": {
      "niveauProvinceEducationnelle": {
        "elaborationPAO": "Le Plan d Action Opérationnel (PAO) 2024-2025 a été élaboré de manière participative avec l implication de toutes les parties prenantes en septembre 2024.",
        "miseEnOeuvre": "Mise en œuvre à 82% avec des progrès notables dans l accès (95%) et des défis persistants dans la qualité (72%) et la gouvernance (68%).",
        "evaluationMiParcours": "Réalisée en décembre 2024, révélant des progrès significatifs dans l accès à l éducation (+8% d effectifs).",
        "evaluationFinale": "Prévue pour juin 2025 avec présentation des résultats au comité provincial et aux partenaires"
      },
      "niveauProvinceAdministrative": {
        "elaborationPAO": "Coordination effective avec le PAO provincial, alignement sur les priorités du SSEF.",
        "miseEnOeuvre": "Exécution à 76% avec des variations importantes selon les territoires (de 65% à 88%).",
        "evaluationMiParcours": "Effectuée en janvier 2025 avec participation des autorités locales.",
        "evaluationFinale": "Programmée pour juillet 2025 avec restitution communautaire"
      }
    },
    "inspectionsAdministrativesC2B": {
      "prescolaire": { "nombrePrevu": 72, "nombreRealise": 64, "pourcentageRealisation": 88.9 },
      "primaire": { "nombrePrevu": 240, "nombreRealise": 216, "pourcentageRealisation": 90 },
      "secondaire": { "nombrePrevu": 168, "nombreRealise": 152, "pourcentageRealisation": 90.5 },
      "special": { "nombrePrevu": 24, "nombreRealise": 22, "pourcentageRealisation": 91.7 }
    },
    "comitesProvinciaux": {
      "comiteEDUNC": { 
        "frequenceReunions": "Réunions mensuelles régulières, 10 réunions tenues sur 12 prévues (83% de réalisation).", 
        "pointsTraites": "Planification et suivi budgétaire, état d avancement des infrastructures, allocation et distribution des ressources pédagogiques."
      },
      "comiteENAFP": { 
        "frequenceReunions": "Réunions trimestrielles, 4 réunions tenues comme prévu (100% de réalisation)", 
        "pointsTraites": "Programmes d alphabétisation des adultes (2500 bénéficiaires), développement de l éducation non-formelle."
      },
      "comiteTENASOSP": { 
        "frequenceReunions": "Réunions bimestrielles, 6 réunions tenues (100% de réalisation)", 
        "pointsTraites": "Stratégies d éducation spécialisée inclusive, inclusion effective des enfants à besoins spécifiques (168 cas suivis)."
      },
      "comiteExamenEtat": { 
        "frequenceReunions": "4 réunions annuelles selon le calendrier officiel des examens d État", 
        "pointsTraites": "Organisation logistique des examens d État, distribution et sécurisation des épreuves, coordination avec les centres d examens (78 centres)."
      }
    },
    "formationsGestionnaires": {
      "leadershipScolaire": { "tauxGF": 78.5, "tauxFilles": 42.3 },
      "managementScolaire": { "tauxGF": 82.1, "tauxFilles": 45.8 },
      "calculIndicateurs": { "tauxGF": 65.4, "tauxFilles": 38.2 },
      "gestionEntiteEducationnelle": { "tauxGF": 71.9, "tauxFilles": 41.5 },
      "planification": { "tauxGF": 68.7, "tauxFilles": 39.6 }
    },
    "commentaireFormations": "Les formations ont été dispensées avec un taux de participation satisfaisant. Cependant, la participation des femmes reste à améliorer dans tous les modules.",
    "groupesAidesPsychopedagogiques": {
      "nombreGAPMisEnPlace": 54,
      "nombreGAPOperationnel": 46,
      "nombreCasPrisEnCharge": 342,
      "problemesIdentifies": "Difficultés d apprentissage (38% des cas), troubles comportementaux (22%), cas de violence scolaire (18%).",
      "solutionsPreconisees": "Renforcement urgent des capacités des GAP existants, recrutement de 25 psychopédagogues qualifiés."
    },
    "acquisitionsMateriels": {
      "ecoles": {
        "nature": "Bancs-pupitres (1020 unités pour 34500 élèves), tableaux noirs (385 unités), matériel didactique (kits pédagogiques pour 215 écoles), équipements informatiques (102 ordinateurs pour 45 écoles), manuels scolaires (28500 exemplaires)",
        "sourceFinancement": { "gvt": 68, "projet": 18, "ptfs": 11, "ong": 3 }
      },
      "bureauxGestionnaires": {
        "nature": "Mobiliers de bureau (150 pièces), ordinateurs (54 unités), imprimantes (34), motos pour supervision (18), photocopieuses (15), générateurs électriques (8)",
        "sourceFinancement": { "gvt": 72, "projet": 14, "ptfs": 9, "ong": 5 }
      }
    }
  },

  "educationUrgence": {
    "planStockContingence": {
      "plan": "Plan de contingence élaboré et validé en août 2024, couvrant les principaux risques identifiés: inondations, épidémies, conflits intercommunautaires.",
      "stock": "Stock de contingence constitué et pré-positionné: 600 kits scolaires d urgence, 240 bâches plastiques, 180 jerrycans, 85 trousses de premiers soins."
    },
    "catastrophesNaturelles": {
      "nature": "Inondations majeures dans 3 territoires (août-septembre 2024, 850 élèves impactés), érosions graves dans 2 sous-divisions.",
      "effetsNegatifs": "Destruction totale de 15 salles de classe, endommagement partiel de 28 salles, interruption des cours pour 1000 élèves pendant 3-5 semaines."
    },
    "destructionSDC": {
      "forcesNegatives": "Actes de vandalisme dans 7 écoles (vol d équipements), conflits fonciers ayant affecté 4 établissements."
    },
    "solutionsLocales": "Relocalisation temporaire dans 12 bâtiments communautaires (églises, centres de santé), mise en place de système de double vacation dans 8 écoles affectées.",
    "reunionsClusterEducation": {
      "frequence": "Réunions trimestrielles du cluster éducation en situation d urgence, 4 réunions tenues en 2024-2025 (septembre, décembre, mars, juin)",
      "pointsTraites": "Coordination inter-agences de la réponse aux urgences éducatives, cartographie actualisée des besoins (3 évaluations rapides conduites), mobilisation et tracking des ressources (1,2 millions USD mobilisés)."
    },
    "recommandations": {
      "espacesTemporairesApprentissage": { 
        "nombre": 22, 
        "couts": "Coût estimé: 55000 USD pour construction de 22 espaces temporaires d apprentissage (ETA) avec capacité de 50-60 élèves chacun, incluant kit mobilier de base et matériel pédagogique d urgence" 
      },
      "apprenantsScolarises": { "cible": 1100 },
      "formationEnseignantsESU": "Formation urgente de 92 enseignants en Éducation en Situations d Urgence (ESU) sur les approches pédagogiques adaptées, le soutien psychosocial aux élèves traumatisés, la gestion de classe en contexte d urgence et la protection de l enfant."
    }
  },

  "autresProblemes": {
    "problemesSpecifiques": "Insuffisance critique de personnel enseignant qualifié dans les zones rurales reculées (déficit de 180 enseignants); Retard persistant dans le paiement des salaires (73 agents administratifs non payés depuis 3-6 mois); Dégradation avancée des infrastructures scolaires (40% nécessitent une réhabilitation urgente)."
  },

  "conclusion": "L année scolaire 2024-2025 a été marquée par des avancées significatives en matière d accès à l éducation dans la Province du Kwango5, avec la construction de 98 nouvelles salles de classe et l augmentation notable des effectifs scolaires (+6,8% au primaire)."
}'
```

### Option B : Test Minimal (Rapide)

Version courte pour test rapide :

```bash
curl -X POST "https://www.edu-nc.site/api/v1/rapport-activite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
  "identificationProved": "6970af4de0355a44bca8a5b9",
  "annee": "2024-2025",
  "statut": "brouillon",
  "introduction": "Test rapide",
  "gouvernance": {
    "formationsGestionnaires": {
      "leadershipScolaire": { "tauxGF": 75, "tauxFilles": 40 }
    },
    "commentaireFormations": "Test commentaire",
    "acquisitionsMateriels": {
      "ecoles": {
        "nature": "Test matériels",
        "sourceFinancement": { "gvt": 65, "projet": 20, "ptfs": 10, "ong": 5 }
      }
    }
  },
  "conclusion": "Test"
}'
```

---

## 🔍 ÉTAPE 3 : Vérifier le Résultat

### 3.1 Vérifier la Réponse CURL

Si succès, tu verras :
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "annee": "2024-2025",
    ...
  }
}
```

**Pour extraire et vérifier l'ID du rapport créé:**

```bash
# Extraire l'ID du rapport
export RAPPORT_ID=$(cat response.json | jq -r '.data._id')
echo "ID du rapport créé: $RAPPORT_ID"

# Récupérer et vérifier le rapport
curl -X GET "https://www.edu-nc.site/api/v1/rapport-activite/$RAPPORT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.' > rapport_verifie.json

# Vérifier spécifiquement les sections gouvernance
cat rapport_verifie.json | jq '.data.gouvernance | keys'

# Vérifier acquisitionsMateriels
cat rapport_verifie.json | jq '.data.gouvernance.acquisitionsMateriels'

# Vérifier formationsGestionnaires
cat rapport_verifie.json | jq '.data.gouvernance.formationsGestionnaires'
```

### 3.2 Vérifier dans l'Application

1. **Ouvre l'application** dans le navigateur
2. **Va dans la liste des rapports**
3. **Clique sur le rapport créé** avec CURL
4. **Vérifie que ces sections s'affichent :**
   - ✅ Introduction
   - ✅ Gouvernance → Comités Provinciaux
   - ✅ Gouvernance → Groupes d'Aides
   - ⚠️  **Gouvernance → Acquisitions de Matériels** (doit s'afficher maintenant!)
   - ❌ **Gouvernance → Formations Gestionnaires** (ne s'affichera pas - affichage manquant)
   - ❌ **Gouvernance → Commentaire** (ne s'affichera pas - affichage manquant)

### 3.3 Vérifier dans la Console du Navigateur

Pour confirmer que les données existent :

```javascript
// Ouvre le rapport puis tape dans la console :
console.log('Acquisitions:', selectedRapport?.gouvernance?.acquisitionsMateriels);
console.log('Formations:', selectedRapport?.gouvernance?.formationsGestionnaires);
console.log('Commentaire:', selectedRapport?.gouvernance?.commentaireFormations);
```

Si tu vois les données → ✅ Backend fonctionne, c'est juste l'affichage qui manque

---

## 📊 Résultats Attendus

| Section | Sauvegarde Backend | Affichage Frontend | Status |
|---------|-------------------|-------------------|--------|
| acquisitionsMateriels | ✅ Fonctionne | ✅ S'affiche (si données existent) | OK |
| formationsGestionnaires | ✅ Fonctionne | ❌ Ne s'affiche pas | Code d'affichage manquant |
| commentaireFormations | ✅ Fonctionne | ❌ Ne s'affiche pas | Code d'affichage manquant |
| reunionsClusterEducation | ✅ Fonctionne | ❌ Ne s'affiche pas | Code d'affichage manquant |
| formationEnseignantsESU | ✅ Fonctionne | ❌ Ne s'affiche pas | Code d'affichage manquant |

---

## ❓ Dépannage

### Erreur 401 Unauthorized
- ✅ Vérifie que ton token est correct
- ✅ Vérifie que tu es bien connecté
- ✅ Le token expire après un certain temps

### Erreur 400 Bad Request
- ✅ Vérifie la structure JSON
- ✅ Assure-toi que `identificationProved` existe dans ta base

### La section ne s'affiche pas
- ✅ Vérifie dans la console que les données existent
- ✅ Si les données existent mais ne s'affichent pas → c'est normal, le code d'affichage n'est pas encore ajouté pour certaines sections

---

## 🚀 Script Complet de Test (Toutes les étapes)

Copie et exécute ce script complet :

```bash
#!/bin/bash

echo "🔐 ÉTAPE 1: Connexion et récupération du token..."
curl -s -X POST https://www.edu-nc.site/api/v1/proved/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "+243899312592",
    "motDePasse": "1234"
  }' | jq -r '.token' > token.txt

export TOKEN=$(cat token.txt)
echo "✅ Token récupéré: ${TOKEN:0:20}..."
echo ""

echo "📝 ÉTAPE 2: Création du rapport avec toutes les sections..."
curl -s -X POST "https://www.edu-nc.site/api/v1/rapport-activite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @rapport_data_filled.json | jq '.' > response.json

export RAPPORT_ID=$(cat response.json | jq -r '.data._id')
echo "✅ Rapport créé avec ID: $RAPPORT_ID"
echo ""

echo "🔍 ÉTAPE 3: Vérification des sections..."
curl -s -X GET "https://www.edu-nc.site/api/v1/rapport-activite/$RAPPORT_ID" \
  -H "Authorization: Bearer $TOKEN" > rapport_complet.json

echo "📊 Sections Gouvernance disponibles:"
cat rapport_complet.json | jq '.data.gouvernance | keys'
echo ""

echo "✅ acquisitionsMateriels présent:"
cat rapport_complet.json | jq -e '.data.gouvernance.acquisitionsMateriels' > /dev/null && echo "OUI ✓" || echo "NON ✗"

echo "✅ formationsGestionnaires présent:"
cat rapport_complet.json | jq -e '.data.gouvernance.formationsGestionnaires' > /dev/null && echo "OUI ✓" || echo "NON ✗"

echo "✅ commentaireFormations présent:"
cat rapport_complet.json | jq -e '.data.gouvernance.commentaireFormations' > /dev/null && echo "OUI ✓" || echo "NON ✗"

echo ""
echo "📄 Fichiers créés:"
echo "  - token.txt (ton token)"
echo "  - response.json (réponse de création)"
echo "  - rapport_complet.json (rapport complet récupéré)"
echo ""
echo "🎉 Test terminé! Ouvre maintenant l'app pour voir le rapport."
```

**Pour exécuter:**
```bash
chmod +x test_rapport.sh
./test_rapport.sh
```

---

## 🚀 Prochaines Étapes

Si le test confirme que :
- ✅ Les données sont bien sauvegardées en base
- ❌ Mais ne s'affichent pas dans l'interface

Alors il faut ajouter le code d'affichage dans :
- `src/pages/RapportActivite/index.tsx` (pour la consultation)

---

## 📝 Notes

- **Backend :** ✅ Tout fonctionne correctement
- **Formulaires :** ✅ Permettent bien de remplir les données
- **Affichage :** ⚠️  4 sections manquent le code d'affichage dans index.tsx

**Pas besoin de toucher au backend!** C'est juste du code JSX à ajouter pour l'affichage.
