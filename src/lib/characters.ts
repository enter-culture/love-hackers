import type { Character } from './types'

export const CHARACTERS: Character[] = [
  { id: 'a', displayName: '민준', color: '#7EC8E3', accentColor: '#4a9fb5' },
  { id: 'b', displayName: '서연', color: '#FFB347', accentColor: '#d4893a' },
  { id: 'c', displayName: '지호', color: '#B5EAD7', accentColor: '#7bc4a8' },
  { id: 'd', displayName: '하은', color: '#FFDAC1', accentColor: '#d4a882' },
  { id: 'e', displayName: '태양', color: '#C7CEEA', accentColor: '#9099c2' },
]

export const NPC_POSITIONS: [number, number, number][] = [
  [-4, 0, -4],
  [4, 0, -4],
  [0, 0, -6],
  [-5, 0, 1],
  [5, 0, 1],
]
