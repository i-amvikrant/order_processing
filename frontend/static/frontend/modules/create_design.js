
var addedparts = {};
var addedparts2 = {};

var partcost = {};
var modulecost = {};


function urlExists(url, callback){
    $.ajax({
      type: 'HEAD',
      url: url,
      success: function(){
        callback(true);
      },
      error: function() {
        callback(false);
      }
    });
  }

  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function remove_part(ID){

    if(ID in addedparts){
        console.log(addedparts);
        delete addedparts[ID];
        delete partcost[ID];
        console.log(partcost);
    }
    else{
        console.log(addedparts2);
        delete addedparts2[ID];
        delete modulecost[ID];
        console.log(modulecost);
    }
    
    $("#"+ID).remove();
}


function create_card(json){

    var id,nm,des,ty,image,cost,quant;

    nm = json.name;
    des = json.description;
    image = json.image;

    if("PartID" in json){
        id = json.PartID;
        cost = json.cost;
        ty = json.partType;
        quant = addedparts[id];
    }
    else{
        id = json.designID;
        cost = json.Total_cost;
        ty = json.Type;
        quant = addedparts2[id];
    }

    $("#write").append(`
        <div id="`+id+`" class="panel panel-default">
        <div class='row align-items-center'>
            <div class="panel-body ">
            <div class = "col-sm-1 text-center">
                <p class="card-text">`+id+`</p>
            </div>
            <div class = "col-sm-1 text-center">
                <p class="card-text">`+nm+`</p>
            </div>
            <div class = "col-sm-3 text-center">
                <p class="card-text">`+des+`</p>
            </div>
            <div class = "col-sm-1 text-center">
                <p class="card-text">`+ty+`</p>
            </div>
            <div class = "col-sm-3 text-center">
                <p class="card-text"><img src="`+image+`" class="img-thumbnail" alt="Cinque Terre"></a></p>
            </div>
            <div class = "col-sm-1 text-center">
                <p class="card-text">`+cost+`</p>
            </div>
            <div class = "col-sm-1 text-center">
                <p class="card-text">`+quant+`</p>
            </div>
            <div class = "col-sm-1 center-block">
                <p class="card-text ">
                <button type="button" class="btn btn-danger" onclick = "remove_part('`+id+`')">
                remove</button>
                </p>
            </div>
            </div>
            </div>
        </div>`
    );

}


$(document).ready(function(){
    var nameList = [];
    var nameList2 = [];
    
    var csrftoken = getCookie('csrftoken');
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $.getJSON(api_base+"parts_autocomplete/?format=json", function (json) {
        
        $.each(json, function(key, val) {
            var part_id = val.PartID;
            nameList.push(part_id);
            //var string = nameList.toString();
            });
    });
        //console.log(nameList);
    
    $("#name_search_tags").autocomplete({source: nameList});

    $.getJSON(api_base+"modules/?format=json", function (json) {

        $.each(json, function(key, val) {
            var design_id = val.designID;
            nameList2.push(design_id);
            //var string = nameList2.toString();
            });
    });
            //console.log(nameList2);

    $("#name_search_tags2").autocomplete({source: nameList2});

    $('#b1').on('click', function(){

        var quant = $('#quantity').val();
        var id = $("#name_search_tags").val();
        var index = nameList.indexOf(id);

        if (id.length !=0 && quant.length!=0 && index!=-1){
            if(!(id in addedparts)){
                addedparts[id]=quant;
                $.getJSON(api_base+"part_detail/"+id+"/?format=json", function (json){
                    partcost[id]=json.cost;
                    create_card(json);
                });
            }
            else{
                alert("part already present");
            }
        }
        else if(index==-1){
            alert("Part not present in the database");
        }
        else{
            alert('you have Either missed the PartID or the quantity');
        }
    });

    $('#b2').on('click', function(){

        var quant2 = $('#quantity2').val();
        var id2 = $("#name_search_tags2").val();
        var index2 = nameList2.indexOf(id2);

        if (id2.length !=0 && quant2.length!=0 && index2!=-1){

            if(!(id2 in addedparts2)){
                addedparts2[id2]=quant2;

                $.getJSON(api_base+"module_detail/"+id2+"/?format=json", function (json){
                    console.log(json);
                    modulecost[id2] = json.Total_cost;
                    create_card(json);
                });
            }
            else{
                alert("module already present");
            } 
        }
        else if(index2==-1){
            alert("module not present in the database");
        }
        else{
            alert('you have Either missed the moduleID or the quantity');
        }
    });

    $('#test').on('click', function(){

        var designID = $('#designID').val();
        var nm = $('#name').val();
        var des = $('#description').val();
        var ty = $('#type').val();
        var img = $('#myfile')[0].files[0];
        var inv = 1;
        var dfee = parseInt($('#design_fee').val());
        var afee = parseInt($('#assembly_fee').val());

        var flag = false;

        if(designID.length!=0){
            
            urlExists(api_base+'module_detail/'+designID+'/?format=json', function(exists){
                if(exists){
                    alert("Give a unique design ID");
                }
                else{
                    var newform = new FormData();
                    newform.append("designID", designID);
                    newform.append("name",nm);
                    newform.append("description",des);
                    newform.append("Type",ty);
                    if(img!=undefined){
                        newform.append("image",img);
                    }
                    else{
                        console.log("uee");
                    }
                    newform.append("inventory",inv);
                    newform.append("design_fee",dfee);
                    newform.append("assembly_fee",afee);

                    //console.log(newform);

                    $.ajax({
                        type: "POST",
                        url: api_base+"modules/",
                        data: newform,
                        async: false,
                        timeout: 30000,
                        contentType: false,
                        processData: false,
                        success: function(data){
                            console.log(data);
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert(String(textStatus) + String(XMLHttpRequest.responseText));
                        }
                    });
                
                    for( x in addedparts){
                        //console.log(x);
                        
                        var pay= new FormData();
                        pay.append("designID", designID);
                        pay.append("PartID", x);
                        var part_quant = parseInt(addedparts[x]);
                        //console.log("The answer you need :",part_quant);
                        pay.append("quantity", part_quant);

                        $.ajax({
                            type: "POST",
                            url: api_base+"sub_part/",
                            data: pay,
                            contentType: false,
                            processData: false,
                            success: function(data){
                                flag = true
                                console.log(data);
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                flag= false;
                                alert("some error " + String(errorThrown) + String(textStatus) + String(XMLHttpRequest.responseText));
                            }
                        });
                    }
                    //console.log("Hereee",addedparts2);
                    for( s in addedparts2){
                        
                        var payload = new FormData();
                        payload.append("designID",designID);
                        payload.append("subID", s);
                        var mod_count = parseInt(addedparts2[s]);
                        payload.append("quantity",mod_count);

                        $.ajax({
                            type: "POST",
                            url: api_base+"sub_module/",
                            data: payload,
                            contentType: false,
                            processData: false,
                            success: function(data){
                                flag = true;
                                console.log(data,flag);

                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                alert("some error " + String(errorThrown) + String(textStatus) + String(XMLHttpRequest.responseText));
                                flag = false;
                            }
                        });
                        }

                        

                        $(document).ajaxStop(function(){
                            //console.log("this should be last",flag);
                            if(flag){
                                window.location.replace("/");
                            }

                        });
                        
                }
            });
        }
        else{
            alert("enter the design ID");
        }
        });
});



