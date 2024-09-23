const fs = require('fs');
const path = require('path');

class AuthConfig {

  constructor(configPath) {
    this.configPath = configPath;
    this.config = this.loadConfig();
  }

  // Méthode pour lire le fichier de configuration JSON
  loadConfig() {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf-8');
      return JSON.parse(configData);
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier de configuration :", error);
      return null;
    }
  }

  // Méthode pour retourner la configuration des fournisseurs PassportJS
  getPassportJSConfig() {
    if (this.config && this.config.auth && this.config.auth.passportjs) {
      const passportConfig = {};

      this.config.auth.passportjs.forEach(provider => {
        const providerName = Object.keys(provider)[0];
        passportConfig[providerName] = provider[providerName];
      });

      return passportConfig;
    } else {
      return { error: "Aucune configuration PassportJS disponible." };
    }
  }

  // Méthode pour retourner la configuration de Simple Login
  getSimpleLoginConfig() {
    if (this.config && this.config.auth && this.config.auth["simple-login"]) {
      return this.config.auth["simple-login"];
    } else {
      return { error: "Aucune configuration Simple Login disponible." };
    }
  }
}

// Utilisation de la classe ConfigManager
const configPath = path.join(__dirname, './auth_config.json');
const instance = new AuthConfig(configPath);
module.exports = instance;

