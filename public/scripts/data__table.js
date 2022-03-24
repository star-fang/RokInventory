import {stringFormatter} from './libs_module.js'
const tableObjHtmlFormat =
    '<table id="{0}" \
    class="w-100 table table-striped table-bordered" \
    cellspacing="0" \
    style="background-color: #eee; style="width:100%"">\
</table>';

const contextmenuHtmlFromat =
    '<div class="dropdown-menu dropdown-menu-sm" id="context-menu"> \
          <a class="dropdown-item" href="#">Action</a> \
          <a class="dropdown-item" href="#">Another action</a> \
          <a class="dropdown-item" href="#">Something else here</a> \
        </div>';

export default class DT {
    constructor(containerId, id) {
        this.containerId = containerId;
        this.id = id;
        this.selected_pos = { row: 0, col: 0 };
    }

    initDT(cols, dataset) {

        const tableObj = $(stringFormatter(tableObjHtmlFormat, this.id));

        tableObj.appendTo($(`#${this.containerId}`));

        const dt = tableObj.DataTable({
            columnDefs: [
                { data: "id", type: "numeric", targets: 0 },
                { data: "name", type: "string", targets: 1 }
            ],
            columns: [
                { title: "아이디" },
                { title: "이름" }

            ],
            data: [{ id: 2, name: 'dd' }, { id: 4, name: null, uuid: 'abvdegs' }],
            scrollY: 200,
            scrollCollapse: true,
            paging: false
        });



        attachTableClickEventHandlers(tableObj, this.selected_pos);

        const addRowBtn = $('#add_row');
        addRowBtn.unbind('click');
        addRowBtn.on('click', () => {
            addRow(tableObj).then((newRow) => {
                dt.row.add(newRow).draw();
            });
        });
    }



} // class DT

const attachTableClickEventHandlers = (tableObj, pos) => {
    tableObj.undelegate('click')
    tableObj.undelegate('contextmenu')
    tableObj.delegate("tbody td", "contextmenu", (e) => {
        var top = e.pageY - 10;
        var left = e.pageX - 10;
        const contextMenu = $(stringFormatter(contextmenuHtmlFromat));
        contextMenu.appendTo($('body'));
        $("#context-menu").css({
            display: "block",
            top: top,
            left: left
        }).addClass("show");
        return false;
    }).delegate("tbody td", "click", (e) => {
        const contextMenu = $("#context-menu");
        if (contextMenu.parent().length > 0) {
            contextMenu.removeClass("show").hide();
            contextMenu.remove();
            return false;
        }

        const cellSelector = e.currentTarget,
            currCell = tableObj.DataTable().cell(cellSelector),
            currVal = currCell.data(),
            currObj = $(cellSelector);
        //pos.row = currRow;
        //pos.col = currCol;

        const inputObj = $('<input>', {
            value: currVal,
            type: 'text',
            blur: () => {
                try {
                    currCell.data(inputObj.val());
                } catch (e) {
                    alert(e);
                    currObj.text(currVal);
                }
                inputObj.remove();
            },
            keyup: (e) => {
                if (e.which === 13) inputObj.blur();
            }
        }).appendTo(currObj.empty()).focus();
    });
}

const typeCheck = (colDef, input) => {
    return new Promise(async (resolve, reject) => {
        let checked = input;
        switch (colDef.type) {
            case 'date':
                break;
            case 'json':
                break;
            case 'numeric':
                break;

        }
        resolve(checked);
    });
}

const addRow = (tableObj, selected_row, newRow) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cols = tableObj.DataTable().init().columnDefs;
            newRow = typeof newRow === 'undefined' ? new Object() : newRow;
            for (let i = 0, colLen = cols.length; i < colLen; i++) {
                if (cols[i].type === "date") {
                    const date = new Date();
                    newRow[cols[i].data] =
                        date.getFullYear() +
                        "/" + (date.getMonth() + 1) +
                        "/" + date.getDate();
                } else if (cols[i].type === "numeric") {
                    newRow[cols[i].data] = 0;
                } else if (cols[i].type === "string") {
                    newRow[cols[i].data] = '';
                }
            }


            //dt.fnAddData(newRow);
            //dataset.splice(selected_row+1, 0, newRow);
            resolve(newRow);
        } catch (e) {
            console.log(e);
            reject();
        }

    });
}




/*
$('#btnAddCol').click(function () {
       
        //new column information
        //row's new field(for new column)
        //cols must be updated
        cols.splice(col_num+1, 0, {"mDataProp": "newField"+iter, sTitle: "Col-"+iter, sType : "string"});
        //update the result, actual data to be displayed
        for(var iRes=0; iRes<results.length ;iRes++){
            results[iRes]["newField"+iter] = "data-"+iter;
        }
        //destroy the table
        data_table.fnDestroy();
        $("#example thead tr th").eq(col_num).after('<th>Col-'+iter+'</th>');
        //init again
        initDT();
        iter++;
        addDBClikHandler();
});
*/



/*
var type1 = ["anil","amit","cd","vvv","vvvvvv","99","999","1","1111","hhh","ttt"];
    
function restoreRow ( oTable, nRow ){
    var aData = oTable.fnGetData(nRow);
    var jqTds = $('>td', nRow);
    
    for ( var i=0, iLen=jqTds.length ; i<iLen ; i++ ) 
    {
        oTable.fnUpdate( aData[i], nRow, i, false );
    }
};

function editRow ( oTable, nRow ){
    var aData = oTable.fnGetData(nRow);
    var jqTds = $('>td', nRow);
    jqTds[col_cell].innerHTML = '<input type="text" id ="typ" value="'+aData[cols[col_cell].mData]+'"/>';
    $("#typ").autocomplete({source:type1});
};

function saveRow ( oTable, nRow ){
    var jqInputs = $('input', nRow);
    oTable.fnUpdate( jqInputs[0].value, row_cell, col_cell, false );
};

jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "date-uk-pre": function ( a ) {
        var ukDatea = a.split('/');
        return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1
    },
    
    "date-uk-asc": function ( a, b ) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },
    
    "date-uk-desc": function ( a, b ) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
} );

function fnGetSelected( oTableLocal ){
    var aReturn = new Array();
    var aTrs = oTableLocal.fnGetNodes();
    
    for ( var i=0 ; i<aTrs.length ; i++ )
    {
        if ( $(aTrs[i]).hasClass('row_selected') )
        {
            aReturn.push( aTrs[i] );
        }
    }
    return aReturn;
};

function addDBClikHandler(){
        $('#example tbody tr').on('dblclick', function (e) {
        e.preventDefault();
        
            var nRow = $(this)[0];
    
             var jqTds = $('>td', nRow);
            if($.trim(jqTds[0].innerHTML.substr(0,6)) != '<input') 
            {
                if ( nEditing !== null && nEditing != nRow ) {
                    restoreRow( oTable, nEditing );
                      nEditing = nRow;
                    editRow( oTable, nRow );
                   
                }
                else {
                      nEditing = nRow;
                    editRow( oTable, nRow );
                  
                }
                
            }
        
        
     } );
    
     $('#example tbody tr').keydown(function(event){
    
        if(event.keyCode==13)
        {
        event.preventDefault();
    
         if(nEditing==null)
            alert("Select Row");
        else
            saveRow( oTable, nEditing );
            nEditing = null;
        }
    
    } );
    
    
};
*/