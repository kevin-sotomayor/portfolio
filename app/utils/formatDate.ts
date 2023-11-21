export default function formatDate(date: string) {
  const dateObject = new Date(date);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }
  const formattedDate = dateObject.toLocaleDateString('fr-FR', options);
  return formattedDate;
}

