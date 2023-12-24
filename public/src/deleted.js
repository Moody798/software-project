$(document).ready(function () {
    $("#tbody").on("click", ".restore", function () {
      console.log("removed");
      var id = $(this).attr("id");
      console.log(id);
      $(this).parent().parent().remove();
      let end_point = "/api/v1/product/restore/" + `${id}`;
      console.log(end_point);
      $.ajax({
        type: "PUT",
        url: end_point,
        success: function (data) {
          console.log(data);
        },
        error: function (data) {
          console.log("error message", data.responseText);
          alert(data.responseText);
        },
      });
    });
  });
