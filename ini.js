"use strict"; // Use ECMAScript 5 strict mode in browsers that support it



$(document).ready(function() {
   $("#fileinput").change(singleFile);
 	var dropZone = document.getElementById('drop_zone');
	dropZone.addEventListener('dragover', handleDragOver, false);
	dropZone.addEventListener('drop', handleFileSelect, false);
});

function singleFile(evt) {
  var f = evt.target.files[0]; 

  if (f) {
	addFile(f);
  } else { 
    alert("Failed to load file");
  }
}

var temp = '<li> <span class = "<%= token.type %>"> <%= match %> </span>\n';

function tokensToString(tokens) {
   var r = '';
   for(var i=0; i < tokens.length; i++) {
     var t = tokens[i]
     var s = JSON.stringify(t, undefined, 2);
     s = _.template(temp, {token: t, match: s});
     r += s;
   }
   return '<ol>\n'+r+'</ol>';
}

function lexer(input) {
  var blanks         = /^\s+/;
  var iniheader      = /^\[([^\]\r\n]+)\]/;
  var comments       = /^[;#](.*)/;
  var nameEqualValue = /^([^=;\r\n]+)=("?[^;\r\n\\#]*"?)(?:[;#].*)?/;
  var multiLine = /^\\\s*(?:[;#][^\n]*)?\n([^\\;#\r\n]*)(?:[;#].*)?/;
  var multiLineQuotes = /^([^=;\r\n]+)=\s*"([^"]*)?/;
  var multiLineQuotesContent = /^([^"].*)/;
  var multiLineComment = /([#;][^\n]*)/g ;
  var any            = /^(.|\n)+/;

  var out = [];
  var m = null;

  while (input != '') {
    if (m = blanks.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type : 'blanks', match: m });
    }
    else if (m = iniheader.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'header', match: m });
    }
    else if (m = comments.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'comments', match: m });
    }else if(m = multiLineQuotes.exec(input)){
		var linea = m;
		input = input.substr(m.index+m[0].length);
	
		while(m = multiLineQuotesContent.exec(input)){
			linea[0] += ' '+m[0];
			linea[linea.length-1] += m[1];
			input = input.substr(m.index+m[0].length);		
		}
		linea[0] += '"';
		input = input.substr(1);	
		linea[0] = linea[0].replace(/\\/g,' ');
		linea[0] = linea[0].replace(/\n/g,' ');
		linea[0] = linea[0].replace(/\r/g,' ');
		linea[2] = linea[2].replace(/\\/g,' ');
		linea[2] = linea[2].replace(/\n/g,' ');
		linea[2] = linea[2].replace(/\r/g,' ');
		out.push({ type: 'nameEqualValue', match: linea });
		linea = null;

	}
	else if (m = nameEqualValue.exec(input)) {
		var linea = m;
		var comentarios = new Array();
		
		input = input.substr(m.index+m[0].length);

		while (m = multiLine.exec(input)) {
			linea[0] += m[0];
			linea[linea.length-1] += m[1];
			input = input.substr(m.index+m[0].length);
		}
		
		while(m = multiLineComment.exec(linea[0])){
			m[0] = m[0].replace(/\n/g,' ');
			m[0] = m[0].replace(/\r/g,' ');			
			comentarios.push(m[0]);
		}
		
		linea[0] = linea[0].replace(/\\/g,' ');
		linea[0] = linea[0].replace(/\n/g,' ');
		linea[0] = linea[0].replace(/\r/g,' ');
		
		out.push({ type: 'nameEqualValue', match: linea });
		
		if(comentarios.length!=0){
			comentarios.unshift(linea[0]);
			out.push({ type: 'nameEqualComments', match: comentarios });
		}
		
		linea = null;
    }
    else if (m = any.exec(input)) {
      out.push({ type: 'error', match: m });
      input = '';
    }
    else {
      alert("Fatal Error!"+substr(input,0,20));
      input = '';
    }
  }
  return out;
}

  function addFile(file) {
  		    var r = new FileReader();
			r.onload = function(e) { 
			  var contents = e.target.result;
			  
			  var tokens = lexer(contents);
			  var pretty = tokensToString(tokens);
			  
			  out.className = 'unhidden';
			  var tableRow = document.createElement('tr');
			  var tableDataInput = document.createElement('td');
			  var tableDataOutput = document.createElement('td');
			  var input = document.createElement('pre');
			  input.className = 'input';
			  input.innerHTML = contents;
			  var output = document.createElement('pre');
			  output.className = 'output';
			  output.innerHTML = pretty;
			  
			  tableDataInput.appendChild(input);
			  tableDataOutput.appendChild(output);
			  tableRow.appendChild(tableDataInput);
			  tableRow.appendChild(tableDataOutput);
			  var tabla = document.getElementById("tabla_resultados");
			  tabla.insertBefore(tableRow,tabla.firstChild);
			}
			r.readAsText(file);
  }
  
  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
		addFile(f);
    }
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

