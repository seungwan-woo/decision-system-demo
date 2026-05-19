import '@testing-library/jest-dom/vitest'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from './App'

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn(async (id: string, diagram: string) => ({
      svg: `<svg id="${id}" data-diagram-prefix="${diagram.slice(0, 9)}" role="img"></svg>`,
    })),
  },
}))

async function renderApp() {
  render(<App />)
  await waitFor(() => {
    expect(screen.getAllByTestId('mermaid-rendered-diagram')).toHaveLength(3)
  })
}

describe('Decision System Demo UI', () => {
  it('fills and clears dummy data from the UI', async () => {
    await renderApp()

    expect(screen.getByText(/nodes: 0/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /fill dummy data/i }))
    expect(screen.getAllByText(/PDE Feature Data/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Context Engine/i).length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole('button', { name: /clear dummy data/i }))
    expect(screen.getByText(/nodes: 0/i)).toBeInTheDocument()
  })

  it('updates trace when the user selects the nudge scenario', async () => {
    await renderApp()

    fireEvent.click(screen.getByRole('button', { name: /fill dummy data/i }))
    fireEvent.click(screen.getByRole('button', { name: /run nudge scenario/i }))

    expect(screen.getByText(/Travel app nudge/i)).toBeInTheDocument()
    expect(screen.getAllByText(/feature-arrival-travel-context/i).length).toBeGreaterThan(0)
  })

  it('shows edge evidence details from the visible edge inspector list', async () => {
    await renderApp()

    fireEvent.click(screen.getByRole('button', { name: /fill dummy data/i }))
    fireEvent.click(screen.getByRole('button', { name: /inspect derived from CE/i }))

    expect(screen.getByText('edge-feature-travel-ce')).toBeInTheDocument()
    expect(screen.getByText('ce://demo/edge-feature-travel-ce')).toBeInTheDocument()
  })

  it('documents the demo structure with rendered Mermaid diagrams', async () => {
    await renderApp()

    expect(screen.getByRole('heading', { name: /demo architecture guide/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /module view/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /component-and-connector/i })).toBeInTheDocument()
    expect(screen.getAllByText(/PDE Feature Data.*Context Engine.*Current Info/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/graphStore/i).length).toBeGreaterThan(0)

    await waitFor(() => {
      expect(screen.getAllByTestId('mermaid-rendered-diagram')).toHaveLength(3)
    })
  })
})
