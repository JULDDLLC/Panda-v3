export const stripeProducts = [
  {
    id: 'prod_SZodc8L1R3wa6H',
    priceId: 'price_1Ref02PjcHpgF26uKTL7Zpqd',
    name: 'Adventure Pack',
    description: 'Panda',
    price: 9.99,
    mode: 'subscription' as const,
  },
];

export const getProductByPriceId = (priceId: string) => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getProductById = (id: string) => {
  return stripeProducts.find(product => product.id === id);
};