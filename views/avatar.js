import component from '../component'

@component
export default class Avatar {
  static defaultProps = {
    size: 75,
  }

  render() {
    const { image, size, ...props } = this.props

    return (
      <avatar {...props}>
        <img src={image} style={{ width: size, height: size }} />
      </avatar>
    )
  }

  style = {
    img: {
      borderRadius: 100,
    },
  }
}
