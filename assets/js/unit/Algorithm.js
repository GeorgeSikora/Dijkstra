/**
 * Algorithm - Algoritmus
 *  Main class to handle Djikstr algorithm
 */

class Algorithm
{
    static mainPoint = null;

    constructor()
    {
    }

    static build()
    {   
        /* clean totals and branches */
        totals = [];
        branches = [];

        totalsDiv.innerHTML = '';
        branchingDiv.innerHTML = '';

        /* get selected point */
        this.mainPoint = Point.getSelected();

        /* if any point isn't selected */
        if (!this.mainPoint)
        {
            this.mainPoint = points[Math.floor(Math.random() * points.length)];
            this.mainPoint.selected = true;
        }
        
        /* get point to the top in array */
        var p_ = this.mainPoint;
        points[this.mainPoint.getIndex()] = points[0];
        points[0] = p_;
    
        /* add totals */
        for (var p of points)
        {
            var t = new PointTotal(p);
            totals.push(t);
        }

        /* add branches */
        for (var p of points)
        {
            var t = PointTotal.getWherePoint(p);
            
            if (p == points[0])
            {
                t.addValue(0);
            }
            else
            {
                t.addInfinity();
            }

            if (PointsConnection.getConnectionsFromPoint(p).length <= 0)
            {
                t.addDisconected();
            }
        }
    }

    static nextStep()
    {
        var lowestTotal = PointTotal.getLowestUnused();

        if (lowestTotal)
        {
            branches.push(new PointBranch(lowestTotal.point));
        }

        /* get last branch */
        var b = PointBranch.last();
        
        /* get point total of last branch */
        var t = PointTotal.getWherePoint(b.point);

        /* add all points to PointTotal */
        for (var c of b.connections)
        {
            var neighborPoint = b.point == c.p1 ? c.p2 : c.p1;
            var total = PointTotal.getWherePoint(neighborPoint);
            var pointToPointCost = c.getPrice();
            //var shortestPath = total.shortestPath;

            //console.log(shortestPath.cost, pointToPointCost);
            
            //var cost = PointsConnection.getPointsPathLength(shortestPath.points);
            //shortestPath.cost += pointToPointCost;
            console.log(b.point.name, total.point.name, pointToPointCost);
            var cost = pointToPointCost;

            var basePTotal = PointTotal.getWherePoint(b.point);

            console.log(basePTotal);

            if (basePTotal.actualVal != Infinity) cost += basePTotal.actualVal;

            if (cost < total.actualVal)
            {
                //console.log(neighborPoint);

                //shortestPath.points.push(neighborPoint);
                
                total.addValue(cost);
                
                //console.log(total.shortestPath);
            }
        }
    }
}