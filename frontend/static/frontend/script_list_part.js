
function display_part(data){

    $('#partlist').append(
        `
        <div class="panel panel-default">
            <a href ="http://localhost:8000/part_detail/`+data.PartID+`">
            <div class="panel-body vcenter" >
                <div class='col-sm-2'>
                <p style="padding: 0px; margin: 0px;">`+data.PartID+`<p>
                <h2 style="padding: 0px; margin: 0px;">`+data.name+`</h2>
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
                    <h3 style="padding: 0px; margin: 0px;">$`+data.cost+`</h2>
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
    var nameList=[];
    $.getJSON("http://localhost:8000/bon/parts_autocomplete/?format=json", function (json) {
        
        $.each(json, function(key, val) {
            var part_id = val.PartID;
            nameList.push(part_id);
            });
    });
    $("#PartID").autocomplete({source: nameList});

    $('#part_search').on('click',function(){

        var searchID = $('#PartID').val();
        if(searchID.length==0){
            alert("Fill the search box first");
        }
        else if(nameList.indexOf(searchID)==-1){
            alert("No such part present");
        }
        else{
            window.location.replace("/part_detail/"+searchID);
        }

    });


    var head = "http://localhost:8000/bon/parts/?limit=5&format=json";
    var next ;
    $.getJSON(head, function(json){
        $.each(json.results,function(key,val){
            console.log(json.next);
            next = json.next;
            display_part(val);

        });
    });

    $(window).scroll(function(){
        if((window.innerHeight+window.scrollY)+1>=document.body.offsetHeight){
            if(next!=null || next!=head){
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