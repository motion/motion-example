import component from '../component'
import Portal from 'react-portal'
import React from 'react'
import { findDOMNode } from 'react-dom'

@component
export default class Popover {
  static defaultProps = {
    distance: 0,
    edgePadding: 6,
    arrowSize: 26,
    noArrow: false,
    hoverable: false,
    overlay: false,
    side: 'auto',
  }

  props: {
    open: boolean;
    target: Function | string | Object;
    position: Object;
    left: number;
    top: number;
  }

  state = {
    targetHovered: false,
    menuHovered: false,
    top: 0,
    left: 0,
    bottom: 0,
    arrowTop: 0,
    arrowLeft: 0,
    arrowInnerTop: 0,
    isOpen: false,
  }

  componentDidMount() {
    if (this.props.hoverable) this.listenForHover()
    this.setState(this.getPositionState())
  }

  componentWillUnmount() {
    this.unlistenForHover()
  }

  componentWillUpdate() {
    if (!this.state.menuHovered && !this.state.targetHovered) return
    clearTimeout(this.checkHoverTimeout)
    this.checkHoverTimeout = setTimeout(this.checkOnLeave, 100)
  }

  checkOnLeave = () => {
    const isHovered = this.state.targetHovered || this.state.menuHovered
    // TODO bug causing this to loop
    if (!isHovered && this.props.onLeave) this.props.onLeave()
  }

  componentWillReceiveProps = nextProps => {
    this.setPosition(nextProps)
    this.setOpen(nextProps)
  }

  setPosition = ({ left, top }) => {
    let nextState = {}

    if (typeof left !== 'undefined' && typeof top !== 'undefined') {
      nextState = { left, top }
    }

    clearTimeout(this.positionTimeout)
    this.positionTimeout = setTimeout(() => {
      this.setState({
        ...nextState,
        ...this.getPositionState(),
      })
    })
  }

  setOpen = props => {
    // closing
    if (this.state.isOpen && !props.open) {
      this.setState({ closing: true }, () => {
        this.closingTimeout = setTimeout(() => {
          this.setState({ closing: false, isOpen: false })
        }, 300)
      })
    }

    if (props.open) {
      this.setState({ isOpen: true })
    }
  }

  unlistenForHover = () => {
    ['enter', 'leave'].forEach(state =>
      Object.keys(this.listeners[state]).forEach(name => {
        const { fn, node } = this.listeners[state][name]
        node.removeEventListener(`mouse${state}`, fn)
      })
    )
  }

  getTarget() {
    const { target } = this.props

    if (this.refs.target)
      return findDOMNode(this.refs.target)

    switch (typeof target) {
      case 'string': return document.querySelector(target)
      case 'function': return findDOMNode(target())
      default: return target
    }
  }

  getPositionState = () => {
    const { left, top, bottom } = this.props
    const target = this.getTarget()

    if (!target) return {}

    const { position } = this.props
    const { popover } = this.refs
    const bounds = position ?
      { width: 10, height: 10, ...position } :
      target.getBoundingClientRect()

    const nextState = {
      ...this.getY(popover, bounds),
      ...this.getX(popover, bounds),
    }

    if (typeof bottom === 'number') {
      nextState.bottom = bottom
      nextState.top = 'auto'
    }
    if (typeof left === 'number') nextState.left = left
    if (typeof top === 'number') nextState.top = top

    return nextState
  }

  ensureEdgePadding = (pos, max, width) => {
    return Math.min(
      // upper limit
      max - this.props.edgePadding - width,
      // lower limit
      Math.max(this.props.edgePadding, pos)
    )
  }

  getX = (popover, bounds) => {
    const fakePadding = this.theme.safeHoverPx * 2
    const popoverWidth = popover.clientWidth - fakePadding
    const popoverHalfWidth = popoverWidth / 2
    const targetCenter = bounds.left + bounds.width / 2
    const arrowCenter = window.innerWidth - popoverHalfWidth

    const left = this.ensureEdgePadding(targetCenter - popoverHalfWidth, window.innerWidth, popoverWidth)
    let arrowLeft = 0

    if (targetCenter < popoverHalfWidth) {
      arrowLeft = - popoverHalfWidth - targetCenter
    }
    else if (targetCenter > arrowCenter) {
      arrowLeft = targetCenter - arrowCenter
    }

    // find arrow bounds
    const max = bounds.width - this.props.edgePadding
    const min = this.props.edgePadding - targetCenter - this.props.arrowSize * 0.75
    arrowLeft = Math.max(min, Math.min(max, arrowLeft))

    return { arrowLeft, left }
  }

  getY = (popover, bounds) => {
    const { safeHoverPx } = this.theme
    const { noArrow, arrowSize, distance } = this.props

    // since its rotated 45deg, the real height is less 1/4 of set height
    const arrowHeight = noArrow ? 0 : (arrowSize * 0.75)
    const targetCenter = bounds.top + bounds.height / 2
    const targetTop = bounds.top - window.scrollY
    const arrowOnBottom = targetCenter > (window.innerHeight / 2) // above half window

    let arrowTop
    let top = null
    let bottom = null

    // bottom half
    if (arrowOnBottom) {
      arrowTop = popover.clientHeight - safeHoverPx
      bottom = (window.innerHeight - targetTop) + distance + arrowHeight
    }
    // top half
    else {
      arrowTop = -arrowSize + safeHoverPx
      top = targetTop + bounds.height + arrowSize + distance
    }

    const arrowInnerTop = arrowHeight * (arrowOnBottom ? -1 : 1)
    const ensurePadding = y => this.ensureEdgePadding(y, window.innerHeight, popover.clientHeight)

    return {
      arrowInnerTop,
      arrowTop,
      top: top && ensurePadding(top),
      bottom: bottom && ensurePadding(bottom),
    }
  }

  handlePopoverSelect = (cb) => {
    if (!this.state.isClosing) {
      this.setState({ isClosing: true })
      this.close(cb)
    }
  }

  close = (cb) => {
    setTimeout(() => {
      if (this.props.onClose) {
        if (cb && typeof cb === 'function') cb()
        this.props.onClose()
      }
    })
  }

  render() {
    const { noArrow, children, arrowSize, overlay, style, bg, target, hoverable, ...props } = this.props
    const { bottom, top, left, arrowTop, arrowLeft, arrowInnerTop, isOpen, closing } = this.state

    const open = this.props.open || typeof this.props.open === 'undefined' && (
      hoverable && (this.state.targetHovered || this.state.menuHovered)
    )

    return (
      <root>
        {React.isValidElement(target) &&
          React.cloneElement(target, { ref: 'target' })
        }
        <Portal isOpened>
          <container $open={isOpen} $closing={closing}>
            <bg $overlay={overlay} onClick={this.handlePopoverSelect} stopPropagation />
            <popover
              {...props}
              $popoverOpen={open}
              ref="popover"
              style={{
                ...style,
                top: top || 'auto',
                bottom: bottom || 'auto',
                left,
                maxHeight: window.innerHeight - (bottom || top),
              }}
            >
              {!noArrow &&
                <arrow
                  style={{
                    top: arrowTop,
                    width: arrowSize,
                    height: arrowSize,
                    marginLeft: -(arrowSize / 2) + arrowLeft,
                  }}
                >
                  <arrowInner
                    style={{
                      top: arrowInnerTop,
                      width: arrowSize,
                      height: arrowSize,
                    }}
                  />
                </arrow>
              }
              <section $withBg={bg}>
                {children}
              </section>
            </popover>
          </container>
        </Portal>
      </root>
    )
  }

  // hover helpers
  setHoverState = (name, val) => () => this.setState({ [`${name}Hovered`]: val })
  listeners = { enter: {}, leave: {} }

  listenForHover = () => {
    if (this.props.target) this.addHoverListeners('target', this.getTarget())
    this.addHoverListeners('menu', this.refs.popover)
  }

  addHoverListeners = (name, node) => {
    if (!node) return
    ['enter', 'leave'].forEach(state => {
      const fn = this.setHoverState(name, state === 'enter')
      this.listeners[state][name] = { node, fn }
      node.addEventListener(`mouse${state}`, fn)
    })
  }

  theme = {
    safeHoverPx: 15,
  }

  style = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      pointerEvents: 'none',
    },
    section: {
      flex: 1,
    },
    open: {
      zIndex: 2147483647,
    },
    closing: {
      zIndex: 2147483647 - 1,
    },
    bg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'transparent',
      pointerEvents: 'none',
    },
    overlay: {
      background: 'rgba(0,0,0,0.2)',
      pointerEvents: 'auto',
    },
    popover: {
      position: 'absolute',
      pointerEvents: 'auto',
      padding: this.theme.safeHoverPx,
      margin: -this.theme.safeHoverPx,
      opacity: 0,
      maxHeight: '70%',
      transition: 'opacity ease-in 100ms, transform ease-out 200ms',
      transform: {
        y: -5,
      },
    },
    popoverOpen: {
      opacity: 1,
      transform: {
        y: 0,
      },
    },
    withBg: {
      background: '#fff',
      boxShadow: `0 0 0 1px rgba(0,0,0,0.1),0 7px 15px rgba(0,0,0,0.1)`,
      borderRadius: 5,
    },
    arrow: {
      position: 'absolute',
      overflow: 'hidden',
      left: '50%',
    },
    arrowInner: {
      background: '#fff',
      position: 'absolute',
      left: 0,
      borderRadius: 3,
      transform: 'rotate(45deg)',
      // boxShadow: '0 0 2px rgba(0,0,0,0.1)',
      border: '1px solid #ddd',
    },
    item: {
      minWidth: 120,
    },
    itemFirstChild: {
      borderTop: 'none',
    },
  }
}
