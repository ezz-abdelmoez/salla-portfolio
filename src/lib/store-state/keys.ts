export const cartKeys = { all: ["cart"] as const, root: () => [...cartKeys.all] as const };
export const favoritesKeys = { all: ["favorites"] as const, root: () => [...favoritesKeys.all] as const };
