// Gallery configuration management for admin
export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    // Try to get saved configuration from KV storage
    const config = await env.GALLERY_CONFIG?.get('admin_gallery_order');
    
    if (config) {
      return Response.json(JSON.parse(config));
    } else {
      // Return default configuration
      return Response.json({
        ordered: [],
        featured: [],
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    return Response.json(
      { error: 'Failed to load configuration' }, 
      { status: 500 }
    );
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // Check authorization
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderData = await request.json();
    
    // Validate the data structure
    if (!orderData.all || !Array.isArray(orderData.all)) {
      return Response.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Save configuration to KV storage
    if (env.GALLERY_CONFIG) {
      await env.GALLERY_CONFIG.put('admin_gallery_order', JSON.stringify({
        ordered: orderData.all,
        featured: orderData.featured || orderData.all.slice(0, 9),
        timestamp: orderData.timestamp || new Date().toISOString()
      }));
    }

    return Response.json({ 
      success: true, 
      message: 'Gallery configuration saved successfully' 
    });

  } catch (error) {
    console.error('Save error:', error);
    return Response.json(
      { error: 'Failed to save configuration' }, 
      { status: 500 }
    );
  }
}
