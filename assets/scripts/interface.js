
const totalsDiv     = document.getElementById('path-totals');
const branchingDiv  = document.getElementById('path-branching');

var totals = [];
var branches = [];

class Total
{
    constructor(point)
    {
        this.uid = mcf.uniqueID();

        this.point = point;
        this.name = point.name;

        this.actualVal = Infinity;

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
            if (Branch.isExists(t.point)) continue;

            if (t.actualVal < (lowest?.actualVal ?? Infinity))
            {
                lowest = t;
            }
        }
        
        return lowest;
    }
}

class Branch
{
    constructor(point)
    {
        this.uid = mcf.uniqueID();

        this.point = point;
        this.name = point.name;
        this.rows = [];
        this.linesSvg = null;
        
        this.lowestCost = Infinity;

        this.build();
    }

    build()
    {
        var container = document.createElement('div');
        container.id = this.uid;
        
        var h4 = document.createElement('h4');
        h4.innerText = (branches.length + 1) + '.';
        container.appendChild(h4)

        var branchRow = this.branchRow = document.createElement('div');
        branchRow.classList.add('point-line');
        container.appendChild(branchRow);

            var rowMainPoint = document.createElement('div');
            rowMainPoint.classList.add('point-line__point');
            rowMainPoint.innerText = this.name;
            branchRow.appendChild(rowMainPoint);

            var pointRow = this.pointRow = document.createElement('div');
            pointRow.classList.add('point-line__row');
            branchRow.appendChild(pointRow);

            this.linesSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this.linesSvg.id = mcf.uniqueID();
            this.linesSvg.style.width       = 150;
            this.linesSvg.style.height      = 900;
            this.linesSvg.style.position    = 'absolute';
            this.linesSvg.style.zIndex      = -1;
            this.linesSvg.style.strokeWidth =  2;
            this.linesSvg.style.stroke      = '#888';
            this.linesSvg.innerHTML         = 'Sorry, your browser does not support inline SVG.';
            branchRow.appendChild(this.linesSvg);

        branchingDiv.appendChild(container);

        
        var connections = this.connections = Connection.getConnectionsFromPoint(this.point);

        for (var c of connections)
        {
            var neighborPoint = this.point == c.p1 ? c.p2 : c.p1;

            if (!Branch.isExists(neighborPoint))
            {
                this.addBranchLine(c, neighborPoint);
            }
        }

        /*
        <h4>1.</h4>
        <div class="point-line">
            <div class="point-line__point">B</div>

            <div class="point-line__row">
                <div class="point-line__row__value"><strong>B = 8</strong> A <i class="fa-light fa-arrow-right-long"></i> B <i class="fa-light fa-arrow-right-long"></i> D <i class="fa-light fa-arrow-right-long"></i> F <i class="fa-light fa-arrow-right-long"></i> Z </div>
                <div class="point-line__row__value"><strong>B = 8</strong> A <i class="fa-light fa-arrow-right-long"></i> B <i class="fa-light fa-arrow-right-long"></i> D <i class="fa-light fa-arrow-right-long"></i> F <i class="fa-light fa-arrow-right-long"></i> Z </div>
                <div class="point-line__row__value"><strong>B = 8</strong> A <i class="fa-light fa-arrow-right-long"></i> B <i class="fa-light fa-arrow-right-long"></i> D <i class="fa-light fa-arrow-right-long"></i> F <i class="fa-light fa-arrow-right-long"></i> Z </div>
                <div class="point-line__row__value"><strong>B = 8</strong> A <i class="fa-light fa-arrow-right-long"></i> B <i class="fa-light fa-arrow-right-long"></i> D <i class="fa-light fa-arrow-right-long"></i> F <i class="fa-light fa-arrow-right-long"></i> Z </div>
            </div>

            <svg id="testsvg" height="500" width="150" style="position: absolute; z-index: -1; stroke-width: 2; stroke:#888;">
                Sorry, your browser does not support inline SVG.
            </svg>
        </div>
        */
    }

    addBranchLine(conn, point)
    {
        const svg = document.getElementById(this.linesSvg.id);

        var x1, y1, x2, y2;
        x1 = 21;
        y1 = 21;
        
        x2 = 128;
        y2 = 21 + 48 * (svg.childNodes.length - 1);
        
        var rowValue = document.createElement('div');
        rowValue.classList.add('point-line__row__value');

        const arrow = ' <i class="fa-light fa-arrow-right-long"></i> ';
        var html = '';
        html += '<strong>' + point.name + ' = ' + conn.getPrice() + '</strong> ';

        var points_ = [
            /*
            Point.getWhereName('B'),
            Point.getWhereName('A'),
            Point.getWhereName('K'),
            Point.getWhereName('J'),
            */
        ];

        points_.push(Algorithm.mainPoint);
        
        // TODO: najít všechny možné trasy mezi dvěma body

        if (Algorithm.mainPoint != this.point) points_.push(this.point);
        points_.push(point);

        var pathCost = Connection.getPointsPathLength([...points_]);

        if (pathCost < this.lowestCost)
        {
            this.lowestCost = pathCost;
        }

        html += '(';
        for (var i in points_)
        {
            html += (i != 0 ? arrow : '') + points_[i].name;
        }
        html += ' = ' + pathCost + ')';

        rowValue.innerHTML = html;
        this.pointRow.appendChild(rowValue);

        var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        newLine.setAttribute('x1', x1);
        newLine.setAttribute('y1', y1);
        newLine.setAttribute('x2', x2);
        newLine.setAttribute('y2', y2);
        svg.appendChild(newLine);
    }

    static isExists(point)
    {
        for (var b of branches)
        {
            if (b.point == point) return true;
        }
        return false;
    }

    static last()
    {
        if (branches.length <= 0) return null;
        return branches[branches.length-1];
    }
}

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
            var t = new Total(p);
            totals.push(t);
        }

        /* add branches */
        for (var p of points)
        {
            var t = Total.getWherePoint(p);
            
            if (p == points[0])
            {
                t.addValue(0);
                branches.push(new Branch(p));
            }
            else
            {
                t.addInfinity();
            }
            /*
            t.addValue(3);
            t.addDisconected();
            t.addInfinity();
            */
                if (Connection.getConnectionsFromPoint(p).length <= 0)
                {
                    t.addDisconected();
                }
        }
    }

    static nextStep()
    {
        /* get last branch */
        var b = Branch.last();

        if (!b)
        {
            return;
        }

        var t = Total.getWherePoint(b.point);
    
        if (!t)
        {
            return;
        }

        /* Add all points to Total */
        for (var c of b.connections)
        {
            var neighborPoint = b.point == c.p1 ? c.p2 : c.p1;
            var total = Total.getWherePoint(neighborPoint);
            var price = c.getPrice();
            console.log(price);
                
            if (price < total.actualVal)
            {
                total.addValue(price);
            }
        }

        var lowestTotal = Total.getLowestUnused();

        if (lowestTotal)
        {
            branches.push(new Branch(lowestTotal.point));
        }
    }
}

const mainSketch = document.getElementById('main-sketch');

mainSketch.oncontextmenu = (e) => {

    e.preventDefault();

    if (document.getElementById("ctxmenu")) return;

    let menu = document.createElement("div");
    menu.id = "ctxmenu";
    menu.style = `top:${e.pageY - 8}px;left:${e.pageX - 8}px`;
    menu.addEventListener('contextmenu', function (e) {
        e.preventDefault(); 
    }, false);

    menu.onmouseleave = () => {
        ctxmenu.outerHTML = '';
    }

    var p = Point.getHovered();

    if (p)
    {
        var renameBtn = document.createElement('p');
        renameBtn.innerText = 'Přejmenovat';
        renameBtn.onclick = () => {
            mcf.getValue('Přejmenování bodu', p.name, 'Potvrdit', (val) => {
                p.name = val;
            });
        };
        menu.appendChild(renameBtn);

        var removeBtn = document.createElement('p');
        removeBtn.innerText = 'Odstranit';
        removeBtn.onclick = () => {
            p.remove();
        };
        menu.appendChild(removeBtn);

        document.body.appendChild(menu);
        return;
    }

    var c = Connection.getHovered();

    if (c)
    {
        var changeValBtn = document.createElement('p');
        changeValBtn.innerText = 'Změnit hodnotu';
        changeValBtn.onclick = () => {
            mcf.getValue('Přejmenování bodu', c.price, 'Potvrdit', (val) => {
                c.price = parseInt(val);
            });
        };
        menu.appendChild(changeValBtn);

        var removeBtn = document.createElement('p');
        removeBtn.innerText = 'Odstranit';
        removeBtn.onclick = () => {
            c.remove();
        };
        menu.appendChild(removeBtn);
        
        document.body.appendChild(menu);
        return;
    }
}