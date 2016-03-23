# [Foundation pour les sites internet](http://foundation.zurb.com)

[![npm version](https://badge.fury.io/js/foundation-sites.svg)](https://badge.fury.io/js/foundation-sites) [![Bower version](https://badge.fury.io/bo/foundation-sites.svg)](https://badge.fury.io/bo/foundation-sites) [![Gem Version](https://badge.fury.io/rb/foundation-rails.svg)](https://badge.fury.io/rb/foundation-rails) [![devDependency Status](https://david-dm.org/zurb/foundation-sites/dev-status.svg)](https://david-dm.org/zurb/foundation-sites#info=devDependencies) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/zurb/foundation-sites?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Fondation est le framework responsive front-end le plus avancé au monde. Avec lui, passez rapidement du prototype à la production, en créant des sites ou des applications qui fonctionnent sur tout type d'appareil.
Foundation inclut une grille entièrement personnalisable et adaptable à tout type d'écran, une grande bibliothèque de mixins Sass (pre-processeur CSS), des extensions JavaScript couramment utilisés, et un support total de l'accessibilité.

## Démarrage

La manière la plus rapide de démarrer avec Foundation est d'utiliser la [version CSS basique (à télécharger ici)](http://foundation.zurb.com/sites/download/). Vous pouvez télécharger des versions de Foundation différentes : avec tous les composants, seulement les essentiels ou une version personnalisée.

Si vous êtes un utilisateur Sass, Foundation dispose de modèles de démarrage, le [Modèle de base (Basic Template)](https://github.com/zurb/foundation-sites-template) et le [ZURB Template](https://github.com/zurb/foundation-zurb-template). Vous pouvez les installer manuellement en téléchargeant depuis GitHub, ou en utilisant l'Interface de commande en ligne [Foundation CLI](https://github.com/zurb/foundation-cli).

Enfin, si vous réalisez votre propre installation, vous pouvez installer Foundation en passant par une variété de gestionnaires de [gestionaires de packages](http://foundation.zurb.com/sites/docs/installation.html#package-managers).

## Documentation

La documentation est disponible à l'adresse <https://foundation.zurb.com/sites/docs>. Pour disposer de la version locale de la documentation sur votre machine, vous aurez besoin d'installer [Node.js](https://nodejs.org/en/) et [Ruby](https://www.ruby-lang.org/en/) sur votre ordinateur. (Votre version de Node.js doit être supérieure ou égale à la version 0.12.)

Lancez ces commandes pour installer la documentation sur votre machine:

```bash
git clone https://github.com/zurb/foundation-sites
cd foundation-sites
gem install scss-lint
npm install
```

Ensuite lancer `npm start` pour compiler la documentation. Quand cela est fini, une fenêtre de navigateur qui affichera la documentation s'ouvrira. Cette page pointera vers un serveur BrowserSync.

## Testing

Foundation dispose de trois types de tests : JavaScript, Sass, and visual regression. Referrez-vous à notre [Guide de tests](https://github.com/zurb/foundation-sites/wiki/Testing-Guide) pour plus de détails.

Voici les commandes qui exécuterons les différents tests:

- `npm run test:sass`
- `npm run test:javascript`
- `npm run test:visual`

## Contribuer

Jettez un coup d'oeil à notre [guide de contribution](http://foundation.zurb.com/develop/contribute.html) pour apprendre comment vous pouvez contribuer au développement de Foundation. Vous pouvez également parcourir l'étiquette [Help Wanted](https://github.com/zurb/foundation-sites/labels/help%20wanted) de notre tracker de problèmes pour trouver ce qu'il faut faire.

Copyright (c) 2016 ZURB, inc.
