import component from '../component'
import Theme from '../theme'

@component
export default class Drawer {
  static defaultProps = {
    width: 400,
  }

  render() {
    const { open, children, right, width, percent, style = {}, ...props } = this.props
    const unit = percent ? '%' : 'px'
    const direction = right ? 1 : -1

    let panelStyle = {
      ...style,
      transform: `translate(${(open ? 0 : width) * direction}${unit})`,
      width: `${width}${unit}`,
    }

    return (
      <drawer>
        <panel $right={right} $panelOpen={open} style={panelStyle} {...props}>
          {children}
        </panel>
        <overlay $overlayOpen={open} />
      </drawer>
    )
  }

  style = {
    drawer: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 10000000000,
      overflow: 'hidden',
      pointerEvents: 'none',
    },
    panel: {
      pointerEvents: 'none',
      background: Theme.color.bg,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      boxShadow: '0 0 15px rgba(0,0,0,0.1)',
      transition: 'all ease-in 150ms',
      opacity: 0,
    },
    panelOpen: {
      pointerEvents: 'all',
      opacity: 1,
      transform: {
        x: 0,
      },
    },
    right: {
      right: 0,
      left: 'auto',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
      background: 'rgba(0,0,0,0.1)',
      transition: 'all ease-in-out 250ms',
      zIndex: -1,
      pointerEvents: 'none',
    },
    overlayOpen: {
      opacity: 1,
      pointerEvents: 'all',
    },
  }
}
