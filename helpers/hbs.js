const moment = require("moment");

module.exports = {
  // Helper to format dates using moment.js
  formatDate: function (date, format) {
    return moment(date).format(format);
  },

  // Helper to strip HTML tags from a given input
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },

  // Helper to generate an edit icon based on user authorization
  editIcon: function (eventUser, loggedUser, eventId, isAdmin, floating = true) {
    if (
        eventUser &&
        eventUser._id &&
        loggedUser &&
        loggedUser._id &&
        (isAdmin || eventUser._id.toString() === loggedUser._id.toString())
    ) {
        if (floating && eventUser._id.toString() === loggedUser._id.toString()) {
            return `<a href="/events/edit/${eventId}" class="btn-floating"><i class="fas fa-edit fa-small"></i></a>`;
        }  else {
            return `<a href="/events/edit/${eventId}"><i class="fas fa-edit"></i></a>`;
        }
    } else {
        return '';
    }
},

  // Helper to handle selected options in dropdowns
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(new RegExp(' value="' + selected + '"'), '$& selected="')
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected="selected"$&'
      );
  },
};
