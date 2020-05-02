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

    $.getJSON("http://localhost:8000/bon/vendors/?format=json", function (json) {
        
        $.each(json, function(key, val) {
            var vendor_id = val.vendorID;
            var name = val.name;
            $('#vendorID').append(
                '<option value="'+vendor_id+'">'+name+'</option>'
            );
            });
    });

    $('form').submit(function(e){

      e.preventDefault();

      var x =$('form')[0];
      var data1 =  new FormData(x);
      

      $.ajax({
        type: "POST",
        url: "http://localhost:8000/bon/parts/",
        data: data1,
        async: false,
        contentType: false,
        processData: false,
        timeout: 30000,
        success: function(data){
            window.location.replace("/view_parts");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(String(textStatus) + String(XMLHttpRequest.responseText));
        }
    });
    });

});