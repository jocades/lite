declare global {
  namespace preact.JSX {
    interface HTMLAttributes {
      __island?: number | string
    }
  }
}

export {}
