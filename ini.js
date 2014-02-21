"use strict"; // Use ECMAScript 5 strict mode in browsers that support it


$(document).ready(function() {
   $("#fileinput").change(addIni);
 	var dropZone = document.getElementById('drop_zone');
	dropZone.addEventListener('dragover', handleDragOver, false);
	dropZone.addEventListener('drop', handleFileSelect, false);
});

function addIni(evt) {
	var f 

	if(evt.type != "drop")
		f = evt.target.files[0]; 
	else
		f = evt.dataTransfer.files[0];

	if (f){
		var r = new FileReader();
		r.onload = function(e) { 
			var contents = e.target.result;

			var tokens = lexer(contents);
			var pretty = tokensToString(tokens);

			out.className = 'tabla_resultados';

			if (window.localStorage) localStorage.initialinput = contents;
				initialinput.innerHTML = contents;
			if (window.localStorage) localStorage.finaloutput = pretty;
				finaloutput.innerHTML = pretty;
		}
		r.readAsText(f);
		added_file.innerHTML = f.name+' '+f.size+' bytes, last modified:'+f.lastModifiedDate.toLocaleDateString();
		if (window.localStorage){
			localStorage.added_file = added_file.innerHTML ;	
		} 
	}else { 
		alert("Failed to load file");
	}
}


function tokensToString(tokens) {
   var r = '';
   var temp = document.getElementById("template1").innerHTML;

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
  
function handleFileSelect(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	var files = evt.dataTransfer.files; // FileList object.
	
	addIni(evt);
	 evt.target.style.background = "#CEE765";

}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	  evt.target.style.background = "#A3D84A"; 
}
    
  
//Añadir Local Store
window.onload = function() {
  // If the browser supports localStorage and we have some stored data
  if (window.localStorage && localStorage.initialinput) {
    document.getElementById("initialinput").innerHTML = localStorage.initialinput;
    document.getElementById("out").className = "none";
  }
  if (window.localStorage && localStorage.finaloutput) {
    document.getElementById("finaloutput").innerHTML = localStorage.finaloutput;
  }
  if (window.localStorage && localStorage.added_file) {
    document.getElementById("added_file").innerHTML = localStorage.added_file;
  }
};