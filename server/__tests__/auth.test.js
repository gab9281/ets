const request = require('supertest');
const AuthConfig = require('../config/auth.js');

const mockConfig = {
    "auth": {
        "passportjs": [
            {
                "provider1": {
                    "type": "oauth",
                    "OAUTH_AUTHORIZATION_URL": "https://www.testurl.com/oauth2/authorize",
                    "OAUTH_TOKEN_URL": "https://www.testurl.com/oauth2/token",
                    "OAUTH_CLIENT_ID": "your_oauth_client_id",
                    "OAUTH_CLIENT_SECRET": "your_oauth_client_secret",
                    "OAUTH_CALLBACK_URL": "https://localhost:3000/auth/provider/callback",
                    "OAUTH_ADD_SCOPE": "scopes",
                    "OAUTH_ROLE_TEACHER_VALUE": "teacher-claim-value",
                    "OAUTH_ROLE_STUDENT_VALUE": "student-claim-value"
                }
            },
            {
                "provider2": {
                    "type": "oidc",
                    "OIDC_CLIENT_ID": "your_oidc_client_id",
                    "OIDC_CLIENT_SECRET": "your_oidc_client_secret",
                    "OIDC_ISSUER_URL": "https://your-issuer.com",
                    "OIDC_CALLBACK_URL": "http://localhost:3000/auth/oidc/callback"
                }
            }
        ],
        "simple-login": {
            "enabled": true,
            "name": "provider3",
            "SESSION_SECRET": "your_session_secret"
        }
    }
};

// Créez une instance de AuthConfig en utilisant la configuration mockée
describe('AuthConfig Class Tests', () => {
    let authConfigInstance;

    // Initialisez l'instance avec la configuration mockée
    beforeAll(() => {
        authConfigInstance = new AuthConfig();
        authConfigInstance.loadConfigTest(mockConfig); // On injecte la configuration mockée
    });

    it('devrait retourner la configuration PassportJS', () => {
        const config = authConfigInstance.getPassportJSConfig();
        expect(config).toHaveProperty('provider1');
        expect(config).toHaveProperty('provider2');
    });

    it('devrait retourner la configuration Simple Login', () => {
        const config = authConfigInstance.getSimpleLoginConfig();
        expect(config).toHaveProperty('name', 'provider3');
        expect(config).toHaveProperty('SESSION_SECRET', 'your_session_secret');
    });

    it('devrait retourner les providers OAuth', () => {
        const oauthProviders = authConfigInstance.getOAuthProviders();
        expect(Array.isArray(oauthProviders)).toBe(true);
        expect(oauthProviders.length).toBe(1);  // Il y a un seul provider OAuth
        expect(oauthProviders[0]).toHaveProperty('provider1');
    });

    it('devrait valider la configuration des providers', () => {
        expect(() => authConfigInstance.validateProvidersConfig()).not.toThrow();
    });

    it('devrait lever une erreur si une configuration manque', () => {
        const invalidMockConfig = {
            "auth": {
                "passportjs": [
                    {
                        "provider1": {
                            "type": "oauth",
                            "OAUTH_CLIENT_ID": "your_oauth_client_id"  // Il manque des champs nécessaires
                        }
                    }
                ]
            }
        };

        const instanceWithInvalidConfig = new AuthConfig();
        instanceWithInvalidConfig.loadConfigTest(invalidMockConfig);

        // Vérifiez que l'erreur est lancée avec les champs manquants corrects
        expect(() => instanceWithInvalidConfig.validateProvidersConfig()).toThrow(
            new Error(`Configuration invalide pour les providers suivants : [
  {
    "provider": "provider1",
    "missingFields": [
      "OAUTH_AUTHORIZATION_URL",
      "OAUTH_TOKEN_URL",
      "OAUTH_CLIENT_SECRET",
      "OAUTH_CALLBACK_URL"
    ]
  }
]`)
        );
    });
});