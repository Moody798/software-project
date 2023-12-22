$(document).ready(function () {
  $("#tbody").on("click", ".delete", function () {
    console.log("removed");
    var id = $(this).attr("id");
    console.log(id);
    $(this).parent().parent().remove();
    let end_point = "/api/v1/product/delete/" + `${id}`;
    console.log(end_point);
    $.ajax({
      type: "DELETE",
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