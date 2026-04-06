import { products } from "./products.js";

function buildLessons(product, moduleIndex) {
  return Array.from({ length: 5 }).map((_, lessonIndex) => ({
    id: `${product.slug}-m${moduleIndex + 1}-l${lessonIndex + 1}`,
    title: `Aula ${lessonIndex + 1} - ${product.title}`,
    durationMinutes: 8 + lessonIndex * 3,
    summary: "Conteudo pratico para aplicacao imediata no seu negocio.",
    thumb: product.cover
  }));
}

export function buildProductContent(productSlug) {
  const product = products.find((item) => item.slug === productSlug);
  if (!product) return null;

  const modules = Array.from({ length: 3 }).map((_, moduleIndex) => ({
    id: `${product.slug}-module-${moduleIndex + 1}`,
    title: `Modulo ${moduleIndex + 1} - ${product.title}`,
    lessons: buildLessons(product, moduleIndex)
  }));

  const recommended = products
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4)
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      cover: item.cover,
      tagline: item.tagline
    }));

  return {
    product: {
      slug: product.slug,
      title: product.title,
      tagline: product.tagline,
      description: product.description,
      cover: product.cover
    },
    modules,
    achievements: [
      { id: "ach-1", title: "Membro fundadora", progress: 100 },
      { id: "ach-2", title: "Consistencia semanal", progress: 70 },
      { id: "ach-3", title: "Execucao de aulas", progress: 45 }
    ],
    recommended
  };
}

