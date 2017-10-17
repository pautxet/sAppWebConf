/*
GNU Liscense - Pau and Arnau

usage:
------------------------------------------
  function SetValueToVar(arrayreturned){
    object.arrayofvalues=arrayreturned;
  }
  mPrompt(parametersQuantity, promptTitle, promptDescription, arrayparametersnames, originalValues, SetValueToVar);
------------------------------------------
parametersQuantity: how many parameters will the mPrompt ask for
promptTitle: main title for the mPrompt
promptDescription: description for the mPrompt
arrayparametersnames: an array with the name of the parameters. If send empty (""), it will display 'parameter'
originalValues: original values of the parameters, inside an array, if no values, send empty string ("")
SetValueToVar: function declared to set the values to the variable. Puts the values into an array
*/

function mPrompt(quantity, procname, description, arrayparametersnames, returnplace, funcgiv){
    if(document.getElementById('idprompt')==null)
    {
        var bgpanel = document.createElement('div');
        arraycontent=returnplace;
        bgpanel.id = 'idbgpanel';
        bgpanel.className = 'backgroundpanel';
        document.getElementsByTagName('body')[0].appendChild(bgpanel);
        var prompt = document.createElement('div');
        prompt.id = 'idprompt';
        prompt.className = 'caixaPrompt';
        prompt.quantity=quantity;
        prompt.descr=description;
        document.getElementsByTagName('body')[0].appendChild(prompt);
        cont="";
        cont+="<div class='Xshortcutbox' onclick='ClosemPrompt();'><b>X</b></div>";
        cont+="<b>"+procname+" parameters</b><hr>";
        cont+="<p>" + description +"</p>";
        for(var i=0; i<quantity; i++)
        {
            if(arrayparametersnames=="")
            {
                arrayparametersnames=["parameter"];
                for(ipar=0; ipar<quantity-1; ipar++)
                {
                    arrayparametersnames.push("parameter");
                }
            }
            if(arraycontent=="")
            {
                arraycontent=[""];
                for(ipar=0; ipar<quantity-1; ipar++)
                {
                    arraycontent.push("");
                }
            }
            cont+= arrayparametersnames[i] + ": <input type='text' onkeypress='inputCharDisabled(event)' name='fname' id='input"+i+"' value='" + arraycontent[i] + "'><br>";
        }
        cont+="<div class='submitbtn' onclick='SubmitmPrompt("+funcgiv+")'>OK</div>";
        idprompt.innerHTML= cont;
        jsPlumb.ready(function() {
            jsPlumb.draggable("idprompt", {
            });
        });
    }
}

function inputCharDisabled(e){
    if(e.which == 32){
        e.preventDefault();
    }else{
    }
}

function SubmitmPrompt(afuncgiv){
    var prompt=document.getElementById('idprompt');
    var arrayresponse="";
    arrayresponse=[document.getElementById("input"+0).value];
    for(var i=1; i<prompt.quantity; i++)
    {
        arrayresponse.push(document.getElementById("input"+i).value);
    }
    afuncgiv(arrayresponse);
    ClosemPrompt();
}
function ClosemPrompt(){
    returned= RemoveById('idprompt');
    returned= RemoveById('idbgpanel');
}
function RemoveById(id) {
    return (elem=document.getElementById(id)).parentNode.removeChild(elem);
}
