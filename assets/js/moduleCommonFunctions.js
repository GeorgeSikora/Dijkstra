
var moduleCommonFunctions = {
    
    uniqueID: () =>
    {
        return 'uid_' + Math.floor(Math.random() * Date.now())
    },

    /**
     * --------------------------------------------------------------------------
     * Add notification
     * --------------------------------------------------------------------------
     * @var string - ok / warn / error
     * @var message - string of message text
     */
    
    addNotification: (type, message) => 
    {
        var uuid = mcf.uniqueID();
    
        var newNotification = `
            <div id="${uuid}" class="msg ${type}">
                <p>${message}</p>
                <i class="closeIcon far fa-times" onclick="mcf.closeNotification('${uuid}')"></i>
            </div>
        `;

        setTimeout(() => {
            mcf.closeNotification(uuid);
        }, 4000);
    
        $('.notifications').append(newNotification);
    },
    
    closeNotification: (id) =>
    {
        $(`#${id}`).addClass('fadeout');

        setTimeout(() => {
            $(`#${id}`).remove();
        }, 200);
    },

    post: (url, data, onresponse, uid) =>
    {
        if (window[uid] == true)
        {
            console.log('Post is already created!');
            return;
        }

        if (uid !== undefined) 
        {
            console.log('Post creating UID: ' + uid);
            window[uid] = true;
        }

        console.log(data);

        fetch(url.includes('http') ? url : BASE_URL + '/' + url, {
            method : 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data  => {
        
            console.log('mcf.post response:', data);

            if (data.code == 500)
            {
                mcf.addNotification('error', `POST with url:<br><small><i>${url}</i></small><br>returns an <b>error 500</b> (Type Error)`);
                return;
            }

            if (data.code == 404)
            {
                mcf.addNotification('error', `POST with url:<br><small><i>${url}</i></small><br>returns an <b>error 404</b> (Not Found)`);
                return;
            }
            
            if (data.status && data.message)
            {
                mcf.addNotification(data.status, data.message);
            }
            
            if (onresponse) 
            {
                onresponse(data);
            }
            
            window[uid] = false;
        })
        .catch(error => {

            if (DEVELOPMENT)
            {
                mcf.addNotification('error', error);
            }
            else
            {
                mcf.addNotification('error', 'Interní chyba serveru.');
            } 

            window[uid] = false;
        });
    },

    /**
     * --------------------------------------------------------------------------
     * Open Modal
     * --------------------------------------------------------------------------
     * @var url - string of target local html template
     * @var data - object with data
     * @var onload - function when the modal has finished loading
     */
    
    openModal: (url, data, onload) =>
    {
        var fd = new FormData();

        for (const property in data) {
            fd.append(property, data[property]);
        }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', BASE_URL + '/' + url, true);
        xhr.onload = function () {
            
            /* zobrazení modalu */
            $('#modal').show();
        
            /* nastavení vnitřního obsahu modalu */
            //document.querySelector('#modal').innerHTML = this.responseText;
            $('#modal').html(this.responseText);
        };
        xhr.send(fd)
    },

    /**
     * --------------------------------------------------------------------------
     * Open Modal Template
     * --------------------------------------------------------------------------
     * @var url - string of target local html template
     * @var variables - object with strings that need to be replaced over a key
     * @var onload - function when the modal has finished loading
     */
    
    openModalTemplate: (templateFile, variables, onload) =>
    {
        /* vytvoření requestu pro získání šablony v html */
        var request = new XMLHttpRequest();

        /* vytvoření GET requestu pro danou url */
        request.open('GET', PUBLIC_URL + '/assets/templates/' + templateFile + '.html', true); // true - asynchronní

        /* nastavení requestu při příjmu dat */
        request.onload = function() 
        {
            /* vnitřní kod se provede jen v případě že request neselže */
            if (request.status >= 200 && request.status < 400)
            {
                /* response string z templatu html */
                var resp = request.responseText;

                /* vymění všechny proměnné, které je třeba do šablony doložit */
                for (const v in variables) 
                {
                    const key = v; // klíč proměnné např: {title}
                    const val = variables[v]; // proměnná za kterou se má klíč vyměnit

                    // záměna všech výskytů tohoto klíče ze šablony
                    resp = resp.replaceAll(`{${key}}`, val);
                }

                /* nastavení vnitřního obsahu modalu */
                document.querySelector('#modal').innerHTML = resp;
                //$('#modal').html(resp);
                        
                /* zobrazení modalu */
                document.getElementById('modal').style.display = 'block';
                //$('#modal').show();

                /* v případě že je deklarována funkce po načtení, vykoná ji */
                if (onload)
                {
                    onload();
                }
            }
        };

        /* pošle se nastavený request */
        request.send();
    },

    loadTemplateToDiv: (divId, templateFile, onload) => 
    {
        /* vytvoření requestu pro získání šablony v html */
        var request = new XMLHttpRequest();

        /* vytvoření GET requestu pro danou url */
        request.open('GET', PUBLIC_URL + '/assets/templates/' + templateFile + '.html', true); // true - asynchronní

        /* nastavení requestu při příjmu dat */
        request.onload = function() 
        {
            /* vnitřní kod se provede jen v případě že request neselže */
            if (request.status >= 200 && request.status < 400)
            {
                /* response string z templatu html */
                var resp = request.responseText;

                /* nastavení vnitřního obsahu divu */
                $('#' + divId).html(resp);

                /* v případě že je deklarována funkce po načtení, vykoná ji */
                if (onload)
                {
                    onload();
                }
            }
        };

        /* pošle se nastavený request */
        request.send();
    },

    closeModal: () =>
    {
        document.getElementById('modal').style.display = 'none';
        //$('#modal').hide();
    },

    alert: (titleText) =>
    {
        mcf.openModalTemplate('alertModal', {
            
            title: titleText,

        });
    },

    getConfirm: (titleText, onConfirm, onCancel) =>
    {

        mcf.onConfirm = onConfirm;
        mcf.onCancel = onCancel;

        mcf.openModalTemplate('getConfirmModal', {
            
            title: titleText,

        });
    },

    getValue: (titleText = 'Zadejte hodnotu', defaultInputValue = '', confirmText = 'Potvrdit', onConfirm, onCancel) =>
    {

        mcf.onConfirm = onConfirm;
        mcf.onCancel = onCancel;

        mcf.openModalTemplate('getValueModal', {
            
            title:              titleText,
            defaultInputValue:  defaultInputValue,
            confirmText:        confirmText,
            inputUid:           mcf.uniqueID(),

        });
    },
    
    uploadImage: (settings = {}, response) =>
    {
        settings.title          = settings.title ?? 'Nahrání obrázku';
        settings.upload_folder  = settings.upload_folder ?? 'temp';
        settings.image_uid      = settings.image_uid == '' || !settings.image_uid ? 'null' : settings.image_uid;
        settings.base_url       = BASE_URL;
        settings.func_response  = mcf.uniqueID();
        settings.aspect_ration  = settings.aspect_ration ?? NaN;
    
        window[settings.func_response] = response;

        mcf.openModalTemplate('imageUploadModal', settings);
    },

    colorToHex(color) 
    {
        var hexadecimal = color.toString(16);
        return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
    },
      
    convertRGBtoHex(red, green, blue) 
    {
        return '#' + this.colorToHex(red) + this.colorToHex(green) + this.colorToHex(blue);
    },

    randomColor()
    {
        return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    },
}

var mcf = moduleCommonFunctions;

window.addEventListener('load', (event) => {
    /*
	mcf.addNotification('ok', 'Vše se podařilo');
	mcf.addNotification('warn', 'Chce to zadat heslo!');
	mcf.addNotification('error', 'Uživatel s tímto emailem je již registrovaný!');
    */
});