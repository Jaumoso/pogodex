export interface Pokemon {
  templateId: string;
  pokedexNumber: number;
  name: string;
  type: string;
  type2?: string;
  gender: {
    male: boolean;
    female: boolean;
    genderless: boolean;
  };
  form?: string;
  canBeLucky: boolean;
  canBeShadow: boolean;
  released: boolean;
  sprite?: string;
}
