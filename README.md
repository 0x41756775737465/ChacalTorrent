# ChacalTorrentInterface

Ce projet est une interface simplifiée pour le téléchargement de fichiers .torrent sur un serveur. Il est conçu pour faciliter le processus de téléchargement de fichiers .torrent et d'organisation des données associées. Veuillez noter que ce projet n'encourage en aucun cas les téléchargements illégaux. Il est à but éducatif et de découverte. L'utilisateur est responsable de l'utilisation légale de ce projet.

Ce projet est découpé en plusieurs parties :

- **Interface Web Vue.js** : Une interface utilisateur construite avec Vue.js pour rentrer le fichier .torrent à télécharger ainsi que les informations nécéssaire du média concerné.

- **Outil d'organisation en Python** : Une partie du projet écrite en Python pour l'organisation des fichiers après leur téléchargement. Cette partie peut être personnalisée en fonction des besoins de l'utilisateur.

Veuillez noter que l'utilisateur est responsable de la mise en place d'un système de téléchargement. Ce projet ne prend pas en charge cette fonctionnalité.

## Architecture logiciel

![Architecture logiciel Chacal Torrent](Archi_ChacalTorrent.svg)

## Guide d'installation et de lancement du projet ChacalTorrent

Ce guide vous aidera à démarrer le projet ChacalTorrent sur une machine vierge. Assurez-vous d'avoir les privilèges d'administrateur et une connexion Internet active pour effectuer toutes les étapes.

### Prérequis

Avant de commencer, assurez-vous que votre système dispose des éléments suivants installés :

- [Docker](https://www.docker.com/get-started) : Utilisé pour la gestion des conteneurs et le déploiement de l'application.
- [Git](https://git-scm.com/) : Pour cloner le dépôt du projet.

### Instructions

1. **Cloner le dépôt du projet** :

    Ouvrez un terminal et exécutez la commande suivante :
    ```
    git clone https://github.com/ChacalTordu/ChacalTorrent.git
    ```

2. **Accéder au répertoire du projet** :

    ```
    cd ChacalTorrent
    ```
3. **Éditer le fichier de configuration `config/path.json` (optionnel)** :

    Utilisez un éditeur de texte pour modifier le fichier `config/path.json` et configurez les dossiers selon vos besoins.
    
    Exemple:
    ```
    nano ChacalFileManagement/config/path.json 
    ```

4. **Construire l'image Docker** :

    ```
    docker build -t chacaltorrent .
    ```

5. **Démarrer le conteneur Docker** :
    Cette commande démarre le conteneur Docker et expose le port 1998 sur votre machine hôte.

    ```
    docker run -p 1998:1998 chacaltorrent
    ```

6. **Accéder à l'application** :

    Ouvrez un navigateur web et accédez à l'URL suivante :
    ```
    http://localhost:1998
    ```
