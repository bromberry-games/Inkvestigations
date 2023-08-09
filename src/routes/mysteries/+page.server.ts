type ShopItem = {
    bought: boolean,
    priceId: string
    mystery: MysteryGame
}

type MysteryGame = {
    name: string,
    description: string,
    prompt: string
}

const shopItems: ShopItem[] = [
    {
        bought: false,
        priceId: 'price_1NaloJKIDbJkcynJshhB7EsM',
        mystery: {
            name: 'The deadly diner',
            description: 'Mystery',
            prompt: 'Answer with one word only'
        }
    }
]

export function load() {
  return {shopItems: shopItems.map(({ mystery, ...rest }) => {
    const { prompt, ...mysteryRest } = mystery;
    return { ...rest, mystery: mysteryRest };
  })};
}
