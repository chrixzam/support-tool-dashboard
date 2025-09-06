import { describe, it, expect } from 'vitest'
import { classNames, categoryBadgeColor, confidencePillColor } from '../lib/ui'
import { solutionsSeed } from '../data/solutions'

describe('ui helpers', () => {
  it('classNames joins truthy strings', () => {
    expect(classNames('a', '', 'b', false && 'x', 'c')).toBe('a  b c')
  })

  it('categoryBadgeColor returns a string', () => {
    expect(typeof categoryBadgeColor('File Format')).toBe('string')
  })

  it('confidencePillColor returns a string', () => {
    expect(typeof confidencePillColor('High')).toBe('string')
  })
})

describe('solutionsSeed', () => {
  it('has at least one solution and valid fields', () => {
    expect(Array.isArray(solutionsSeed)).toBe(true)
    expect(solutionsSeed.length).toBeGreaterThan(0)
    const s = solutionsSeed[0]
    expect(s).toHaveProperty('title')
    expect(s).toHaveProperty('steps')
    expect(Array.isArray(s.steps)).toBe(true)
  })

  it('search finds json-related items', () => {
    const q = 'json'
    const found = solutionsSeed.filter(s =>
      s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    )
    expect(found.length).toBeGreaterThan(0)
  })
})
