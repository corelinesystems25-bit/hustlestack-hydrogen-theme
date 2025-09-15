# HustleStack - Premium Shopify Hydrogen Theme

A sophisticated, business-focused Shopify Hydrogen theme designed for entrepreneurs and growing businesses.

## Features

- **Premium Design**: Clean, professional aesthetic with subtle animations
- **Responsive**: Mobile-first design that works on all devices
- **Performance**: Built with Shopify Hydrogen for lightning-fast loading
- **Customizable**: Easy to customize colors, fonts, and layouts
- **SEO Optimized**: Built-in SEO best practices
- **Accessibility**: WCAG compliant design

## Tech Stack

- **Shopify Hydrogen**: React-based framework for headless commerce
- **Remix**: Full-stack web framework
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your Shopify store details
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```
NODE_ENV="development"
SESSION_SECRET="your-session-secret"
PUBLIC_STOREFRONT_API_TOKEN="your-storefront-api-token"
PRIVATE_STOREFRONT_API_TOKEN="your-private-storefront-api-token"
PUBLIC_STORE_DOMAIN="your-shop-name.myshopify.com"
PUBLIC_STOREFRONT_ID="your-storefront-id"
```

## Deployment

### Deploy to Shopify Oxygen

1. Connect your GitHub repository to Shopify Oxygen
2. Set up your environment variables in the Oxygen dashboard
3. Deploy automatically on push to main branch

### Deploy to Other Platforms

This theme can be deployed to any platform that supports Node.js applications:

- Vercel
- Netlify
- Railway
- Render

## Customization

### Colors

Edit the color palette in `tailwind.config.js`:

```js
colors: {
  primary: {
    // Your primary colors
  },
  // Add more custom colors
}
```

### Typography

Update fonts in `app/styles/app.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font');
```

### Layout

Modify the main layout in `app/components/Layout.tsx`

## Support

For support and customization requests, please contact the development team.

## License

This theme is proprietary software. All rights reserved.

