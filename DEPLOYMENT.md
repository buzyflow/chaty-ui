# Deploying BizyFlow to Render

This guide will help you deploy your BizyFlow application to Render.

## Prerequisites

- A Render account (sign up at https://render.com)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Firebase project credentials
- Gemini API key

## Step 1: Prepare Your Repository

1. Make sure all your code is committed to Git:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. Ensure you have a `render.yaml` file in your project root (already created)

## Step 2: Create a New Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your Git repository:
   - Click **"Connect account"** if you haven't already
   - Select your repository from the list
   - Click **"Connect"**

## Step 3: Configure Your Service

Fill in the following settings:

### Basic Settings
- **Name**: `bizyflow` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty
- **Runtime**: `Node`

### Build & Deploy Settings
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview`

### Instance Type
- **Free** (for testing) or **Starter** ($7/month for production)

## Step 4: Add Environment Variables

Click **"Advanced"** and add these environment variables:

### Firebase Configuration
Get these from your Firebase Console → Project Settings → General

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Gemini API Key
Get this from Google AI Studio (https://makersuite.google.com/app/apikey)

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build your app
   - Deploy it

3. Wait for the deployment to complete (usually 2-5 minutes)

## Step 6: Update Firebase Settings

After deployment, you need to add your Render domain to Firebase:

1. Go to Firebase Console → Authentication → Settings
2. Under **"Authorized domains"**, click **"Add domain"**
3. Add your Render URL: `your-app-name.onrender.com`

## Step 7: Test Your Deployment

1. Click the URL shown in Render dashboard (e.g., `https://bizyflow.onrender.com`)
2. Test the following:
   - Landing page loads
   - Sign up/Login works
   - Dashboard displays
   - Chat functionality works
   - Product management works
   - Orders work

## Troubleshooting

### Build Fails
- Check the build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### Environment Variables Not Working
- Make sure all variable names start with `VITE_`
- Check for typos in variable names
- Restart the service after adding variables

### Firebase Authentication Errors
- Verify authorized domains in Firebase Console
- Check that all Firebase env variables are correct
- Ensure Firebase project is in production mode

### App Loads but Features Don't Work
- Check browser console for errors
- Verify all API keys are correct
- Check Render logs for server errors

## Updating Your App

To deploy updates:

1. Make changes to your code
2. Commit and push to Git:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. Render will automatically detect changes and redeploy

## Custom Domain (Optional)

To use your own domain:

1. In Render dashboard, go to your service
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain and follow DNS instructions
4. Add the custom domain to Firebase authorized domains

## Monitoring

- **Logs**: View in Render dashboard → Logs tab
- **Metrics**: Check CPU/Memory usage in Metrics tab
- **Alerts**: Set up in Render dashboard → Notifications

## Cost Optimization

### Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free

### Upgrade to Starter ($7/month)
- Always-on service
- No spin-down delays
- Better performance
- Custom domains

## Support

If you encounter issues:
- Check Render documentation: https://render.com/docs
- Firebase documentation: https://firebase.google.com/docs
- Gemini API docs: https://ai.google.dev/docs

## Security Checklist

- ✅ All API keys stored as environment variables
- ✅ `.env.local` added to `.gitignore`
- ✅ Firebase security rules configured
- ✅ HTTPS enabled (automatic on Render)
- ✅ Authorized domains configured in Firebase

---

**Your app should now be live at**: `https://your-app-name.onrender.com`

Enjoy your deployed BizyFlow! 🚀
