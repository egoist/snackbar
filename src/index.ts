import './style.css'

export interface Action {
  /**
   * Action button text
   */
  text: string
  /**
   * Action button style
   * @example
   *
   * ```js
   * {
   *   color: 'red'
   * }
   * ```
   */
  style?: {
    [k: string]: any
  }
  /**
   * Invoke a function when the action button is clicked
   */
  callback?: ActionCallback
}

export type ActionCallback = (
  button: HTMLButtonElement,
  snackbar: Snackbar
) => void

export type Position = 'left' | 'center' | 'right'

export interface SnackOptions {
  /**
   * Automatically destroy the snackbar in specific timeout (ms)
   * @default `0` means we won't automatically destroy the snackbar
   */
  timeout?: number
  /**
   * An array of action buttons
   */
  actions?: Action[]
  /**
   * Show snackbar in given position
   * @default `center`
   */
  position?: Position
  theme?: 'string' | ThemeRules
  /**
   * Maximum stacks to display, earlier created snackbar will be hidden
   * @default 3
   */
  maxStack?: number
}

export interface SnackInstanceOptions {
  timeout: number
  actions: Action[]
  position: Position
  theme: ThemeRules
  maxStack: number
}

export interface SnackResult {
  destroy: () => void
}

export interface ThemeRules {
  backgroundColor?: string
  textColor?: string
  boxShadow?: string
  actionColor?: string
}

let instances: { [k: string]: Snackbar[] } = {
  left: [],
  center: [],
  right: []
}

let instanceStackStatus: { [k: string]: boolean } = {
  left: true,
  center: true,
  right: true
}

const themes: { [name: string]: ThemeRules } = {
  light: {
    backgroundColor: '#fff',
    textColor: '#000',
    actionColor: '#008000'
  },
  dark: {}
}

export class Snackbar {
  message: string
  options: SnackInstanceOptions
  wrapper: HTMLDivElement
  /**
   * The snackbar element
   */
  el?: HTMLDivElement
  private timeoutId?: number

  constructor(message: string, options: SnackOptions = {}) {
    const {
      timeout = 0,
      actions = [{ text: 'dismiss', callback: () => this.destroy() }],
      position = 'center',
      theme = 'dark',
      maxStack = 3
    } = options
    this.message = message
    this.options = {
      timeout,
      actions,
      position,
      maxStack,
      theme: typeof theme === 'string' ? themes[theme] : theme
    }

    this.wrapper = this.getWrapper(this.options.position)
    this.insert()
    instances[this.options.position].push(this)
    this.stack()
  }

  get theme() {
    return this.options.theme
  }

  getWrapper(position: Position): HTMLDivElement {
    let wrapper = document.querySelector(
      `.snackbars-${position}`
    ) as HTMLDivElement
    if (!wrapper) {
      wrapper = document.createElement('div')
      wrapper.className = `snackbars snackbars-${position}`
      document.body.appendChild(wrapper)
    }
    return wrapper
  }

  insert() {
    const el = document.createElement('div')
    el.className = 'snackbar'
    el.setAttribute('aria-live', 'assertive')
    el.setAttribute('aria-atomic', 'true')
    el.setAttribute('aria-hidden', 'false')

    const { backgroundColor, textColor, boxShadow, actionColor } = this.theme

    const container = document.createElement('div')
    container.className = 'snackbar--container'
    if (backgroundColor) {
      container.style.backgroundColor = backgroundColor
    }
    if (textColor) {
      container.style.color = textColor
    }
    if (boxShadow) {
      container.style.boxShadow = boxShadow
    }
    el.appendChild(container)

    const text = document.createElement('div')
    text.className = 'snackbar--text'
    text.textContent = this.message
    container.appendChild(text)

    // Add action buttons
    if (this.options.actions) {
      for (const action of this.options.actions) {
        const { style, text, callback } = action
        const button = document.createElement('button')
        button.className = 'snackbar--button'
        button.innerHTML = text
        if (actionColor) {
          button.style.color = actionColor
        }
        if (style) {
          Object.keys(style).forEach(key => {
            button.style[key as any] = style[key]
          })
        }
        button.addEventListener('click', () => {
          this.stopTimer()
          if (callback) {
            callback(button, this)
          } else {
            this.destroy()
          }
        })
        container.appendChild(button)
      }
    }

    this.startTimer()

    el.addEventListener('mouseenter', () => {
      this.expand()
    })
    el.addEventListener('mouseleave', () => {
      this.stack()
    })

    this.el = el

    this.wrapper.appendChild(el)
  }

  stack() {
    instanceStackStatus[this.options.position] = true
    const positionInstances = instances[this.options.position]
    const l = positionInstances.length - 1
    positionInstances.forEach((instance, i) => {
      // Resume all instances' timers if applicable
      instance.startTimer()
      if (instance.el) {
        instance.el.style.transform = `translate3d(0, -${(l - i) * 15}px, -${l -
          i}px) scale(${1 - 0.05 * (l - i)})`
        if (l - i >= this.options.maxStack) {
          instance.el.style.opacity = '0'
        } else {
          instance.el.style.opacity = '1'
        }
      }
    })
  }

  expand() {
    // Do not expand when hovering on hidden snackbar
    if (this.el !== undefined && this.el.style.opacity === '0') {
      return
    }
    instanceStackStatus[this.options.position] = false
    const positionInstances = instances[this.options.position]
    const l = positionInstances.length - 1
    positionInstances.forEach((instance, i) => {
      // Stop all instances' timers to prevent destroy
      instance.stopTimer()
      if (instance.el) {
        instance.el.style.transform = `translate3d(0, -${(l - i) *
          instance.el.clientHeight}px, 0) scale(1)`
        if (l - i >= this.options.maxStack) {
          instance.el.style.opacity = '0'
        } else {
          instance.el.style.opacity = '1'
        }
      }
    })
  }

  /**
   * Destory the snackbar
   */
  async destroy() {
    const { el, wrapper } = this
    if (el) {
      // Animate the snack away.
      el.setAttribute('aria-hidden', 'true')
      await new Promise(resolve => {
        const eventName = getAnimationEvent(el)
        if (eventName) {
          el.addEventListener(eventName, () => resolve())
        } else {
          resolve()
        }
      })
      wrapper.removeChild(el)
      // Remove instance from the instances array
      const positionInstances = instances[this.options.position]
      let index: number | undefined = undefined
      for (let i = 0; i < positionInstances.length; i++) {
        if (positionInstances[i].el === el) {
          index = i
          break
        }
      }
      if (index !== undefined) {
        positionInstances.splice(index, 1)
      }
      // Based on current status, refresh stack or expand style
      if (instanceStackStatus[this.options.position]) {
        this.stack()
      } else {
        this.expand()
      }
    }
  }

  startTimer() {
    if (this.options.timeout && !this.timeoutId) {
      this.timeoutId = self.setTimeout(
        () => this.destroy(),
        this.options.timeout
      )
    }
  }

  stopTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = undefined
    }
  }
}

function getAnimationEvent(el: HTMLDivElement): string | undefined {
  const animations: { [k: string]: string } = {
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'Animationend',
    WebkitAnimation: 'webkitAnimationEnd'
  }

  for (const key of Object.keys(animations)) {
    if (el.style[key as any] !== undefined) {
      return animations[key]
    }
  }
  return
}

export function createSnackbar(message: string, options?: SnackOptions) {
  return new Snackbar(message, options)
}

export function destroyAllSnackbars() {
  let instancesArray: Snackbar[] = []
  Object.keys(instances)
    .map(position => instances[position])
    .forEach(positionInstances => instancesArray.push(...positionInstances))
  return Promise.all(instancesArray.map(instance => instance.destroy()))
}
