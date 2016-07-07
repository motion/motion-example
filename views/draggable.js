import component from '../component'
import { DragSource as drag } from 'react-dnd'
import Dragger from '../stores/dragger'
import { DragType } from '../types'
import { getEmptyImage } from 'react-dnd-html5-backend'

const cardSource = { beginDrag: props => props }

@drag(DragType.BOX, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))
@component
export default class Draggable {
  componentDidMount() {
    // prevent default browser preview
    this.props.connectDragPreview(getEmptyImage(), {
      captureDragginState: true,
    })
  }

  render() {
    const { children, left, top, isDragging, connectDragSource } = this.props

    if (isDragging) {
      Dragger.toggleIsDragging()
    }

    return (
      <wrap
        style={isDragging ? {
          transform: `translate3d(${left}px, ${top}px, 0)`,
        } : {}}
        $isDragging={isDragging}
      >
        {children(connectDragSource)}
      </wrap>
    )
  }

  style = {
    isDragging: {
      opacity: 0.5,
    },
  }
}
