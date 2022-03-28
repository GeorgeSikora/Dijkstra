/**
 * Branch - Větev
 *  Branching of individual points
 */

 class PointBranch
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
 
         
         var connections = this.connections = PointsConnection.getConnectionsFromPoint(this.point);
 
         for (var c of connections)
         {
             var neighborPoint = this.point == c.p1 ? c.p2 : c.p1;
 
             if (!PointBranch.isExists(neighborPoint))
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
 
         var pathCost = PointsConnection.getPointsPathLength([...points_]);
 
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