# Workshop : Sécurité Web - SQLi & XSS

## Introduction
Bienvenue dans ce workshop sur la sécurité des applications web ! 🚀 Ici, tu apprendras à identifier et corriger deux types de vulnérabilités courantes : **l'injection SQL (SQLi)** et **le cross-site scripting (XSS)**.

J'ai préparé deux branches :
- **main** : une version vulnérable de l'application où ces attaques sont possibles.
- **correction** : une version sécurisée où ces failles ont été corrigées.

L'objectif est de tester ces failles sur la branche `main`, comprendre pourquoi elles sont dangereuses, puis apprendre à les corriger pour aboutir à une application plus sécurisée.

---

## 📌 Installation et configuration

1. Clone ce repository :
   ```sh
   git clone https://github.com/ton-repo/workshop-SQLi-XSS.git
   cd workshop-SQLi-XSS
   ```
2. Copie les fichiers `.env.sample` et configure ton environnement (côté frontend et backend) :
   ```sh
   cp .env.sample .env
   ```
3. Installe les dépendances :
   ```sh
   npm install
   ```
4. Exécute les migrations de la base de données :
   ```sh
   npm run db:migrate
   ```
5. Lance le serveur :
   ```sh
   npm run dev
   ```

Maintenant, ton application est prête à être testée ! 🔥

---

## 🛠️ Tester les vulnérabilités

### 1️⃣ Injection SQL - Connexion sans mot de passe

Essaie de te connecter avec l'email d'un utilisateur existant et entre cette valeur dans le champ mot de passe :
```sql
' OR 1=1 --
```
➡️ Résultat attendu : Tu seras connecté sans connaître le mot de passe.

Pourquoi ?
> Cette requête modifie la condition SQL pour toujours être vraie, permettant l'accès à n'importe quel compte !

### 2️⃣ Injection XSS - Exécution de script malveillant

Ajoute un nouvel utilisateur avec ce `firstname` :
```html
<script>alert("XSS Attack!")</script>
```
➡️ Résultat attendu : Une alerte JavaScript s'exécutera dans l'interface utilisateur.

Pourquoi ?
> L'application affiche les entrées utilisateur sans les nettoyer, permettant d'injecter du code HTML/JS malveillant.

### 3️⃣ SQL Injection avancée - Suppression de la base de données

Entre cette valeur dans le champ mot de passe lors de la connexion :
```sql
'; DROP DATABASE testdb; --
```
➡️ Résultat attendu : La base de données sera supprimée. ⚠️

Pourquoi ?
> Cette requête injectée exécute un `DROP DATABASE` en exploitant la concaténation de chaînes dans les requêtes SQL non sécurisées.

---

## 🔐 Correction des vulnérabilités

### 1️⃣ Sécurisation des requêtes SQL avec des requêtes préparées

Dans `server/src/modules/user/userRepository.ts`, remplace ce code vulnérable :
```ts
async readWithEmailAndPassword(
  user: Omit<User, "id" | "firstname" | "lastname">
) {
  const [rows] = await databaseClient.query<Rows>(
    `select * from user where email= '${user.email}' and password = '${user.password}'`,
  );
  return rows[0] as User;
}
```

Par une version sécurisée avec des **requêtes préparées** :
```ts
async readWithEmailAndPassword(
  user: Omit<User, "id" | "firstname" | "lastname">
) {
  const [rows] = await databaseClient.execute<Rows>(
    "SELECT * FROM user WHERE email = ? AND password = ?",
    [user.email, user.password]
  );
  return rows[0] as User;
}
```
✅ **Pourquoi ?**
> Les requêtes préparées empêchent l'injection SQL en séparant les données des instructions SQL. Elles garantissent que les valeurs utilisateur ne sont jamais interprétées comme du code SQL. Au lieu d'insérer directement les données dans la requête sous forme de chaînes de caractères (ce qui ouvre la porte aux injections SQL), elles utilisent des placeholders (?) où les valeurs sont ensuite liées de manière sécurisée. Ainsi, même si un utilisateur malveillant tente d'injecter du code SQL, il sera traité comme une simple donnée et non comme une commande exécutable.

### 2️⃣ Protection contre le XSS en supprimant `executeScript`

Cherche la "Step 2" dans le fichier `client/src/app.tsx`.\
Supprime la fonction `executeScript` qui forçait l'exécution des `<script>` injectés.\
Supprime également l'attribut `dangerouslySetInnerHTML` pour la colone "firstname" de du tableau et remet le comme les autres balises du tableau.

✅ **Pourquoi ?**
> React protège nativement contre le XSS en échappant les entrées utilisateur avant de les insérer dans le DOM. Cela signifie que si un utilisateur tente d’injecter du code malveillant, React va le considérer comme une simple chaîne de texte et non comme du code exécutable. Pour cette raison, il ne faut `jamais` utiliser `dangerouslySetInnerHTML` sans désinfection préalable avec une bibliothèque comme `DOMPurify`, qui nettoie les entrées et empêche l’exécution de scripts dangereux.

### 3️⃣ Désactivation de `multipleStatements` dans MySQL

Dans `server/database/client.ts`, trouve cette ligne :
```ts
multipleStatements: true, // Permet plusieurs requêtes dans une seule instruction
```
Remplace-la par :
```ts
multipleStatements: false,
```
✅ **Pourquoi ?**
> Laisser `multipleStatements: true` permet d'exécuter plusieurs requêtes SQL en une seule instruction, ce qui ouvre la porte à des attaques SQL Injection avancées. Par exemple, un utilisateur malveillant pourrait enchaîner plusieurs commandes dans une seule requête, ce qui peut aller jusqu’à supprimer toute la base de données (`DROP DATABASE`). Cette option est `désactivée par défaut` car elle supprime une couche de protection contre les injections SQL. En la désactivant, on s’assure que chaque requête est traitée individuellement et empêche toute tentative d’injection malveillante à travers une seule requête SQL.

---

## 🎉 Conclusion

Bravo, tu as sécurisé ton application contre les injections SQL et les attaques XSS ! 🚀

Ce workshop est une introduction aux vulnérabilités les plus courantes, mais la sécurité est un **vaste sujet**. Il existe encore **de nombreuses autres menaces** et **meilleures pratiques** à appliquer.

➡️ Continue d’explorer les bonnes pratiques en matière de sécurité web et pense à toujours **valider, échapper et filtrer** les entrées utilisateur ! 🔒

Bon apprentissage ! 💻

