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
  var nameEqualValue = /^([^=;\r\n]+)=([^;\r\n]*)/;
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
    }
    else if (m = nameEqualValue.exec(input)) {
      /* while (match casa con /\\$/) concatena la siguiente línea */
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'nameEqualValue', match: m });
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
			  document.getElementById("tabla_resultados").appendChild(tableRow);
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

