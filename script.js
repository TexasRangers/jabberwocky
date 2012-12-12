/**
 * @author kelner
 */

var lp = 0;// licznik par dobrych
var ft = 0;// suma par
var tem = [];// zmienna tymczasowa - przechowuje pary do porownania
tem[1] = 0;
tem[2] = 0;
var koniec_testu = true;
var flips = 0; //licznik prob

var p = 0;// licznik odkrytych pojedynczych pol

// tablica z obrazkami
var obrazek = inicjuj_obrazki();

// stałe definiujące czy karta jest zakryta czy odkryta
var ZAKR = "zakryty", ODKR = "odkryty";

// USTAW OBRAZKI
var pole = inicjuj_pola();

// zmienna globalna na tajmer
var tajmer;

/**
 * inicjuj pola.
 * @return poczatkowy stan pol (wszystkie zakryte)
 */
function inicjuj_pola() {
    // 25 elementów - max możliwych
    var rozmiar = 25;
    var pole = [];
    for(var i = 0; i < 25; i++) {
        pole[i] = { obr: 0, stan: ZAKR };
    }
    return pole;
}

/**
 * inicjuje obrazki.
 * @return tablica z zainicjowanymi obrazkami.
 */
function inicjuj_obrazki() {
    var obrazek = [];
    var obrazki_katalog = "images/";
    var kat = obrazki_katalog + "flowers/";
    obrazek[0] = obrazki_katalog + "baobab.png";
    for(var i = 1; i <= 14; i++) {
        obrazek[i] = kat + i + ".jpeg";
    }

    return obrazek;
}

// generacja tablicy pól
function genTab(lix, liy) {
	var lixy = lix * liy, h, k,
		e = document.getElementById('ramka');
	//przydzielanie wylosowanych obrazkow, do pol
	var sf = setfields(lixy);
	flips = 0;
	lp = 0;
	p = 0;

	for (c = 0; c < lixy; c++) {
		pole[c].obr = sf[c];
		pole[c].stan = ZAKR;
		}
	//wyswietlanie tablicy
	e.innerHTML = null;
	e.style.width = (lix * 118) + 10 + 'px';
	e.style.height = (liy * 118) + 10 + 'px';
	e.style.border = "1px solid white";
	for (h = 0; h < lixy; h++) {
		e.innerHTML += '<img class="pole" id="p' + h + '" src="' + obrazek[0] + '" onclick="mainStart(' + h + ')"></img>';
	}
	ft = lixy; //ilosc elementow tablicy (do okreslenia ilosci par do odkrycia)
}

function setfields(ilosc_pol) {

	//ilosc_pol = Math.floor(ilosc_pol/2);
	var pula = [], tabelka = [], wynik, b = 1;
	//tworzenie zestawu obrazkow do wylosowania
	var a1 = 0,
		a2 = 0;//numer obrazka
	if (ilosc_pol%2) {
		pula.splice(0, 0, 1);
		a1 = a1 + 1;
		a2 = a2 + 1;
		}
	while (a1 < (ilosc_pol-1)) {
		pula.splice(a1, 0, a2+1, a2+1);
		a1 = a1 + 2;
		a2++;
	}
	//losowanie obrazka

	for (ilosc_pol; ilosc_pol >= 1; ilosc_pol--) {
		var los = Math.floor(Math.random() * ilosc_pol);
		wynik = pula[los];
		tabelka.splice(b++, 0, wynik);
		//usuwanie wylosowanego obrazka z zestawu
		pula.splice(los, 1);
	}
	//display

	return tabelka;
}


// wybor pola
function zmiana(nr) {
	if (p === 2) {
		return;
	}
	// zmiana statusu pola jesli zakryte
	if (pole[nr].stan !==  ZAKR) { return;
		} else {
		var a = document.getElementById('p' + nr);
		a.src = obrazek[pole[nr].obr];
		pole[nr].stan = ODKR;
		p++;
	}
}

// reakcja na wybranie kafelka
function mainStart(nr) {
	tajmer.start();  // upewnij się że tajmer jest zastartowany
	if (koniec_testu === false) { return; } //jeśli "testMatrycy" nie skończył, opuść funkcje bez odkrywania kolejnego kafelka	
	zmiana(nr); //...a jeśłi skończył, to odkryj kolejny kafelek
	flips++; //zwiększ ilość pojedynczych "odkryć" kafelków (część punktacji)
	if (p>2) alert("ooooooooo");
	if (p === 2) {// jeśli dwa kafelki odkryte, wykonaj "testMatrycy"
		setTimeout("testMatrycy()", 400);
	};
}


function resetuj() {
  inicjuj_pola();
  tajmer = new tajmer("timer");
	lp = 0; // wyzeruj licznik par dobrych
	p = 0;
	flips = 0;
	if (ft===0) return;
	var i;
	for (i = 1; i <= ft; i++) {
		document.getElementById("p" + i).style.visibility = "visible";
		document.getElementById("p" + i).src = obrazek[0];
		pole[i].stan = ZAKR;
	}
}



// sprawdzanie czy oba odkryte sa takie same
function testMatrycy() {
	koniec_testu = false; // oznaczenie początku testu
	var b = 0, li;
	if (!Number(ft)) { alert("ft error"); }
	//szukanie odkrytych par - sprawdzanie czy dokladnie dwa pola sa odkryte
	for (li = 0; li < ft; li++) {
		if (pole[li].stan === ODKR) {
			tem[++b] = li;
		}
	}  
	// test zgodnosci odkrytych pol  
	if (pole[tem[1]].obr === pole[tem[2]].obr) {
		document.getElementById("p" + tem[1]).style.visibility = "hidden";
		pole[tem[1]].stan = ZAKR;
		document.getElementById("p" + tem[2]).style.visibility = "hidden";
		pole[tem[2]].stan = ZAKR;
		lp++;
	} else {
		document.getElementById("p" + tem[1]).src = obrazek[0];
		pole[tem[1]].stan = ZAKR;
		document.getElementById("p" + tem[2]).src = obrazek[0];
		pole[tem[2]].stan = ZAKR;
	}
	tem[1] = 0;
	tem[2] = 0;
	p = 0; 
	koniec_testu = true;

    // gracz wygrał!
	if (lp === Math.floor(ft/2)) {
            tajmer.stop();
            alert("Wynik: "+flips+" flipsów"+"\nCzas: "+ tajmer.aktualny_czas());
        }
}


/**
 * 'Klasa' tajmera. Sposób użycia:
 *
 * <code>
 * var timer = new Timer("timerid");
 * ...
 * timer.start();
 * ...
 * timer.stop();
 * ...
 * </code>
 * a później łatwo zawołać: 
 * @param id ID elementu HTML gdzie ma być ustawiony
 */
function tajmer(id)	{ // id = ID elementu HTML, w którym ma być umieszczony timer lub stan koncowy tajmera
    this.prot = false; // protection lock - metoda dla clearInterval
    this.t = new Object(); // clearInterval wymaga metody (przy użyciu var t, zeruje licznik, ale nie zatrzymuje go - liczy od nowa)
    this.exit = new String(); // wyjscie dla clearInterval (stop)

    var place = document.getElementById(id); // ustaw miejsce wyswietlania tajmera
    var disp;

    if(!place) {
        console.log("UWAGA: Nie udało odnaleźć elementu z id='" + id + "' na stronie!");
    }

    // zmienne na sekundy, minuty i godziny
    var h1=0, h2=0, m1=0, m2=0, s1=0, s2=1; // hh-mm-ss
    
    /**
     * resetuj zawartość tajmera.
     */
    this.reset = function() {
        h1=0, h2=0, m1=0, m2=0, s1=0, s2=1;
    };

    /**
     * sformatuj czas z ilości godzin, minut i sekund na string.
     * @return string ze sformatowanym czasem
     */
    function formatuj_czas() {
        return ""+h1+h2+":"+m1+m2+":"+s1+s2;        
    }
    
    /**
     * startuj tajmera.
     */
    this.start = function() {
	if (this.prot) { console.log("timer already started"); return; }; // jesli tajmer nie zostal zatrzymany, nie uruchamiaj go kolejny raz

        console.log("tajmer start");
        
	this.prot = true; // tajmer startuje
	this.t = setInterval(	function() {
	    if	(s2>9)	{ s2=0; s1++;	};
	    if	(s1>5)	{ s1=0; m2++;	};
	    if	(m2>9)	{ m2=0; m1++;	};
	    if	(m1>5)	{ m1=0; h2++;	};
	    if	(h2>9)	{ h2=0; h1++;	};
	    disp = formatuj_czas(); //layout zegara
            if(place) {
	        place.textContent = disp;	// update zegara w elemencie html                
            }

	    exit = disp; //zapamietanie stanu do wyslania w przypadku zatrzymania timera
	    s2++;	// sekunda do przodu
	}, 992); // wychodzi na to, silniki JS zawsze dodają kilka ms (jednowątkowośc long story :)))
    };

    /**
     * stopuj tajmera.
     */
    this.stop = function() {
        clearInterval(this.t); //zatrzymuje licznik (czyli wartość zmiennej t)
	this.prot=false; // protection lock wyłączony, można teraz ponownie uruchomic tajmer
	return this.exit;
    }; 

    /**
     * zwróć aktualną wartość tajmera (sformatowaną).
     * @return 
     */
    this.aktualny_czas = function() {
        return formatuj_czas();
    };

    // inicjalizacja objektu
    if(place) {
        place.textContent = formatuj_czas(); // reset zawartosci elementu html
    }


}