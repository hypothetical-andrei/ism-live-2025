// init-mongo.js

// IMPORTANT: This script runs as part of the Docker entrypoint.
// MongoDB needs to be running and accessible for this script to execute commands.
// Ensure your 'ssluser' client certificate has the Common Name (CN) 'ssluser'.

// Switch to the $external database, which is where X.509 users are managed.
// This database implicitly handles authentication mechanisms outside of MongoDB's
// internal authentication, such as X.509, Kerberos, or LDAP.
db = db.getSiblingDB("$external");

// Check if the user already exists to prevent errors on re-runs.
// If the user does not exist, createUser will be called.
// The user is identified by the Subject DN of their X.509 certificate.
// In our case, the Common Name (CN) is "ssluser".
const userExists = db.getUser("CN=ssluser");

if (!userExists) {
  print("Creating X.509 user 'ssluser'...");
  db.createUser(
    {
      user: "CN=ssluser", // This MUST match the Common Name (CN) from your client-combined.pem certificate
                          // For a more complete match, you might use the full subject DN, e.g.,
                          // "CN=ssluser,OU=IT,O=MyOrg,L=MyCity,ST=MyState,C=US"
                          // Obtain this using: openssl x509 -in client.pem -subject -nameopt RFC2253
      roles: [
        // Assign appropriate roles. For demonstration, 'readWriteAnyDatabase' and 'userAdminAnyDatabase' are given.
        // Adjust these roles based on the principle of least privilege for your application.
        { role: "readWriteAnyDatabase", db: "admin" }, // Allows read/write operations on any database
        { role: "userAdminAnyDatabase", db: "admin" }  // Allows user administration on any database
      ],
      // Specify MONGODB-X509 as the authentication mechanism.
      // This tells MongoDB to authenticate this user based on their X.509 certificate.
      mechanisms: ["MONGODB-X509"]
    }
    // Removed 'writeConcern' option as it's causing an "unknown field" error in MongoDB 7.
    // This option might not be supported or has changed syntax for createUser in newer MongoDB versions.
  );
  print("X.509 user 'ssluser' created successfully.");
} else {
  print("X.509 user 'ssluser' already exists. Skipping creation.");
  // You might want to update roles here if they change, but for simple user creation,
  // skipping is often sufficient.
}

// Exit the script (optional, as it's typically the last command in initdb.d)
// quit();
