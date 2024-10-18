$(document).ready(function() {
    $('#taskForm').submit(function(event) {
      event.preventDefault(); // Prevent the default form submission

      // Get the date input value
      const dateInput = $('#deadline').val();
      const date = new Date(dateInput);

      // Format the date
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);

      // Set the formatted date to the hidden input
      $('#formattedDeadline').val(formattedDate);

      // Submit the form
      this.submit();
    });
});