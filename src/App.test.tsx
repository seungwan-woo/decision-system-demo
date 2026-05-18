import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('Decision System Demo UI', () => {
  it('fills and clears dummy data from the UI', () => {
    render(<App />)

    expect(screen.getByText(/nodes: 0/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /fill dummy data/i }))
    expect(screen.getAllByText(/PDE Feature Data/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Context Engine/i).length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole('button', { name: /clear dummy data/i }))
    expect(screen.getByText(/nodes: 0/i)).toBeInTheDocument()
  })

  it('updates trace when the user selects the nudge scenario', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /fill dummy data/i }))
    fireEvent.click(screen.getByRole('button', { name: /run nudge scenario/i }))

    expect(screen.getByText(/Travel app nudge/i)).toBeInTheDocument()
    expect(screen.getAllByText(/feature-arrival-travel-context/i).length).toBeGreaterThan(0)
  })

  it('shows edge evidence details from the visible edge inspector list', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /fill dummy data/i }))
    fireEvent.click(screen.getByRole('button', { name: /inspect derived from CE/i }))

    expect(screen.getByText('edge-feature-travel-ce')).toBeInTheDocument()
    expect(screen.getByText('ce://demo/edge-feature-travel-ce')).toBeInTheDocument()
  })

  it('documents the demo structure with module and C&C views', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /demo architecture guide/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /module view/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /component-and-connector/i })).toBeInTheDocument()
    expect(screen.getAllByText(/PDE Feature Data.*Context Engine.*Current Info/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/graphStore/i).length).toBeGreaterThan(0)
  })
})
