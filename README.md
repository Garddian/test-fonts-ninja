# TEST Fonts Ninja

## Code source
tout le code source est dans le répertoire [./src](./src)

## Script SQL

Le script de création de la base est dans [./init/sql/articles.sql](./init/sql/articles.sql)

Pour la requête pour récupérer les articles par ordres décroissant de date sur les 7 derniers jours je propose cette requête : 
```sql
SELECT *
FROM articles
WHERE publicationDate >= (now() - INTERVAL 7 DAY)
ORDER BY publicationDate
```

## Docker
J'ai 2 dockerfiles : 
- Dockerfile : production
- Dockerfile.dev : développement

## lancement de l'application
Il faut se mettre à la racine de projet de lancer la commande : 
```shell
docker-compose up --build -d
```

Pour voir les logs : 
```shell
docker-compose logs -f
```