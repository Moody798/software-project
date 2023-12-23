$(document).ready(function () {
    $("#tbody").on("click", ".AddtoCart", function () {
      console.log("added");
      var id = $(this).attr("id");
      console.log(id);
      let end_point = "/api/v1/cart/new";
      console.log(end_point);
      console.log(parseInt(id)+1);
      let quantity =1;
      let data = {
        productId:parseInt(id), 
        quantity
      }
      $.ajax({
        type: "Post",
        url: end_point,
        data,
        success: function (data) {
          console.log(data);
          alert("successfully added");
        },
        error: function (data) {
          console.log("error message", data.responseText);
          alert(data.responseText);
        },
      });
    });
    $("#tbody").on("click", ".view", function () {
      console.log("view");
      var id = $(this).attr("id");
      console.log(id);
      let end_point = "/api/v1/product/view/" + `${id}`;
      console.log(end_point);
      $.ajax({
        type: "Get",
        data:id,
        success: function (data) {
          location.href = end_point;
        },
        error: function (data) {
          console.log("error message", data.responseText);
          alert(data.responseText);
        },
      });
    });
  });