export async function onRequestGet(context) {
  const { env } = context;
  const list = await env.JOEY_BUCKET.list({ prefix: "", limit: 1000 });

  const images = list.objects
    .filter(o => /\.(jpe?g|png|webp)$/i.test(o.key))
    .map(o => ({
      key: o.key,
      url: `https://${env.R2_PUBLIC_DOMAIN}/${o.key}`,
      hero: /hero/i.test(o.key)
    }));

  return Response.json({
    featured: images.filter(i => i.hero).slice(0, 3),
    all: images
  });
}
