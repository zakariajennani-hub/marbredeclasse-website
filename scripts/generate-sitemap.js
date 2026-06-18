import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://www.marbredeclasse.com";

const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/produits", priority: "0.9", changefreq: "weekly" },
  { path: "/products", priority: "0.8", changefreq: "weekly" },
  { path: "/services", priority: "0.8", changefreq: "monthly" },
  { path: "/contact", priority: "0.8", changefreq: "monthly" },
  { path: "/qui-sommes-nous", priority: "0.7", changefreq: "monthly" },
  { path: "/devis", priority: "0.7", changefreq: "weekly" },
  {
    path: "/politique-confidentialite",
    priority: "0.3",
    changefreq: "yearly",
  },
  {
    path: "/conditions-utilisation",
    priority: "0.3",
    changefreq: "yearly",
  },
];

const dynamicSources = [
  {
    file: "src/data/fabricatedProducts.js",
    routePrefix: "/produits",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    file: "src/data/products.js",
    routePrefix: "/products",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    file: "src/data/blogPosts.js",
    routePrefix: "/blog",
    priority: "0.7",
    changefreq: "weekly",
  },
  {
    file: "src/data/projects.js",
    routePrefix: "/projets",
    priority: "0.7",
    changefreq: "monthly",
  },
];

function fileExists(filePath) {
  return fs.existsSync(path.resolve(filePath));
}

function extractIdsFromFile(filePath) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) return [];

  const content = fs.readFileSync(absolutePath, "utf8");

  const ids = [];
  const regex = /id\s*:\s*["'`]([^"'`]+)["'`]/g;

  let match;

  while ((match = regex.exec(content)) !== null) {
    ids.push(match[1]);
  }

  return [...new Set(ids)];
}

function cleanRoute(route) {
  if (route === "/") return "/";
  return route.replace(/\/+/g, "/").replace(/\/$/, "");
}

function buildUrlXml({ path: routePath, priority = "0.8", changefreq = "weekly" }) {
  const cleanPath = cleanRoute(routePath);
  const loc = cleanPath === "/" ? BASE_URL + "/" : BASE_URL + cleanPath;

  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const routes = [...staticRoutes];

for (const source of dynamicSources) {
  if (!fileExists(source.file)) continue;

  const ids = extractIdsFromFile(source.file);

  ids.forEach((id) => {
    routes.push({
      path: `${source.routePrefix}/${id}`,
      priority: source.priority,
      changefreq: source.changefreq,
    });
  });
}

const uniqueRoutesMap = new Map();

routes.forEach((route) => {
  uniqueRoutesMap.set(cleanRoute(route.path), route);
});

const uniqueRoutes = [...uniqueRoutesMap.values()];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueRoutes.map(buildUrlXml).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Disallow: /admin
Disallow: /devis-success

Sitemap: ${BASE_URL}/sitemap.xml
`;

const publicDir = path.resolve("public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(publicDir, "robots.txt"), robots);

console.log(`✅ sitemap.xml generated with ${uniqueRoutes.length} URLs.`);
console.log("✅ robots.txt generated successfully.");