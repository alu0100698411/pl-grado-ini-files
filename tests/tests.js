
var assert = chai.assert;

suite('Pruebas Unitarias para el lexer del parseador de ficheros tipo INI', function() {
  
    test('Captacion del header', function() {
        var tokens = lexer('[HOLA]');
		assert.equal(tokens[0].type,'header');
    });
    
    test('Captacion de asignaciones', function() {
        var tokens = lexer('ejemplo = hola');
		assert.equal(tokens[0].type,'nameEqualValue');
    });
    
    test('Captacion de asignaciones multilinea', function() {
        var tokens = lexer('ejemplo =  /  \nhola');
		assert.equal(tokens[0].type,'nameEqualValue');
    });

    test('Captacion de asignaciones con comentarios multilinea', function() {
        var tokens = lexer('four   = hello \  # comments work here, too  \nmultiple \        # and here !!! \nmultilines \       # and even here (OMG) \nyeah ');
		assert.equal(tokens[0].type,'nameEqualValue');
		assert.equal(tokens[1].type,'nameEqualComments');
    });


    test('Captacion de comentarios', function() {
        var tokens = lexer(';Esto es un comentario');
		assert.equal(tokens[0].type,'comments');
    });


    test('Captacion de espacios en blanco', function() {
        var tokens = lexer(' 	');
		assert.equal(tokens[0].type,'blanks');
    });
    
    test('Captacion de errores', function() {
        var tokens = lexer('12345****');
		assert.equal(tokens[0].type,'error');
    });
    
});
suite('Pruebas Unitarias para los tokens del parseador de ficheros tipo INI', function() {
	test('Token comentario 1', function() {
		var input = "; comments should be ignored";
		var tokens = lexer(input);
		var pretty = tokensToString(tokens);
		assert.equal(pretty, '<ol>\n\n\t\t<li> <span class = "comments"> {\n  "type": "comments",\n  "match": [\n    "; comments should be ignored",\n    " comments should be ignored"\n  ]\n} </span>\n\t</ol>');
    });
	test('Token comentario 2', function() {
		var input = "# comments should be ignored";
		var tokens = lexer(input);
		var pretty = tokensToString(tokens);
		assert.equal(pretty, '<ol>\n\n\t\t<li> <span class = "comments"> {\n  "type": "comments",\n  "match": [\n    "# comments should be ignored",\n    " comments should be ignored"\n  ]\n} </span>\n\t</ol>');
    });
	test('Token cabecera', function() {
		var input = "[section_one]";
		var tokens = lexer(input);
		var pretty = tokensToString(tokens);
		assert.equal(pretty, '<ol>\n\n\t\t<li> <span class = "header"> {\n  "type": "header",\n  "match": [\n    "[section_one]",\n    "section_one"\n  ]\n} </span>\n\t</ol>');
    });
	test('Token blanks', function() {
		var input = '\r\n\r\n';
		var tokens = lexer(input);
		var pretty = tokensToString(tokens);
		assert.equal(pretty, '<ol>\n\n\t\t<li> <span class = "blanks"> {\n  "type": "blanks",\n  "match": [\n    "\\r\\n\\r\\n"\n  ]\n} </span>\n\t</ol>');
    });	

	test('Token variable 1: entrecomillada', function() {
		var input = 'five = \"multiple lines  inside of quotations  preserve everything\"';
		var tokens = lexer(input);
		var pretty = tokensToString(tokens);
		assert.equal(pretty, '<ol>\n\n\t\t<li> <span class = "nameEqualValue"> {\n  "type": "nameEqualValue",\n  "match": [\n    "five = \\"multiple lines  inside of quotations  preserve everything\\"",\n    "five ",\n    "multiple lines  inside of quotations  preserve everything"\n  ]\n} </span>\n\t</ol>');
    });	
	test('Token variable 2: multilinea', function() {
		var input = 'three   = hello \\\r\nmultiline';
		var tokens = lexer(input);
		var pretty = tokensToString(tokens);
		assert.equal(pretty, '<ol>\n\n\t\t<li> <span class = "nameEqualValue"> {\n  "type": "nameEqualValue",\n  "match": [\n    "three   = hello \\\\\\r\\nmultiline",\n    "three   ",\n    " hello multiline"\n  ]\n} </span>\n\t</ol>');
    });	
	test('Token variable 3: multilinea y comentarios', function() {
		var input = 'four   = hello \\  # comments work here, too\r\nmultiple \\        # and here !!!\r\nmultilines \\       # and even here (OMG)\r\nyeah ; and even with another format!';
		var tokens = lexer(input);
		var pretty = tokensToString(tokens);
		assert.equal(pretty, '<ol>\n\n\t\t<li> <span class = "nameEqualValue"> {\n  "type": "nameEqualValue",\n  "match": [\n    "four   = hello \\\\  # comments work here, too\\r\\nmultiple \\\\        # and here !!!\\r\\nmultilines \\\\       # and even here (OMG)\\r\\nyeah ; and even with another format!",\n    "four   ",\n    " hello multiple multilines yeah "\n  ]\n} </span>\n\t\n\t\t<li> <span class = "nameEqualComments"> {\n  "type": "nameEqualComments",\n  "match": [\n    "four   = hello \\\\  # comments work here, too\\r\\nmultiple \\\\        # and here !!!\\r\\nmultilines \\\\       # and even here (OMG)\\r\\nyeah ; and even with another format!",\n    "# comments work here, too ",\n    "# and here !!! ",\n    "# and even here (OMG) ",\n    "; and even with another format!"\n  ]\n} </span>\n\t</ol>');
    });
	test('Token variable 4: simple', function() {
		var input = 'not_empty=full';
		var tokens = lexer(input);
		var pretty = tokensToString(tokens);
		assert.equal(pretty, '<ol>\n\n\t\t<li> <span class = "nameEqualValue"> {\n  "type": "nameEqualValue",\n  "match": [\n    "not_empty=full",\n    "not_empty",\n    "full"\n  ]\n} </span>\n\t</ol>');
    });
	test('Token error', function() {
		var input = 'not_empty15asg@r%';
		var tokens = lexer(input);
		var pretty = tokensToString(tokens);
		assert.equal(pretty, '<ol>\n\n\t\t<li> <span class = "error"> {\n  "type": "error",\n  "match": [\n    "not_empty15asg@r%",\n    "%"\n  ]\n} </span>\n\t</ol>');
    });

});

suite('Pruebas Unitarias para localStorage', function() {
	test('Soporte de localStorage', function() {
		if(window.localStorage){
		  localStorage.test = "test";
		  assert.equal(localStorage.test, "test");
		  localStorage.removeItem("test");
		}
    });

});


