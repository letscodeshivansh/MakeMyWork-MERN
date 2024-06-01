<script>
  $(document).ready(function() {
    // Fetch the index.html file when the page loads
    $.get("../templates/index.html", function() {
      // Once index.html is fetched, bind the form submission event
      $("#taskForm").submit(function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Perform the form submission using AJAX
        $.ajax({
          url: "/postwork",
          type: "POST",
          data: new FormData(this),
          processData: false,
          contentType: false,
          success: function(response) {
            window.location.href = "../templates/index.html";
            // Show an alert with the success message
            alert("Task Successfully saved");
            // Redirect to the index page
          },
          error: function(xhr, status, error) {
            // Show an alert with the error message
            alert("Error: " + error);
          }
        });
      });
    });
  });
</script>
