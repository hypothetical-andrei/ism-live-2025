#!/bin/bash

set -e

CERTS_DIR="./certs"
mkdir -p "$CERTS_DIR"
cd "$CERTS_DIR"

echo "🔐 Generating CA key and certificate..."
openssl genrsa -out ca-key.pem 4096
openssl req -new -x509 -days 365 -key ca-key.pem -out ca.pem -subj "/CN=MyMongoCA"

echo "🔐 Generating MongoDB server key and CSR..."
openssl genrsa -out mongo-key.pem 4096
openssl req -new -key mongo-key.pem -out mongo.csr -subj "/CN=localhost"

echo "✅ Signing server certificate with CA..."
openssl x509 -req -in mongo.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out mongo.pem -days 365

echo "📝 Creating combined PEM for MongoDB server..."
cat mongo.pem mongo-key.pem > mongo-combined.pem

echo "🧹 Cleaning up..."
rm -f mongo.csr
rm -f mongo.pem
rm -f ca-key.pem  # Optional: remove if you don’t need to keep the private CA
rm -f mongo-key.pem

echo "🎉 Certificates created in $CERTS_DIR:"
cd ..
ls -l "$CERTS_DIR"
