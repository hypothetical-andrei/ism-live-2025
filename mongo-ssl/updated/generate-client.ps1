# Set strict mode for better error handling
Set-StrictMode -Version Latest

$CertsDir = "./certs" # Define the certs directory relative to the script's execution location

# Create the certificates directory if it doesn't exist
if (-not (Test-Path $CertsDir -PathType Container)) {
    Write-Host "Creating directory: $CertsDir"
    New-Item -ItemType Directory -Path $CertsDir | Out-Null
}

# Define the path to the openssl.cnf file
$OpenSslConfig = "$CertsDir/openssl.cnf"

# Ensure openssl.cnf exists
if (-not (Test-Path $OpenSslConfig)) {
    Write-Error "Error: openssl.cnf not found at $OpenSslConfig. Please create it first."
    exit 1
}


# --- Step 1: Generate Client Key and CSR ---
Write-Host "Generating MongoDB client key and CSR..."
$clientKeyPath = "$CertsDir/client-key.pem"
Write-Host "DEBUG: clientKeyPath defined as: '$clientKeyPath'" # Debugging line

$clientCsrPath = "$CertsDir/client.csr"
Write-Host "DEBUG: clientCsrPath defined as: '$clientCsrPath'" # Debugging line


try {
    openssl genrsa -out $clientKeyPath 4096
    if (-not (Test-Path $clientKeyPath) -or (Get-Item $clientKeyPath).Length -eq 0) {
        throw "Failed to create client key: $clientKeyPath"
    }
    Write-Host "Client key created: $clientKeyPath"

    # Use the config file for CSR generation and specify v3_req_client extensions
    openssl req -new -key $clientKeyPath -out $clientCsrPath -subj "/CN=ssluser" -reqexts v3_req_client -config $OpenSslConfig
    if (-not (Test-Path $clientCsrPath) -or (Get-Item $clientCsrPath).Length -eq 0) {
        throw "Failed to create client CSR: $clientCsrPath"
    }
    Write-Host "Client CSR created: $clientCsrPath"

} catch {
    Write-Error "Error during client key/CSR generation: $($_.Exception.Message)"
    exit 1 # Exit script on critical error
}


# --- Step 2: Sign Client Certificate with CA ---
Write-Host "Signing client certificate with CA..."
$caCertPath = "$CertsDir/ca.pem"
$caKeyPath = "$CertsDir/ca-key.pem"
$caSerialPath = "$CertsDir/ca.srl" # Use the same serial file as the server script
$clientCertPath = "$CertsDir/client.pem" # This variable needs to be correctly set
Write-Host "DEBUG: clientCertPath defined as: '$clientCertPath'" # Debugging line


# Crucial check: Ensure CA files exist before attempting to sign
if (-not (Test-Path $caCertPath) -or -not (Test-Path $caKeyPath)) {
    Write-Error "CA certificate ($caCertPath) or CA key ($caKeyPath) not found. Please ensure server certificates were generated first."
    exit 1 # Exit script if CA files are missing
}

# Ensure the CA serial file exists and is initialized (if not already by server script)
if (-not (Test-Path $caSerialPath) -or (Get-Content $caSerialPath | Measure-Object -Line).Lines -eq 0) {
    Write-Host "Initializing CA serial file: $caSerialPath"
    Set-Content $caSerialPath "01" # Start with serial 01 if file is new or empty
}

try {
    # Use the CA's serial file for signing. Removed -extensions and -config as they are invalid for x509.
    # The extensions should already be in the CSR.
    openssl x509 -req -in $clientCsrPath -CA $caCertPath -CAkey $caKeyPath -CAserial $caSerialPath -out $clientCertPath -days 365 2>&1 | Write-Host

    # --- Enhanced Validation for client.pem after openssl command ---
    if (-not (Test-Path $clientCertPath)) {
        throw "File $clientCertPath was not created by openssl command. Check openssl output for errors."
    }
    if ((Get-Item $clientCertPath).Length -eq 0) {
        throw "File $clientCertPath was created empty by openssl command. Check openssl output for errors."
    }
    Write-Host "Client certificate created: $clientCertPath"

} catch {
    Write-Error "Error during client certificate signing: $($_.Exception.Message)"
    Write-Error "Possible cause: Ensure 'openssl' command output is clean and the CA serial file ($caSerialPath) is writable."
    exit 1 # Exit script on critical error
}


# --- Step 3: Create Combined PEM for MongoDB Client ---
Write-Host "Creating combined PEM for MongoDB client..."
$clientCombinedPath = "$CertsDir/client-combined.pem"

# --- DEBUGGING: Print variable values before combining ---
Write-Host "DEBUG: clientCertPath value before combine check: '$clientCertPath'"
Write-Host "DEBUG: clientKeyPath value before combine check: '$clientKeyPath'"

# Ensure both individual client certificate and key exist before combining
# These paths should be set correctly if the previous steps succeeded.
if (-not (Test-Path $clientCertPath) -or -not (Test-Path $clientKeyPath)) {
    Write-Error "Client certificate ($clientCertPath) or client key ($clientKeyPath) missing for combination."
    exit 1
}

try {
    # This command concatenates client.pem and client-key.pem into client-combined.pem
    # It's crucial for the Node.js driver which expects both in one file.
    Get-Content $clientCertPath, $clientKeyPath | Set-Content $clientCombinedPath
    if (-not (Test-Path $clientCombinedPath) -or (Get-Item $clientCombinedPath).Length -eq 0) {
        throw "Failed to create combined client PEM: $clientCombinedPath"
    }
    Write-Host "Combined client PEM created: $clientCombinedPath"

} catch {
    Write-Error "Error creating combined client PEM: $($_.Exception.Message)"
    exit 1
}


# --- Step 4: Clean up temporary files ---
Write-Host "Cleaning up..."
try {
    Remove-Item $clientCsrPath -Force -ErrorAction SilentlyContinue # CSR is temporary
    Remove-Item $clientCertPath -Force -ErrorAction SilentlyContinue # Individual cert, now combined
    Remove-Item $clientKeyPath -Force -ErrorAction SilentlyContinue # Individual key, now combined
} catch {
    Write-Warning "Failed to clean up some temporary files. Check permissions if this persists."
}


Write-Host "Client certificates created in ${CertsDir}:"
Get-ChildItem $CertsDir
