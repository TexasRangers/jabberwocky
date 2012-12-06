module("Inicjalizacja");

test( "test długości tablicy z obrazkami", function() {
    var obrazki = inicjuj_obrazki();
    equal( obrazki.length, 15, "zła długość tablicy, powinno być 15 " );
});

test( "czy inicjalizacja zmiennej 'pola[]' przebiegła poprawnie", function() {
    var pole = inicjuj_pola();
    equal( pole.length, 25, "rozmiar zmiennej 'pole[]' nieprawidłowy" );
    for(var i=0; i<pole.length; i++) {
      equal(pole[i].stan, "zakryty", "pole " + i + " nie jest zakryte");
      equal(pole[i].obr, 0, "pole " + i + " jest 'obrocone' (a nie powinno)");
    }
})