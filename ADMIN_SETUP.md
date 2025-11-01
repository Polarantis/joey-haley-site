# Joey Haley Gallery Admin Setup

## Environment Variables Required

Add these to your Cloudflare Pages dashboard:

### 1. ADMIN_PASSWORD
Set a secure password for admin access:
```
ADMIN_PASSWORD=your-secure-password-here
```

### 2. GALLERY_CONFIG (KV Namespace)
Create a KV namespace for storing gallery configuration:

1. Go to Cloudflare Dashboard → Workers & Pages → KV
2. Create a new namespace called `gallery-config`  
3. In your Pages project → Settings → Functions
4. Add KV binding:
   - Variable name: `GALLERY_CONFIG`
   - KV namespace: `gallery-config`

## Admin Interface Usage

### Access
- URL: `https://joey-haley-site.pages.dev/admin.html`
- Hidden from main navigation for security

### Features
- **Mobile-first design** - Optimized for phone use
- **Drag and drop reordering** - Touch-friendly on mobile
- **Move to Top/Bottom buttons** - Quick repositioning
- **Live gallery updates** - Changes appear immediately on site
- **Featured images** - First 9 images show on homepage

### How It Works
1. Login with your admin password
2. See current gallery order with image previews
3. Drag items to reorder OR use Top/Bottom buttons
4. Click "Save" to update the live gallery
5. Changes appear immediately on your website

## Technical Details

The admin interface:
- Loads current images from R2 bucket via `/api/gallery`
- Saves custom ordering to Cloudflare KV storage via `/api/admin/gallery-config`
- Main gallery API checks for admin configuration and uses it if available
- Falls back to default `hero1`, `hero2`, `hero3` ordering if no admin config exists

## Files Added/Modified

- `admin.html` - Simple mobile admin interface
- `functions/api/admin/auth.js` - Password authentication
- `functions/api/admin/gallery-config.js` - Save/load gallery configuration  
- `functions/api/gallery.js` - Updated to use admin configuration

## Security

- Admin page hidden from navigation
- Password authentication required
- All admin API endpoints require authorization
- Configuration stored securely in Cloudflare KV
