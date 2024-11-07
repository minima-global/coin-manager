import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const packageJsonPath = path.join(__dirname, "..", "package.json")
const envFilePath = path.join(__dirname, "..", ".env")
const dappConfPath = path.join(__dirname, "..", "public", "dapp.conf")

const packageJsonAsString = fs.readFileSync(packageJsonPath, "utf-8")
const packageJson = JSON.parse(packageJsonAsString)
const version = packageJson.version

// Read the current .env file
let envContent = fs.readFileSync(envFilePath, "utf-8")

// Update or add the VITE_APP_VERSION
const versionRegex = /^VITE_APP_VERSION=.*/m
if (versionRegex.test(envContent)) {
  // Replace existing VITE_APP_VERSION
  envContent = envContent.replace(versionRegex, `VITE_APP_VERSION=${version}`)
} else {
  // Add VITE_APP_VERSION if it doesn't exist
  envContent += `\nVITE_APP_VERSION=${version}`
}

// Write the updated content back to .env
fs.writeFileSync(envFilePath, envContent)

// Update dapp.conf
let dappConfContent = fs.readFileSync(dappConfPath, "utf-8")
const dappConfJson = JSON.parse(dappConfContent)
dappConfJson.version = version
fs.writeFileSync(dappConfPath, JSON.stringify(dappConfJson, null, 2))

// Output the version to stdout (keeping the original functionality)
process.stdout.write(`${version}`)
