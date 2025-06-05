# Set strict mode for better error handling
Set-StrictMode -Version Latest

$CertsDir = "./certs"

# Create the certificates directory if it doesn't exist
if (-not (Test-Path $CertsDir -PathType Container)) {
    Write-Host "Creating directory: $CertsDir"
    New-Item -ItemType Directory -Path $CertsDir | Out-Null
}

# Define the path to the openssl.cnf file
$OpenSslConfig = "$CertsDir/openssl.cnf"

# Ensure openssl.cnf exists (you must create it manually or with a prior step)
if (-not (Test-Path $OpenSslConfig)) {
    Write-Error "Error: openssl.cnf not found at $OpenSslConfig. Please create it first."
    exit 1
}


Write-Host "Generating CA key and certificate..."
$caKeyPath = "$CertsDir/ca-key.pem"
$caCertPath = "$CertsDir/ca.pem"
$caSerialPath = "$CertsDir/ca.srl" # OpenSSL sometimes prefers explicit serial file

try {
    openssl genrsa -out $caKeyPath 4096
    if (-not (Test-Path $caKeyPath) -or (Get-Item $caKeyPath).Length -eq 0) {
        throw "Failed to create CA key: $caKeyPath"
    }
    Write-Host "CA key created: $caKeyPath"

    # Use the config file for CA generation and specify v3_ca extensions
    openssl req -new -x509 -days 365 -key $caKeyPath -out $caCertPath -subj "/CN=MyMongoCA" -extensions v3_ca -config $OpenSslConfig
    if (-not (Test-Path $caCertPath) -or (Get-Item $caCertPath).Length -eq 0) {
        throw "Failed to create CA certificate: $caCertPath"
    }
    Write-Host "CA certificate created: $caCertPath"

    # Initialize CA serial number (important for signing operations)
    # This creates a serial file if it doesn't exist, starting with 01
    If (-not (Test-Path $caSerialPath)) {
        Set-Content $caSerialPath "01"
        Write-Host "Initialized CA serial file: $caSerialPath"
    }

    Write-Host "CA key and certificate generated successfully."
} catch {
    Write-Error "Error during CA generation: $($_.Exception.Message)"
    exit 1
}


Write-Host "Generating MongoDB server key and CSR..."
$mongoKeyPath = "$CertsDir/mongo-key.pem"
$mongoCsrPath = "$CertsDir/mongo.csr"

try {
    openssl genrsa -out $mongoKeyPath 4096
    if (-not (Test-Path $mongoKeyPath) -or (Get-Item $mongoKeyPath).Length -eq 0) {
        throw "Failed to create MongoDB server key: $mongoKeyPath"
    }
    Write-Host "MongoDB server key created: $mongoKeyPath"

    # Use the config file for CSR generation and specify v3_req_server extensions
    # CN is explicitly set to localhost to match typical local MongoDB setups.
    openssl req -new -key $mongoKeyPath -out $mongoCsrPath -subj "/CN=localhost" -reqexts v3_req_server -config $OpenSslConfig
    if (-not (Test-Path $mongoCsrPath) -or (Get-Item $mongoCsrPath).Length -eq 0) {
        throw "Failed to create MongoDB server CSR: $mongoCsrPath"
    }
    Write-Host "MongoDB server key and CSR created successfully."
} catch {
    Write-Error "Error during server key/CSR generation: $($_.Exception.Message)"
    exit 1
}


Write-Host "Signing server certificate with CA..."
$mongoCertPath = "$CertsDir/mongo.pem"

# Crucial check: Ensure CA files and serial exist before attempting to sign
if (-not (Test-Path $caCertPath) -or -not (Test-Path $caKeyPath) -or -not (Test-Path $caSerialPath)) {
    Write-Error "CA certificate ($caCertPath), CA key ($caKeyPath), or CA serial ($caSerialPath) not found for signing. Please ensure CA was generated correctly."
    exit 1
}

try {
    # Get initial modification time of ca.srl for debugging
    $initialSerialModTime = (Get-Item $caSerialPath).LastWriteTime

    # Use the CA's serial file for signing. Removed -extensions and -config as they are invalid for x509.
    # The extensions should already be in the CSR.
    openssl x509 -req -in $mongoCsrPath -CA $caCertPath -CAkey $caKeyPath -CAserial $caSerialPath -out $mongoCertPath -days 365 2>&1 | Write-Host

    # --- NEW: Enhanced Validation for mongo.pem after openssl command ---
    if (-not (Test-Path $mongoCertPath)) {
        throw "File $mongoCertPath was not created by openssl command. Check openssl output for errors."
    }
    if ((Get-Item $mongoCertPath).Length -eq 0) {
        throw "File $mongoCertPath was created empty by openssl command. Check openssl output for errors."
    }
    Write-Host "Server certificate signed successfully: $mongoCertPath"

    # Check if ca.srl was updated
    Start-Sleep -Milliseconds 100 # Small delay to ensure timestamp updates
    $finalSerialModTime = (Get-Item $caSerialPath).LastWriteTime
    if ($finalSerialModTime -eq $initialSerialModTime) {
        Write-Warning "DEBUG: CA serial file ($caSerialPath) was NOT modified during signing. This could indicate a permissions issue or an OpenSSL problem."
    } else {
        Write-Host "DEBUG: CA serial file ($caSerialPath) was modified during signing."
    }


} catch {
    Write-Error "Error during server certificate signing: $($_.Exception.Message)"
    Write-Error "Possible cause: Ensure 'openssl' command output is clean and the CA serial file ($caSerialPath) is writable."
    exit 1
}


Write-Host "Creating combined PEM for MongoDB server..."
$mongoCombinedPath = "$CertsDir/mongo-combined.pem"

# Ensure both individual server certificate and key exist before combining
if (-not (Test-Path $mongoCertPath) -or -not (Test-Path $mongoKeyPath)) {
    Write-Error "Server certificate ($mongoCertPath) or server key ($mongoKeyPath) missing for combination."
    exit 1
}

try {
    Get-Content $mongoCertPath, $mongoKeyPath | Set-Content $mongoCombinedPath
    if (-not (Test-Path $mongoCombinedPath) -or (Get-Item $mongoCombinedPath).Length -eq 0) {
        throw "Failed to create combined server PEM: $mongoCombinedPath"
    }
    Write-Host "Combined PEM for MongoDB server created."
} catch {
    Write-Error "Error creating combined server PEM: $($_.Exception.Message)"
    exit 1
}


Write-Host "Cleaning up..."
try {
    Remove-Item $mongoCsrPath -Force -ErrorAction SilentlyContinue
    Remove-Item $mongoCertPath -Force -ErrorAction SilentlyContinue
    # It's generally recommended to keep ca-key.pem if you need to sign more certs later
    # Remove-Item $caKeyPath -Force -ErrorAction SilentlyContinue
    Remove-Item $mongoKeyPath -Force -ErrorAction SilentlyContinue
} catch {
    Write-Warning "Failed to clean up some temporary files. Check permissions if this persists."
}


Write-Host "Server certificates created in ${CertsDir}:"
Get-ChildItem $CertsDir
