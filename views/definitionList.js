import component from '../component'

@component
export default class DefinitionList {
  static defaultProps = {
    start: 0,
    limit: null,
  }

  render() {
    const { object, limit, start } = this.props
    const rows = Object.keys(object)

    return (
      <dl>
        {rows.slice(start, limit + start || rows.length).map((item, i) =>
          <row key={i}>
            <dt>{item}</dt>
            <dd>{object[item]}</dd>
          </row>
        )}
      </dl>
    )
  }

  style = {
    dl: {
      padding: 5,
    },
    row: {
      borderBottom: '1px dotted rgba(0,0,0,0.07)',
      flexFlow: 'row',
    },
    dt: {
      flex: 1,
      fontWeight: 500,
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    dd: {
      color: 'rgba(0,0,0,0.7)',
    },
  }
}
