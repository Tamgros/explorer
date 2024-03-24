import React from 'react';
import { PingMetric, PingInfo } from '@providers/stats/SolanaPingProvider';
import { Cluster, clusterSlug } from '@utils/cluster';
import {  } from '@providers/stats/SolanaPingProvider';


// import { layouts } from 'chart.js';
const thirtyMinuteinterval = 1000 * 60 * 30/30;
const twoHourInterval = 1000 * 60 * 2*60/30;
const sixHourInterval = 1000 * 60 * 6*60/30;


let exPing: PingInfo = {
    submitted: 5,
    confirmed: 4,
    loss: 1,
    mean: 1000,
    timestamp: new Date(Date.now()),
}

exPing.timestamp.setMilliseconds(0);
exPing.timestamp.setSeconds(0);
let thisMinute = Math.floor(exPing.timestamp.getTime()/thirtyMinuteinterval) * thirtyMinuteinterval;


function bucketPings(points: PingInfo[]): PingInfo[] {
    let buckets: PingInfo[];
    


    return buckets;
}

export function BucketPractice(){

    return (
        <div className="container">
            hello world 
            {Cluster.MainnetBeta}
            <p>{exPing.timestamp.toString()}</p>
            <p>{exPing.timestamp.getTime()}</p>
            <p>{thisMinute}</p>
            <p>{Date(thisMinute).toString()}</p>
            <p>{Date.now()}</p>
            
            
        </div>
    );
}