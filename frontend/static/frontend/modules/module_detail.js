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

function add_to_table(json,index){

    var id,name,cost,tableid,reroute,quantity;

    if("PartID" in json){
        id = json.PartID;
        name = json.part_name;
        tableid = '#parts_table';
        cost = json.part_cost;
        reroute = 'part_detail';
        quantity =json.quantity;
    }
    else{
        id = json.subID;
        name = json.sub_name;
        tableid = '#modules_table';
        cost = json.sub_cost;
        reroute = 'module_detail';
        quantity =json.quantity;
    }

    $(tableid).append(
        `
        <tr>
            <th scope="row">`+(parseInt(index)+1)+`</th>
            <td><a href ="http://localhost:8000/`+reroute+`/`+id+`">
            `+id+`<a>
            </td>
            <td>`+name+`</td>
            <td>`+quantity+`</td>
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
            success: function(data1){
                for(x1 in data1){
                    console.log(data1[x1]);
                    add_to_table(data1[x1],x1);
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
            success: function(data2){
                for(x2 in data2){
                    console.log(data2[x2]);
                    add_to_table(data2[x2],x2);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(String(textStatus) + String(XMLHttpRequest.responseText));
            }
        });
    }
    




    $('#delete-module').on('click', function(){
        
        if(confirm("Do you want the delete this module")){

            var del_url =  'http://localhost:8000/bon/module_detail/'+designID;
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