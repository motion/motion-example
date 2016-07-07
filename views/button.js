import component from '../component'
import Theme from '../theme'

@component
export default class Button {
  render() {
    const {
      children,
      fullwidth,
      flex,
      small,
      sharp,
      end,
      ...props,
    } = this.props

    return (
      <button
        $small={small}
        $fullwidth={fullwidth}
        $flex={flex}
        $sharp={sharp}
        $end={end}
        {...props}
      >
        {children}
      </button>
    )
  }

  style = {
    button: {
      background: Theme.color.brandDark,
      color: '#fff',
      border: 'none',
      borderRadius: 5,
      padding: [12, 20],
      fontSize: 18,
      outline: 'none',
      hover: {
        backgroundColor: Theme.color.brandLight,
      },
      focus: {
        backgroundColor: Theme.color.brand,
      },
    },
    sharp: {
      borderRadius: 0,
    },
    flex: {
      flex: 1,
    },
    fullwidth: {
      width: '100%',
    },
    end: {
      alignSelf: 'flex-end',
    },
    small: {
      fontSize: 12,
      padding: [6, 10],
    },
  }
}
