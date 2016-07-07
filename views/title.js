import component from '../component'
import Avatar from './avatar'

@component
export default class Title {
  render() {
    const {
      pad,
      small,
      tiny,
      big,
      children,
      subtitle,
      after,
      before,
      avatar,
      ...props,
    } = this.props

    const avatarProps = {
      size: big ? 60 : 40,
      // TODO once motion-style fixed
      style: {
        paddingRight: 10,
      },
    }

    return (
      <titleBar $bigbg={big} $pad={pad}>
        {typeof avatar === 'string' && <Avatar {...avatarProps} image={avatar} />}
        {typeof avatar === 'object' && <Avatar {...avatarProps} {...avatar} />}
        {before && <before>{before}</before>}
        <main>
          <h1 $big={!!big} $small={small} $tiny={tiny} {...props}>{children}</h1>
          {subtitle && <subtitle $avatarSmall={small || tiny}>{subtitle}</subtitle>}
        </main>
        {after && <after>{after}</after>}
      </titleBar>
    )
  }

  style = {
    titleBar: {
      flexFlow: 'row',
    },
    h1: {
      fontWeight: 300,
      fontSize: 18,
      margin: [5, 0],
      lineHeight: '1.4rem',
      fontFamily: 'Fira Sans',
    },
    pad: {
      padding: 10,
    },
    bigbg: {
      padding: 15,
      borderBottom: '1px solid #eee',
    },
    big: {
      fontSize: 24,
      fontWeight: 300,
      color: 'rgba(0,0,0,0.8)',
      padding: 0,
      margin: [5, 0, 5],
    },
    after: {
      alignSelf: 'flex-end',
    },
    before: {
      marginRight: 15,
    },
    main: {
      flex: 1,
      justifyContent: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: 'rgba(0,0,0,0.5)',
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    small: {
      fontSize: 16,
    },
    tiny: {
      fontSize: 14,
      lineHeight: '1.1rem',
    },
    avatarSmall: {
      margin: [-10, 0, 0],
      fontSize: 14,
    },
  }
}
