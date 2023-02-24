import { ServerRespond } from './DataStreamer';

export interface Row {
  priceAbc: number,   
   priceDef: number,
    ratio: number,        
    timestamp: Date,      
    upperBound: number,  
    lowerBound: number,  
    triggerAlert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
       const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
        const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
        const ratio = priceABC / priceDEF;
        const upperBound = 1 + 0.05;
        const lowerBound = 1 - 0.05;
        return {
          priceAbc: priceABC,
          priceDef: priceDEF,
          ratio,
          timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
            serverRespond[0].timestamp : serverRespond[1].timestamp,
          upperBound: upperBound,
          lowerBound: lowerBound,
          triggerAlert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
        };
       }
}
