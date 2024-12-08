import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon } from '../shared/Pokemon';
@Component({
  selector: 'app-pokemon-list',
  imports: [CommonModule],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent {
  getBackgroundColor(type: string, type2?: string): string {
    const typeColors: { [key: string]: string } = {
      fire: '#FF6D6D',
      water: '#4592C4',
      grass: '#78C850',
      electric: '#FFDD57',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
      normal: '#A8A878',
    };

    if (!type2) return typeColors[type] || '#777';
    return `linear-gradient(45deg, ${typeColors[type] || '#777'}, ${
      typeColors[type2] || '#777'
    })`;
  }

  pokemonList: Pokemon[] = [];

  constructor(private readonly pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemonData();
  }

  loadPokemonData(): void {
    this.pokemonService.getPokemonData().subscribe({
      next: (data) => {
        this.pokemonList = data;
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
      },
    });
  }

  getPokemonImageUrl(name: string): string {
    return `https://img.pokemondb.net/sprites/go/normal/${name.toLowerCase()}.png`;
  }
}
