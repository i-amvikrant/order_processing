var addedparts2 = {};
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

    //console.log(addedparts2);
    delete addedparts2[ID];
    delete modulecost[ID];
    //console.log(modulecost);
    
    $("#"+ID).remove();
}


function create_card(json){

    var id,nm,des,ty,image,cost,quant;

    nm = json.name;
    des = json.description;
    image = json.image;
    id = json.designID;
    cost = json.Total_cost;
    ty = json.Type;
    quant = addedparts2[id];

    $("#add_designs").append(`
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

function add_customer(json){
    $('#chose_cus').append(
        `
        <br>
        <label id=`+json.CustomerID+` class="btn btn-default" style="width:1150px;">
            <input type="radio" name="options" id="3">
            <div class='row'>
                <div class='col-sm-3'>
                    `+json.CustomerID+`
                </div>
                <div class='col-sm-3'>
                    `+json.name+`
                </div>
                <div class='col-sm-3'>
                    `+json.City+`
                </div>
                <div class='col-sm-3'>
                    `+json.poc+`
                </div>
            </div>
        </label>
        <br>
        `

    );
    
}

function customer_validate(){
    customerid = $('#CustomerID').val();
    if(customerid.length!=0){
        urlExists(api_base+'customer_detail/'+customerid+'/?format=json',function(exists){
            if(exists){
                alert("Enter a Unique Customer ID");
                return false;
            }
        })
    }
    else{
        alert('Please Enter customer id');
        return false;
    }
    name = $('#name').val();
    if(name.length==0){
        alert("Enter name");
        return false;
    }
    city = $('#City').val();
    if(city.length==0){
        alert("Enter City");
        return false;
    }
    add = $('#Address').val();
    if(add.length==0){
        alert("Enter Address");
        return false;
    }
    pin = $('#pin').val();
    if(pin.length==0){
        alert("Enter PIN");
        return false;
    }
    else if(pin.length!=6){
        alert("Enter a 6-digit pin only !")
        return
    }
    poc = $('#poc').val();
    if(poc.length==0){
        alert("Enter the name of the Point of Contact");
        return false;
    }
    con = $('#contact').val();
    if(con.length==0){
        alert("Enter the contact detail");
        return false;
    }
    else if(con.length!=10){
        alert("Enter a 10-digit number only !");
        return false;
    }
    return true;
}

function order_validate(){
    //console.log('order validation done');
    orderid = $('#orderID').val();
    if(orderid.length==0){
        alert("Enter Order id");
        return false;
    }
    else{
        urlExists(api_base+'order_detail/'+orderid+'/?format=json',function(exists){
            if(exists){
                alert("Enter a Unique order ID");
                return false;
            }
        })
    }
    due = $('#due').val();
    if(due.length==0){
        alert("Enter the number of days due");
        return false;
    }
    return true;
}

function print_order_summary(new_customer,order_data,cus_data){
    if(new_customer){
        for (pair of cus_data.entries()) {
            $('#order_summary').append(pair[0]+ ': ' + pair[1]+'<br>');
        }  
    }
    $('#order_summary').append('<br>');
    for (pair of order_data.entries()) {
        $('#order_summary').append(pair[0]+ ': ' + pair[1]+'<br>' );
    }

    $('#order_summary').append('<br>');
    $.each(addedparts2,function(key,val){
        $('#order_summary').append(key+": "+val+'<br>');
    });

    
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

    var list = ['#chose_customer',
                    '#customer_form',
                    '#select_customer',
                    '#select_designs',
                    '#order_details',
                    '#order_summary'];
    var cus_data,order_data;
    var stack = [];
    stack.push(0)
    var new_customer = false;
    var nameList2 = [];

    $.getJSON(api_base+"modules/?format=json", function (json) {

        $.each(json, function(key, val) {
            var design_id = val.designID;
            nameList2.push(design_id);
            });
    });
            console.log(nameList2);

    $("#design_id").autocomplete({source: nameList2});

    $('#design_add').on('click', function(){

        var quant2 = $('#quantity').val();
        var id2 = $("#design_id").val();
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


    $('#next').on('click',function(){
        var top = stack[stack.length-1];
        console.log(top);
        if(top==0){
            if($('#op1').hasClass('active')){
                new_customer=true;
                top+=1;
            }
            else if($('#op2').hasClass('active')){
                new_customer=false;
                top+=2;
            }
            else{
                alert("choose and option");
                return;
            }
            $('#previous').removeClass('hidden');
        }
        else if(top==1){
            cus_data = new FormData(document.getElementById('cus_form'));
            if(customer_validate()){
                top+=2;
            }
            else{
                return;
            }
        }
        else if(top==3){
            if(Object.keys(addedparts2).length==0){
                alert('add aleast one product');
                return;
            }
            else{
                top+=1;
            }
        }
        else if(top==list.length-2){
            order_data = new FormData(order_form);
            if(order_validate()){
                top+=1;
                $('#next').addClass('hidden');
                $('#submit').removeClass('hidden');
                print_order_summary(new_customer,order_data,cus_data);
            }
            else{
                return;
            }
        }
        else{
            top+=1;
        }
        $(list[stack[stack.length-1]]).addClass('hidden');
        stack.push(top);
        $(list[top]).removeClass('hidden');
        console.log(new_customer);

    });

    $('#previous').on('click',function(){
        var top = stack.pop();
        if(top==list.length-1){
            $('#submit').addClass('hidden');
            $('#order_summary1').empty();
            $('#next').removeClass('hidden');
        }
        if(top==list.length-2){
            order_data=null;
            $('#order_form').trigger('reset');
        }

        if(top==2 || top==1){
            new_customer=false
            cus_data=null;
            $('#cus_form').trigger('reset');
            $('#previous').addClass('hidden');
        }
        $(list[top]).addClass('hidden');
        $(list[stack[stack.length-1]]).removeClass('hidden');
        console.log(new_customer);

    });

    var url = api_base+"customers/?format=json";
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data){
            console.log(data);
            $.each(data,function(key,val){
                add_customer(val);
    
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(String(textStatus) + String(XMLHttpRequest.responseText));
        }
    });

    $('#submit').on('click',function(){
        var id;
        var flag=false;
        if(new_customer){
            id = $('#CustomerID').val();
            for (pair of cus_data.entries()) {
                console.log(pair[0]+ ', ' + pair[1]); 
            }
            $.ajax({
                type: "POST",
                url: api_base+"customers/",
                data: cus_data,
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
        }
        else{
            id = $("#chose_cus label.active").attr('id');
        }
        order_data.append('customerID',id);

        for (pair1 of order_data.entries()) {
            console.log(pair1[0]+ ', ' + pair1[1]);
        }
        
        $.ajax({
            type: "POST",
            url: api_base+"order_create/",
            data: order_data,
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
        console.log(addedparts2);
        var orderID = $('#orderID').val();
        for( s in addedparts2){
                        
            var payload = new FormData();
            payload.append("orderID",orderID);
            payload.append("productID", s);
            var mod_count = parseInt(addedparts2[s]);
            payload.append("quantity",mod_count);

            
            $.ajax({
                type: "POST",
                url: api_base+"product_list/",
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
    });
});