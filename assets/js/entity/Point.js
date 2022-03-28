/**
 * Point - Bod
 * points in the canvas window
 */

class Point
{
    constructor(name = 'A', x = 0, y = 0)
    {
        this.uid = mcf.uniqueID();

        this.name = name;
        this.x = x;
        this.y = y;
        
        this.hover = false;
        this.selected = false;
    }
    
    refresh()
    {
        if (actionMode == 'cursor' || actionMode == 'connection')
        {
            this.hover = (abs(mouseX - this.x) < 48 /2 && abs(mouseY - this.y) < 48 /2 || this == dragPoint) && (!Point.getHovered() || Point.getHovered() == this);
        }

        if (actionMode == 'cursor')
        {
            if (this.hover) cursor(HAND);
        }
    }

    draw()
    {
        noStroke();
        if (this.hover) fill('#caf'); else fill('#84f');

        if (this.selected)
        {
            fill(255);
            stroke('#84f');
            strokeWeight(2);
        }
        ellipse(this.x, this.y, 48, 48);

        noStroke();
        fill('#fff');
        
        if (this.selected)
        {
            fill('#000');
        }
        textSize(14 + 12 / this.name.length);
        textAlign(CENTER, CENTER)
        text(this.name, this.x, this.y);
    }

    static draw()
    {
        switch (actionMode)
        {
            case 'addpoint':
                noStroke();
                fill('#caf');
                ellipse(mouseX - 12, mouseY - 14, 48, 48);
        
                fill('#fff');
                textSize(28);
                textAlign(CENTER, CENTER)
                text(Point.getNextLetter(), mouseX  - 12, mouseY - 14);
                break;
        
            default:
                break;
        }
    }

    mousePressed()
    {

    }

    mouseReleased()
    {
        if (dist(mouseX, mouseY, mousePressPos.x, mousePressPos.y) < 8 && mouseButton == LEFT && !document.getElementById('ctxmenu')?.matches(':hover'))
        {
            this.selected = this.hover && !this.selected;
        }
    }

    static getLastLetter()
    {
        var biggestLetter = '@'; // code: 64 ... before 'A'

        for (var p of points)
        {
            if (p.name.length != 1) continue;

            if (p.name.toUpperCase() > biggestLetter)
            {
                biggestLetter = p.name;
            }
        }

        return biggestLetter;
    }

    static getWhereName(name)
    {
        for (var p of points)
        {
            if (p.name == name) return p;
        }
        return null;
    }

    static getNextLetter()
    {
        var letter = Point.getLastLetter();

        if (letter == 'Z') return ':)';

        return String.fromCharCode(letter.charCodeAt(0) + 1);
    }

    static getSelected()
    {
        for (var p of points)
        {
            if (p.selected) return p;
        }
        return null;
    }

    static getHovered()
    {
        for (var p of points)
        {
            if (p.hover) return p;
        }
        return null;
    }

    getIndex()
    {
        for (var index in points)
        {
            if (points[index] == this) return index;
        }
        return null;
    }

    remove()
    {
        for (var i = points.length-1; i >= 0; i--)
        {
            if (points[i] == this)
            {
                points.splice(i, 1);
            }
        }
        
        for (var i = connections.length-1; i >= 0; i--)
        {
            if (connections[i].p1 == this || connections[i].p2 == this)
            {
                connections.splice(i, 1);
            }
        }
    }

    save()
    {
        return { name: this.name, x: this.x, y: this.y };
    }
}