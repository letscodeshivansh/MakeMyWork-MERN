<script>
  // Example using jQuery
  $("form").submit(function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Perform the form submission using AJAX
    $.ajax({
      url: "/postwork",
      type: "POST",
      data: new FormData(this),
      processData: false,
      contentType: false,
      success: function(response) {
        // Show an alert with the success message
        alert("Task Successfully saved: " + response);
      },
      error: function(xhr, status, error) {
        // Show an alert with the error message
        alert("Error: " + error);
      }
    });
  });
</script>
