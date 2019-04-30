import * as _ from "lodash";
import * as fs from "fs";

interface Point {
    x: number,
    y: number
}

interface Line {
    point1: Point,
    point2: Point
}

let firstLines = JSON.parse(fs.readFileSync(process.argv[2]).toString());
let secondLines = JSON.parse(fs.readFileSync(process.argv[3]).toString());
console.log(calculateLikeness(firstLines, secondLines));

function calculateLikeness(redPoints: Point[], bluePoints: Point[]): number {
    // Turn the sets of points into sets of lines
    let redLines = getLinesFromPoints(redPoints);
    let blueLines = getLinesFromPoints(bluePoints);

    // For each redPoint find the shortest distance to any red segment
    let redToBlueLines = redPoints.map(redPoint => {
        // Find shortest distance to any blue segment
        let shortest = blueLines.reduce((shortestDistSoFar, blueLine) => {
            let dist = findShortestDistance(redPoint, blueLine);
            if (dist < shortestDistSoFar) return dist;
            else return shortestDistSoFar;
        }, 9999999999);

        return shortest;
    });

    let blueToRedLines = bluePoints.map(bluePoint => {
        // Find the shortest distance to any red segment
        let shortest = redLines.reduce((shortestDistSoFar, redLine) => {
            let dist = findShortestDistance(bluePoint, redLine);
            if (dist < shortestDistSoFar) return dist;
            else return shortestDistSoFar;
        }, 99999999999);
    });

    // Now average everything
    let someRandomFinalNumberOfCloseness = _.mean(_.merge(blueToRedLines, redToBlueLines));
    return someRandomFinalNumberOfCloseness;
}

function getLinesFromPoints(points: Point[]): Line[] {
    let lines: Line[] = [];
    for (let i = 0; i < points.length - 1; i++) {
        let point1 = points[i];
        let point2 = points[i + 1];

        lines.push({ point1, point2 });
    }
    return lines;
}

function findShortestDistance(point: Point, line: Line): number {
    // From... https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
    function sqr(x) { return x * x }
    function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
    function distToSegmentSquared(p, v, w) {
        var l2 = dist2(v, w);
        if (l2 == 0) return dist2(p, v);
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return dist2(p, {
            x: v.x + t * (w.x - v.x),
            y: v.y + t * (w.y - v.y)
        });
    }
    function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }
    return distToSegment(point, line.point1, line.point2);
}

