export function messageToTagArray(message: string) {
  const words = message.split(' ');

  const tags = words.filter((word) => word.startsWith('#'));

  return tags.map((tag) => {
    return { name: tag.replace(/[^\w\s]/gi, '').toLocaleLowerCase() };
  });
}
