
//const DEFAULT_SCENE_DATA = '[{"name":"Point","uid":"uid_1106630336391","data":{"name":"A","x":349,"y":127}},{"name":"Point","uid":"uid_1473397138106","data":{"name":"B","x":88,"y":279}},{"name":"Point","uid":"uid_1118384679312","data":{"name":"C","x":268,"y":523}},{"name":"Point","uid":"uid_1538965246575","data":{"name":"D","x":720,"y":310}},{"name":"Point","uid":"uid_360054450349","data":{"name":"E","x":474,"y":406}},{"name":"Point","uid":"uid_1436731211327","data":{"name":"F","x":909,"y":238}},{"name":"Point","uid":"uid_333188672215","data":{"name":"H","x":676,"y":500}},{"name":"Point","uid":"uid_480333765715","data":{"name":"I","x":920,"y":430}},{"name":"Point","uid":"uid_1523094011329","data":{"name":"J","x":617,"y":165}},{"name":"Point","uid":"uid_1342470678973","data":{"name":"K","x":739,"y":57}},{"name":"Connection","uid":"uid_1492697047188","data":{"p1":"uid_1106630336391","p2":"uid_1473397138106"}},{"name":"Connection","uid":"uid_1418419382717","data":{"p1":"uid_1473397138106","p2":"uid_1118384679312"}},{"name":"Connection","uid":"uid_1448170838926","data":{"p1":"uid_1118384679312","p2":"uid_1106630336391"}},{"name":"Connection","uid":"uid_3616219005","data":{"p1":"uid_1106630336391","p2":"uid_1538965246575"}},{"name":"Connection","uid":"uid_1386946928143","data":{"p1":"uid_360054450349","p2":"uid_1118384679312"}},{"name":"Connection","uid":"uid_1066416056794","data":{"p1":"uid_1436731211327","p2":"uid_1538965246575"}},{"name":"Connection","uid":"uid_1375060173020","data":{"p1":"uid_360054450349","p2":"uid_1538965246575"}},{"name":"Connection","uid":"uid_107631408938","data":{"p1":"uid_360054450349","p2":"uid_1106630336391"}},{"name":"Connection","uid":"uid_273834929949","data":{"p1":"uid_360054450349","p2":"uid_333188672215"}},{"name":"Connection","uid":"uid_76376633007","data":{"p1":"uid_333188672215","p2":"uid_480333765715"}},{"name":"Connection","uid":"uid_471998841881","data":{"p1":"uid_480333765715","p2":"uid_360054450349"}},{"name":"Connection","uid":"uid_1171916618614","data":{"p1":"uid_480333765715","p2":"uid_1538965246575"}},{"name":"Connection","uid":"uid_199479988683","data":{"p1":"uid_1538965246575","p2":"uid_1523094011329"}},{"name":"Connection","uid":"uid_377574606444","data":{"p1":"uid_1523094011329","p2":"uid_1342470678973"}},{"name":"Connection","uid":"uid_1579616627792","data":{"p1":"uid_1342470678973","p2":"uid_1106630336391"}}]';
const DEFAULT_SCENE_DATA = '[{"name":"Point","uid":"uid_818019431798","data":{"name":"A","x":314.828125,"y":271.96965195246173}},{"name":"Point","uid":"uid_527768357139","data":{"name":"B","x":502.828125,"y":161.98132427843808}},{"name":"Point","uid":"uid_515972473127","data":{"name":"C","x":508.828125,"y":376.95851018675717}},{"name":"Point","uid":"uid_678690014014","data":{"name":"D","x":731.828125,"y":157.98174872665538}},{"name":"Point","uid":"uid_1078398944227","data":{"name":"E","x":734.828125,"y":375.95861629881153}},{"name":"Connection","uid":"uid_828118039758","data":{"p1":"uid_818019431798","p2":"uid_527768357139","price":10}},{"name":"Connection","uid":"uid_1562225057694","data":{"p1":"uid_527768357139","p2":"uid_515972473127","price":1}},{"name":"Connection","uid":"uid_235405295592","data":{"p1":"uid_515972473127","p2":"uid_818019431798","price":3}},{"name":"Connection","uid":"uid_564988251484","data":{"p1":"uid_515972473127","p2":"uid_1078398944227","price":2}},{"name":"Connection","uid":"uid_1579758606269","data":{"p1":"uid_515972473127","p2":"uid_678690014014","price":8}},{"name":"Connection","uid":"uid_231123711617","data":{"p1":"uid_678690014014","p2":"uid_527768357139","price":2}},{"name":"Connection","uid":"uid_1091443816262","data":{"p1":"uid_678690014014","p2":"uid_1078398944227","price":7}}]';
var mainContainer = document.getElementById('main-container');

var actionMode = 'cursor';

var points = [];
var connections = [];

var dragPoint, startPoint;
var mousePressPos, mouseOffset;

function setup()
{
    var canvasSize = getCanvasSize();
    createCanvas(canvasSize.w, canvasSize.h);

    Scene.load(DEFAULT_SCENE_DATA);
}

function draw()
{
    clear();
    switch (actionMode)
    {
        case 'cursor': 
            cursor('default');
            break;
        case 'addpoint':
            cursor('grabbing');
            break;
        case 'connection':
            cursor('crosshair');
            break;
            
        default:
            cursor(0);
            break;
    }
    
    if (dragPoint)
    {
        var tx, ty, collision, collDist; // colDist - collision distance
        tx = mouseX + mouseOffset.x; // targetX
        ty = mouseY + mouseOffset.y; // targetY
    
        collision = false;

        for (const cr of collisionRules)
        {
            var ruleRes = cr(dragPoint, tx, ty); // rule result

            if (ruleRes)
            {
                collision = true;
                
                var dx, dy, angle;

                dx = tx - ruleRes.collider.x;
                dy = ty - ruleRes.collider.y;

                angle = atan2(dx, dy);

                dragPoint.x = ruleRes.collider.x + sin(angle) * ruleRes.collDist;
                dragPoint.y = ruleRes.collider.y + cos(angle) * ruleRes.collDist;
            }
        }
        
        if (!collision)
        {
            dragPoint.x = tx;
            dragPoint.y = ty;
        }
    }
    
    if (!document.getElementById('ctxmenu')?.matches(':hover'))
    {
        connections.forEach(p => {
            p.refresh();
        });
        points.forEach(p => {
            p.refresh();
        });
    }

    connections.forEach(p => {
        p.draw();
    });
    Connection.draw();

    points.forEach(p => {
        p.draw();
    });
    Point.draw();

    fill(0);
    stroke(255);
    strokeWeight(2);
    textSize(12);
    textAlign(LEFT, TOP);
    text('FPS: ' + parseInt(frameRate()) + '\nBodů: ' + points.length + '\nPropojení: ' + connections.length, 4, 4);
}

function mousePressed()
{
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

    mousePressPos = { x: mouseX, y: mouseY };

    for (var p of points)
    {
        p.mousePressed();
    }

    switch (actionMode) 
    {
        case 'cursor':

            if (mouseButton != LEFT) break;

            points.forEach(p => {
                
                if (p.hover && !dragPoint)
                {
                    dragPoint = p;
                    mouseOffset = {
                        x: p.x - mouseX,
                        y: p.y - mouseY
                    };
                }
            });
            break;

        case 'addpoint':
            points.push(new Point(Point.getNextLetter(), mouseX  - 12, mouseY - 14));
            break;

        case 'connection':

            if (startPoint)
            {
                for (p of points)
                {
                    if (p.hover && p != startPoint)
                    {
                        var exists = false;

                        for (c of connections)
                        {
                            if (c.p1 == startPoint && c.p2 == p || c.p2 == startPoint && c.p1 == p)
                            {
                                exists = true;
                            }
                        }
                        
                        if (!exists)
                        {
                            connections.push(new Connection(startPoint, p));
                        }

                        startPoint = null;
                    }
                }
                break;
            }

            points.forEach(p => {
                
                if (p.hover && !startPoint)
                {
                    startPoint = p;
                }
            });
            break;
        default:
            break;
    }
}

function mouseReleased()
{
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

    dragPoint = null;
    
    for (var p of points)
    {
        p.mouseReleased();
    }
}

function keyPressed()
{
    if (document.getElementById("modal").style.display == 'block') return;

    if (keyCode == ESCAPE || key == ' ')
    {
        clickPanelButton('cursor');
    }
    if (key == 'b' || key == 'B')
    {
        clickPanelButton('addpoint');
    }
    if (key == 'p' || key == 'P')
    {
        clickPanelButton('connection');
    }
    if (key == 'c' || key == 'C')
    {
        clickPanelButton('getpath');
    }
}

function windowResized()
{
    var canvasSize = getCanvasSize();
    resizeCanvas(canvasSize.w, canvasSize.h);
}

function getCanvasSize()
{
    return {
        w: mainContainer.clientWidth - 12,
        h: mainContainer.clientWidth / 16 * 9
    };
}