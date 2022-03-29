/**
 * Points Connection - Propojení Bodů
 *  Line connecting two points between which a path leads in the canvas window
 */

class PointsConnection
{
    constructor(p1, p2)
    {
        this.uid = mcf.uniqueID();

        this.dist = 0;
        this.price = 0;
        this.hover = false;
        this.highlighted = false;
        
        if (p1 && p2)
        {
            this.p1 = p1;
            this.p2 = p2;
        }
    }

    refresh()
    {
        var x1, y1, x2, y2;
        x1 = this.p1.x;
        y1 = this.p1.y;
        x2 = this.p2.x;
        y2 = this.p2.y;
        this.dist = round(dist(x1, y1, x2, y2) / 10);

        var hoveredPointConn = PointsConnection.getHovered();
        this.hover = PointsConnection.linePoint(x1, y1, x2, y2, gMouse.x, gMouse.y) && (!hoveredPointConn || hoveredPointConn == this);
    }

    draw()
    {
        var x1, y1, x2, y2;
        x1 = this.p1.x;
        y1 = this.p1.y;
        x2 = this.p2.x;
        y2 = this.p2.y;

        if (this.hover) stroke('#888'); else stroke(0, 255);
        if (this.hover) strokeWeight(5); else strokeWeight(3);
        if (this.highlighted) stroke('#f00');
        line(x1, y1, x2, y2);

        push();

        var x0, y0, dx, dy, cx, cy;
        
        x0 = x1 < x2 ? x1 : x2;
        y0 = y1 < y2 ? y1 : y2;

        dx = x1 - x2;
        dy = y1 - y2;

        cx = x0 + abs(dx) / 2;
        cy = y0 + abs(dy) / 2;

        translate(cx, cy);
        rotate(atan(dy/dx));

        if (this.hover) fill('#888'); else fill(0, 255);
        noStroke();
        textSize(24);
        textAlign(CENTER, BOTTOM);
        text(this.price ? this.price : this.dist, 0, 0);

        pop();
    }

    static draw()
    {
        if (actionMode == 'connection')
        {
            if (startPoint)
            {
                var x1, y1, x2, y2;
                x1 = startPoint.x;
                y1 = startPoint.y;
                x2 = gMouse.x;
                y2 = gMouse.y;

                stroke(0, 127);
                strokeWeight(3);
                line(x1, y1, x2, y2);

                push();

                var x0, y0, dx, dy, cx, cy;
                
                x0 = x1 < x2 ? x1 : x2;
                y0 = y1 < y2 ? y1 : y2;

                dx = x1 - x2;
                dy = y1 - y2;

                cx = x0 + abs(dx) / 2;
                cy = y0 + abs(dy) / 2;

                translate(cx, cy);
                rotate(atan(dy/dx));

                fill(0, 127);
                noStroke();
                textSize(24);
                textAlign(CENTER, BOTTOM);
                text(round(dist(x1, y1, x2, y2) / 10), 0, 0);

                pop();
            }
        }
    }

    getPrice()
    {
        return this.price ? this.price : this.dist;
    }

    static getBetween(p1, p2)
    {
        for (var c of connections)
        {
            if ((c.p1 == p1 && c.p2 == p2) || (c.p1 == p2 && c.p2 == p1))
            {
                return c;
            }
        }
        return null;
    }

    static getConnectionsFromPoint(p)
    {
        var conns = [];

        for (var c of connections)
        {
            if ((c.p1 == p || c.p2 == p) && !conns.find(c_ => c_ == c))
            {
                conns.push(c);
            }
        }
        return conns;
    }

    /*
    PointsConnection.getPointsPathLength([
        Point.getWhereName('B'), 
        Point.getWhereName('A'), 
        Point.getWhereName('K'), 
        Point.getWhereName('J')
    ]);
    */
    static getPointsPathLength(points, price = 0)
    {
        if (points.length <= 0) return price;

        for (var p of points)
        {
            var conns = this.getConnectionsFromPoint(p);

            points.shift();

            var neighborPoint, targetConn = null;

            for (var c of conns)
            {
                neighborPoint = p == c.p1 ? c.p2 : c.p1;

                if (neighborPoint == points[0])
                {
                    targetConn = c;
                    break;
                }
            }

            if (!targetConn)
            {
                return price;
            }

            price += targetConn.getPrice();

            return this.getPointsPathLength(points, price);
        }
    }

    static searchPoint(point, targetPoint, usedConns = [], pathConns = [])
    {
        var conns = this.getConnectionsFromPoint(point);
        
        for (var c of conns)
        {
            var exists = false;
            for (var pc of usedConns)
            {
                if (pc == c)
                {
                    exists = true;
                }
            }

            if (exists)
            {
                continue;
            } 
            else
            {
                c.highlighted = true;
                usedConns.push(c);
            }

            var neighborPoint = point == c.p1 ? c.p2 : c.p1;

            if (targetPoint == c.p1 || targetPoint == c.p2 || neighborPoint == targetPoint)
            {
                founds.push({
                    status: 'found',
                usedConns: usedConns});
            }

            pathConns.push(c);

            var result = PointsConnection.searchPoint(neighborPoint, targetPoint, usedConns, pathConns);

            if (result.status == 'found')
            {
            }
        }

        return {
            status: 'notfound',
            usedConns: usedConns,
            founds: founds,
        };
    }

    static getPointsBetween(p1, p2)
    {
        var conns = this.getConnectionsFromPoint(p1);

        for (var c of conns)
        {
            
        }
    }
    // LINE/POINT
    static linePoint(x1, y1, x2, y2, px, py)
    {
        // get distance from the point to the two ends of the line
        var d1 = dist(px,py, x1,y1);
        var d2 = dist(px,py, x2,y2);
    
        // get the length of the line
        var lineLen = dist(x1,y1, x2,y2);
    
        // since floats are so minutely accurate, add
        // a little buffer zone that will give collision
        var buffer = 1;    // higher # = less accurate
    
        // if the two distances are equal to the line's 
        // length, the point is on the line!
        // note we use the buffer here to give a range, 
        // rather than one #
        if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer)
        {
            return true;
        }
        return false;
    }
    
    static getHovered()
    {
        for (var c of connections)
        {
            if (c.hover) return c;
        }
        return null;
    }

    save()
    {
        return { p1: this.p1.uid, p2: this.p2.uid, price: this.price };
    }
}