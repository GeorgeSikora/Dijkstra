
const totalsDiv     = document.getElementById('path-totals');
const branchingDiv  = document.getElementById('path-branching');

var totals = [];
var branches = [];

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

    var c = PointsConnection.getHovered();

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