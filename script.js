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
var kat = "images/flowers/";// katalog z obrazkami
var p = 0;// licznik odkrytych pojedynczych pol
var obrazek = [];
obrazek[1] = kat + "1.jpeg";
obrazek[2] = kat + "2.jpeg";
obrazek[3] = kat + "3.jpeg";
obrazek[4] = kat + "4.jpeg";
obrazek[5] = kat + "5.jpeg";
obrazek[6] = kat + "6.jpeg";
obrazek[7] = kat + "7.jpeg";
obrazek[8] = kat + "8.jpeg";
obrazek[9] = kat + "9.jpeg";
obrazek[10] = kat + "10.jpeg";
obrazek[11] = kat + "11.jpeg";
obrazek[12] = kat + "12.jpeg";
obrazek[13] = kat + "13.jpeg";
obrazek[14] = kat + "14.jpeg";
// zestaw obrazków

obrazek[0] = "images/baobab.png";

var start, end;
// USTAW OBRAZKI
var pole = []; // tablica 
pole[1] = { obr: 0, stan: "zakryty"};
pole[2] = { obr: 0, stan: "zakryty"};
pole[3] = { obr: 0, stan: "zakryty"};
pole[4] = { obr: 0, stan: "zakryty"};
pole[5] = { obr: 0, stan: "zakryty"};
pole[6] = { obr: 0, stan: "zakryty"};
pole[7] = { obr: 0, stan: "zakryty"};
pole[8] = { obr: 0, stan: "zakryty"};
pole[9] = { obr: 0, stan: "zakryty"};
pole[10] = { obr: 0, stan: "zakryty"};
pole[11] = { obr: 0, stan: "zakryty"};
pole[12] = { obr: 0, stan: "zakryty"};
pole[13] = { obr: 0, stan: "zakryty"};
pole[14] = { obr: 0, stan: "zakryty"};
pole[15] = { obr: 0, stan: "zakryty"};
pole[16] = { obr: 0, stan: "zakryty"};
pole[17] = { obr: 0, stan: "zakryty"};
pole[18] = { obr: 0, stan: "zakryty"};
pole[19] = { obr: 0, stan: "zakryty"};
pole[20] = { obr: 0, stan: "zakryty"};
pole[21] = { obr: 0, stan: "zakryty"};
pole[22] = { obr: 0, stan: "zakryty"};
pole[23] = { obr: 0, stan: "zakryty"};
pole[24] = { obr: 0, stan: "zakryty"};
pole[25] = { obr: 0, stan: "zakryty"};


// generacja tablicy pól
function genTab(lix, liy) {
	var lixy = lix * liy, h, k,
		e = document.getElementById('ramka');
	//przydzielanie wylosowanych obrazkow, do pol	
	var sf = setfields(lixy);
	flips = 0;
	lp = 0;
	p = 0;
	
	for (c = 1; c <= lixy; c++) {
		pole[c].obr = sf[c-1];
		pole[c].stan = "zakryty";		
		}
	//wyswietlanie tablicy
	e.innerHTML = null;
	e.style.width = (lix * 118) + 10 + 'px';
	e.style.height = (liy * 118) + 10 + 'px';
	e.style.border = "1px solid white";
	for (h = 1; h <= lixy; h++) {
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
	if (pole[nr].stan !==  "zakryty") { return;
		} else {
		var a = document.getElementById('p' + nr);
		a.src = obrazek[pole[nr].obr];
		pole[nr].stan = "odkryty";
		p++;
	}
}

function mainStart(nr) {
	if (koniec_testu === false) { return; }
	zmiana(nr);
	if (p === 2) {document.getElementById("czas").innerHTML
		koniec_testu = false;
		flips++;
		setTimeout("testMatrycy()", 400);
	}
}


function ustaw() {
	start = new Date().getTime(5);
	document.getElementById("czas").innerHTML = 0;	
	lp = 0; // wyzeruj licznik par dobrych
	p = 0;
	flips = 0;
	if (ft===0) return;
	var i;
	for (i = 1; i <= ft; i++) {
		document.getElementById("p" + i).style.visibility = "visible";
		document.getElementById("p" + i).src = obrazek[0];
		pole[i].stan = "zakryty";
	}
}



// sprawdzanie czy oba odkryte sa takie same
function testMatrycy() {
	var b = 0, li;
	if (!Number(ft)) { alert("ft error"); }
	//szukanie odkrytych par - sprawdzanie czy dokladnie dwa pola sa odkryte 	
	for (li = 1; li <= ft; li++) {
		if (pole[li].stan === "odkryty") {
			tem[++b] = li;
		}
	}
	// test zgodnosci odkrytych pol
	if (pole[tem[1]].obr === pole[tem[2]].obr) {
		document.getElementById("p" + tem[1]).style.visibility = "hidden";
		pole[tem[1]].stan = "zakryty";
		document.getElementById("p" + tem[2]).style.visibility = "hidden";
		pole[tem[2]].stan = "zakryty";
		lp++;
	} else {
		document.getElementById("p" + tem[1]).src = obrazek[0];
		pole[tem[1]].stan = "zakryty";
		document.getElementById("p" + tem[2]).src = obrazek[0];
		pole[tem[2]].stan = "zakryty";
	}
	tem[1] = 0;
	tem[2] = 0;
	p = 0;
	koniec_testu = true;
	if (lp === Math.floor(ft/2)) { end = new Date().getTime(5); document.getElementById("czas").innerHTML = Math.floor((end-start)/1000) + " SEKUND";
		alert("Wynik: "+flips); }
	
}
