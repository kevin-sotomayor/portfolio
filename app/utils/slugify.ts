// This function creates a slug from a string :

export default function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // delete all special characters
    .replace(/-{2,}/g, '-') // replaces multiple - with single -
}