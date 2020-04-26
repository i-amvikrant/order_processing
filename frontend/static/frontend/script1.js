
var addedparts = [];
var addedparts2 = [];
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

function checkifpresent(id){
    for(x in addedparts){
        if(addedparts[x][0]==id){
            return false;
        }
    }
    return true;
}

function checkifpresent2(id){
    for(x in addedparts2){
        if(addedparts2[x][0]==id){
            return false;
        }
    }
    return true;
}

function remove_part(partID){

    var val;

    for(x in addedparts){
        if(addedparts[x][0]==partID){
            val = addedparts[x];
        }
    }

    const ind = addedparts.indexOf(val);
    addedparts.splice(ind,1);
    console.log(addedparts);
    $("#"+partID).remove();


}

function remove_part2(partID){

    var val;

    for(x in addedparts2){
        if(addedparts2[x][0]==partID){
            val = addedparts2[x];
        }
    }

    const ind = addedparts2.indexOf(val);
    addedparts2.splice(ind,1);
    console.log(addedparts2);
    $("#"+partID).remove();


}

function create_card(json){

    var val;

    for(x in addedparts){
        if(addedparts[x][0]==json.PartID){
            val = addedparts[x];
        }
    }

    $("#write").append(`
        <div id="`+json.PartID+`" class="card">
        <div class='row align-items-center'>
            <div class="card-body">
            
            <div class = "col-sm-1">
                <p class="card-text">`+json.PartID+`</p>
            </div>
            <div class = "col-sm-1 ">
                <p class="card-text">`+json.name+`</p>
            </div>
            <div class = "col-sm-3 ">
                <p class="card-text">`+json.description+`</p>
            </div>
            <div class = "col-sm-1">
                <p class="card-text">`+json.partType+`</p>
            </div>
            <div class = "col-sm-3">
                <p class="card-text"><img src="`+json.image+`" class="img-thumbnail" alt="Cinque Terre"></a></p>
            </div>
            <div class = "col-sm-1">
                <p class="card-text">`+json.cost+`</p>
            </div>
            <div class = "col-sm-1">
                <p class="card-text">`+val[1]+`</p>
            </div>
            <div class = "col-sm-1">
                <p class="card-text"><button type="button" class="btn btn-info" onclick = "remove_part('`+val[0]+`')">remove</button></p>
            </div>
            </div>
            </div>
        </div>`
    );

}


function create_card2(json){

    var val;

    for(x in addedparts2){
        if(addedparts2[x][0]==json.designID){
            val = addedparts2[x];
        }
    }
    console.log(val);

    $("#write").append(`
        <div id="`+json.designID+`" class="card">
        <div class='row align-items-center'>
            <div class="card-body">
            
            <div class = "col-sm-1">
                <p class="card-text">`+json.designID+`</p>
            </div>
            <div class = "col-sm-1 ">
                <p class="card-text">`+json.name+`</p>
            </div>
            <div class = "col-sm-3 ">
                <p class="card-text">`+json.description+`</p>
            </div>
            <div class = "col-sm-1">
                <p class="card-text">`+json.Type+`</p>
            </div>
            <div class = "col-sm-3">
                <p class="card-text"><img src="`+json.image+`" class="img-thumbnail" alt="Cinque Terre"></a></p>
            </div>
            <div class = "col-sm-1">
                <p class="card-text">`+json.Total_cost+`</p>
            </div>
            <div class = "col-sm-1">
                <p class="card-text">`+val[1]+`</p>
            </div>
            <div class = "col-sm-1">
                <p class="card-text"><button type="button" class="btn btn-info" onclick = "remove_part2('`+val[0]+`')">remove</button></p>
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

    $.getJSON("bon/parts/?format=json", function (json) {
        for (x in json){
            console.log(json[x].image);
        }
        
        $.each(json, function(key, val) {
            var part_id = val.PartID;
            nameList.push(part_id);
            var string = nameList.toString();
            });
    });
        console.log(nameList);
    
    $("#name_search_tags").autocomplete({source: nameList});

        $.getJSON("bon/modules/?format=json", function (json) {
    
            $.each(json, function(key, val) {
                var design_id = val.designID;
                nameList2.push(design_id);
                var string = nameList2.toString();
                });
        });
            console.log(nameList2);

    $("#name_search_tags2").autocomplete({source: nameList2});

    $('#b1').on('click', function(){

        var quant = $('#quantity').val();
        var id = $("#name_search_tags").val();

        if (id.length !=0 && quant.length!=0){

            var value = [id,quant];

            

            if(checkifpresent(id)){
                addedparts.push(value);

                $.getJSON("bon/part_detail/"+value[0]+"/?format=json", function (json){

                    create_card(json);

                });
            }
            else{
                alert("part already present");
            }
            
        }
        else{
            alert('you have Either missed the PartID or the quantity');
        }
    });

    $('#b2').on('click', function(){

        var quant2 = $('#quantity2').val();
        var id2 = $("#name_search_tags2").val();

        if (id2.length !=0 && quant2.length!=0){

            var value2 = [id2,quant2];



            if(checkifpresent2(id2)){
                addedparts2.push(value2);

                $.getJSON("bon/module_detail/"+value2[0]+"/?format=json", function (json){
                    console.log(json);
                    create_card2(json);

                });
            }
            else{
                alert("module already present");
            }
            
        }
        else{
            alert('you have Either missed the moduleID or the quantity');
        }
    });

    $('#test').on('click', function(){

        var designID = $('#designID').val();
        console.log(designID);

        if(designID.length!=0){
            
            urlExists('bon/module_detail/'+designID+'/?format=json', function(exists){
                if(exists){
                    alert("Give a unique design ID");
                }
                else{
                    
                }
            });

            for( x in addedparts){
                console.log(addedparts[x]);
    
                
                var data1 = {};
                data1["designID"] = designID;
                data1["PartID"] = addedparts[x];
                data1["quantity"] = 3;
                console.log(data1);
    
                var val1 = JSON.stringify(data1, null, '\t');
    
                $.ajax({
                    type: "POST",
                    url: "bon/sub_part/",
                    data: val1,
                    contentType: "application/json; charset=utf-8",
                    success: function(data){
                        alert(data);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert("some error " + String(errorThrown) + String(textStatus) + String(XMLHttpRequest.responseText));
                    }
                });
    
            }

        }
        else{
            alert("enter the design ID");
        }
        
        });


});



