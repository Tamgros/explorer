import React from 'react';
import { PingMetric, PingInfo } from '@providers/stats/SolanaPingProvider';
import { Cluster, clusterSlug } from '@utils/cluster';
import {  } from '@providers/stats/SolanaPingProvider';
import { start } from 'repl';


// import { layouts } from 'chart.js';
const thirtyMinuteinterval = 1000 * 60 * 30/30;
const twoHourInterval = 1000 * 60 * 2*60/30;
const sixHourInterval = 1000 * 60 * 6*60/30;
const numBuckets = 30;


export type PingsAggregated = {
    submitted: number;
    confirmed: number;
    // loss: number;
    mean: number;
    bucketStart: Date;
    bucketEnd: Date;
};

let exPing: PingInfo = {
    submitted: 5,
    confirmed: 4,
    loss: 1,
    mean: 1000,
    timestamp: new Date(Date.now()),
}

// exPing.timestamp.setMilliseconds(0);
// exPing.timestamp.setSeconds(0);

let thisMinute = Math.floor(exPing.timestamp.getTime()/thirtyMinuteinterval) * thirtyMinuteinterval;
let thisMinuteDate = new Date(thisMinute);
let nextMinute = Math.ceil(exPing.timestamp.getTime()/thirtyMinuteinterval) * thirtyMinuteinterval;
let nextMinuteDate = new Date(nextMinute);

let pingAPIResponse: PingMetric[] = [];
pingAPIResponse.push(
    {
        submitted: 10,
        confirmed: 7,
        loss: "0",
        mean_ms: 1000,
        mean_without_drops: 500,
        ts: Date(),
        error: "none",
    }
)



const baseDate = Date.now()
for (var i = 0; i < 70000;  i++){
    let thisSubmitted = Math.floor(Math.random() * 9) + 1;
    let thisConfirmed = Math.floor(thisSubmitted * Math.random())

    let thisDate = baseDate - (400*i)
    // console.log(thisDate);
    // console.log(new Date(thisDate));
    let thisDateDate = new Date(thisDate)

    pingAPIResponse.push(
        {
            submitted: thisSubmitted,
            confirmed: thisConfirmed,
            loss: (thisConfirmed/thisSubmitted).toString(),
            mean_ms: Math.random()*7499 + 1,
            mean_without_drops: 500,
            ts: thisDateDate.toString(),
            error: "none",
        }
    )

}


console.log("last pingAPI Response " + pingAPIResponse[pingAPIResponse.length - 1].ts)


const points = pingAPIResponse
    .map<PingInfo>(({ submitted, confirmed, mean_ms, ts }: PingMetric) => {
        let remove_dropped_ms = (mean_ms - (75*(submitted - confirmed)/submitted));

        let renormalized_mean = null;
        if (confirmed != 0){
            renormalized_mean = remove_dropped_ms * submitted/confirmed;
        }
        
        return {
            confirmed,
            loss: (submitted - confirmed) / submitted,
            mean: mean_ms,
            mean_without_drops: renormalized_mean,
            submitted,
            timestamp: new Date(ts),
        };
    })
    .reverse();

// const startTime = points.slice(-1).timestamp;
let startTime = points[points.length - 1].timestamp.getTime();
console.log("startTime: " + new Date(startTime));
startTime = Math.ceil(startTime/(1000*60)) * 1000*60;
console.log("startTime Ceil: " + new Date(startTime));

let endTime = points[0].timestamp.getTime();
endTime = Math.floor(endTime/(1000*60)) * 1000*60;
console.log("endTime floor: " + new Date(endTime));

// let thirtyMinuteArray = 



for (i in points){
    if (i == 1){
        console.log(i);
    }

}

function alignStartDate(interval: number) {
    const now = new Date();
    now.setMinutes(Math.floor(now.getMinutes() / interval) * interval, 0, 0); // Align to the nearest interval
    return now;
}

console.log("1 " + alignStartDate(1).toString());
console.log("4 " + alignStartDate(4).toString());
console.log("12 " + alignStartDate(12).toString());

function generateStaticDateArray(interval: number, duration: number) {
    const startDate = alignStartDate(interval); // Start at the nearest interval mark
    const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000); // End date after `duration` hours
    let currentDate = new Date(startDate);
    let datesArray = [];

    while (currentDate <= endDate) {
        datesArray.push(new Date(currentDate));
        currentDate = new Date(currentDate.getTime() + interval * 60 * 1000); // Increase by `interval` minutes
    }

    return datesArray;
}

// Generate arrays with static intervals
const every4MinutesArray = generateStaticDateArray(4, 2); // Every 4 minutes at 0, 4, 8... minute marks for the next 2 hours
const every12MinutesArray = generateStaticDateArray(12, 2); // Every 12 minutes at 0, 12, 24, 36, 48 minute marks for the next 2 hours

// Example to view the arrays
console.log("Every 4 Minutes Array:", every4MinutesArray.map(date => date.toString()));
console.log("Every 12 Minutes Array:", every12MinutesArray.map(date => date.toString()));

function prepend(value: any, thearray: Array) {
    var newArray = thearray.slice();
    newArray.unshift(value);
    return newArray;
  }

function generateBucketDates(buckets: number, duration: number) {
    const interval = duration * 60/buckets;
    const startDate = alignStartDate(interval); // Start at the nearest interval mark
    const endDate = new Date(startDate.getTime() - duration * 60 * 60 * 1000); // End date after `duration` hours

    let currentDate = new Date(startDate);
    let datesArray = [];


    while (currentDate >= endDate) {
        const nextDate = new Date(currentDate.getTime() - interval * 60 * 1000);
        const thisBucket: PingsAggregated = {
            submitted: 0,
            confirmed: 0,
            mean: 0,
            bucketStart: nextDate,
            bucketEnd: new Date(currentDate),
        }
        // datesArray.push(new Date(currentDate));
        // datesArray.push(thisBucket);
        datesArray = prepend(thisBucket, datesArray);
        currentDate = nextDate; // Increase by `interval` minutes
    }

    return datesArray;
}

const twoHour = generateBucketDates(30, 2); // Every 4 minutes at 0, 4, 8... minute marks for the next 2 hours
const sixHour = generateBucketDates(30, 6); // Every 12 minutes at 0, 12, 24, 36, 48 minute marks for the next 2 hours

// Example to view the arrays
console.log("2 Array:", twoHour.map((d) => d.bucketStart.toString()));
console.log("2 Array:", twoHour.map((d) => d.submitted.toString()));
console.log(twoHour.length)
console.log("6 Minutes Array:", sixHour.map((d) => d.bucketStart.toString()));


// var thirtyMinuteArray = [];

// for (var i = 0; i < numBuckets; i++) {
//     let end = startTime - i * 1000 * 60
//     let start = startTime - (i+1) * 1000 * 60

//     const thisBucket: PingsAggregated = {
//         submitted: 0,
//         confirmed: 0,
//         mean: 0,
//         bucketStart: new Date(start),
//         bucketEnd: new Date(end),
//     }

//     thirtyMinuteArray.push(thisBucket);
// }

console.log("points length " + points.length);
console.log("points start " + points[0].timestamp);
console.log("points end " + points[points.length -1].timestamp);
console.log("twoHour start " + twoHour[0].bucketStart);
console.log("twoHour end " + twoHour[0].bucketEnd);

const len2 = twoHour.length;
var i2 = 0;
var i6 = 0;
for (var i = 0; i< points.length; i++){
    if (points[i].timestamp <= twoHour[i2].bucketStart) {
        // console.log( points[i].timestamp + ' heyo ' + twoHour[i2].bucketStart);
        continue;
    
    } else if (points[i].timestamp <= twoHour[i2].bucketEnd && points[i].timestamp >= twoHour[i2].bucketStart){
        twoHour[i2].confirmed += points[i].confirmed;
        twoHour[i2].submitted += points[i].submitted;


        twoHour[i2].mean += points[i].mean;
        // console.log("yoooooo " + twoHour[i2]);
    } else {
        console.log("does it make it?");
        console.log( twoHour[i2].bucketStart);
        console.log( points[i].timestamp);
        console.log( twoHour[i2].bucketEnd);

        i2++;
        // twoHour[i2].confirmed += points[i].confirmed;
    }



    if (i2 >= len2){
        break;
    }


};


// let remove_dropped_ms = (points[i].mean - (75*(points[i].submitted - points[i].confirmed)/points[i].submitted));

// let renormalized_mean = null;
// if (points[i].confirmed != 0){
//     renormalized_mean = remove_dropped_ms * points[i].submitted/points[i].confirmed;
// }

console.log('one SUB ' + twoHour[0].submitted);
console.log('one ' + twoHour[0].confirmed);
console.log('one ' + twoHour[0].mean);
console.log('TWO SUB ' + twoHour[1].submitted);
console.log('two ' + twoHour[1].confirmed);
console.log('two ' + twoHour[1].mean_ms);
console.log('length ' + twoHour.length)
console.log('start ' + twoHour[0].bucketStart)
console.log('end ' + twoHour[0].bucketEnd)

console.log('last start ' + twoHour[twoHour.length - 1].bucketStart)
console.log('last end ' + twoHour[twoHour.length - 1].bucketEnd)

// function bucketPings(points: PingInfo[]): PingInfo[] {
//     let buckets: PingInfo[] = [];
//     // let buckets = [];

    
//     return buckets;
// }

export function BucketPractice(){

    return (
        <div className="container">
            hello world 
            {Cluster.MainnetBeta}
            <p>{exPing.timestamp.toString()}</p>
            <p>{exPing.timestamp.getTime()}</p>
            <p>{thisMinute}</p>
            <p>floor {thisMinuteDate.toString()}</p>
            <p>ceil {nextMinuteDate.toString()}</p>
            <p>{Date.now()}</p>
            {/* <p>{thirtyMinuteArray.toString()}</p> */}
            <p>{pingAPIResponse[0].ts}</p>
            <p>{pingAPIResponse[pingAPIResponse.length - 2].ts}</p>
            <p>{pingAPIResponse.length}</p>
            <p>{baseDate}</p>
            

            
            
        </div>
    );
}