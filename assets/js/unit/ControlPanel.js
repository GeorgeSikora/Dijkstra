/**
 * Control Panel - Panel Nástrojů
 *  Handles panel button events
 */
class ControlPanel
{
    static buttons;

    static init()
    {
        this.buttons = document.querySelectorAll('#main-panel .btn');

        this.buttons.forEach((btn) => {
            btn.onclick = () => {
                ControlPanel.buttonEvent(btn);
            };
        });
    }

    static buttonEvent(btn)
    {
        var actionName = btn.id.split('__')[1];
    
        dragPoint = null;
        startPoint = null;
    
        switch (actionName)
        {
            case 'cursor':
                this.toggleButton(btn);
                actionMode = actionName;
                break;
            case 'addpoint':
                this.toggleButton(btn);
                actionMode = actionName;
                break;
            case 'connection':
                this.toggleButton(btn);
                actionMode = actionName;
                break;
            case 'getpath':
                this.toggleButton(btn);
                actionMode = actionName;
                break;
            case 'fullscreen':
                var fs = fullscreen();
                fullscreen(!fs);
                break;
            case 'loadscene':
    
                var fileText = '[{"name":"Point","uid":"uid_1106630336391","data":{"name":"A","x":367,"y":366}},{"name":"Point","uid":"uid_1473397138106","data":{"name":"B","x":459,"y":212}},{"name":"Point","uid":"uid_1118384679312","data":{"name":"C","x":627,"y":379}},{"name":"Connection","uid":"uid_1492697047188","data":{"p1":"uid_1106630336391","p2":"uid_1473397138106"}},{"name":"Connection","uid":"uid_1418419382717","data":{"p1":"uid_1473397138106","p2":"uid_1118384679312"}},{"name":"Connection","uid":"uid_1448170838926","data":{"p1":"uid_1118384679312","p2":"uid_1106630336391"}}]';
    
                if (Scene.isClear())
                {
                    Scene.load(fileText);
                    return;
                }
    
                mcf.getConfirm('Načtením ztratíte aktuálně provedené změny!', () => {
    
                    Scene.load(fileText);
    
                });
    
                break;
    
            case 'savescene':
    
                Scene.save();
    
                break;
            case 'searchscene':
    
                break;
            case 'removescene':
    
                if (Scene.isClear()) break;
    
                mcf.getConfirm('Opravdu chcete vymazat celý pracovní prostor?', () => {
                    Scene.clear();
                });
                
                break;

            case 'build':
                Algorithm.build();
                break;
    
            case 'prevstep':
    
                break;
            
            case 'nextstep':
                Algorithm.nextStep();
                break;
    
            case 'finalresult':
    
                break;
    
    
            default:
                console.error('Undefined action from panel button! actionName is "' + actionName + '"');
                break;
        }
    }

    static clickButton(actionName)
    {
        const panelName = 'main-panel';
        
        var btn = document.getElementById(panelName + '__' + actionName);

        if (!btn) return;

        btn.click();
    }

    static toggleButton(btn)
    {
        this.buttons.forEach((b) => { 
            b.classList.remove('btn--selected'); 
        });

        btn.classList.add('btn--selected');
    }
}