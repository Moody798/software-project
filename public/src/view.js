$(document).ready(function () {
    $("#Update").click(function () {
        
      const id = $("#id").val();
      const name = $("#name").val();
      const quantity = $("#quantity").val();
      const price = $("#price").val();
      const category = $("#category").val();
      const description = $("#description").val();
      const data = {
        name,
        quantity,
        price,
        category,
        description,
      };
    let end_point = "/api/v1/product/edit/" + `${id}`;
    console.log(id);
    console.log(data);
      $.ajax({
        type: "Put",
        url: end_point,
        data,
        success: function (serverResponse) {
          if (serverResponse) {
            alert("Updated Successfully");
            location.href = "/product";
          }
        },
        error: function (errorResponse) {
          if (errorResponse) {
            alert(`error: ${errorResponse.responseText}`);
          }
        },
      });
    });
  });
  