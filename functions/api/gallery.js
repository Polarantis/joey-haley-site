export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    console.log('Gallery API: Starting...');
    console.log('Environment check - JOEY_BUCKET exists:', !!env.JOEY_BUCKET);
    console.log('Environment check - R2_PUBLIC_DOMAIN:', env.R2_PUBLIC_DOMAIN);
    
    const list = await env.JOEY_BUCKET.list({ prefix: "", limit: 1000 });
    console.log('R2 list result:', list.objects?.length, 'objects found');

    const images = list.objects
      .filter(o => /\.(jpe?g|png|webp)$/i.test(o.key))
      .map(o => ({
        key: o.key,
        url: `https://${env.R2_PUBLIC_DOMAIN}/${o.key}`,
        heroOrder: getHeroOrder(o.key)
      }));

    console.log('Filtered images count:', images.length);

    // Try to get admin-configured gallery order
    let orderedImages = images;
    let featuredImages = [];

    try {
      if (env.GALLERY_CONFIG) {
        console.log('Checking for admin gallery config...');
        const adminConfig = await env.GALLERY_CONFIG.get('admin_gallery_order');
        if (adminConfig) {
          const config = JSON.parse(adminConfig);
          console.log('Admin config found:', config);
          
          // Use admin-configured order if available
          if (config.ordered && config.ordered.length > 0) {
            orderedImages = config.ordered.filter(img => 
              images.some(available => available.key === img.key)
            );
            featuredImages = config.featured || orderedImages.slice(0, 9);
            console.log('Using admin-configured order');
          }
        } else {
          console.log('No admin config found');
        }
      } else {
        console.log('GALLERY_CONFIG KV namespace not available');
      }
    } catch (error) {
      console.warn('Could not load admin gallery config, using default:', error);
    }

    // Fallback to hero images if no admin configuration
    if (featuredImages.length === 0) {
      featuredImages = images
        .filter(i => i.heroOrder > 0)
        .sort((a, b) => a.heroOrder - b.heroOrder)
        .slice(0, 9);
      console.log('Using hero-based featured images:', featuredImages.length);
    }

    console.log('Final result - Featured:', featuredImages.length, 'All:', orderedImages.length);

    return Response.json({
      featured: featuredImages,
      all: orderedImages
    });
    
  } catch (error) {
    console.error('Gallery API error:', error);
    return Response.json(
      { error: 'Failed to load gallery', details: error.message }, 
      { status: 500 }
    );
  }
}

function getHeroOrder(filename) {
  if (/hero1/i.test(filename)) return 1;
  if (/hero2/i.test(filename)) return 2;
  if (/hero3/i.test(filename)) return 3;
  return 0;
}
