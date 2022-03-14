import FSDO from "./fsdo.js"

export function launchListView() {
    const fsdo = new FSDO();
    fsdo.linkCollection( 'commander', change => {
        if( change.doc !== undefined && change.doc !== null ) {
            const docId = change.doc.id;
            const docData = change.doc.data();
            if( docData.id !== undefined && docData.id !== null ) {
                const table = $('#table_db'), 
                thead = table.find('thead'), theadRow = thead.find('tr'), 
                tbody = table.find('tbody') 
               
                let rowHtml = ''
                Object.keys(docData).forEach( key => {
                    let initColumn = true;
                    theadRow.children('th').each( (_, th) => {
                        if( th.innerText == key ) {
                            initColumn = false;
                            return false;
                        }
                    });

                    rowHtml += `<td>${docData[key]}</td>`;
                    
                    if( initColumn ) {
                        $(`<th class="text-center">${key}</th>`).appendTo(theadRow);
                    }
                })
                
                if( $(`#addr${docData.id}`).length == 0 ) {
                    console.log( rowHtml )
                    table.append(`<tr id="addr${docData.id}"></tr>`);
                }
                const rowObj = $(`#addr${docData.id}`);
                rowObj.html(`<td>${rowObj.parent().index()}</td>${rowHtml}`);
                rowObj.on('click', ()=>{
                    fsdo.readDocument( 'commander', docId ).then( (docData)=>{
                        console.log('read:'+docData.nameKor)
                    } );
                })
                
            }
        }
    } );

    
}