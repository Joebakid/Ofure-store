const PHONE_NUMBER = "2348140588890";

export function getWhatsAppLink({
  name,
  price,
  category,
  quantity = 1,
}) {
  const message = `
Hello 👋 I’d like to order:

• Product: ${name}
• Category: ${category}
• Price: ${price}
• Quantity: ${quantity}
`;

  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
    message.trim()
  )}`;
}
