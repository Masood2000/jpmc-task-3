import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
          priceAbc: 'float',
            priceDef: 'float',
            ratio: 'float',
             timestamp: 'date',
            upperBound: 'float',
            lowerBound: 'float',
            triggerAlert: 'float',
    };

    if (window.perspective) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
   
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lowerBound", "upperBound", "triggerAlert"]');
    
      elem.setAttribute('aggregates', JSON.stringify({
        priceAbc: 'avg',
      priceDef: 'avg',
        ratio: 'avg',
         timestamp: 'distinct count',
        upperBound: 'avg',
        lowerBound: 'avg',
        triggerAlert: 'avg',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
       ] );
    }
  }
}

export default Graph;
