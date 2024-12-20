import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon } from '../shared/Pokemon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { AdvancedChecklistService } from '../services/advanced-checklist.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pokemon-list',
  imports: [CommonModule, MatTooltipModule, MatButtonModule, MatIconModule],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent implements OnInit, OnDestroy {
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
  advancedChecklist = false;
  private advancedChecklistSubscription!: Subscription;
  pageSize = 50;
  currentPage = 0;
  paginatedPokemonList: Pokemon[] = [];

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly advancedChecklistService: AdvancedChecklistService
  ) {}

  ngOnInit() {
    this.advancedChecklistSubscription =
      this.advancedChecklistService.advancedChecklist$.subscribe((state) => {
        this.advancedChecklist = state;
      });
    this.loadPokemonData();

    const goToTopButton = document.getElementById('go-to-top');
    if (goToTopButton) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
          goToTopButton.style.display = 'block';
        } else {
          goToTopButton.style.display = 'none';
        }
      });

      goToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
    }
  }

  loadPokemonData(): void {
    this.pokemonService.getPokemonData().subscribe({
      next: (data) => {
        this.pokemonList = data;
        this.loadNextPage();
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
      },
    });
  }

  loadNextPage(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPokemonList = [
      ...this.paginatedPokemonList,
      ...this.pokemonList.slice(startIndex, endIndex),
    ];
    this.currentPage++;
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      this.loadNextPage(); // Cargar la siguiente página cuando llegue al final
    }
  }

  getPokemonImageUrl(name: string): string {
    return `https://img.pokemondb.net/sprites/go/normal/${name.toLowerCase()}.png`;
  }

  ngOnDestroy() {
    if (this.advancedChecklistSubscription) {
      this.advancedChecklistSubscription.unsubscribe();
    }
  }
}
