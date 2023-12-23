$(document).ready(function () {
    $("#AddtoCart").click(function () {
        
      const id = $("#id").val();
      const quantity = $("#preferredQuantities").val();
      let data = {
        productId:parseInt(id), 
        quantity:parseInt(quantity)
      }
    let end_point = "/api/v1/cart/new";
    console.log(id);
    console.log(data);
    $.ajax({
        type: "Post",
        url: end_point,
        data,
        success: function (serverResponse) {
          if (serverResponse) {
            alert("successfully added");
            location.href = "/dashboard";
          }
        },
        error: function (data) {
          console.log("error message", data.responseText);
          alert(data.responseText);
        },
      });
    });
    });
  
  