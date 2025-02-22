// utils/verifyToken.js
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
// import { useRuntimeConfig } from '#imports';

let client;

function getClient() {
  if (!client) {
    const config = useRuntimeConfig();
    // Derive the JWKS URI by replacing 'token' with 'certs'
    const jwksUri = config.keycloak.idpEndpoint.replace(/token$/, 'certs');
    client = jwksClient({ jwksUri });
  }
  return client;
}

function getKey(header, callback) {
  const client = getClient();
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

/**
 * Verifies a JWT token using Keycloak's JWKS.
 * @param {string} token - The JWT token to verify.
 * @returns {Promise<any>} - Resolves with the decoded token payload.
 */
export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {}, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}
