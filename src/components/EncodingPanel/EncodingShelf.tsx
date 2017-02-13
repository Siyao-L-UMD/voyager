import * as React from 'react';
import {ConnectDropTarget, DropTarget, DropTargetCollector, DropTargetSpec} from 'react-dnd';

import { DraggableType } from '../../constants';
import {ShelfChannel, ShelfFieldDef} from '../../models';
import {Field} from '../Field';

import './EncodingShelf.scss';

import * as classNames from 'classnames';

/**
 * Props for react-dnd of EncodingShelf
 */
export interface EncodingShelfDropTargetProps {
  connectDropTarget: ConnectDropTarget;

  isOver: boolean;
}

export interface EncodingShelfDispatchProps {
  onFieldDrop: (channel: ShelfChannel, fieldDef: ShelfFieldDef, index?: number) => void;

  onFieldRemove: (channel: ShelfChannel, index?: number) => void;
}

export interface EncodingShelfProps extends EncodingShelfDropTargetProps, EncodingShelfDispatchProps {
  channel: ShelfChannel;
  fieldDef: ShelfFieldDef;
}

const encodingShelfTarget: DropTargetSpec<EncodingShelfProps> = {
  // TODO: add canDrop
  drop(props, monitor) {
    // Don't drop twice for nested drop target
    if (monitor.didDrop()) {
      return;
    }

    const item = monitor.getItem() as ShelfFieldDef;
    props.onFieldDrop(props.channel, item);
  }
};

const collect: DropTargetCollector = (connect, monitor): EncodingShelfDropTargetProps => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
};

class EncodingShelfBase extends React.Component<EncodingShelfProps, {}> {
  constructor(props: EncodingShelfProps) {
    super(props);

    // Bind - https://facebook.github.io/react/docs/handling-events.html
    this.onRemove = this.onRemove.bind(this);
  }
  public render() {
    const {channel, connectDropTarget, fieldDef, isOver} = this.props;

    const classes = classNames({
      EncodingShelf: true,
      isOver: isOver
    });

    // HACK: add alias to suppress compile error for: https://github.com/Microsoft/TypeScript/issues/13526
    const F = Field as any;

    const field = (<F fieldDef={fieldDef} draggable={true} onRemove={this.onRemove}/>);

    return connectDropTarget(
      <div className={classes}>
        <span>{channel}: </span>
        {fieldDef ? field : FieldPlaceholder()}
      </div>
    );
  }
  private onRemove() {
    const {channel, onFieldRemove} = this.props;
    onFieldRemove(channel);
  }
}

function FieldPlaceholder() {
  return (
    <span className="FieldPlaceholder">
      (Drop Field Here)
    </span>
  );
}

export const EncodingShelf = DropTarget(DraggableType.FIELD, encodingShelfTarget, collect)(EncodingShelfBase);