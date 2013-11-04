angular.module('classvantageApp').run(['$templateCache', function($templateCache) {

  $templateCache.put('views/admin.html',
    "<div class=\"page-container container\">\n" +
    "\t<br>\n" +
    "\t<h3>Grade:</h3>\n" +
    "\t<select ng-model=\"selection.unit.grade\" ng-change=\"selection.unit.subject_id = null;revert();\" ng-options=\"u.grade as u.grade for u in units | unique:'grade'\" cv-styled-select=\"\"></select>\n" +
    "\t<br><br>\n" +
    "\t\n" +
    "\t<h3>Subject:</h3>\n" +
    "\t<select ng-model=\"selection.unit.subject_id\" class=\"wide-select\" ng-disabled=\"selection.unit.grade == null\" ng-change=\"selection.unit_id = null;revert();\" ng-options=\"u.strand.subject.id as u.strand.subject.title for u in units | filter:{grade: selection.unit.grade} | unique:'subject_id'\" cv-styled-select=\"\">\n" +
    "\t\t<option value=\"\" disabled=\"disabled\">Select a subject</option>\n" +
    "\t</select>\n" +
    "\t<br><br>\n" +
    "\t\n" +
    "\t<h3>Unit:</h3>\n" +
    "\t<select ng-model=\"selection.unit_id\" class=\"wide-select\" ng-disabled=\"selection.unit.subject_id == null\" ng-options=\"u.id as u.title for u in units | filter: filterUnits\" ng-change=\"goToUnit();\" cv-styled-select=\"\">\n" +
    "\t\t<option value=\"\" disabled=\"disabled\">Select a unit</option>\n" +
    "\t</select>\n" +
    "\t<br><br>\n" +
    "\t\n" +
    "\t<br><br>\n" +
    "\t\n" +
    "\t<div ui-view=\"\">\n" +
    "\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/adminUnit.html',
    "<div style=\"height:60px\">\n" +
    "\t<h3 style=\"float:left\">Overall Expectations: {{unit.overall_expectations.length}}</h3>\n" +
    "\t<div style=\"clear:both\"></div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"overall\" ng-repeat=\"overall in unit.overall_expectations | orderBy:'created_at'\">\n" +
    "\t<edit-in-place model=\"overall\" save=\"save(overall)\" cancel=\"cancel(overall)\" remove=\"remove(overall)\" required-field=\"long_form\">\n" +
    "\t\t<editable-input field=\"code\" class=\"exp code\" placeholder=\"Code\"></editable-input>\n" +
    "\t\t<editable-input field=\"short_form\" class=\"exp short\" placeholder=\"Short Form\"></editable-input>\n" +
    "\t\t<editable-textarea field=\"long_form\" class=\"exp long\" placeholder=\"Long Form\">\n" +
    "\t</editable-textarea></edit-in-place>\n" +
    "\t<br>\n" +
    "\t<div class=\"specific\" ng-repeat=\"specific in overall.specific_expectations | orderBy:'created_at'\">\n" +
    "\t\t<edit-in-place model=\"specific\" save=\"saveSpecific(specific)\" cancel=\"cancelSpecific(overall, specific)\" remove=\"removeSpecific(overall, specific)\" required-field=\"description\">\n" +
    "\t\t\t<editable-input field=\"code\" class=\"exp code\" placeholder=\"Code\"></editable-input>\n" +
    "\t\t\t<editable-textarea field=\"description\" class=\"exp short\" placeholder=\"Expectation\"></editable-textarea>\n" +
    "\t\t\t<editable-textarea field=\"example\" class=\"exp short\" placeholder=\"Example or helper copy\"></editable-textarea>\n" +
    "\t\t\t<editable-textarea field=\"friendly_description\" class=\"exp short\" placeholder=\"Child Friendly description\"></editable-textarea>\n" +
    "\t\t</edit-in-place>\n" +
    "\t</div>\n" +
    "\t<a ng-click=\"newSpecific(overall)\" class=\"plus green\" style=\"margin-left:70px;line-height:90px\">Add a specific expectation</a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"overall\">\n" +
    "\t<a ng-click=\"newOverall()\" id=\"bottom\" class=\"plus green\" style=\"float:right;padding-top:3px;margin-bottom:20px\">Add overall expectation</a>\n" +
    "</div>"
  );


  $templateCache.put('views/assessment.html',
    "<div class=\"hero green\" style=\"height:251px\">\n" +
    "\t<div class=\"container\">\n" +
    "\t\t<br>\n" +
    "  \t<form>\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"breadcrumbs\">\n" +
    "\t\t\t\t<div ng-show=\"assessment.rubric.page\">\n" +
    "\t\t\t\t\t<a ui-sref=\"gradebook.page({page_id: assessment.rubric.page.id})\">{{assessment.rubric.page.title}}</a>\n" +
    "\t\t\t\t\t<span>{{assessment.rubric.title || 'Untitled'}}</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div style=\"float:left;width:639px\">\n" +
    "\t\t\t\t<label class=\"title-input-text\" style=\"margin-left:28px\">{{assessment.rubric.title}}</label>\n" +
    "\t\t\t\t<br>\n" +
    "\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\n" +
    "\t\t</form>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<!-- RUBRIC CONTENT -->\n" +
    "<div class=\"container page-container\" style=\"padding-left:54px\">\n" +
    "\t<h2>{{assessment.student.first_name}} {{assessment.student.last_name}}</h2>\n" +
    "\t<div style=\"clear:both\"></div>\n" +
    "\t<br>\n" +
    "\t<section style=\"margin-top:28px\" class=\"specific\">\n" +
    "\t\t<div class=\"header\">\n" +
    "\t\t\t\t<h4>SPECIFIC:</h4>\n" +
    "\t\t\t\t<h4>LEVEL 1</h4>\n" +
    "\t\t\t\t<h4>LEVEL 2</h4>\n" +
    "\t\t\t\t<h4>LEVEL 3</h4>\n" +
    "\t\t\t\t<h4>LEVEL 4</h4>\n" +
    "\t\t</div>\n" +
    "\t\t<div style=\"clear:both\">\n" +
    "\t\t<div class=\"rubric-group\">\n" +
    "\t\t\t<div class=\"rubric-row\" ng-repeat=\"row in assessment.rubric.rows\" ng-init=\"mark = assessment.marks.$firstForRow(row)\" ng-switch=\"mark.$wholeValue\">\n" +
    "\t\t\t\t<div class=\"top-cover\"></div>\n" +
    "\t\t\t\t<div class=\"rubric-column criteria min-height\">\n" +
    "\t\t\t\t\t<span>{{row.criteria}}</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"rubric-column level assess\">\n" +
    "\t\t\t\t\t<span class=\"mark four red\">\n" +
    "\t\t\t\t\t\t<div class=\"marked\" style=\"background-color:rgba(0,0,0,0.8)\" ng-switch-when=\"0\">\n" +
    "\t\t\t\t\t\t\t<span class=\"middle\">{{mark.$value}}</span>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"marked\" ng-switch-when=\"1\">\n" +
    "\t\t\t\t\t\t\t<span class=\"middle\">{{mark.$value}}</span>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"value frst colorR\" ng-click=\"saveMark(mark, 0)\"><span class=\"middle\">R</span></div>\n" +
    "\t\t\t\t\t\t<div class=\"value scnd\" ng-click=\"saveMark(mark, 1)\"><span class=\"middle\">1-</span></div>\n" +
    "\t\t\t\t\t\t<div class=\"value thrd\" ng-click=\"saveMark(mark, 2)\"><span class=\"middle\">1</span></div>\n" +
    "\t\t\t\t\t\t<div class=\"value frth\" ng-click=\"saveMark(mark, 3)\"><span class=\"middle\">1+</span></div>\n" +
    "\t\t\t\t\t\t{{row.level1_description}}\n" +
    "\t\t\t\t\t</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"rubric-column level assess\">\n" +
    "\t\t\t\t\t<span class=\"mark yellow\">\n" +
    "\t\t\t\t\t\t<div class=\"marked\" ng-switch-when=\"2\">\n" +
    "\t\t\t\t\t\t\t<span class=\"middle\">{{mark.$value}}</span>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"value frst\" ng-click=\"saveMark(mark, 4)\"><span class=\"middle\">2-</span></div>\n" +
    "\t\t\t\t\t\t<div class=\"value scnd\" ng-click=\"saveMark(mark, 5)\"><span class=\"middle\">2</span></div>\n" +
    "\t\t\t\t\t\t<div class=\"value thrd\" ng-click=\"saveMark(mark, 6)\"><span class=\"middle\">2+</span></div>\n" +
    "\t\t\t\t\t\t{{row.level2_description}}\n" +
    "\t\t\t\t\t</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"rubric-column level assess\">\n" +
    "\t\t\t\t\t<span class=\"mark bright-green\">\n" +
    "\t\t\t\t\t\t<div class=\"marked\" ng-switch-when=\"3\">\n" +
    "\t\t\t\t\t\t\t<span class=\"middle\">{{mark.$value}}</span>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"value frst\" ng-click=\"saveMark(mark, 7)\"><span class=\"middle\">3-</span></div>\n" +
    "\t\t\t\t\t\t<div class=\"value scnd\" ng-click=\"saveMark(mark, 8)\"><span class=\"middle\">3</span></div>\n" +
    "\t\t\t\t\t\t<div class=\"value thrd\" ng-click=\"saveMark(mark, 9)\"><span class=\"middle\">3+</span></div>\n" +
    "\t\t\t\t\t\t{{row.level3_description}}\n" +
    "\t\t\t\t\t</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"rubric-column level assess\">\n" +
    "\t\t\t\t\t<span class=\"mark green\">\n" +
    "\t\t\t\t\t\t<div class=\"marked\" ng-switch-when=\"4\">\n" +
    "\t\t\t\t\t\t\t<span class=\"middle\">{{mark.$value}}</span>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"value frst\" ng-click=\"saveMark(mark, 10)\"><span class=\"middle\">4-</span></div>\n" +
    "\t\t\t\t\t\t<div class=\"value scnd\" ng-click=\"saveMark(mark, 11)\"><span class=\"middle\">4</span></div>\n" +
    "\t\t\t\t\t\t<div class=\"value thrd\" ng-click=\"saveMark(mark, 12)\"><span class=\"middle\">4+</span></div>\n" +
    "\t\t\t\t\t\t{{row.level4_description}}\n" +
    "\t\t\t\t\t</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"bottom-divider\"></div>\n" +
    "\t\t\t\t<div class=\"bottom-divider wide\"></div>\n" +
    "\t\t\t\t<div class=\"bottom-cover\"></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t\n" +
    "\t\t\n" +
    "\t\t<br><br><br><br><br>\n" +
    "\n" +
    "\t</div></section>\n" +
    "</div>\n" +
    "\n" +
    "<!-- FINAl GRADE -->\n" +
    "<div class=\"final\">\n" +
    "\t<span>FINAL GRADE</span>\n" +
    "\t<div class=\"grade color{{assessment.$averageGrade.substr(0,1)}}\">\n" +
    "\t\t<span>{{assessment.$averageGrade || '?'}}</span>\n" +
    "\t</div>\n" +
    "\t<span class=\"auto-grade\">\n" +
    "\t\t<input type=\"checkbox\" style=\"display:none\" checked=\"checked\">&nbsp;\n" +
    "\t</span>\n" +
    "\t<a class=\"btn\" ui-sref=\"gradebook.page({page_id: assessment.rubric.page.id})\">Finished</a>\n" +
    "</div>"
  );


  $templateCache.put('views/gradebook.html',
    "<div class=\"hero green\">\n" +
    "\t<div class=\"container\" style=\"height:275px\">\n" +
    "  \t<h1 style=\"padding-top:97px\">Gradebook&nbsp;&nbsp;<span><ng-pluralize count=\"pages.length\" when=\"{'1': '(1 Page)', 'other': '({} Pages)'}\"></ng-pluralize></span></h1>\n" +
    "\t\t\n" +
    "\t\t<div style=\"position:absolute\">\n" +
    "\t\t\t<a class=\"plus white\" style=\"line-height:75px\" ng-click=\"newPage()\"></a>\n" +
    "\t\t\t<a style=\"line-height:75px;color:white\" href=\"\" ng-click=\"newPage()\" ng-show=\"pages.length == 0\">Add your first page</a>\n" +
    "\t\t</div>\n" +
    "\t\t\n" +
    "\t\t<nav class=\"tab-container\">\n" +
    "\t\t\t<a class=\"pages-tab\" ng-class=\"{selected: $stateParams.page_id == page.id}\" ng-repeat=\"page in pages | orderBy:'created_at':true | swapForId:5:$stateParams.page_id | limitTo: 6\" ui-sref=\"gradebook.page({ page_id: page.id })\">\n" +
    "\t\t\t\t<span>{{page.title}}</span>\n" +
    "\t\t\t</a>\n" +
    "\t\t\t<a class=\"pages-tab dropdown-toggle\" style=\"position:relative\" ng-show=\"pages.length > 6\">\n" +
    "\t\t\t\t<span style=\"width:65px\">\n" +
    "\t\t\t\t\t<img src=\"/images/d90c8301.dropdown-red.png\" style=\"vertical-align:middle\">\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t</a>\n" +
    "\t\t\t<ul class=\"dropdown-menu\" style=\"left:auto;right:0\">\n" +
    "\t    \t<li ng-repeat=\"page in pages | orderBy:'created_at':true | swapForId:5:$stateParams.page_id | slice:6:pages.length\">\n" +
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
    "\t\t\tYou'll organize the classes or subjects you teach by adding different pages in your Gradebook. So go ahead and <a href=\"\" ng-click=\"newPage()\">add your first page</a>.\n" +
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
    "\t<div class=\"student row\" ng-repeat=\"student in page.students | orderBy:'last_name'\">\n" +
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
    "\t<div class=\"drop-shadow\" ng-show=\"page.rubrics.length > 5\"></div>\n" +
    "\t<div class=\"scroll-container\" style=\"overflow-x: auto\" ng-show=\"page.rubrics.length > 0\" scroll-with=\"#grid-scrollbar\">\n" +
    "\t\t<div class=\"scroll-content\" ng-style=\"{width: (page.rubrics.length*117) + 'px'}\">\n" +
    "\t\t\t<div class=\"rubric header-row\">\n" +
    "\t\t\t\t<div class=\"rubric header-cell\" ng-repeat=\"rubric in page.rubrics\">\n" +
    "\t\t\t\t\t<div class=\"title-container\">\n" +
    "\t\t\t\t\t\t<a ui-sref=\"rubric({id: rubric.id})\">{{rubric.title || 'Untitled'}}</a>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"grade row\" ng-repeat=\"student in page.students | orderBy:'last_name'\">\n" +
    "\t\t\t\t<div class=\"grade-cell\" ng-repeat=\"rubric in page.rubrics\" ng-initt=\"assessment = student.assessments.$firstForRubric(rubric);averageGrade = assessment.$averageGrade;\" ng-switch=\"student.assessments.$firstForRubric(rubric).$status\">\n" +
    "\t\t\t\t\t<a ng-switch-when=\"incomplete\" ui-sref=\"assessment({id: student.assessments.$firstForRubric(rubric).id})\" class=\"gray\">\n" +
    "\t\t\t\t\t\t? <span ng-if=\"student.assessments.$firstForRubric(rubric).$averageGrade\">({{student.assessments.$firstForRubric(rubric).$averageGrade}})</span>\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t<a ng-switch-when=\"marked\" ui-sref=\"assessment({id: student.assessments.$firstForRubric(rubric).id})\" class=\"color{{student.assessments.$firstForRubric(rubric).$averageGrade.substr(0,1)}}\">\n" +
    "\t\t\t\t\t\t{{student.assessments.$firstForRubric(rubric).value || student.assessments.$firstForRubric(rubric).$averageGrade}}\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t<a ng-switch-default=\"\" href=\"\" class=\"new\" ng-click=\"saveAndAssess(student.assessments.$firstForRubric(rubric))\"> + </a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<div class=\"pin-right scroll-fixed\" ng-class=\"{true:'with-divider', false:''}[page.rubrics.length > 0]\" ng-style=\"{height: (94 + (page.students ? page.students.length * 50 : 0)) + 'px'}\"> <!-- HEIGHT MUST BE SET ON THIS -->\n" +
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
    "\t\t<a class=\"close-button\" ng-click=\"cancel()\"><img src=\"/images/909711eb.beige-ex.png\"></a>\n" +
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
    "\t\t\t\t\t<select ng-model=\"page.copy_students_from\" class=\"wider-select\" ng-options=\"page.id as page.title for page in pages\" cv-styled-select=\"\">\n" +
    "\t\t\t\t\t\t<option value=\"\">Choose a page (optional)</option>\n" +
    "\t\t\t\t\t</select>\n" +
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
    "\t\t<br>\n" +
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
    "\t\t\t\t<textarea ng-model=\"rubric.title\" class=\"title-input-text editable-text\" msd-elastic=\"\" placeholder=\"Type a title\" rows=\"2\" cols=\"17\" autocorrect=\"off\" style=\"height:100px\" blurs-on-enter=\"\" cv-input=\"\"></textarea>\n" +
    "\t\t\t\t<br>\n" +
    "\t\t\t\t<a class=\"plus white\" ng-click=\"displayDesc = true\" ng-show=\"(rubric.description == null || rubric.description == '') && displayDesc == false\">Add a description</a>\n" +
    "\t\t\t\t<textarea id=\"rubricDescription\" ng-model=\"rubric.description\" rows=\"3\" cols=\"62\" autocorrect=\"off\" class=\"desc-input-text editable-text\" ng-show=\"(rubric.description != null && rubric.description != '') || displayDesc == true\" focus-when=\"displayDesc == true\" ng-blur=\"displayDesc = false\" cv-input=\"\"></textarea>\n" +
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
    "</div>\n" +
    "<!-- RUBRIC CONTENT -->\n" +
    "<div class=\"container page-container\" style=\"padding-left:54px\">\n" +
    "\t<h2>Expectations</h2>\n" +
    "\t<div style=\"clear:both\"></div>\n" +
    "\t<section style=\"margin-top:16px\">\n" +
    "\t\t<h4>OVERALL</h4>\n" +
    "\t\t<ul class=\"overalls\">\n" +
    "\t\t\t<li>\n" +
    "\t\t\t\t<!-- input type=\"checkbox\" ng-checked=\"rubric.custom_expectation\" cv-value=\"rubric.custom_expectation\" cv-styled-checkbox / -->\n" +
    "\t\t\t\t<textarea ng-model=\"rubric.custom_expectation\" class=\"editable-text\" style=\"height:22px\" msd-elastic=\"\" placeholder=\"Type an overall expectation\" blurs-on-enter=\"\" cv-input=\"\"></textarea>\n" +
    "\t\t\t</li>\n" +
    "\t\t</ul>\n" +
    "\t</section>\n" +
    "\t<br>\n" +
    "\t<section style=\"margin-top:16px\" class=\"specific\">\n" +
    "\t\t<div class=\"header\">\n" +
    "\t\t\t\t<h4>SPECIFIC</h4>\n" +
    "\t\t\t\t<h4>LEVEL 1</h4>\n" +
    "\t\t\t\t<h4>LEVEL 2</h4>\n" +
    "\t\t\t\t<h4>LEVEL 3</h4>\n" +
    "\t\t\t\t<h4>LEVEL 4</h4>\n" +
    "\t\t</div>\n" +
    "\t\t<div style=\"clear:both\">\n" +
    "\t\t<div class=\"rubric-group\">\n" +
    "\t\t\t<div class=\"rubric-row\" ng-repeat=\"row in rubric.rows\">\n" +
    "\t\t\t\t<div class=\"top-cover\"></div>\n" +
    "\t\t\t\t<div class=\"rubric-column criteria\">\n" +
    "\t\t\t\t\t<a class=\"close-button\" ng-click=\"deleteRow(row)\"><img src=\"images/beige-ex.png\"></a>\n" +
    "\t\t\t\t\t<textarea class=\"editable-text\" ng-model=\"row.criteria\" style=\"height:64px\" msd-elastic=\"\" placeholder=\"Type criteria description here\" ng-blur=\"row.$save()\" blurs-on-enter=\"\"></textarea>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"rubric-column level\">\n" +
    "\t\t\t\t\t<textarea class=\"editable-text\" ng-model=\"row.level1_description\" placeholder=\"Type level description here\" msd-elastic=\"\" ng-blur=\"unlock(row);row.$save();\" blurs-on-enter=\"\"></textarea>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"rubric-column level\">\n" +
    "\t\t\t\t\t<textarea class=\"editable-text\" ng-model=\"row.level2_description\" msd-elastic=\"\" ng-blur=\"row.$save()\" blurs-on-enter=\"\"></textarea>\n" +
    "\t\t\t\t\t<label ng-show=\"levelsLocked(row)\">{{row.level1_description}}</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"rubric-column level\">\n" +
    "\t\t\t\t\t<textarea class=\"editable-text\" ng-model=\"row.level3_description\" msd-elastic=\"\" ng-blur=\"row.$save()\" blurs-on-enter=\"\"></textarea>\n" +
    "\t\t\t\t\t<label ng-show=\"levelsLocked(row)\">{{row.level1_description}}</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"rubric-column level\">\n" +
    "\t\t\t\t\t<textarea class=\"editable-text\" ng-model=\"row.level4_description\" msd-elastic=\"\" ng-blur=\"row.$save()\" blurs-on-enter=\"\"></textarea>\n" +
    "\t\t\t\t\t<label ng-show=\"levelsLocked(row)\">{{row.level1_description}}</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"bottom-divider\"></div>\n" +
    "\t\t\t\t<div class=\"bottom-divider wide\"></div>\n" +
    "\t\t\t\t<div class=\"bottom-cover\"></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t\n" +
    "\t\t\n" +
    "\t\t<br><br><br><br><br>\n" +
    "\t\t<a class=\"plus green\" ng-click=\"addRow()\" style=\"margin-left:-39px\">Add a specific expectation</a>\n" +
    "\t\t<br><br>\n" +
    "\t</div></section>\n" +
    "</div>"
  );


  $templateCache.put('views/studentForm.html',
    "<form ng-submit=\"submitForm()\">\n" +
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <input type=\"text\" id=\"silver-input\" placeholder=\"Type a student's name\" ng-model=\"student.full_name\" required=\"\">\n" +
    "\t\t<a class=\"close-button\" ng-click=\"cancel()\"><img src=\"/images/909711eb.beige-ex.png\"></a>\n" +
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
