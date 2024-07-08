declare global {
  namespace preact.JSX {
    interface HTMLAttributes {
      'data-island'?: number | string
    }
  }
}

export {}
