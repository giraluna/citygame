module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.registerTask('default', ['concat', 'uglify']);

  var srcFiles =
  [
    "src/reactui/js/draggable.js",
    "src/reactui/js/splitmultilinetext.js",
    
    "src/reactui/js/list.js",
    "src/reactui/js/actioninfo.js",
    "src/reactui/js/employee.js",
    "src/reactui/js/employeelist.js",
    "src/reactui/js/employeeaction.js",
    "src/reactui/js/employeeactionpopup.js",
    "src/reactui/js/infopopup.js",
    "src/reactui/js/confirmpopup.js",
    "src/reactui/js/loadpopup.js",
    "src/reactui/js/savepopup.js",
    "src/reactui/js/buildinglist.js",
    "src/reactui/js/buildinglistpopup.js",
    "src/reactui/js/modifierlist.js",
    "src/reactui/js/modifierpopup.js",
    "src/reactui/js/statlist.js",
    "src/reactui/js/stats.js",
    "src/reactui/js/optionlist.js",
    "src/reactui/js/options.js",
    
    "src/reactui/js/sidemenumodifierbutton.js",
    "src/reactui/js/sidemenutools.js",
    "src/reactui/js/sidemenustats.js",
    "src/reactui/js/sidemenusave.js",
    "src/reactui/js/sidemenuzoom.js",
    "src/reactui/js/sidemenumapmode.js",
    "src/reactui/js/sidemenubuildings.js",
    "src/reactui/js/sidemenu.js",
    
    "src/reactui/js/stage.js",
    "src/reactui/js/reactui.js",
    
    "src/js/arraylogic.js",
    
    "data/js/playermodifiers.js",
    "data/js/levelupmodifiers.js",
    "data/js/employeemodifiers.js",
    "data/js/cellmodifiers.js",
    "data/js/cg.js",
    "data/js/names.js",
    
    "src/js/eventlistener.js",
    "src/js/utility.js",
    "src/js/options.js",
    
    "src/js/timer.js",
    "src/js/sorteddisplaycontainer.js",
    "src/js/mapgeneration.js",
    "src/js/citygeneration.js",
    "src/js/board.js",
    "src/js/landvalueoverlay.js",
    "src/js/spritehighlighter.js",
    "src/js/spriteblinker.js",
    "src/js/keyboardinput.js",
    "src/js/employee.js",
    "src/js/player.js",
    "src/js/actions.js",
    "src/js/systems.js",
    "src/js/loader.js",
    "src/js/citygame.js",
    "src/js/ui.js"
  ]

  grunt.initConfig(
  {
    concat:
    {
      dist:
      {
        src: srcFiles,
        dest: 'dist/citygame.js',
      },
    },
    uglify:
    {
      dist:
      {
        files:
        {
          "dist/citygame.min.js": ['<%= concat.dist.dest %>']
        }
      }
    }
  });
}