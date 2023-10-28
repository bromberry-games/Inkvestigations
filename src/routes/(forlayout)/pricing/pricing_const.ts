
export function getAmountForPrice(price: string): number {
  return name_to_amount_map[price_to_name_map[price]];
}

export const name_to_price_map = {
  'ROOKIE' : 'price_1NgTQsKIDbJkcynJPpFoFZNz',
  'DETECTIVE' : 'price_1Ng9UfKIDbJkcynJYsE9jPMZ',
  'CHIEF' : 'price_1NgSRVKIDbJkcynJkhJJb1E3',
}

const price_to_name_map = {
  'price_1NgTQsKIDbJkcynJPpFoFZNz' : 'ROOKIE',
  'price_1Ng9UfKIDbJkcynJYsE9jPMZ' : 'DETECTIVE',
  'price_1NgSRVKIDbJkcynJkhJJb1E3' : 'CHIEF',
}

const name_to_amount_map = {
  'ROOKIE' : 10,
  'DETECTIVE' : 20,
  'CHIEF' : 30,
}