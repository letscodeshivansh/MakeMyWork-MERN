$(document).ready(function() {
    $('.deadline-date').each(function() {
        const dateStr = $(this).text();
        const date = new Date(dateStr);
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        $(this).text(formattedDate);
    });
});

// New JavaScript code to toggle nav items
$(document).ready(function() {
    $('.nav-icons-btn').click(function() {
        $('.nav-items').toggle(); /* Toggle the display of navigation items */
    });
});