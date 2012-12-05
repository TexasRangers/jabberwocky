module("Inicjalizacja");

test( "test długości tablicy z obrazkami", function() {
    var obrazki = inicjuj_obrazki();
    equal( obrazki.length, 15, "zła długość tablicy, powinno być 15 " );
});

test( "czy inicjalizacja zmiennej 'pola[]' przebiegła poprawnie", function() {
    equal( pole.length, 25, "rozmiar zmiennej 'pola[]' nieprawidłowy" );
})