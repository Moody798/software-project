$(document).ready(function () {
    $("#tbody").on("click", ".remove", function () {
      console.log("removed");
      var id = $(this).attr("id");
      console.log(id);
      $(this).parent().parent().remove();
      let end_point = "/api/v1/cart/delete/" + `${id}`;
      console.log(end_point);
      $.ajax({
        type: "DELETE",
        url: end_point,
        success: function (data) {
                alert("successfully deleted");
        },
        error: function (data) {
          console.log("error message", data.responseText);
          alert(data.responseText);
        },
      });
    });
    $("#tbody").on("click", ".update", function () {
      console.log("view");
      var id = $(this).attr("id");
      console.log(id);
      let end_point = "/api/v1/cart/edit/" + `${id}`;
      console.log(end_point);
      const quantity = $(this).parent().parent().children("#quantity").children("#quantity_input").val();
      console.log(quantity);
      const data = {
        quantity
      }
      $.ajax({
        type: "Put",
        url: end_point,
        data,
        success: function (serverResponse) {
            if (serverResponse) {
                alert("Updated Successfully");
                location.href = "/cart";
              }
        },
        error: function (data) {
          console.log("error message", data.responseText);
          alert(data.responseText);
        },
      });
    });
    $("#order").on("click", function () {
        console.log("order");
        let end_point = "/api/v1/order/new";
        console.log(end_point);
        $.ajax({
          type: "Post",
          url: end_point,
          success: function (data) {
            console.log(data);
            alert("successfully created");
            location.href = "/dashboard";
          },
          error: function (data) {
            console.log("error message", data.responseText);
            alert(data.responseText);
          },
        });
      });
  });