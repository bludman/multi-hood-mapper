Mapper = Mapper || {};

Mapper.MapperApp = Backbone.Model.extend({

  initialize: function() {
    var config = Mapper.Config;
    var hood;

    var setActiveHood = _.bind(function($el) {
      $('.hoodlist li').removeClass('active');
      hood = $el.addClass('active').data('hood');
      this.traceBorder(hood);
    }, this);

    $('.hoodlist li').click(function(e) {
      setActiveHood($(e.currentTarget));
    });

    $('td').click(_.bind(function(e) {
      var $el = $(e.currentTarget);
      var $parent = $el.parent();
      var col = $parent.children().index($el);
      var row = $parent.parent().children().index($parent);
      $(e.currentTarget).toggleClass(hood);
      this.traceBorder(hood);
    }, this));

    $(document).keypress(function(e) {
      var index = e.keyCode - 49;
      setActiveHood($('.hoodlist li').eq(index));
    });

    this.import(Mapper.Config.hoods);
    setActiveHood($('.hoodlist li').eq(0));
    console.log('App initialized');
  },

  traceBorder: function(hood) {
    var maxRow = Mapper.MapperApp.ROWS;
    var maxCol = Mapper.MapperApp.COLS;
    var cell = null;
    $('#map td')
        .removeClass('top')
        .removeClass('bottom')
        .removeClass('right')
        .removeClass('left');

    for (var row = 0; row < maxRow; row++) {
      for (var col = 0; col < maxCol; col++) {
        cell = this.cell(row, col);
        if (cell.hasClass(hood)) {
          if (row > 0 && !this.cell(row - 1, col).hasClass(hood)) {
            cell.addClass('top');
          }

          if (col > 0 && !this.cell(row, col - 1).hasClass(hood)) {
            cell.addClass('left');
          }

          if (row < maxRow - 1 && !this.cell(row + 1, col).hasClass(hood)) {
            cell.addClass('bottom');
          }

          if (col < maxCol - 1 && !this.cell(row, col + 1).hasClass(hood)) {
            cell.addClass('right');
          }
        }
      }
    }
  },

  cell: function(row, col) {
    return $('#map tr').eq(row).find('td').eq(col);
  },

  export: function() {
    var maxRow = Mapper.MapperApp.ROWS;
    var maxCol = Mapper.MapperApp.COLS;
    var hoodNames = ['red', 'blue', 'yellow'];
    var hoods = [];
    var cells;
    var hoodName;

    for (var idx = 0; idx < hoodNames.length; idx++) {
      cells = [];
      hoodName = hoodNames[idx];

      for (var row = 0; row < maxRow; row++) {
        for (var col = 0; col < maxCol; col++) {
          if (this.cell(row, col).hasClass(hoodName)) {
            cells.push([row, col]);
          }
        }
      }

      hoods.push({
        name: hoodName,
        cells: cells
      });
    }

    return hoods;
  },

  import: function(hoods) {
    $('#map td').removeClass();
    _.each(hoods, _.bind(function(hood) {
      _.each(hood.cells, _.bind(function(cell) {
        var row = cell[0];
        var col = cell[1];
        this.cell(row, col).addClass(hood.name);
      }, this));
    }, this));
  }
}, {
  ROWS: 10,
  COLS: 10
});
