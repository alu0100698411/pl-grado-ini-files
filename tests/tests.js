var assert = chai.assert;

suite('Suite CSV', function() {

   test('Tabla Simple', function () {
        original.value = '1,2,3\n4,5,6';
        calculate();
        var valueExpected = '<p>\n</p><table class="center" id="result">\n<tbody><tr>\n\t<td>1</td><td>2</td><td>3</td>\n    </tr>\n<tr>\n\t<td>4</td><td>5</td><td>6</td>\n    </tr>\n</tbody></table>';
        assert.deepEqual(finaltable.innerHTML, valueExpected);
    });

    test('Tabla Compleja', function () {
        original.value = 'Hola, caracola, "Pan, queso y miel"\nalmendras, lechuga, jamon';
        calculate();
        var valueExpected = '<p>\n</p><table class="center" id="result">\n<tbody><tr>\n\t<td>Hola</td><td> caracola</td><td>Pan, queso y miel</td>\n    </tr>\n<tr>\n\t<td>almendras</td><td> lechuga</td><td> jamon</td>\n    </tr>\n</tbody></table>';
        assert.deepEqual(finaltable.innerHTML, valueExpected);
    });

    test('Error', function () {
        original.value = '1,2,3\nq,w,e,r';
        calculate();
        var valueExpected = '<p>\n</p><table class="center" id="result">\n<tbody><tr>\n\t<td>1</td><td>2</td><td>3</td>\n    </tr>\n<tr class="error">\n\t<td>q</td><td>w</td><td>e</td><td>r</td>\n    </tr>\n</tbody></table>';
        assert.deepEqual(finaltable.innerHTML, valueExpected);
    });
  

});
