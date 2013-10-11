function ngGridPinRightPlugin () {
    var self = this;
    this.grid = null;
    this.scope = null;
    this.init = function(scope, grid, services) {
	
	
	
	
        console.log(scope);
			 	console.log(grid);
				console.log(services);
				
				/*
				services.DomUtilityService.BuildStyles = function($scope, grid, digest) {
				        var rowHeight = grid.config.rowHeight,
				            $style = grid.$styleSheet,
				            gridId = grid.gridId,
				            css,
				            cols = $scope.columns,
				            sumWidth = 0;

				        if (!$style) {
				            $style = $('#' + gridId);
				            if (!$style[0]) {
				                $style = $("<style id='" + gridId + "' type='text/css' rel='stylesheet' />").appendTo(grid.$root);
				            }
				        }
				        $style.empty();
				        var trw = $scope.totalRowWidth();
				        css = "." + gridId + " .ngCanvas { width: " + trw + "px; }" +
				            "." + gridId + " .ngRow { width: " + trw + "px; }" +
				            "." + gridId + " .ngCanvas { width: " + trw + "px; }" +
				            "." + gridId + " .ngHeaderScroller { width: " + (trw + domUtilityService.ScrollH) + "px}";
				        for (var i = 0; i < cols.length; i++) {
				            var col = cols[i];
				             if (col.visible !== false) {
				                var colLeft;
				                if (!col.colDef.pinRight) {
				                    colLeft = col.pinned ? grid.$viewport.scrollLeft() + sumWidth : sumWidth;
				                } else {
				                    colLeft = grid.$viewport.width() - col.width +  grid.$viewport.scrollLeft();
				                };
				                css += "." + gridId + " .col" + i + " { width: " + col.width + "px; left : " + colLeft + "px; height: " + rowHeight + "px }" +
				                    "." + gridId + " .colt" + i + " { width: " + col.width + "px; }";
				                sumWidth += col.width;
				            }
				        };
				        if ($utils.isIe) { // IE
				            $style[0].styleSheet.cssText = css;
				        } else {
				            $style[0].appendChild(document.createTextNode(css));
				        }
				        grid.$styleSheet = $style;
				        if (digest) {
				            $scope.adjustScrollLeft(grid.$viewport.scrollLeft());
				            domUtilityService.digest($scope);
				        }
				    };
				*/
				var $scope = scope;
				var domUtilityService = services.DomUtilityService;
				
				grid.buildColumns = function() {
				        var columnDefs = grid.config.columnDefs,
				            cols = [];
				        if (!columnDefs) {
				            grid.buildColumnDefsFromData();
				            columnDefs = grid.config.columnDefs;
				        }
				        if (grid.config.showSelectionCheckbox) {
				            cols.push(new ngColumn({
				                colDef: {
				                    field: '\u2714',
				                    width: grid.elementDims.rowSelectedCellW,
				                    sortable: false,
				                    resizable: false,
				                    groupable: false,
				                    headerCellTemplate: $templateCache.get($scope.gridId + 'checkboxHeaderTemplate.html'),
				                    cellTemplate: $templateCache.get($scope.gridId + 'checkboxCellTemplate.html'),
				                    pinned: grid.config.pinSelectionCheckbox,
				                },
				                index: 0,
				                headerRowHeight: grid.config.headerRowHeight,
				                sortCallback: grid.sortData,
				                resizeOnDataCallback: grid.resizeOnData,
				                enableResize: grid.config.enableColumnResize,
				                enableSort: grid.config.enableSorting,
				                enablePinning: grid.config.enablePinning
				            }, $scope, grid, domUtilityService, $templateCache, $utils));
				        }
				        if (columnDefs.length > 0) {
				            var indexOffset = grid.config.showSelectionCheckbox ? grid.config.groups.length + 1 : grid.config.groups.length;
				            $scope.configGroups.length = 0;
				            angular.forEach(columnDefs, function(colDef, i) {
				                i += indexOffset;
				                var column = new ngColumn({
				                    colDef: colDef,
				                    index: i,
				                    headerRowHeight: grid.config.headerRowHeight,
				                    sortCallback: grid.sortData,
				                    resizeOnDataCallback: grid.resizeOnData,
				                    enableResize: grid.config.enableColumnResize,
				                    enableSort: grid.config.enableSorting,
				                    enablePinning: grid.config.enablePinning,
				                    enableCellEdit: grid.config.enableCellEdit,
				                    pinRight: grid.config.pinRight   
				                }, $scope, grid, domUtilityService, $templateCache, $utils);
				                var indx = grid.config.groups.indexOf(colDef.field);
				                if (indx != -1) {
				                    column.isGroupedBy = true;
				                    $scope.configGroups.splice(indx, 0, column);
				                    column.groupIndex = $scope.configGroups.length;
				                }
				                cols.push(column);
				            });
				            $scope.columns = cols;
				        }
				    };
				
				
    };
}

var ngColumn = function (config, $scope, grid, domUtilityService, $templateCache, $utils) {
    var self = this,
        colDef = config.colDef,
        delay = 500,
        clicks = 0,
        timer = null;
    self.colDef = config.colDef;
    self.width = colDef.width;
    self.groupIndex = 0;
    self.isGroupedBy = false;
    self.minWidth = !colDef.minWidth ? 50 : colDef.minWidth;
    self.maxWidth = !colDef.maxWidth ? 9000 : colDef.maxWidth;
    self.enableCellEdit = colDef.enableCellEdit !== undefined ? colDef.enableCellEdit : (config.enableCellEdit || config.enableCellEditOnFocus);

    self.headerRowHeight = config.headerRowHeight;
    self.displayName = (colDef.displayName === undefined) ? colDef.field : colDef.displayName;

    self.index = config.index;
    self.isAggCol = config.isAggCol;
    self.cellClass = colDef.cellClass;
    self.sortPriority = undefined;
    self.cellFilter = colDef.cellFilter ? colDef.cellFilter : "";
    self.field = colDef.field;
    self.aggLabelFilter = colDef.cellFilter || colDef.aggLabelFilter;
    self.visible = $utils.isNullOrUndefined(colDef.visible) || colDef.visible;
    self.sortable = false;
    self.resizable = false;
    self.pinnable = false;
    self.pinned = (config.enablePinning && colDef.pinned);
    self.originalIndex = config.originalIndex == null ? self.index : config.originalIndex;
    self.groupable = $utils.isNullOrUndefined(colDef.groupable) || colDef.groupable;
    if (config.enableSort) {
        self.sortable = $utils.isNullOrUndefined(colDef.sortable) || colDef.sortable;
    }
    if (config.enableResize) {
        self.resizable = $utils.isNullOrUndefined(colDef.resizable) || colDef.resizable;
    }
    if (config.enablePinning) {
        self.pinnable = $utils.isNullOrUndefined(colDef.pinnable) || colDef.pinnable;
    }
    self.sortDirection = undefined;
    self.sortingAlgorithm = colDef.sortFn;
    self.headerClass = colDef.headerClass;
    self.cursor = self.sortable ? 'pointer' : 'default';
    self.headerCellTemplate = colDef.headerCellTemplate || $templateCache.get('headerCellTemplate.html');
    self.cellTemplate = colDef.cellTemplate || $templateCache.get('cellTemplate.html').replace(CUSTOM_FILTERS, self.cellFilter ? "|" + self.cellFilter : "");
    if(self.enableCellEdit) {
        self.cellEditTemplate = $templateCache.get('cellEditTemplate.html');
        self.editableCellTemplate = colDef.editableCellTemplate || $templateCache.get('editableCellTemplate.html');
    }
    if (colDef.cellTemplate && !TEMPLATE_REGEXP.test(colDef.cellTemplate)) {
        self.cellTemplate = $.ajax({
            type: "GET",
            url: colDef.cellTemplate,
            async: false
        }).responseText;
    }
    if (self.enableCellEdit && colDef.editableCellTemplate && !TEMPLATE_REGEXP.test(colDef.editableCellTemplate)) {
        self.editableCellTemplate = $.ajax({
            type: "GET",
            url: colDef.editableCellTemplate,
            async: false
        }).responseText;
    }
    if (colDef.headerCellTemplate && !TEMPLATE_REGEXP.test(colDef.headerCellTemplate)) {
        self.headerCellTemplate = $.ajax({
            type: "GET",
            url: colDef.headerCellTemplate,
            async: false
        }).responseText;
    }
    self.colIndex = function () {
        var classes = self.pinned ? "pinned " : "";
        classes += "col" + self.index + " colt" + self.index;
        if (self.cellClass) {
            classes += " " + self.cellClass;
        }
        return classes;
    };
    self.groupedByClass = function() {
        return self.isGroupedBy ? "ngGroupedByIcon" : "ngGroupIcon";
    };
    self.toggleVisible = function() {
        self.visible = !self.visible;
    };
    self.showSortButtonUp = function() {
        return self.sortable ? self.sortDirection === DESC : self.sortable;
    };
    self.showSortButtonDown = function() {
        return self.sortable ? self.sortDirection === ASC : self.sortable;
    };
    self.noSortVisible = function() {
        return !self.sortDirection;
    };
    self.sort = function(evt) {
        if (!self.sortable) {
            return true; 
        }
        var dir = self.sortDirection === ASC ? DESC : ASC;
        self.sortDirection = dir;
        config.sortCallback(self, evt);
        return false;
    };
    self.gripClick = function() {
        clicks++; 
        if (clicks === 1) {
            timer = setTimeout(function() {
                clicks = 0; 
            }, delay);
        } else {
            clearTimeout(timer); 
            config.resizeOnDataCallback(self); 
            clicks = 0; 
        }
    };
    self.gripOnMouseDown = function(event) {
        $scope.isColumnResizing = true;
        if (event.ctrlKey && !self.pinned) {
            self.toggleVisible();
            domUtilityService.BuildStyles($scope, grid);
            return true;
        }
        event.target.parentElement.style.cursor = 'col-resize';
        self.startMousePosition = event.clientX;
        self.origWidth = self.width;
        $(document).mousemove(self.onMouseMove);
        $(document).mouseup(self.gripOnMouseUp);
        return false;
    };
    self.onMouseMove = function(event) {
        var diff = event.clientX - self.startMousePosition;
        var newWidth = diff + self.origWidth;
        self.width = (newWidth < self.minWidth ? self.minWidth : (newWidth > self.maxWidth ? self.maxWidth : newWidth));
        $scope.hasUserChangedGridColumnWidths = true;
        domUtilityService.BuildStyles($scope, grid);
        return false;
    };
    self.gripOnMouseUp = function (event) {
        $(document).off('mousemove', self.onMouseMove);
        $(document).off('mouseup', self.gripOnMouseUp);
        event.target.parentElement.style.cursor = 'default';
        domUtilityService.digest($scope);
        $scope.isColumnResizing = false;
        return false;
    };
    self.copy = function() {
        var ret = new ngColumn(config, $scope, grid, domUtilityService, $templateCache);
        ret.isClone = true;
        ret.orig = self;
        return ret;
    };
    self.setVars = function (fromCol) {
        self.orig = fromCol;
        self.width = fromCol.width;
        self.groupIndex = fromCol.groupIndex;
        self.isGroupedBy = fromCol.isGroupedBy;
        self.displayName = fromCol.displayName;
        self.index = fromCol.index;
        self.isAggCol = fromCol.isAggCol;
        self.cellClass = fromCol.cellClass;
        self.cellFilter = fromCol.cellFilter;
        self.field = fromCol.field;
        self.aggLabelFilter = fromCol.aggLabelFilter;
        self.visible = fromCol.visible;
        self.sortable = fromCol.sortable;
        self.resizable = fromCol.resizable;
        self.pinnable = fromCol.pinnable;
        self.pinned = fromCol.pinned;
        self.originalIndex = fromCol.originalIndex;
        self.sortDirection = fromCol.sortDirection;
        self.sortingAlgorithm = fromCol.sortingAlgorithm;
        self.headerClass = fromCol.headerClass;
        self.headerCellTemplate = fromCol.headerCellTemplate;
        self.cellTemplate = fromCol.cellTemplate;
        self.cellEditTemplate = fromCol.cellEditTemplate;
    };
};
