# 🔥 CONFIGURATION FIREBASE - GUIDE RAPIDE

## ⚡ ACTION REQUISE : Obtenir `FIREBASE_CONFIG` pour le `.env`

### Option A : Via Firebase Console (2 min)
1. Allez sur https://console.firebase.google.com/
2. Sélectionnez votre projet (ou créez-en un : "aura-ai-platform")
3. ⚙️ **Project Settings** → **Service Accounts** → **Generate New Private Key**
4. Téléchargez le JSON
5. Copiez **TOUT le contenu** en une seule ligne dans `.env` :

```env
FIREBASE_CONFIG='{"type":"service_account","project_id":"VOTRE_PROJET","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk@VOTRE_PROJET.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token"}'
```

### Option B : Via gcloud CLI (si connecté)
```bash
gcloud iam service-accounts keys create firebase-key.json \
  --iam-account=firebase-adminsdk@VOTRE_PROJET.iam.gserviceaccount.com
# Puis copiez le contenu de firebase-key.json dans .env
```

---

## ✅ CE QUI SE PASSERA APRÈS CONFIGURATION

Une fois `FIREBASE_CONFIG` ajouté au `.env` et le serveur redémarré :

| Fonction | Avant | Après |
|----------|-------|-------|
| **Persistance** | Local JSON seulement | **Firebase + Local (double écriture)** |
| **Survie redémarrage** | ❌ Perte état | ✅ État complet restauré |
| **Health check** | `firebase: not_configured` | `firebase: connected` |
| **Scalabilité** | Instance unique | Multi-instances synchronisées |

---

## 🧪 TEST APRÈS CONFIGURATION

```bash
# 1. Ajouter FIREBASE_CONFIG au .env
# 2. Redémarrer le serveur
npm run dev

# 3. Vérifier health check
curl http://localhost:3008/health
# Doit afficher: "firebase": "connected"

# 4. Tester persistance
# - Modifier config via UI admin
# - Redémarrer serveur
# - Vérifier que config persiste
```

---

## 📝 NOTE IMPORTANTE

Le code dans `server.ts` gère déjà :
- ✅ Initialisation Firebase au démarrage (`initializeFirebase()`)
- ✅ `loadStateFromDb()` : Priorité Firebase → fallback local JSON
- ✅ `saveStateToDb()` : Double écriture (local instantané + Firestore merge)
- ✅ Collection: `aura_state` / Document: `platform`

**Il ne manque QUE la clé de service dans `.env`**
