/*

   Name:              David Bui
   Email address:     David_Bui@student.uml.edu
   Affiliation:       Student at UMass Lowell in course COMP 4610 GUI Programming I
   Date file created: November 16, 2016
   Short Description: This is the JavaScript file for my assignment. It does all of
                      the calculations necessary to get the input, calculate the
                      output, and then physically display it on screen in a table.

*/

/* Performs validation */
$(document).ready(function() {

    var sliderOpts = {
        min : -10 ,
        max : 10 ,
        value : 0 ,
        slide : function( e, ui ) {
            var strInputID = "#" + e.target.id.substr( 6, 1 ).toLowerCase() + e.target.id.substr( 7 ) ;

            $( strInputID ).val( ui.value ) ;
        }
    };

    $('#sliderXBegin').slider( sliderOpts ) ;
    $('#sliderXEnd').slider( sliderOpts ) ;
    $('#sliderYBegin').slider( sliderOpts ) ;
    $('#sliderYEnd').slider( sliderOpts ) ;

    /*
        Credit goes to here for providing the greaterThan and lessThan methods
        http://stackoverflow.com/questions/14347177/how-can-i-validate-that-the-max-field-is-greater-than-the-min-field
    */
    $.validator.addMethod("greaterThan",
                          function(value, element, param) {
                              var $min = $(param);
			      if (this.settings.onfocusout) {
				  $min.off(".validate-greaterThan").on("blur.validate-greaterThan", function() {
				      $(element).valid();
				  });
			      }
			      return parseInt(value) > parseInt($min.val());
			  }, "The maximum value has to be greater than the minimum value.");

    $.validator.addMethod("lessThan",
			  function(value, element, param) {
			      var $max = $(param);
			      if (this.settings.onfocusout) {
				  $max.off(".validate-lessThan").on("blur.validate-lessThan", function() {
				      $(element).valid();
				  });
			      }
			      return parseInt(value) < parseInt($max.val());
			  }, "The minimum value has to be less than the maximum value.");

        /* 
            Checks to make sure values are inputted
            Looks to see if ranges exist
            Make sure that minimum value is less than maximum value
        */
    $('#input').validate({
        rules: {
            rowMins: {
		required: true,
		range: [-100, 100],
		lessThan: '#rowMaxs'
            },
            rowMaxs: {
		required: true,
		range: [-100, 100],
		greaterThan: "#rowMins"
            },
            columnMins: {
		required: true,
		range: [-100, 100],
		lessThan: '#columnMaxs'
            },
            columnMaxs: {
		required: true,
		range: [-100, 100],
		greaterThan: '#columnMins'
            }
        },

          /* Error messages */
        messages: {
            rowMins: {
		required: "Enter the minimum row value.",
		lessThan: "The minimum row value must be smaller than the maximum row value."
            },
            rowMaxs: {
		required: "Enter the maximum row value.",
		greaterThan: "The maximum row value must be greater than the minimum row value."
            },
            columnMins: {
		required: "Enter the minimum column value.",
		lessThan: "The minimum column value must be smaller than the maximum column value."
            },
            columnMaxs: {
		required: "Enter the maximum column value.",
		greaterThan: "The maximum column value must be greater than the minimum column value."
            }
        }
    });

        /* Obtains parameters from url bar */
    $.urlParam = function(name) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

	return results[1] || 0;
    }
        
        /* Acquires Query url parameters or sets default values of null */
    var rowMinimums = parseInt(($.urlParam('rowMins') !== null ? $.urlParam('rowMins') : 0));
    var rowMaximums = parseInt(($.urlParam('rowMaxs') !== null ? $.urlParam('rowMaxs') : 1));
    var columnMinimums = parseInt(($.urlParam('columnMins') !== null ? $.urlParam('columnMins') : 0));
    var columnMaximums = parseInt(($.urlParam('columnMaxs') !== null ? $.urlParam('columnMaxs') : 1));

        /* Retains values after submissions */
    $('#rowMins').val(rowMinimums);
    $('#rowMaxs').val(rowMaximums);
    $('#columnMins').val(columnMinimums);
    $('#columnMaxs').val(columnMaximums);

        /* Delete previous tables */
    $("#placeholder").empty();

    var rowCount = rowMaximums - rowMinimums;
    var columnCount = columnMaximums - columnMinimums;

        /* Store values into arrays as indices */
    var multipliers = new Array();
    var multiplicands = new Array();

    for (rowMinimums; rowMinimums <= rowMaximums; rowMinimums++) {
        multiplicands.push(rowMinimums);
    }

    for (columnMinimums; columnMinimums <= columnMaximums; columnMinimums++) {
        multipliers.push(columnMinimums);
    }

    var tableMake = "";
    tableMake += "<table>";
        
        /* Goes through and does calculation to produce each value in the output table */
    for (var row = 0; row <= (rowCount + 1); row++) {
        tableMake += "<tr>";

        for (var column = 0; column <= (columnCount + 1); column++) {
            if (row == 0 && column == 0) {
                tableMake += "<td class='empty'>" + "" + "</td>";
            } else if (row == 0 && column > 0) {
                tableMake += "<td class='firstRow'>" + multipliers[column - 1] + "</td>";
            } else if (column == 0 && row > 0) {
                tableMake += "<td class='firstColumn'>" + multiplicands[row - 1] + "</td>";
            } else {
                tableMake += "<td class='middle'>" + (multipliers[column - 1] * multiplicands[row - 1]) + "</td>";
            }
        }
        tableMake += "</tr>";
    }
        
    tableMake += "</table>";
        
    $('#table').html(tableMake);
});
