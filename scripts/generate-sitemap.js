import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://www.marbredeclasse.com";

const staticRoutes = [
  "/",
  "/produits",
  "/products",
  "/services",
  "/contact",
  "/qui-sommes-nous",
  "/devis",
  "/politique-confidentialite",
  "/conditions-utilisation",
];

const dataFiles = [
  {
    file: "src/data/fabricatedProducts.js",
    routePrefix: "/produits",
  },
  {
    file: "src/data/products.js",
    routePrefix: "/products",
  },
];

function extractIdsFromFile(filePath) {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf8");
  const ids = [];
  const regex = /id\s*:\s*["'`](.*?)["'`]/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    ids.push(match[1]);
  }

  return [...new Set(ids)];
}

function buildUrlXml(route, priority = "0.8", changefreq = "weekly") {
  return `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const routes = [...staticRoutes];

for (const item of dataFiles) {
  const ids = extractIdsFromFile(item.file);
  ids.forEach((id) => {
    routes.push(`${item.routePrefix}/${id}`);
  });
}

const uniqueRoutes = [...new Set(routes)];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueRoutes.map((route) => buildUrlXml(route)).join("\n")}
</urlset>
`;

const publicDir = path.resolve("public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml);

const robots = `User-agent: *
Allow: /

Disallow: /admin
Disallow: /devis-success

Sitemap: ${BASE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(publicDir, "robots.txt"), robots);

console.log("✅ sitemap.xml and robots.txt generated successfully.");