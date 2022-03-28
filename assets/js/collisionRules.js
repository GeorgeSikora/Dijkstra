
var collisionRules = [

    /* Collision with other points */
    function (dragPoint, tx, ty) {

        for (p of points)
        {
            if (p == dragPoint) continue;

            if (dist(tx, ty, p.x, p.y) < 48)
            {
                return { collider: p, collDist: 48 };
            }
        }
    },

    /* Collision of neighbor of the connection */
    function (dragPoint,  tx, ty) {

        for (c of connections)
        {
            if (!c.p1 || !c.p2) continue;

            var dp, np; // drag point, neighbor point

            if (c.p1 == dragPoint)
            {
                dp = c.p1;
                np = c.p2;
            }
            if (c.p2 == dragPoint)
            {
                dp = c.p2;
                np = c.p1;
            }

            if (!dp || !np) continue;

            if (dist(tx, ty, np.x, np.y) < 100)
            {
                return { collider: np, collDist: 100 };
            }
        }
    },
];