// Script de test pour l'API backend
const http = require('http');

// Configuration
const API_HOST = 'localhost';
const API_PORT = 3000;

// Fonction pour effectuer une requête HTTP
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`\nRéponse de ${method} ${path}:`);
        console.log(`Status: ${res.statusCode}`);
        try {
          const parsedData = JSON.parse(responseData);
          console.log('Body:', JSON.stringify(parsedData, null, 2));
          resolve({ status: res.statusCode, data: parsedData });
        } catch (e) {
          console.log('Body:', responseData);
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`Erreur lors de la requête ${method} ${path}:`, error.message);
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Tests à exécuter
async function runTests() {
  console.log('=== DÉBUT DES TESTS API ===');
  
  try {
    // Test 1: Connexion avec un utilisateur existant
    console.log('\n=== Test 1: Connexion ===');
    const loginData = {
      email: 'admin@example.com',
      password: 'admin123'
    };
    const loginResponse = await makeRequest('POST', '/api/auth/login', loginData);
    const token = loginResponse.data.token;
    
    if (!token) {
      throw new Error('Échec de connexion: pas de token reçu');
    }
    
    // Test 2: Récupérer les meubles
    console.log('\n=== Test 2: Récupération des meubles ===');
    await makeRequest('GET', '/api/furniture');
    
    // Test 3: Récupérer les informations de l'utilisateur connecté
    console.log('\n=== Test 3: Informations utilisateur ===');
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
    const userInfoRequest = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`\nRéponse de GET /api/auth/me:`);
        console.log(`Status: ${res.statusCode}`);
        try {
          const parsedData = JSON.parse(data);
          console.log('Body:', JSON.stringify(parsedData, null, 2));
        } catch (e) {
          console.log('Body:', data);
        }
      });
    });
    
    userInfoRequest.on('error', (error) => {
      console.error('Erreur lors de la requête GET /api/auth/me:', error.message);
    });
    
    userInfoRequest.end();
    
    console.log('\n=== TESTS TERMINÉS AVEC SUCCÈS ===');
  } catch (error) {
    console.error('\n=== ERREUR PENDANT LES TESTS ===');
    console.error(error);
  }
}

// Lancer les tests
runTests(); 