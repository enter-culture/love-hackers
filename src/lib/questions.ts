import type { Question } from './types'

export const QUESTION_BANK: Question[] = [
  {
    question: '주말엔 주로 뭐 해요?',
    choices: ['집에서 쉬어요', '친구랑 놀아요', '혼자 여행 가요'],
    scores: [5, 10, 5],
  },
  {
    question: '좋아하는 음식 종류는?',
    choices: ['한식', '양식', '아시안 퓨전'],
    scores: [10, 5, 10],
  },
  {
    question: '이상형의 첫인상은?',
    choices: ['눈이 마주쳤을 때 끌려요', '목소리가 중요해요', '분위기로 느껴요'],
    scores: [10, 5, 10],
  },
  {
    question: '여행 스타일은?',
    choices: ['계획형', '즉흥형', '반반이에요'],
    scores: [5, 10, 10],
  },
  {
    question: '카페에서 주로 뭐 마셔요?',
    choices: ['아메리카노', '라떼류', '논커피'],
    scores: [10, 5, 5],
  },
  {
    question: '쉬는 날 하고 싶은 건?',
    choices: ['드라이브', '집에서 영화', '맛집 탐방'],
    scores: [10, 5, 10],
  },
]

export const NPC_REACTIONS = [
  '오, 그렇구나!',
  '나도 그래요!',
  '재밌다!',
  '좋아요~',
  '그런 편이에요?',
  '멋지네요!',
]

export const QUESTIONS_PER_NPC = 3

export function getQuestionsForNpc(npcIndex: number): Question[] {
  const start = (npcIndex * QUESTIONS_PER_NPC) % QUESTION_BANK.length
  const result: Question[] = []
  for (let i = 0; i < QUESTIONS_PER_NPC; i++) {
    result.push(QUESTION_BANK[(start + i) % QUESTION_BANK.length])
  }
  return result
}
