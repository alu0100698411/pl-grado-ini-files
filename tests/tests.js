
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


    test('Captacion de comentarios multilinea', function() {
        var tokens = lexer(';Esto es un comentario / \nmultilinea');
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
