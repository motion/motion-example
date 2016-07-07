import component from './component'

@component
export default class Layout {
  render() {
    return (
      <layout>
        {this.props.children}
      </layout>
    )
  }
}
