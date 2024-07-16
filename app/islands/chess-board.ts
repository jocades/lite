declare global {
  interface HTMLElementTagNameMap {
    'chess-board': HTMLChessboardElement
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'chess-board': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLChessboardElement>,
        HTMLChessboardElement
      >
    }
  }
}

const COLUMNS = 'abcdefgh'.split('')

// prettier-ignore
const pieceImg: Record<string, string> = {
  wr: '♖', wn: '♘', wb: '♗', wq: '♕', wk: '♔', wp: '♙',
  br: '♜', bn: '♞', bb: '♝', bq: '♛', bk: '♚', bp: '♟',
}

// prettier-ignore
const initPosition: Record<string, string> = {
  a1: 'wr', b1: 'wn', c1: 'wb', d1: 'wq', e1: 'wk', f1: 'wb', g1: 'wn', h1: 'wr',
  a2: 'wp', b2: 'wp', c2: 'wp', d2: 'wp', e2: 'wp', f2: 'wp', g2: 'wp', h2: 'wp',
  a7: 'bp', b7: 'bp', c7: 'bp', d7: 'bp', e7: 'bp', f7: 'bp', g7: 'bp', h7: 'bp',
  a8: 'br', b8: 'bn', c8: 'bb', d8: 'bq', e8: 'bk', f8: 'bb', g8: 'bn', h8: 'br',
}

function clone<T extends Record<string, unknown>>(obj: T) {
  return { ...obj }
}

function style(el: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
  Object.assign(el.style, styles)
}

function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Partial<HTMLElementTagNameMap[K]>,
  children?: HTMLElement[],
) {
  const el = document.createElement(tag)
  if (attrs) Object.assign(el, attrs)
  if (children) el.append(...children)
  return el
}

const squareColor = ['#edd7a4', '#b58863'] as const

const BOARD_SIZE = 512
const SQUARE_SIZE = BOARD_SIZE / 8

function customElement(tagName: string) {
  return (target: CustomElementConstructor) => {
    customElements.define(tagName, target)
  }
}

function size(n: number) {
  return `width: ${n}px; height: ${n}px;`
}

function translate(x: number, y: number) {
  return `transform: translate(${x}px, ${y}px);`
}

const squares = []
const inverted = false

for (let c = 0; c < 8; c++) {
  for (let r = 0; r < 8; r++) {
    squares.push(inverted ? COLUMNS[c] + (r + 1) : COLUMNS[c] + (8 - r))
  }
}

@customElement('chess-board')
export class HTMLChessboardElement extends HTMLElement {
  private _boardSize = 512
  private _squareSize = this._boardSize / 8

  private _position: Record<string, string> = clone(initPosition)

  static styles = `
    :host {
      --white: #f0d9b5;
      --black: #b58863;
      --board-size: 512px;
      --square-size: calc(var(--board-size) / 8);
    }
    .bg-white {
      background-color: var(--white);
    }
    .bg-black {
      background-color: var(--black);
    }
    .white {
      color: var(--white);
    }
    .black {
      color: var(--black);
    }
    .container {
      display: flex;
      position: relative;
      flex-direction: column;
      width: var(--board-size);
      height: var(--board-size);
    }
    .row {
      display: flex;
    }
    .square {
      position: relative;
      width: var(--square-size);
      height: var(--square-size);
    }
    .piece {
      position: absolute;
      cursor: grab;
      width: var(--square-size);
      height: var(--square-size);
    }
    .notation {
      position: absolute;
      left: 1px;
      top: 1px;
      font-size: 12px;
      user-select: none;
    }
  `

  private $container!: HTMLDivElement

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.render()
  }

  private renderBoard() {
    for (let r = 0; r < 8; r++) {
      const $row = h('div', { className: 'row' })

      for (let c = 0; c < 8; c++) {
        const square = COLUMNS[c] + (8 - r)
        const $square = h('div', {
          className: `square ${(r + c) % 2 === 0 ? 'bg-white' : 'bg-black'}`,
          /* onclick: () => {
            console.log('square')
            console.log({
              square,
              color: (r + c) % 2 === 0 ? 'white' : 'black',
              piece: this.getPiece(square),
            })
          }, */
        })
        $square.dataset.square = square
        /* style($square, {
          width: `${this._squareSize}px`,
          height: `${this._squareSize}px`,
          // backgroundColor: (r + c) % 2 === 0 ? squareColor[0] : squareColor[1],
        }) */

        const $notation = h('div', {
          textContent: square,
          className: `notation ${(r + c) % 2 === 0 ? 'black' : 'white'}`,
        })

        /* if (piece) {
          $square.onclick = (e) => {
            // get the current piece in the square an snap its center to the current mouse position
            const $piece = $square.querySelector<HTMLElement>('.piece')!
            const rect = $piece.getBoundingClientRect()
            console.log({ rect })
          }
        }

        if (this._position[square]) {
          const $piece = h('img', {
            src: `/pub/assets/${this._position[square]}.png`,
            draggable: true,
            className: 'piece',
            onclick: (e) => {
              console.log('piece')
            },
          })
          $square.appendChild($piece)
        } */

        $square.appendChild($notation)
        $row.appendChild($square)
      }

      this.$container.appendChild($row)
    }
  }

  // move the pieces using transform and the board size translating on x and y realtive to the board contianer
  private renderPieces() {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const square = COLUMNS[c] + (8 - r)
        const piece = this._position[square]

        if (piece) {
          const $piece = h('img', {
            src: `/pub/assets/${piece}.png`,
            draggable: false,
            className: `piece ${piece[0] === 'w' ? 'white' : 'black'}`,
          })
          $piece.style.cssText = translate(
            c * this._squareSize,
            r * this._squareSize,
          )

          $piece.onclick = (e) => {
            console.log({
              square,
              color: (r + c) % 2 === 0 ? 'white' : 'black',
              piece,
            })

            const boardRect = this.$container.getBoundingClientRect()
            const pieceRect = $piece.getBoundingClientRect()
          }

          this.$container.appendChild($piece)
        }
      }
    }
  }

  private render() {
    const $style = h('style', { textContent: HTMLChessboardElement.styles })
    this.$container = h('div', { className: 'container' })
    this.shadowRoot!.append($style, this.$container)

    this.renderBoard()
    this.renderPieces()

    document.addEventListener('click', (e) => {
      console.log('DOC', e.clientX, e.clientY)
    })

    /* for (let r = 0; r < 8; r++) {
      const $row = h('div', { className: 'row' })

      for (let c = 0; c < 8; c++) {
        const square = COLUMNS[c] + (8 - r)

        const $square = h('div', {
          className: 'square',
          onclick: () => {
            // get the square, color and piece
            console.log({
              square,
              color: (r + c) % 2 === 0 ? 'white' : 'black',
              piece: this.getPiece(square),
            })
          },
          ondragover: (e) => {
            e.preventDefault()
            e.dataTransfer!.dropEffect = 'move'
          },
          ondrop: (e) => {
            e.preventDefault()
            const $target = (e.target as HTMLElement).closest(
              '[data-square]',
            )! as HTMLDivElement

            const [from, piece] = e
              .dataTransfer!.getData('text/plain')
              .split(':')

            const to = $target.dataset.square

            console.log({ from, to, piece })

            if (!to || from === to) return

            // move piece
            this._position[to] = piece
            delete this._position[from]

            const $piece = this.$container.querySelector('[dragging]')!

            // $target.innerHTML = ''
            // $target.appendChild($piece)
            $target.firstChild?.replaceWith($piece)
            $piece.removeAttribute('dragging')
          },
        })
        $square.dataset.square = square
        style($square, {
          width: `${this._squareSize}px`,
          height: `${this._squareSize}px`,
          backgroundColor: (r + c) % 2 === 0 ? squareColor[0] : squareColor[1],
        })

        const piece = this.getPiece(square)
        if (piece) {
          const $piece = h('img', {
            src: `/pub/assets/${piece}.png`,
            draggable: true,
            className: 'piece',
            onclick: (e) => {
              const squareRect = $square.getBoundingClientRect()
              const pieceRect = $piece.getBoundingClientRect()
              console.log({
                squareRect,
                pieceRect,
                offsetX: e.offsetX,
                offsetY: e.offsetY,
              })
            },
            ondragstart: (e) => {
              $piece.setAttribute('dragging', '')
              e.dataTransfer!.setData('text/plain', `${square}:${piece}`)
            },
            ondragend: (e) => {
              const success = e.dataTransfer!.dropEffect === 'move'
              console.log('drag end', success)
            },
          })
          $piece.dataset.piece = piece
          style($piece, {
            fontSize: `${this._squareSize}px`,
            color: piece[0] === 'w' ? 'white' : 'black',
          })

          $square.appendChild($piece)
        }

        const $notation = h('div', {
          className: 'notation',
          textContent: square,
        })

        style($notation, {
          color: (r + c) % 2 === 0 ? squareColor[1] : squareColor[0],
          userSelect: 'none',
        })

        $square.appendChild($notation)
        $row.appendChild($square)
      }

      this.$container.appendChild($row)
    } */
  }

  getPiece(square: string): string | undefined {
    return this._position[square]
  }

  makeMove(from: string, to: string) {
    this._position[to] = this._position[from]
    delete this._position[from]
  }

  // lifecycle methods

  // called when the element is added to the DOM
  connectedCallback() {
    console.log('connected')
    const orientation = this.getAttribute('orientation')
    console.log({ orientation })
  }

  // called when the element is removed from the DOM
  disconnectedCallback() {
    console.log('disconnected')
  }

  // called when the element is moved to a new document
  adoptedCallback() {
    console.log('adopted')
  }

  // called when an attribute is added, removed, or updated
  /* attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log('attribute changed', { name, oldValue, newValue })
  }

  // observe attributes
  static get observedAttributes() {
    return ['orientation']
  } */
}
