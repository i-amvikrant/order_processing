part_no = 0;
module_no = 0;


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

function add_to_table(json,quant){

    var id,name,cost,tableid,reroute,index;
    name = json.name;

    if("PartID" in json){
        part_no +=1;
        index = part_no
        id = json.PartID;
        tableid = '#parts_table';
        cost = json.cost;
        reroute = 'part_detail';
    }
    else{
        module_no +=1;
        index = module_no
        id = json.designID;
        tableid = '#modules_table';
        cost = json.Total_cost;
        reroute = 'module_detail';
    }

    $(tableid).append(
        `
        <tr>
            <th scope="row">`+index+`</th>
            <td><a href ="http://localhost:8000/`+reroute+`/`+id+`">
            `+id+`<a>
            </td>
            <td>`+name+`</td>
            <td>`+quant+`</td>
            <td> ₹`+cost+`</td>
        </tr>
        `
    );

}

$(document).ready(function(){

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

    //console.log(typeof Sub_modules);
    if(parts!=0){
        $.ajax({
            url: 'http://localhost:8000/bon/sub_part/?designID='+designID,
            type: 'GET',
            success: function(data){
                for(x in data){
                    $.ajax({
                        url: 'http://localhost:8000/bon/part_detail/'+data[x].PartID,
                        type:'GET',
                        success: function(part){
                            add_to_table(part,data[x].quantity);
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert(String(textStatus) + String(XMLHttpRequest.responseText));
                        }
                    })
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(String(textStatus) + String(XMLHttpRequest.responseText));
            }
        });
    }
    
    if(Sub_modules!=0){
        $.ajax({
            url: 'http://localhost:8000/bon/sub_module/?designID='+designID,
            type: 'GET',
            success: function(data){
                for(x in data){
                    $.ajax({
                        url: 'http://localhost:8000/bon/module_detail/'+data[x].subID,
                        type:'GET',
                        success: function(mod){
                            add_to_table(mod,data[x].quantity);
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert(String(textStatus) + String(XMLHttpRequest.responseText));
                        }
                    })
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(String(textStatus) + String(XMLHttpRequest.responseText));
            }
        });
    }
    




    $('#delete-module').on('click', function(){
        
        if(confirm("Do you want the delete this module")){

            var del_url =  'http://localhost:8000/bon/module_detail/'+'{{designID}}';
            $.ajax({
                url: del_url,
                type: 'DELETE',
                success: function(result){
                    window.location.replace("/view_modules");
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert(String(textStatus) + String(XMLHttpRequest.responseText));
                }
            })

        }
    });
});