
function display_part(data){

    $('#partlist').append(
        `
        <div class="panel panel-default">
            <a href ="`+base+`part_detail/`+data.PartID+`">
            <div class="panel-body vcenter" >
                <div class='col-sm-2'>
                <p style="padding: 0px; margin: 0px;">`+data.PartID+`<p>
                <h3 style="padding: 0px; margin: 0px;">`+data.name+`</h3>
                </div>
                <div class="col-sm-2">
                <p style="padding: 0px;">description</p>
                <div>
                `+data.description+`
                </div>
                </div>
                <div class="col-sm-6">
                <div class="col-sm-4">
                    <p>Type</p>
                    <h3 style="padding: 0px; margin: 0px;">`+data.partType+`</h2>
                </div>
                <div class="col-sm-4">
                    <p>VendorID</p>
                    <h3 style="padding: 0px; margin: 0px;">`+data.vendorID+`</h2>
                </div>
                <div class="col-sm-4">
                    <p>cost</p>
                    <h3 style="padding: 0px; margin: 0px;">₹`+data.cost+`</h2>
                </div>
                </div>
                <div class='col-sm-2'>
                <p>
                    <img src="`+data.image+ `" class="img-thumbnail" alt="Cinque Terre"></a>
                </p>
                </div>
            </div>
            </a>
        </div>`
    )
    
}

$(document).ready(function(){
    //console.log(api_base);
    var nameList=[];
    var prevscroll_value = 0;
    $.getJSON(api_base+"parts_autocomplete/?format=json", function (json) {
        
        $.each(json, function(key, val) {
            var part_id = val.PartID;
            var part_name = val.name;
            nameList.push(part_id);
            nameList.push(part_name);
            });
    });
    $("#PartID").autocomplete({source: nameList});


    var head = api_base+"parts/?limit=5&format=json";
    var next ;
    $.getJSON(head, function(json){
        $.each(json.results,function(key,val){
            console.log(json.next);
            next = json.next;
            display_part(val);

        });
    });

    $('#part_search').on('click',function(){
        var keyword = $('#PartID').val();
        //console.log("http://localhost:8000/bon/parts/?search="+keyword+"&limit=5&format=json");
        $('#partlist').empty();
        head = api_base+"parts/?search="+keyword+"&limit=5&format=json";
        $.getJSON(head,function(json){
            console.log(json);
            $.each(json.results,function(key,val){
                next=json.next;
                prevscroll_value=0;
                display_part(val);
            });
        });

    });

    $(window).scroll(function(){
        scroll_value = Math.ceil(window.innerHeight+window.scrollY)
        if(scroll_value>=document.body.offsetHeight && prevscroll_value<scroll_value){
            if(next!=null || next!=head){
                prevscroll_value = scroll_value;
                $.getJSON(next, function(json){
                    next = json.next;
                    $.each(json.results,function(key,val){
                        display_part(val);
                    });
                });
            }




        }

    });






});