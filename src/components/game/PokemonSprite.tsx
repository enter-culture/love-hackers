import type { CSSProperties } from 'react';

interface PokemonSpriteProps {
  pokemonId: number;
  size?: number;
  isActive?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function PokemonSprite({
  pokemonId,
  size = 240,
  isActive = true,
  className = '',
  style,
}: PokemonSpriteProps) {
  const src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  return (
    <img
      src={src}
      alt={`pokemon-${pokemonId}`}
      width={size}
      height={size}
      className={`select-none pointer-events-none object-contain ${isActive ? 'game-float game-glow' : 'opacity-40'} ${className}`}
      style={{ width: size, height: size, ...style }}
      draggable={false}
    />
  );
}
