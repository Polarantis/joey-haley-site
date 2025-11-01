// Admin authentication endpoint for Cloudflare Pages
export async function onRequestPost(context) {
  const { env, request } = context;
  
  try {
    const { password } = await request.json();
    
    // Check against Cloudflare environment variable
    const correctPassword = env.ADMIN_PASSWORD || 'joeyhaley2024'; // Fallback for dev
    
    if (password === correctPassword) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Invalid password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Authentication error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
