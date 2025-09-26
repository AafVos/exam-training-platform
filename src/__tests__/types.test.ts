import { User, Question, StudentAnswer } from '@/types'

describe('Type Definitions', () => {
  describe('User', () => {
    it('should have required properties', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'STUDENT',
        vwoLevel: 'VWO',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      }

      expect(user.id).toBeDefined()
      expect(user.email).toBeDefined()
      expect(user.name).toBeDefined()
      expect(user.role).toBeDefined()
      expect(user.createdAt).toBeInstanceOf(Date)
      expect(user.lastLoginAt).toBeInstanceOf(Date)
    })

    it('should allow optional vwoLevel', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      }

      expect(user.vwoLevel).toBeUndefined()
    })
  })

  describe('Question', () => {
    it('should have required properties', () => {
      const question: Question = {
        id: '1',
        content: 'What is 2 + 2?',
        answer: '4',
        points: 1,
        tags: ['arithmetic', 'basic'],
        category: 'Algebra',
        difficulty: 'EASY',
        year: 2024,
        examType: 'REGULAR',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(question.id).toBeDefined()
      expect(question.content).toBeDefined()
      expect(question.answer).toBeDefined()
      expect(question.points).toBeGreaterThan(0)
      expect(Array.isArray(question.tags)).toBe(true)
      expect(question.category).toBeDefined()
      expect(['EASY', 'MEDIUM', 'HARD']).toContain(question.difficulty)
      expect(question.year).toBeGreaterThan(0)
      expect(['REGULAR', 'RESIT']).toContain(question.examType)
    })
  })

  describe('StudentAnswer', () => {
    it('should have required properties', () => {
      const answer: StudentAnswer = {
        id: '1',
        userId: 'user1',
        questionId: 'question1',
        answerText: 'My answer',
        isCorrect: true,
        pointsEarned: 1,
        tagScores: { 'arithmetic': 1, 'basic': 1 },
        submittedAt: new Date(),
        evaluatedAt: new Date(),
      }

      expect(answer.id).toBeDefined()
      expect(answer.userId).toBeDefined()
      expect(answer.questionId).toBeDefined()
      expect(typeof answer.isCorrect).toBe('boolean')
      expect(answer.pointsEarned).toBeGreaterThanOrEqual(0)
      expect(typeof answer.tagScores).toBe('object')
      expect(answer.submittedAt).toBeInstanceOf(Date)
      expect(answer.evaluatedAt).toBeInstanceOf(Date)
    })
  })
})
