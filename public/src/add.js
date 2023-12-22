$(document).ready(function () {
  $("#Create").click(function () {
    const name = $("#name").val();
    const quantity = $("#quantity").val();
    const rating = $("#rating").val();
    const category = $("#category").val();
    const price = $("#price").val();
    const description = $("#description").val();

    const data = {
      name,
      quantity,
      rating,
      category,
      price,
      description,
    };

    $.ajax({
      type: "POST",
      url: "/api/v1/product/new ",
      data,
      success: function (serverResponse) {
        if (serverResponse) {
          alert("Created Successfully");
          location.href = "/add";
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
