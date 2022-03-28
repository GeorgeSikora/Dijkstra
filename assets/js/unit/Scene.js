
class Scene
{
    static load(fileText)
    {
        this.clear();
        
        var fileObj = JSON.parse(fileText);

        for (var o of fileObj)
        {
            var name    = o.name;
            var uid     = o.uid;
            var data    = o.data;

            switch (name)
            {
                case 'Point':
                    var p = new Point(data.name, data.x, data.y);
                    p.uid = uid;
                    points.push(p);
                    break;

                case 'Connection':
                    var c = new PointsConnection();
                    c.uid = uid;
                    c.price = data.price;
                    c.p1 = points.find(p => p.uid === data.p1);
                    c.p2 = points.find(p => p.uid === data.p2);
                    connections.push(c);
                    break;
            }
        }
    }

    static save()
    {
        var dataArray = [];
                
        for (var p of points)
        {
            dataArray.push({ name: 'Point', uid: p.uid, data: p.save()});
        }
        for (var c of connections)
        {
            dataArray.push({ name: 'Connection', uid: c.uid, data: c.save()});
        }

        downloadFile(JSON.stringify(dataArray), 'dijkstrSpace.txt', 'text/plain');
    }

    static clear()
    {
        points = [];
        connections = [];
    }

    static isClear()
    {
        return points.length == 0 && connections.length == 0;
    }

    static downloadFile(data, filename, type)
    {
        var file = new Blob([data], {type: type});
    
        if (window.navigator.msSaveOrOpenBlob)  // IE10+
        {
            window.navigator.msSaveOrOpenBlob(file, filename);
        }
        else
        { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }
}