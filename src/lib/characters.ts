import type { Character } from './types'

export const CHARACTERS: Character[] = [
  { id: 'a', displayName: '민준', color: '#f4a460', accentColor: '#c87941', model: '/models/Fox.glb' },
  { id: 'b', displayName: '서연', color: '#e8c07a', accentColor: '#c49a52', model: '/models/ShibaInu.glb' },
  { id: 'c', displayName: '지호', color: '#b5d6b2', accentColor: '#7eaa7a', model: '/models/Deer.glb' },
  { id: 'd', displayName: '하은', color: '#e8d5c0', accentColor: '#c4a882', model: '/models/Alpaca.glb' },
  { id: 'e', displayName: '태양', color: '#a8c4e0', accentColor: '#6899c4', model: '/models/Husky.glb' },
]

export const PLAYER_MODEL = '/models/Wolf.glb'

export const NPC_POSITIONS: [number, number, number][] = [
  [-4, 0, -4],
  [4, 0, -4],
  [0, 0, -6],
  [-5, 0, 1],
  [5, 0, 1],
]
