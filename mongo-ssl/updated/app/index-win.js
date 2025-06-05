import { MongoClient } from "mongodb";
import fs from "fs";

// Define the paths to your certificate files relative to where the script is run.
// Ensure these paths are correct.
const caFilePath = "../certs/ca.pem";
const clientCombinedFilePath = "../certs/client-combined.pem";

// Verify that the necessary certificate files exist before attempting to read them.
if (!fs.existsSync(caFilePath)) {
  console.error(`❌ Error: CA certificate file not found at ${caFilePath}`);
  process.exit(1); // Exit if the CA file is missing
}
if (!fs.existsSync(clientCombinedFilePath)) {
  console.error(`❌ Error: Client combined certificate/key file not found at ${clientCombinedFilePath}`);
  process.exit(1); // Exit if the client cert/key file is missing
}

// Connection URI for MongoDB.
// IMPORTANT: Removed 'ssluser:sslpass' as X.509 authentication does not use passwords in the URI.
// Added 'authMechanism=MONGODB-X509' to explicitly tell the driver to use X.509 authentication.
// FIX: Changed 'authSource=admin' to 'authSource=$external' as required by MONGODB-X509.
const uri = "mongodb://127.0.0.1:27017/?tls=true&authSource=$external&authMechanism=MONGODB-X509";

// Create a new MongoClient instance with TLS options.
const client = new MongoClient(uri, {
  // tlsCAFile: Path to the Certificate Authority file to verify the server's certificate.
  // This tells the Node.js driver which CA issued the server's certificate.
  tlsCAFile: caFilePath,

  // tlsCertificateKeyFile: Path to the client's certificate and private key combined in one .pem file.
  // This is essential for mutual TLS (mTLS), where the client presents its identity to the server.
  tlsCertificateKeyFile: clientCombinedFilePath,

  // tlsAllowInvalidCertificates: Set to true to allow self-signed certificates in the chain.
  // This is often necessary when using custom or self-signed CAs in development environments,
  // as standard trust stores might not recognize your CA.
  // DO NOT use in production environments unless you fully understand the security implications.
  tlsAllowInvalidCertificates: true,

  // Optional: If your client's private key (within client-combined.pem) is encrypted, provide the password here.
  // tlsCertificateKeyFilePassword: "your_password_if_key_is_encrypted",

  // tlsAllowInvalidHostnames: This is often needed if your server certificate CN is 'localhost'
  // and you are connecting to '127.0.0.1'.
  tlsAllowInvalidHostnames: true,
});

// Asynchronous function to connect to MongoDB and perform operations.
async function connectToMongo() {
  try {
    console.group('Trying to connect to MongoDB...');
    await client.connect();
    console.log("✅ Connected successfully over SSL!");

    // List databases to confirm connection and authentication.
    const dbs = await client.db().admin().listDatabases();
    console.log("📦 Databases:", dbs.databases.map(db => db.name));

  } catch (err) {
    console.error("❌ Connection error:", err);
    // Provide more specific error details if available
    if (err.name === 'MongoServerSelectionError') {
      console.error("   MongoDB server selection error. Check server status, network, and certificate configurations. Also, ensure your server is listening on '127.0.0.1'.");
    } else if (err.message.includes('self-signed certificate in certificate chain')) {
      console.error("   This error often occurs with self-signed certificates. Ensure 'tlsAllowInvalidCertificates: true' is set on the client, and that the CA file is correctly provided.");
    } else if (err.message.includes('no SSL certificate provided by peer')) {
      console.error("   The server is expecting a client certificate, but none was provided or it was invalid. Ensure 'tlsCertificateKeyFile' is correctly set on the client and contains both cert and key.");
    } else if (err.message.includes('connection closed')) {
      console.error("   The connection was closed by the server. This can be due to a TLS handshake failure, hostname mismatch, or immediate authentication rejection. Check MongoDB server logs for more details.");
    } else if (err.name === 'MongoServerError' && err.codeName === 'AuthenticationFailed') {
        console.error("   Authentication failed. Double-check that the 'ssluser' exists in MongoDB, that its 'mechanisms' include 'MONGODB-X509', and that the Common Name (CN) in your client certificate matches the user defined in MongoDB.");
    }
  } finally {
    // Ensure the client connection is closed when done or an error occurs.
    await client.close();
    console.groupEnd(); // End the console group
    console.log("Connection closed.");
  }
}

// Call the main connection function.
connectToMongo();
