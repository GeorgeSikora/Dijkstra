/**
 * Total - Součet
 *  Table with changing values ​​of the shortest paths to points
 */

 class PointTotal
 {
    constructor(point)
    {
        this.uid = mcf.uniqueID();

        this.point = point;
        this.name = point.name;

        this.actualVal = Infinity;

        this.shortestPath = {
            points: [Algorithm.mainPoint], cost: 0
        };
        
        this.build();
    }

    /*
    <div class="point-line">
        <div class="point-line__point">A</div>
        <div class="point-line__value">0</div>
        <div class="point-line__value">23</div>
        <div class="point-line__value point-line--selected">11</div>
    </div>
    */

    build()
    {
        var container = this.container = document.createElement('div');
        container.id = this.uid;
        container.classList.add('point-line');

            var linePoint = document.createElement('div');
            linePoint.classList.add('point-line__point');
            linePoint.innerText = this.name;
            container.appendChild(linePoint);

        totalsDiv.appendChild(container);
    }
    
    removeSelected()
    {
        var selected = this.container.querySelector('.point-line--selected');
        if (!selected) return;
        selected.classList.remove('point-line--selected');
    }

    addValue(val)
    {
        this.removeSelected();

        this.actualVal = val;

        var lineValue = document.createElement('div');
        lineValue.classList.add('point-line__value', 'point-line--selected');
        lineValue.innerText = val;
        this.container.appendChild(lineValue);
    }

    addInfinity()
    {
        this.removeSelected();

        this.actualVal = Infinity;

        var lineValue = document.createElement('div');
        lineValue.classList.add('point-line__value', 'point-line--selected', 'point-line--infinity');
        lineValue.innerText = '∞';
        this.container.appendChild(lineValue);
    }

    addDisconected()
    {
        this.removeSelected();

        var lineValue = document.createElement('div');
        lineValue.classList.add('point-line__value', 'point-line--selected', 'point-line--not-connected');

            var icon = document.createElement('i');
            icon.classList.add('fa-solid', 'fa-plug-circle-xmark');
            lineValue.appendChild(icon);

        this.container.appendChild(lineValue);
    }

    static getWherePoint(point)
    {
        for (var t of totals)
        {
            if (t.point == point) return t;
        }
    }

    static getLowestUnused()
    {
        if (totals.length <= 0) return null;

        var lowest = null;

        for (var t of totals)
        {
            if (PointBranch.isExists(t.point)) continue;

            if (t.actualVal < (lowest?.actualVal ?? Infinity))
            {
                lowest = t;
            }
        }
        
        return lowest;
    }
}