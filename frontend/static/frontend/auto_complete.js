$(document).ready(function(){
    var nameList = [];
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

        $('#b1').on('click', function(){

            if ($("#name_search_tags").val().length !=0){

                var id = $("#name_search_tags").val();

                $.getJSON("bon/part_detail/"+id+"/?format=json", function (json){

                    console.log(json);

                    $.each(json, function(key, val){
                        $("#write").append(val+"<br>");
                    });
    
                });

            }

            
        });
});


