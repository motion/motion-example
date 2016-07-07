import component from '../component'

@component
export default class Table {
  static defaultProps = {
    onClickRow: () => {},
  }

  render() {
    const {
      data,
      large,
      small,
      config,
      onClickRow,
      nowrap,
      ...props,
    } = this.props

    if (!data || !data.length)
      return null

    const getKeys = row => Object.keys(row).filter(x => x !== 'hidden')

    return (
      <table {...props}>
        <thead>
          <tr>
            {getKeys(data[0]).map((key, i) =>
              <th
                style={config && config[key] &&
                  config[key]
                }
                $large={large}
                $small={small}
                key={i}
              >{key}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) =>
            <tr $hoverable key={i}
              onClick={e => {
                if (e.currentTarget.tagName.match(/TD|TR/)) {
                  onClickRow(row)
                }
              }}
            >
              {getKeys(row).map((item, j) =>
                <td
                  style={config && config[item] ?
                    config[item] :
                    {
                      textAlign: 'center',
                      color: 'rgba(0,0,0,0.7)',
                    }
                  }
                  $nowrap={nowrap}
                  $large={large}
                  $small={small}
                  key={j}
                >{row[item]}</td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    )
  }

  style = {
    table: {
      margin: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderSpacing: 0,
      fontSize: 13,
      lineHeight: '1rem',
      letterSpacing: 0.3,
      minWidth: '100%',
    },
    th: {
      padding: [5, 5, 5, 5],
      margin: 0,
      fontWeight: 200,
      borderBottom: '1px solid rgba(0,0,0,.1)',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    td: {
      margin: 0,
      padding: 8,
      borderBottom: '1px solid rgba(0,0,0,.05)',
    },
    tr: {
      margin: 0,
    },
    tbody: {
      margin: 0,
    },
    thead: {
      margin: 0,
      textTransform: 'uppercase',
    },
    nowrap: {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    hoverable: {
      hover: {
        backgroundColor: 'rgba(0,0,0,.03)',
      },
    },
    large: {
      padding: 14,
    },
    small: {
      padding: 2,
    },
  }
}
