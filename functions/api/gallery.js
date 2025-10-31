export async function onRequestGet(context) {
  const { env } = context;
  const list = await env.JOEY_BUCKET.list({ prefix: "", limit: 1000 });

  const images = list.objects
    .filter(o => /\.(jpe?g|png|webp)$/i.test(o.key))
    .map(o => ({
      key: o.key,
      url: `https://${env.R2_PUBLIC_DOMAIN}/${o.key}`,
      heroOrder: getHeroOrder(o.key)
    }));

  // Get hero images in order (hero1, hero2, hero3)
  const heroImages = images
    .filter(i => i.heroOrder > 0)
    .sort((a, b) => a.heroOrder - b.heroOrder)
    .slice(0, 3);

  return Response.json({
    featured: heroImages,
    all: images
  });
}

function getHeroOrder(filename) {
  if (/hero1/i.test(filename)) return 1;
  if (/hero2/i.test(filename)) return 2;
  if (/hero3/i.test(filename)) return 3;
  return 0;
}
