# Security Notice

This repository intentionally omits sensitive configuration files to prevent accidental exposure of API keys. The `appwrite.json` file is not included in the repository for security reasons.

To deploy this project:

1. Create a new appwrite.json configuration file
2. Add your security-sensitive keys through Appwrite environment variables
3. Never commit API keys to version control

# Security Best Practices

## Environment Variables
All sensitive credentials should be stored in Appwrite Console. Never commit actual API keys to git.

### Required Server Variables:
- `TAVUS_API_KEY`
- `OPENAI_API_KEY`
- `APPWRITE_API_KEY`

### Adding Variables in Appwrite:
1. Open project in Appwrite Console
2. Go to Settings > Environment Variables
3. Add each secret with production values
