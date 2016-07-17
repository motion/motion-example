import component from '../../component'

@component
export default class Home {
  render() {
    return (
      <root>
        hello world
      </root>
    )
  }

  static style = {
    root: {
      background: '#eee'
    }
  }
}
