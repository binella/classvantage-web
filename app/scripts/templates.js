angular.module('classvantageApp').run(['$templateCache', function($templateCache) {

  $templateCache.put('views/gradebook.html',
    "<div class=\"hero green\">\n" +
    "\t<div class=\"container\" style=\"height:275px\">\n" +
    "  \t<h1 style=\"padding-top:97px\">Gradebook&nbsp;&nbsp;<span><ng-pluralize count=\"pages.length\" when=\"{'1': '(1 Page)', 'other': '({} Pages)'}\"></ng-pluralize></span></h1>\n" +
    "\t\t\n" +
    "\t\t<div style=\"position:absolute\">\n" +
    "\t\t\t<a class=\"plus white\" style=\"line-height:75px\" ng-click=\"openPageModal()\"></a>\n" +
    "\t\t\t<a style=\"line-height:75px;color:white\" href=\"\" ng-click=\"openPageModal()\" ng-show=\"pages.length == 0\">Add your first page</a>\n" +
    "\t\t</div>\n" +
    "\t\t\n" +
    "\t\t<nav class=\"tab-container\">\n" +
    "\t\t\t<a class=\"pages-tab\" ng-class=\"{selected: $stateParams.page_id == page.id}\" ng-repeat=\"page in pages | limitTo: 6\" ui-sref=\"gradebook.page({ page_id: page.id })\">\n" +
    "\t\t\t\t<span>{{page.title}}</span>\n" +
    "\t\t\t</a>\n" +
    "\t\t\t<a class=\"pages-tab dropdown-toggle\" style=\"position:relative\" ng-show=\"pages.length > 6\">\n" +
    "\t\t\t\t<span style=\"width:65px\">\n" +
    "\t\t\t\t\t<img src=\"/images/dropdown-red.png\" style=\"vertical-align:middle\">\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t</a>\n" +
    "\t\t\t<ul class=\"dropdown-menu\" style=\"left:auto;right:0\">\n" +
    "\t    \t<li ng-repeat=\"page in pages | slice:6:pages.length\">\n" +
    "\t      \t<a ui-sref=\"gradebook.page({ page_id: page.id })\">{{page.title}}</a>\n" +
    "\t    \t</li>\n" +
    "\t  \t</ul>\n" +
    "\t\t</nav>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<div class=\"container\" id=\"pageContainer\">\n" +
    "\t<div class=\"gradebook-coach\" ng-show=\"pages.length == 0\">\n" +
    "\t\t<span>Get started!</span><br><br>\n" +
    "\t\t<p>\n" +
    "\t\t\tYou'll organize the classes or subjects you teach by adding different pages in your Gradebook. So go ahead and <a href=\"\" ng-click=\"openPageModal()\">add your first page</a>.\n" +
    "\t\t</p>\n" +
    "\t</div>\n" +
    "\t<div class=\"page-container\" ng-show=\"pages.length > 0\" ui-view=\"\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/main.html',
    "<div class=\"hero green\">\n" +
    "\t<div class=\"container\">\n" +
    "  \t<h1>Test</h1>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/page.html',
    "<div style=\"height:80px\">\n" +
    "\t<h2>{{page.title}}</h2>\n" +
    "\t<ul class=\"header\" ng-show=\"page.grade\">\n" +
    "\t\t<li><span>Grade:&nbsp;</span> {{page.grade}}</li>\n" +
    "\t\t<li><div class=\"beige-box\"></div></li>\n" +
    "\t\t<li><span>Subject:&nbsp;</span> {{page.subject.title}}</li>\n" +
    "\t\t<li><a class=\"pencil\" href=\"\" ng-click=\"openPageModal(page)\"></a></li>\n" +
    "\t</ul>\n" +
    "</div>\n" +
    "<div style=\"height:15px\"></div>\n" +
    "<div class=\"student-list scroll-fixed\" ng-style=\"{'border-right': (page.students.length > 0 || page.rubrics.length > 0 ? '' : 'none')}\">\n" +
    "\t<div class=\"student\" ng-class=\"{true:'header-row', false:''}[page.students.length > 0 || page.rubrics.length > 0]\">\n" +
    "\t\t<div class=\"student header-cell\">\n" +
    "\t\t\t<a class=\"plus green\" ng-click=\"newStudent();\">Add a student</a>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"student row\" ng-repeat=\"student in page.students\">\n" +
    "\t\t<div class=\"student-cell\">\n" +
    "\t\t\t<a href=\"\" class=\"close-button\" ng-click=\"deleteStudent(student)\"><img src=\"images/beige-ex.png\"></a>\n" +
    "\t\t\t<span>{{student.full_name}}</span>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<div class=\"scrollbar-container\" ng-show=\"page.rubrics.length > 5\">\n" +
    "\t<div class=\"scrollbar\" id=\"grid-scrollbar\"><div class=\"empty-content\" style=\"height:17px\" ng-style=\"{'width': (page.rubrics.length*117)+'px'}\"></div></div>\n" +
    "</div>\n" +
    "<div class=\"grid-container\">\n" +
    "\t<div class=\"drop-shadow\"></div>\n" +
    "\t<div class=\"scroll-container\" style=\"overflow-x: auto\" ng-show=\"page.rubrics.length > 0\" scroll-with=\"#grid-scrollbar\">\n" +
    "\t\t<div class=\"scroll-content\" ng-style=\"{width: (page.rubrics.length*117) + 'px'}\">\n" +
    "\t\t\t<div class=\"rubric header-row\">\n" +
    "\t\t\t\t<div class=\"rubric header-cell\" ng-repeat=\"rubric in page.rubrics\">\n" +
    "\t\t\t\t\t<div class=\"title-container\">\n" +
    "\t\t\t\t\t\t<a ui-sref=\"rubric({id: rubric.id})\">{{rubric.title || 'Untitled'}}</a>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"grade row\" ng-repeat=\"student in page.students\">\n" +
    "\t\t\t\t<div class=\"grade-cell\" ng-repeat=\"rubric in page.rubrics\">\n" +
    "\t\t\t\t\t<a href=\"\" title=\"click here to grade this rubric for this student\"></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<div class=\"pin-right scroll-fixed\" ng-class=\"{true:'with-divider', false:''}[page.rubrics.length > 0]\" ng-style=\"{height: (95 + (page.students ? page.students.length * 50 : 0)) + 'px'}\"> <!-- HEIGHT MUST BE SET ON THIS -->\n" +
    "\t<div class=\"rubric\" ng-class=\"{true:'header-row', false:''}[page.students.length > 0 || page.rubrics.length > 0]\">\n" +
    "\t\t<div class=\"rubric header-cell\" ng-style=\"{width: (page.rubrics.length > 0 ? '113px' : '265px')}\">\n" +
    "\t\t\t<a class=\"plus green\" ng-style=\"{'margin-left': (page.rubrics.length > 0 ? '40px' : '34px')}\" style=\"margin-left:34px;position:relative;top:39px\" ng-click=\"newRubric()\">\n" +
    "\t\t\t\t{{page.rubrics.length > 0 ? '' : 'Add your first rubric'}}\n" +
    "\t\t\t</a>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/pageForm.html',
    "<form ng-submit=\"submitForm()\">\n" +
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <input type=\"text\" id=\"beige-input\" placeholder=\"Type a title (eg. French P2)\" ng-model=\"page.title\" required=\"\">\n" +
    "\t\t<a class=\"close-button\" ng-click=\"cancel()\"><img src=\"/images/beige-ex.png\"></a>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <ul>\n" +
    "    \t<li>Grade:<br>\n" +
    "\t\t\t\t<span class=\"dark-uniform\">\n" +
    "\t\t\t\t<select class=\"narrow-select\" ng-model=\"page.grade\" ng-options=\"u.grade as u.grade for u in units | unique:'grade'\" ng-change=\"page.subject = null;\" cv-styled-select=\"\"></select>\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t</li>\n" +
    "\t\t\t<!--li>Term:<br/>\n" +
    "\t\t\t\t<select></select>\n" +
    "\t\t\t</li-->\n" +
    "\t\t\t<li>Subject:<br>\n" +
    "\t\t\t\t<span class=\"dark-uniform\">\n" +
    "\t\t\t\t<select ng-model=\"page.subject\" ng-disabled=\"page.grade == null\" class=\"wider-select\" ng-options=\"u.strand.subject as u.strand.subject.title for u in units | filter:{grade: page.grade} | unique:'subject_id' track by $subjectId(u)\" cv-styled-select=\"\">\n" +
    "\t\t\t\t\t<option value=\"\" disabled=\"disabled\">Select a subject</option>\n" +
    "\t\t\t\t</select>\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t</li>\n" +
    "\t\t\t<li ng-show=\"pages.length > 0 && !page.id\">Use students from:<br>\n" +
    "\t\t\t\t<span class=\"dark-uniform\">\n" +
    "\t\t\t\t<select ng-model=\"page.copy_students_from\" class=\"wider-select\" ng-options=\"page.id as page.title for page in pages\" cv-styled-select=\"\"></select>\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t</li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "\t\t<button class=\"btn btn-red\" type=\"submit\" ng-disabled=\"page.title == '' || page.title == null || page.grade == '' || page.grade == null || page.subject == null\">\n" +
    "\t\t\t\t\t\t{{buttonCaption}}\n" +
    "\t\t</button>\n" +
    "</div>\n" +
    "</form>"
  );


  $templateCache.put('views/rubric.html',
    "<div class=\"hero green\" style=\"height:387px\">\n" +
    "\t<div class=\"container\">\n" +
    "\t\t<div>Breadcrumbs</div>\n" +
    "  \t<form>\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"breadcrumbs\">\n" +
    "\t\t\t\t<div ng-show=\"rubric.page\">\n" +
    "\t\t\t\t\t<a ui-sref=\"gradebook.page({page_id: rubric.page.id})\">{{rubric.page.title}}</a>\n" +
    "\t\t\t\t\t<span>{{rubric.title || 'New Rubric'}}</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div style=\"float:left;width:639px\">\n" +
    "\t\t\t\t<textarea ng-model=\"rubric.title\" class=\"title-input-text\" msd-elastic=\"\" placeholder=\"Type a title\" rows=\"2\" cols=\"17\" autocorrect=\"off\" style=\"height:100px\" blurs-on-enter=\"\" cv-input=\"\"></textarea>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t<a class=\"plus white\" ng-click=\"displayDesc = true\" ng-show=\"(rubric.description == null || rubric.description == '') && displayDesc == false\">Add a description</a>\n" +
    "\t\t\t\t<textarea id=\"rubricDescription\" ng-model=\"rubric.description\" rows=\"3\" cols=\"62\" autocorrect=\"off\" class=\"desc-input-text\" ng-show=\"(rubric.description != null && rubric.description != '') || displayDesc == true\" focus-when=\"displayDesc == true\" ng-blur=\"displayDesc = false\" cv-input=\"\"></textarea>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div style=\"float:left;width:1px;height:215px;margin-top:21px\" class=\"verticalLine\"></div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div style=\"float:left;padding-left:20px\">\n" +
    "\t\t\t\t<ul>\n" +
    "\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t<span>Grade:</span><br>\n" +
    "\t\t\t\t\t\t<select ng-model=\"rubric.unit.grade\" ng-change=\"rubric.unit.strand.subject.id = null;rubric.unit_id = null;updateModel();\" ng-options=\"u.grade as u.grade for u in units | unique:'grade'\" cv-styled-select=\"\"></select>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t<span>Subject:</span><br>\n" +
    "\t\t\t\t\t\t<select ng-model=\"rubric.unit.strand.subject.id\" class=\"wide-select\" ng-disabled=\"rubric.unit.grade == null\" ng-change=\"rubric.unit_id = null;updateModel();\" ng-options=\"u.strand.subject.id as u.strand.subject.title for u in units | filter:{grade: rubric.unit.grade} | unique:'subject_id'\" cv-styled-select=\"\">\n" +
    "\t\t\t\t\t\t\t<option value=\"\" disabled=\"disabled\">Select a subject</option>\n" +
    "\t\t\t\t\t\t</select>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t<span>Unit:</span><br>\n" +
    "\t\t\t\t\t\t<select ng-model=\"rubric.unit_id\" class=\"wide-select\" ng-disabled=\"rubric.unit.strand.subject.id == null\" ng-options=\"u.id as u.title for u in units | filter: filterUnits\" ng-change=\"updateModel()\" cv-styled-select=\"\">\n" +
    "\t\t\t\t\t\t\t<option value=\"\" disabled=\"disabled\">Select a unit</option>\n" +
    "\t\t\t\t\t\t</select>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t</form>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/studentForm.html',
    "<form ng-submit=\"submitForm()\">\n" +
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <input type=\"text\" id=\"silver-input\" placeholder=\"Type a student's name\" ng-model=\"student.full_name\" required=\"\">\n" +
    "\t\t<a class=\"close-button\" ng-click=\"cancel()\"><img src=\"/images/beige-ex.png\"></a>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "\t\t<button class=\"btn btn-red\" type=\"submit\" ng-disabled=\"student.full_name == null || student.full_name == ''\">\n" +
    "\t\t\t\t\t\tAdd student\n" +
    "\t\t</button>\n" +
    "</div>\n" +
    "</form>"
  );

}]);
