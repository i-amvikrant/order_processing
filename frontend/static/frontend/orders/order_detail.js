
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

    var id = json.productID;
    var name = json.product_name;
    var cost = json.product_cost;
    var quantity =json.quantity;
    var type = json.product_type;
    var image = "http://localhost:8000"+json.product_image;
    console.log(image);

    $('#products_table').append(
        `
        <tr>
            <th class = 'col-sm-1'>`+(parseInt(index)+1)+`</th>
            <td class = 'col-sm-2'><a href ="http://localhost:8000/module_detail/`+id+`">
            `+id+`<a>
            </td>
            <td class = 'col-sm-2'>`+name+`</td>
            <td class = 'col-sm-2'>`+type+`</td>
            <td class = 'col-sm-1'>`+quantity+`</td>
            <td class = 'col-sm-2'> ₹`+cost+`</td>
            <td class = 'col-sm-2'><img src = "`+image+`" class="img-thumbnail" alt="Cinque Terre"></td>
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

    $('#'+status).attr("selected","selected");

    var index = 0;
    console.log(count);
    if(count!=0){
        $.ajax({
            url: 'http://localhost:8000/bon/product_list/?orderID='+id,
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





    $('#update').on('click',function(){
        var new_status = $('#status').val();
        var des = $('#status_description').val();
        var up_data =new FormData();
        up_data.append('status',new_status);
        up_data.append('status_description',des);
        for (pair of up_data.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        $.ajax({
            type: "PUT",
            url: "http://localhost:8000/bon/order_update/"+id+"/",
            data: up_data,
            contentType: false,
            processData: false,
            success: function(data){
                console.log(data);
                location.reload();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(String(textStatus) + String(XMLHttpRequest.responseText));
            }
        });
    });

});