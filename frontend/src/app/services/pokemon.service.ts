import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Pokemon } from '../shared/Pokemon';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly gameMasterUrl = 'assets/GAME_MASTER.json';
  // private readonly formsUrl = 'assets/POKEMON_FORMS.json';

  constructor(private readonly http: HttpClient) {}

  getPokemonData(): Observable<Pokemon[]> {
    return this.http.get<any[]>(this.gameMasterUrl).pipe(
      map((gameMaster) => {
        const data = gameMaster
          .filter(
            (entry) =>
              entry.templateId.startsWith('V') &&
              entry.templateId.includes('POKEMON') &&
              !entry.templateId.includes('NORMAL') &&
              !entry.templateId.includes('HOME_FORM_REVERSION') &&
              !entry.templateId.includes('HOME_REVERSION') &&
              !entry.templateId.includes('VS_SEEKER_POKEMON_REWARDS')
          )
          .map((entry) => {
            const poke = {
              templateId: entry.templateId,
              pokedexNumber: +entry.templateId.substring(1, 5),
              name: entry.data.pokemonSettings?.pokemonId || 'MissingNo',
              type: this.transformTypeString(entry.data.pokemonSettings.type),
              type2: entry.data.pokemonSettings.type2
                ? this.transformTypeString(entry.data.pokemonSettings.type2)
                : undefined,
              form: entry.data.pokemonSettings.form
                ? this.transformFormString(entry.data.pokemonSettings.form)
                : undefined,
              canBeLucky: entry.data.pokemonSettings.isTradable || false,
              canBeShadow: entry.data.pokemonSettings.shadow !== undefined,
              released: entry.data.pokemonSettings.camera !== undefined,
              sprite: entry.data.pokemonSettings.form
                ? this.transformSpriteString(
                    entry.data.pokemonSettings.form
                  ).toString()
                : undefined,
            } as any;
            return poke;
          });

        const raticate_party_hat = {
          templateId: 'V0019_POKEMON_RATTATA', // ID único para el nuevo sprite
          pokedexNumber: 20,
          name: 'RATICATE',
          type: 'normal',
          type2: undefined,
          form: 'PARTY_HAT',
          canBeLucky: true, // Puedes ajustar estos valores
          canBeShadow: false,
          released: true,
          sprite: 'raticate-party-hat', // Define cómo manejarás este sprite en tu sistema
        };

        const modifiedData: {
          templateId: string; // ID único para el nuevo sprite
          pokedexNumber: number;
          name: string;
          type: string;
          type2: undefined;
          form: string;
          canBeLucky: boolean; // Puedes ajustar estos valores
          canBeShadow: boolean;
          released: boolean;
          sprite: string;
        }[] = [];
        data.forEach((poke) => {
          modifiedData.push(poke);
          if (poke.name === 'RATICATE' && !poke.form) {
            modifiedData.push(raticate_party_hat);
          }
        });

        const genderMap = gameMaster
          .filter((entry) => entry.templateId.startsWith('SPAWN'))
          .reduce((map, entry) => {
            map[entry.data.genderSettings.pokemon] = {
              male: entry.data.genderSettings.gender.malePercent !== undefined,
              female:
                entry.data.genderSettings.gender.femalePercent !== undefined,
              genderless:
                entry.data.genderSettings.gender.genderlessPercent !==
                undefined,
            };
            return map;
          }, {} as Record<string, any>);

        const pokemon = modifiedData.map((entry) => ({
          ...entry,
          gender: genderMap[entry.name] || {
            male: false,
            female: false,
            genderless: false,
          },
        }));

        console.log(pokemon);

        return pokemon;
      })
    );
  }

  transformTypeString(type: string): string {
    const typeString: { [key: string]: string } = {
      POKEMON_TYPE_FIGHTING: 'fighting',
      POKEMON_TYPE_GHOST: 'ghost',
      POKEMON_TYPE_PSYCHIC: 'psychic',
      POKEMON_TYPE_FIRE: 'fire',
      POKEMON_TYPE_BUG: 'bug',
      POKEMON_TYPE_ELECTRIC: 'electric',
      POKEMON_TYPE_NORMAL: 'normal',
      POKEMON_TYPE_ICE: 'ice',
      POKEMON_TYPE_POISON: 'poison',
      POKEMON_TYPE_WATER: 'water',
      POKEMON_TYPE_FLYING: 'flying',
      POKEMON_TYPE_FAIRY: 'fairy',
      POKEMON_TYPE_DRAGON: 'dragon',
      POKEMON_TYPE_ROCK: 'rock',
      POKEMON_TYPE_GROUND: 'ground',
      POKEMON_TYPE_DARK: 'dark',
      POKEMON_TYPE_GRASS: 'grass',
      POKEMON_TYPE_STEEL: 'steel',
    };
    return typeString[type];
  }

  transformFormString(form: string): string {
    const formString: { [key: string]: string } = {
      BULBASAUR_FALL_2019: 'FALL 2019',
      CHARMANDER_FALL_2019: 'FALL 2019',
      VENUSAUR_COPY_2019: 'CLONE',
      CHARIZARD_COPY_2019: 'CLONE',
      SQUIRTLE_FALL_2019: 'FALL 2019',
      BLASTOISE_COPY_2019: 'CLONE',
      RATICATE_PARTY_HAT: 'PARTY HAT', //! not in the game master
      PIKACHU_ADVENTURE_HAT_2020: 'ADVENTURE HAT',
      PIKACHU_COPY_2019: 'CLONE',
      // PIKACHU_COSTUME_2020: '',
      '2850': 'SAREE',
      PIKACHU_DOCTOR: 'PH. D',
      PIKACHU_FALL_2019: 'MIMIKYU COSTUME',
      // PIKACHU_FLYING_01: '',
      // PIKACHU_FLYING_02: '',
      // PIKACHU_FLYING_03: '',
      // PIKACHU_FLYING_04: '',
      PIKACHU_FLYING_5TH_ANNIV: '5TH ANNIVERSARY',
      PIKACHU_FLYING_OKINAWA: 'OKINAWA BALLOON',
      // PIKACHU_GOFEST_2022: '',
      // PIKACHU_GOFEST_2024_MTIARA: '',
      // PIKACHU_GOFEST_2024_STIARA: '',
      // PIKACHU_GOTOUR_2024_A: '',
      // PIKACHU_GOTOUR_2024_A_02: '',
      // PIKACHU_GOTOUR_2024_B: '',
      // PIKACHU_GOTOUR_2024_B_02: '',
      // PIKACHU_HORIZONS: '',
      // PIKACHU_JEJU: '',
      // PIKACHU_KARIYUSHI: '',
      // PIKACHU_POP_STAR: '',
      // PIKACHU_ROCK_STAR: '',
      // PIKACHU_SUMMER_2023_A: '',
      // PIKACHU_SUMMER_2023_B: '',
      // PIKACHU_SUMMER_2023_C: '',
      // PIKACHU_SUMMER_2023_D: '',
      // PIKACHU_SUMMER_2023_E: '',
      // PIKACHU_TSHIRT_01: '',
      // PIKACHU_TSHIRT_02: '',
      // PIKACHU_TSHIRT_03: '',
      // PIKACHU_VS_2019: '',
      // PIKACHU_WCS_2022: '',
      // PIKACHU_WCS_2023: '',
      // PIKACHU_WCS_2024: '',
      // PIKACHU_WINTER_2020: '',
    };
    const mappedForm = formString[form];
    if (typeof form == 'string') {
      if (!mappedForm && form.endsWith('ALOLA')) {
        return 'ALOLA';
      }
    }
    return mappedForm ?? form;
  }

  transformSpriteString(costume: string): string {
    const costumeString: { [key: string]: string } = {
      BULBASAUR_FALL_2019: 'bulbasaur-shedinja',
      CHARMANDER_FALL_2019: 'charmander-cubone',
      VENUSAUR_COPY_2019: 'venusaur-clone',
      CHARIZARD_COPY_2019: 'charizard-clone',
      SQUIRTLE_FALL_2019: 'squirtle-yamask',
      BLASTOISE_COPY_2019: 'blastoise-clone',
      RATICATE_PARTY_HAT: 'raticate-party-hat', //! not in the game master
      PIKACHU_ADVENTURE_HAT_2020: 'pikachu-adventure-hat',
      PIKACHU_COPY_2019: 'pikachu-clone',
      // PIKACHU_COSTUME_2020: '',
      '2850': 'pikachu-saree',
      PIKACHU_DOCTOR: 'pikachu-phd',
      PIKACHU_FALL_2019: 'pikachu-mimikyu',
      // PIKACHU_FLYING_01: '',
      // PIKACHU_FLYING_02: '',
      // PIKACHU_FLYING_03: '',
      // PIKACHU_FLYING_04: '',
      PIKACHU_FLYING_5TH_ANNIV: 'pikachu-balloon5',
      PIKACHU_FLYING_OKINAWA: 'pikachu-okinawa-balloon',
      // PIKACHU_GOFEST_2022: '',
      // PIKACHU_GOFEST_2024_MTIARA: '',
      // PIKACHU_GOFEST_2024_STIARA: '',
      // PIKACHU_GOTOUR_2024_A: '',
      // PIKACHU_GOTOUR_2024_A_02: '',
      // PIKACHU_GOTOUR_2024_B: '',
      // PIKACHU_GOTOUR_2024_B_02: '',
      // PIKACHU_HORIZONS: '',
      // PIKACHU_JEJU: '',
      // PIKACHU_KARIYUSHI: '',
      // PIKACHU_POP_STAR: '',
      // PIKACHU_ROCK_STAR: '',
      // PIKACHU_SUMMER_2023_A: '',
      // PIKACHU_SUMMER_2023_B: '',
      // PIKACHU_SUMMER_2023_C: '',
      // PIKACHU_SUMMER_2023_D: '',
      // PIKACHU_SUMMER_2023_E: '',
      // PIKACHU_TSHIRT_01: '',
      // PIKACHU_TSHIRT_02: '',
      // PIKACHU_TSHIRT_03: '',
      // PIKACHU_VS_2019: '',
      // PIKACHU_WCS_2022: '',
      // PIKACHU_WCS_2023: '',
      // PIKACHU_WCS_2024: '',
      // PIKACHU_WINTER_2020: '',
    };
    const mappedCostume = costumeString[costume];
    if (typeof costume == 'string') {
      if (!mappedCostume && costume.endsWith('ALOLA')) {
        return costume.split('_')[0].toLowerCase() + '-alolan';
      }
    }

    return mappedCostume ?? costume;
  }
}
