# 🐼 Panda Adventure App

A magical interactive web application featuring a lovable panda character with AI-powered voice, 3D models, and premium content subscriptions.

## 🌟 Features

- **Interactive Panda Character**: Name your panda and watch it respond with different moods
- **AI-Powered Voice**: ElevenLabs integration for realistic panda speech
- **3D Model Preview**: Interactive 3D panda model (requires Supabase storage setup)
- **User Authentication**: Secure login/signup system via Supabase
- **Premium Subscriptions**: Stripe-powered subscription system for exclusive content
- **Responsive Design**: Beautiful UI with animations and glass morphism effects
- **Modern Tech Stack**: Next.js 13, TypeScript, Tailwind CSS, Framer Motion

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **Git** for version control
- Accounts for the following services:
  - [Supabase](https://supabase.com) (free tier available)
  - [Stripe](https://stripe.com) (free for testing)
  - [ElevenLabs](https://elevenlabs.io) (free tier available)
  - [Netlify](https://netlify.com) (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd panda-experience
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env.local` file in the root directory with these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# ElevenLabs Configuration
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Webhook Configuration (for production)
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## 🗄️ Supabase Integration

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization and fill in project details
4. Wait for the project to be created (usually takes 2-3 minutes)

### Step 2: Get Project Credentials

1. In your Supabase dashboard, go to **Settings > API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Set Up Authentication

1. Go to **Authentication > Settings** in your Supabase dashboard
2. **Site URL**: Set to `http://localhost:3000` for development
3. **Email confirmation**: Disable for easier testing (optional)
4. **Additional redirect URLs**: Add your production URL when ready

### Step 4: Run Database Migrations

The project includes pre-configured database migrations. To apply them:

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase (if not already done):
   ```bash
   supabase login
   supabase init
   ```

3. Link to your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Apply migrations:
   ```bash
   supabase db push
   ```

### Step 5: Set Up Storage (Optional - for 3D Model)

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket named `media`
3. Set the bucket to **Public**
4. Upload Policy: Allow public uploads (optional)
5. Upload the `tbd.glb` file to the root of the `media` bucket

**Storage Bucket Policy Example:**
```sql
-- Allow public read access to media bucket
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'media');
```

## 💳 Stripe Integration

### Step 1: Create Stripe Account

1. Sign up at [Stripe Dashboard](https://dashboard.stripe.com)
2. Complete account verification
3. Switch to **Test Mode** for development

### Step 2: Get API Keys

1. Go to **Developers > API Keys**
2. Copy these keys:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### Step 3: Create Products and Prices

1. Go to **Products** in Stripe dashboard
2. Click **Add Product**
3. Fill in product details:
   - **Name**: "Adventure Pack"
   - **Description**: "Premium panda content subscription"
4. Add pricing:
   - **Price**: $9.99
   - **Billing**: Monthly recurring
   - **Currency**: USD
5. Copy the **Price ID** and update `src/stripe-config.ts`

### Step 4: Set Up Webhooks (Production Only)

1. Go to **Developers > Webhooks**
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the **Webhook Secret** → `STRIPE_WEBHOOK_SECRET`

## 🎵 ElevenLabs Integration

### Step 1: Create ElevenLabs Account

1. Sign up at [ElevenLabs](https://elevenlabs.io)
2. Verify your email
3. Choose a plan (free tier includes 10,000 characters/month)

### Step 2: Get API Key

1. Go to **Settings > API Keys**
2. Create a new API key
3. Copy the key → `NEXT_PUBLIC_ELEVENLABS_API_KEY`

### Step 3: Voice Configuration

The app is pre-configured to use voice ID: `E95NigJoVU5BI8HjQeN3`

To use a different voice:
1. Browse voices in the ElevenLabs dashboard
2. Copy the voice ID
3. Update the `ELEVENLABS_VOICE_ID` in `lib/elevenlabs.ts`

## 🛠️ Development

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Key Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Testing Integrations

1. **Authentication**: Try signing up with a test email
2. **Voice**: Click on the panda to test ElevenLabs integration
3. **Payments**: Use Stripe test card: `4242 4242 4242 4242`
4. **3D Model**: Ensure the GLB file is uploaded to Supabase storage

## 🚢 Deployment

### Netlify Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `out`
   - Add environment variables in Netlify dashboard

### Environment Variables for Production

In your Netlify dashboard, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_production_stripe_key
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_key
STRIPE_SECRET_KEY=your_production_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### Post-Deployment Setup

1. **Update Supabase Site URL**:
   - Go to Authentication > Settings
   - Update Site URL to your production domain

2. **Configure Stripe Webhooks**:
   - Update webhook endpoint to production URL
   - Test webhook delivery

3. **Test All Features**:
   - Authentication flow
   - Voice generation
   - Payment processing
   - 3D model loading (if enabled)

## 📁 Project Structure

```
├── app/                     # Next.js app router pages
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # User dashboard
│   ├── success/            # Payment success page
│   └── page.tsx            # Home page
├── components/             # Reusable components
│   ├── 3d/                # 3D model components
│   ├── ui/                # UI components (shadcn/ui)
│   ├── header.tsx         # Navigation header
│   ├── panda-avatar.tsx   # Panda character component
│   └── voice-controls.tsx # Voice control interface
├── hooks/                 # Custom React hooks
│   └── use-voice.ts       # Voice generation hook
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client
│   ├── stripe.ts          # Stripe configuration
│   ├── elevenlabs.ts      # ElevenLabs integration
│   └── utils.ts           # General utilities
├── src/                   # Source configuration
│   └── stripe-config.ts   # Stripe product configuration
├── supabase/              # Supabase configuration
│   ├── functions/         # Edge functions
│   └── migrations/        # Database migrations
└── public/                # Static assets
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Supabase Connection Issues
**Error**: `Failed to connect to Supabase`
**Solution**: 
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check if your Supabase project is active
- Ensure RLS policies are properly configured

#### 2. Stripe Webhook Errors
**Error**: `Webhook signature verification failed`
**Solution**:
- Verify `STRIPE_WEBHOOK_SECRET` matches your Stripe dashboard
- Check webhook endpoint URL is correct
- Test webhook delivery in Stripe dashboard

#### 3. ElevenLabs Voice Issues
**Error**: `Voice not configured`
**Solution**:
- Verify `NEXT_PUBLIC_ELEVENLABS_API_KEY` is correct
- Check your ElevenLabs account has remaining credits
- Ensure voice ID exists and is accessible

#### 4. 3D Model Loading Issues
**Error**: `GLB file not accessible`
**Solution**:
- Verify `tbd.glb` is uploaded to Supabase storage
- Check the `media` bucket is public
- Ensure proper storage policies are set

#### 5. Build Errors
**Error**: `Type error` or `Cannot find module`
**Solution**:
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript configuration
- Verify all imports are correct

### Debug Mode

Enable debug logging by adding to your `.env.local`:
```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## 🎨 Customization

### Changing the Panda Character

1. Replace `public/tbd.png` with your character image
2. Update `public/tbd-logo.png` for the header logo
3. Replace `public/tbd.glb` in Supabase storage for the 3D model

### Modifying Voice Settings

Edit `lib/elevenlabs.ts` to adjust:
- Voice stability
- Similarity boost
- Speaking style
- Voice ID

### Updating Color Scheme

The app uses Tailwind CSS. Update colors in:
- `tailwind.config.ts` for theme colors
- `app/globals.css` for custom CSS variables
- Component files for specific styling

### Adding New Features

1. Create new components in `components/`
2. Add API routes in `app/api/`
3. Update database schema with new migrations
4. Add new environment variables as needed

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review the documentation for each integration service

---

Made with ❤️ by [JULDD LLC](https://juldd.me)