import component from '../component'

@component
export default class Badge {

  render() {
    const { children, bgColor, color } = this.props

    return (
      <label
        style={{
          backgroundColor: bgColor,
          color,
        }}
      >{children}</label>
    )
  }

  style = {
    label: {
      borderRadius: 3,
      padding: 3,
      textAlign: 'center',
    },
  }
}
