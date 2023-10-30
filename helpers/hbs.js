const moment = require('moment')

module.exports = {
    formatDate: function(date, format) {
        return moment(date).format(format)
    },

    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },
    editIcon: function (eventUser, loggedUser, eventId, floating = true) {
        if (eventUser._id.toString() == loggedUser._id.toString()) {
          if (floating) {
            return `<a href="/events/edit/${eventId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
          } else {
            return `<a href="/events/edit/${eventId}"><i class="fas fa-edit"></i></a>`
          }
        } else {
          return ''
        }
      },
      select: function (selected, options) {
        return options
          .fn(this)
          .replace(
            new RegExp(' value="' + selected + '"'),
            '$& selected="'
          )
          .replace(
              new RegExp('>' + selected + '</option>'),
              ' selected="selected"$&'
          )
      },
}
