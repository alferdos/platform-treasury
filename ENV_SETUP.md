# Environment Variables Setup

## Required Environment Variables

The following environment variables must be set in Railway for the application to work properly:

### Database Connection
- `CONNECTION_URL` - MongoDB connection string
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster1`

### Server Configuration
- `PORT` - Server port (default: 8080)
- `NODE_ENV` - Environment mode (production/development)

### Authentication Tokens
- `ACCESS_TOKEN_SECRET` - Secret key for JWT access tokens
- `REFRESH_TOKEN_SECRET` - Secret key for JWT refresh tokens

### Blockchain Configuration
- `BSC_NET` - BSC network RPC URL
  - Default: `https://bsc-dataseed1.binance.org:8545`
- `PRIVATE_KEY` - Blockchain private key (if needed)

## Setting Up in Railway

1. Go to your Railway project dashboard
2. Click on the **treasury-platform** service
3. Navigate to **Variables** section
4. Add each environment variable with its value
5. Click **Save**
6. Railway will automatically redeploy with the new variables

## Test Credentials

### Super Admin Account
- **Email:** superadmin@treasury.sa
- **Password:** SuperAdmin@2024
- **Role:** Admin (can access admin features)

### Property Agent Account
- **Email:** property.agent@treasury.sa
- **Password:** PropertyAgent@2024
- **Role:** Regular User (can add properties and trade)

## Deployment

After setting all environment variables in Railway:
1. Railway will automatically rebuild and deploy
2. Check the deployment logs for any errors
3. Test the login at https://platform.treasury.sa
