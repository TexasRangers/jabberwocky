/**
 * @author kelner
 */
// WSZYSTKO MUSI ZOSTAC ZALADOWANE PO SPARSOWANIU HTML-A
window.onload = function() {
	updateSetDisplay.currentSet = 0;
	updateSetDisplay();
	buttonActions();
	
	// USTAWIANIE REAKCJI DLA PRZYCISKOW W MENU GLOWNYM
	function buttonActions()	{
		// przycisk zmiany zestawu
		var		chSet= document.getElementById("changeSet");
		chSet.addEventListener("click", function()	{ okno(updateSetDisplay); }, false);
	
		// przycisk RESTART
		var restart = document.getElementById("resetuj");
		restart.addEventListener("click", resetuj, false);
	
		// przyciski rozmiarow tablicy
		var lista =	[ {rx: 3, ry: 4, elId: "34"},
									{rx: 4, ry: 4, elId: "44"},
									{rx: 4, ry: 5, elId: "45"},
									{rx: 6, ry: 4, elId: "46"},
									{rx: 3, ry: 5, elId: "35"},
									{rx: 5, ry: 5, elId: "55"}
								];
		for (var l = 0; l<6; l++)	{
		butId = document.getElementById(lista[l].elId);
		butId.addEventListener("click", (function(s){ return function(){ genTab(lista[s].rx, lista[s].ry); }})(l), false);	
		}
		
	}
	var lp = 0;// licznik par dobrych
	var ft = 0;// suma par
	var koniec_testu = true;
	var flips = 0; //licznik prob
	var p = 0;// licznik odkrytych pojedynczych pol

	// tablica z obrazkami
	var obrazek = inicjuj_obrazki(updateSetDisplay.currentSet);

	// stałe definiujące czy karta jest zakryta czy odkryta
	var ZAKR = "zakryty", ODKR = "odkryty";

	// USTAW OBRAZKI
	var pole = inicjuj_pola();

	// zmienna globalna na tajmer
	var tajmer;

	/*inicjacja wartosci dla metody mem funkcji proxyReset - to nie jest zmienna globalna,
		to tzw. hoisting, deklarujemy i inicjujemy metodę wewnnętrzną funkcji, która jest
		zdefiniowana gdzies dalej w kodzie. Sama funkcja moze zmieniać(i to robi) tę wartość,
		jednak, żako,, że jest to metoda, dodatkowo zwracana przez tą funkcje, powoduje to
		zachowanie jej wartosci, az do kolejnej zmiany wywolanej przez ta funkcje lub przez
		inny obiekt (standardowo ta metoda jest read-write).
	*/
	proxyReset.mem = { mx: 0, my: 0 };

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
	function inicjuj_obrazki(zestawik) {
  	var obrazek = [];
  	var obrazki_katalog = "images/";
  	var kat = obrazki_katalog + "zestaw" + zestawik +"/";
  	obrazek[0] = obrazki_katalog + "baobab.png";
  	for(var i = 1; i <= 14; i++) {
        obrazek[i] = kat + i + ".jpeg";
  	}	
    return obrazek;
	}

	// generacja tablicy pól
	function genTab(lix, liy) {
		proxyReset(lix,liy);
		ft = 0; // zerowanie liczby kafelków
		resetuj();
		var lixy = lix * liy, h, k,
		e = document.getElementById('ramka');
		//przydzielanie wylosowanych obrazkow, do pol
		var sf = setfields(lixy);
		flips = 0;
		lp = 0;
		p = 0;
		for (var c = 0; c < lixy; c++) {
	    pole[c].obr = sf[c];
	    pole[c].stan = ZAKR; console.log("pole:"+c);
		}
    
		//wyswietlanie tablicy
		e.innerHTML = null;
		e.style.width = (lix * 118) + 10 + 'px';
		e.style.height = (liy * 118) + 10 + 'px';
		e.style.border = "1px solid white";
		for (h = 0; h < lixy; h++) {
		var pl = document.createElement("img");
		pl.className = "pole";
		pl.id = "p"+h;
		pl.src = obrazek[0];
		pl.addEventListener("click", (function(s){ return function(){ mainStart(s);}})(h), false);
		e.appendChild(pl);
		}
		ft = lixy; //ilosc elementow tablicy (do okreslenia ilosci par do odkrycia)
	}

	// funkcja zwraca gotową tabelke z wylosowanymi indeksami obrazków potrzebną dla zmiennej SF z genTab()
	function setfields(ilosc_pol) {
		var pulaStart = [], pula = [], tabelka = [], wynik, b = 1;
			//tworzenie zestawu obrazkow do wylosowania
  		//pula startowa z wszystkimi numerami obrazkow - [1,2,3,4,... 13,14]
		for (var licznik = 0; licznik < 14; licznik++) { 
	    pulaStart[licznik] = licznik + 1;
		}
	
		/*tworzenie zestawu przetasowanych par obrazkow - np. [3,3,9,9,1,1, ... 6,6,12,12],	
			w ten sposob maszyna losująca obrazek (zmienna LOS), wylosuje kazdy obrazek dokladnie 2 razy
		*/		
		for(var poc=0; poc<ilosc_pol; poc = poc + 2) {            
			var s1 = Math.floor(Math.random() * pulaStart.length);
			pula[poc] = pulaStart[s1];
			pula[poc + 1] = pula[poc];
			pulaStart.splice(s1, 1); //usun wylosowany obrazek z pulaStart
		}

		//losowanie obrazka z puli par
		for (var i = ilosc_pol; i >= 1; i--) {
			var los = Math.floor(Math.random() * pula.length);
			wynik = pula[los];
			tabelka.splice(b, 0, wynik); //dodajemy "wynik" do koncowego zestawu (tabelki)  
			b = b + 1;
			//usuwanie wylosowanego obrazka z zestawu, aby nie losowac go ponownie, tym samym zmniejszamy rozmiar puli
			pula.splice(los, 1);
		}
		return tabelka;
	}

	/**
 	* zmień status pola na 'odkryte'.
 	* @param nr nr pola w zmiennej pole[]
 	*/
	function odkryj_pole(nr) {
    // zmiana statusu pola jesli zakryte
    var a = document.getElementById('p' + nr);
    a.src = obrazek[pole[nr].obr];
    pole[nr].stan = ODKR;
	}


	// reakcja na wybranie kafelka
	function mainStart(nr) { console.log("mainstart nr :"+nr);
		if (pole[nr].stan === ODKR) { return; }; //nie reaguj na doubleclick tego samego
		p++; //zwieksz ilosc odkrytych kafelków
		if (p>2) { p=0; return; }; //jesli odkryte 2 obrazki, poczekaj 
		tajmer.start();  // upewnij się że tajmer jest zastartowany
		if (koniec_testu === false) { return; } //jeśli "testMatrycy" nie skończył, opuść funkcje bez odkrywania kolejnego kafelka	
		odkryj_pole(nr); //...a jeśli skończył, to odkryj kolejny kafelek
		flips++; //zwiększ ilość pojedynczych "odkryć" kafelków (część punktacji)	
		if (p === 2) {// jeśli dwa kafelki odkryte, wykonaj "testMatrycy"
		setTimeout(testMatrycy, 400);
		};
	}

	/* tzw. posrednik - pozwala on pobrac, zapamietac, i przekazac rozmiary tablicy z jednej funkcji do drugiej
		bez koniecznosci tworzenia zmiennej globalnej, a my potrzebujemy X i Y w funkcji resetuj(), do prawidlowego
		wywolania genTab(), która robi wszystko - inicjuje, losuje i ustawia kafelki, gotowe do klikniecia.
	*/
	function proxyReset(lx,ly) {
		proxyReset.mem.mx = lx;
		proxyReset.mem.my = ly;
	return proxyReset.mem;	//zwraca obiekt zawierający wymiary matrycy z obrazkami
	}

	function resetuj() {
    if(tajmer) {
        tajmer.stop();
        tajmer.reset();
    } else {
        tajmer = new Tajmer("timer");      
    }
		if (ft===0) return;
		/*	generujemy ponownie tablice (automatycznie resetujac odpowiednie zmienne),
     		przekazując do genTab-a zmienne mx i my , wczesniej ustawione w obiekcie .mem, w funkcji
     		proxyReset. Zmienne te są ustawiane za pomoca wywołania tej funkcji w genTab().
  	*/
		genTab(proxyReset.mem.mx, proxyReset.mem.my);
	}

	// sprawdzanie czy oba odkryte sa takie same
	function testMatrycy() {
		var tem = [0,0];// zmienna tymczasowa - przechowuje pary do porownania
		koniec_testu = false; // oznaczenie początku testu
		var b = 0, li;
		if (!Number(ft)) { alert("ft error"); };
		//szukanie odkrytych par - sprawdzanie czy dokladnie dwa pola sa odkryte
		for (li = 0; li < ft; li++) {
			if (pole[li].stan === ODKR) {
				tem[b++] = li;
			}
		}  
		// test zgodnosci odkrytych pol  
		if (pole[tem[0]].obr === pole[tem[1]].obr) {
			document.getElementById("p" + tem[0]).style.visibility = "hidden";
			pole[tem[0]].stan = ZAKR;
			document.getElementById("p" + tem[1]).style.visibility = "hidden";
			pole[tem[1]].stan = ZAKR;
			lp++;
		} else {
			document.getElementById("p" + tem[0]).src = obrazek[0];
			pole[tem[0]].stan = ZAKR;
			document.getElementById("p" + tem[1]).src = obrazek[0];
			pole[tem[1]].stan = ZAKR;
		}
		p = 0; 
		koniec_testu = true;
    // gracz wygrał!
		if (lp === Math.floor(ft/2)) {
            tajmer.stop();
            var ac = tajmer.aktualny_czas();
            alert("Wynik: "+flips+" flipsów"+"\nCzas: "+ ac + "\n\nPunkty: "+ wynik(flips, ac, ft));
            resetuj(); //resetuj czas i generuj nową tablice o tym samym rozmiarze (domyslnie)
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
 *
 * a później łatwo zawołać:
 *
 * <code>
 * timer.aktualny_czas();
 * </code>
 *
 * żeby uzyskać string z czasem.
 *
 * @param id ID elementu HTML gdzie ma być ustawiony
 */
	var Tajmer = function (id)	{ // id = ID elementu HTML, w którym ma być umieszczony timer lub stan koncowy tajmera
		this.prot = false; // protection lock - metoda dla clearInterval
		this.t = new Object(); // clearInterval wymaga metody (przy użyciu var t, zeruje licznik, ale nie zatrzymuje go - liczy od nowa)
		this.exit = new String(); // wyjscie dla clearInterval (stop)
		var place = document.getElementById(id); // ustaw miejsce wyswietlania tajmera
		var disp;
		if(!place) {
			console.log("UWAGA: Nie udało odnaleźć elementu z id='" + id + "' na stronie!");
    }
    // zmienne na sekundy, minuty i godziny
    var h=0, m=0, s=0;

    /**
     * resetuj zawartość tajmera.
     */
    this.reset = function() {
        h=0, m=0, s=0;
        if(place) {
            place.textContent = formatuj_czas();
        };
    };

    /**
     * sformatuj czas z ilości godzin, minut i sekund na string.
     * @return string ze sformatowanym czasem
     */
    function formatuj_czas() {
        return "" + fmt_liczbe(h) + ":" + fmt_liczbe(m) + ":" + fmt_liczbe(s);
    }

    /**
     * prefiksuj liczbę zerem, jeśli jest mniejsza niż 10.
     * @param liczba
     * @return jeśli liczba
     */
    function fmt_liczbe(liczba) {
        if(liczba < 10) {
            return "0" + liczba;
        }
        return "" + liczba;
    }

    /**
     * startuj tajmera.
     */
		this.start = function() {
			if (this.prot) { return; }; // jesli tajmer nie zostal zatrzymany, nie uruchamiaj go kolejny raz
			this.prot = true; // tajmer startuje
			this.t = setInterval(function() {
				s++; // sekunda do przodu
				if	(s>59)	{ s=0; m++; };
				if	(m>59)	{ m=0; h++; };
				if	(h>99)	{ h=0; }; // tajmer zawinie się po 99:99:99
				disp = formatuj_czas(); //layout zegara
				if(place) {
					place.textContent = disp;	// update zegara w elemencie html                
				}
				exit = disp; //zapamietanie stanu do wyslania w przypadku zatrzymania timera
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

    // ...i na początek zresetuj tajmer
    this.reset();

	};
	
	/*	FUNKCJA ZWRACAJACA WYNIK (LICZBE PUNKTOW)
	*		ARGUMENTY: 
	*		lk - liczba prob (odkryc kafelkow)
	*		czas - czas rozgrywki (STRING w formacie hh:mm:ss)
	*		roztab - rozmiar tablicy (ilosc kafelkow)
	*/
	function wynik(lk, czas, roztab) {
    var bonus = 0;
    if (roztab%2 !==0)	{
    	roztab = roztab - 1;
    	bonus = bonus + (roztab*10);
    }
    var t = czas.split(":");
    czas = (t[0] * 3600) + (t[1] * 60) + (t[2] * 1);
    var minCzas = roztab/2
    var pula = (roztab * minCzas * 10) + bonus;
    var pktCzas = (czas - minCzas) * 5;
    var pktKaf  = (lk - roztab) * 10;
    var punkty = pula - pktCzas - pktKaf;
    return punkty;
	}
	
	// FUNKCJA AKTUALIZUJACA I WYSWIETLAJACA BIEZACY ZESTAW
	function updateSetDisplay(zestaw)	{
		console.log("updateSetDisplay");
		cs = document.getElementById("currentsetImage");
		if (zestaw === undefined) {
			cs.src = "images/zestaw" + updateSetDisplay.currentSet + "/1.jpeg"; 
			console.log("nie ma zestawu - odczyt updsetdis");
			return updateSetDisplay.currentSet;
		};
		updateSetDisplay.currentSet = zestaw;
		cs.src = "images/zestaw" + updateSetDisplay.currentSet + "/1.jpeg";
		obrazek = inicjuj_obrazki(updateSetDisplay.currentSet); 
		if (proxyReset.mem.mx !== 0) genTab(proxyReset.mem.mx, proxyReset.mem.my); // rysuj tablice tylko po ustaleniu jej rozmiaru
	}
	/*	MENU WYBORU ZESTAWU
	*		jako argument musi tu wystapic funkcja, ktora wyswietla, aktualizuje i dostarcza nr zestawu
	*/
	function okno (updateSD) {
		console.log("okno");
		var aktualny_zestaw = updateSD();
		createBase(); // struktura HTML/CSS
		/*funkcja w setTimeout musi byc bezargumentowa, jesli nie uzywamy "niezalecanej" konstrukcji 
		* setTimeout("nazwaFunkcji(argument)", opoznienie).	
		* dlatego setMat z argumentem opakowalem w funkcje bezargumentowa (takie popularne rozwiazanie)
		*/
		setTimeout( startpopap, 50);
		setTimeout( function(){ setMat(aktualny_zestaw);}, 300);// opoznienie jako pomoc dla efektu animacji
		setTimeout( function(){ dispSelectSet(); setEventListeners();  }, 500);

		// TWORZENIE STRUKTURY HTML DLA POP-UP'A	- CSS DLA STRUKTURY JEST W STYLE.CSS
		function createBase()	{
			console.log("createBase");
			// zaciemnienie
			var backElement =	document.createElement("div");
			backElement.id = "backgnd";
			document.body.appendChild(backElement);

			// podklad dla pop-up'a
			var popRama = document.createElement("div");
			popRama.id = "popRama";
			document.body.appendChild(popRama);

			// wlasciwy pop-up
			var ramka = document.getElementById("popRama");
			var popik = document.createElement("div");
			popik.id = "popik";
			ramka.appendChild(popik);

			// podzial pop-up'a na die czesci - gorna i dolna
			var popMain = document.getElementById("popik");
			var popikTop = document.createElement("div");
			popikTop.id = "popikTop";
			var popikBottom = document.createElement("div");
			popikBottom.id = "popikBottom";
			popMain.appendChild(popikTop);
			popMain.appendChild(popikBottom);
		}
		// AKTYWUJE OKNO 'POP-UP' OPARTE NA CSS
		function startpopap()	{
			console.log("startpopap");
			document.getElementById("popRama").id = "popRamaAfter";
			document.getElementById("backgnd").id = "backgndShad";
		}
		// ZATWIERDZA ZESTAW I DEZAKTYWUJE 'POP-UP'A
		function removepopap(stan)	{
			console.log("removepopap");
			if (stan === true) updateSD(zestawSel.gotowy); // aktualizacja numeru zestawu - nazwa funkcji to argument glownej funkcji 'okno'
			delMat(); // usuwa wewnetrzne elementy pop-up'a - kafelki (dla plynnosci i poprawnosci animacji)
			delMenuSet(); // usuwa menu zestawow	(dla plynnosci i poprawnosci animacji)				
			document.getElementById("popRamaAfter").id = "popRama";	  
			document.getElementById("backgndShad").id = "backgnd";
			setTimeout( delBase, 400);
		}
		// USTAWIA MATRYCE OBRAZKOW Z WYBRANEGO ZESTAWU
		function setMat(set_nr)	{
			console.log("setMat");
			var a = [];
			for	(var cn = 0; cn<20; cn++)	{
				a[cn] = document.createElement("img");	
				a[cn].className = "kwadracik";
				a[cn].src = "images/zestaw"+set_nr.toString()+"/"+(cn+1)+".jpeg";
				document.getElementById("popikTop").appendChild(a[cn]);
			};
		}
		// WYSWIETLA MENU WYBORU ZESTAWU
		function dispSelectSet	(){
			console.log("dispSelectSet");
			// tworzenie struktury HTML z 4 obrazkami jako menu
			for (var z = 0; z<4; z++)	{
				var zest = document.createElement("img");
				zest.src = "images/zestaw"+z+"/1.jpeg"; //pierwszy obrazek danego zestawu ustaw jako reprezentacyjny
				zest.className = "zestaw"; // predefiniowany CSS dla menu
				zest.id = "z"+z;
				document.getElementById("popikBottom").appendChild(zest);
				};
			// przycisk ANULUJ
			var elem = document.createElement("button");
			var elemName = document.createTextNode("Anuluj");
			elem.id = "anuluj";
			elem.style.width = "30%";
			elem.style.top = "70%";
			elem.style.left = "35%";
			elem.style.marginRight = "5px";
			document.getElementById("popikBottom").appendChild(elem);
			document.getElementById("anuluj").appendChild(elemName);							
			
			// przycisk OK
			var elem = document.createElement("button");
			var elemName = document.createTextNode("OK");
			elem.id = "confset";
			elem.style.width = "30%";
			elem.style.top = "70%";
			elem.style.left = "35%";  
			document.getElementById("popikBottom").appendChild(elem);
			document.getElementById("confset").appendChild(elemName);
		}
		// USTAWIANIE OBSLUGI REAKCJI NA WYBOR ZESTAWU	
		function	setEventListeners (){
			console.log("setEventListeners");			
			document.getElementById("z0").addEventListener("click", function(){ zestawSel(0); }, false);
			document.getElementById("z1").addEventListener("click", function(){ zestawSel(1); }, false);
			document.getElementById("z2").addEventListener("click", function(){ zestawSel(2); }, false);
			document.getElementById("z3").addEventListener("click", function(){ zestawSel(3); }, false);
			document.getElementById("confset").addEventListener("click", function(){ removepopap(true); }, false);
			document.getElementById("anuluj").addEventListener("click", function(){ removepopap(false); }, false);
			}
		// REAKCJA NA WYBRANIE ZESTAWU    
		function	zestawSel(t)	{
			console.log("zestawSel");
			//if (aktualny_zestaw === t) { return; }; // gdy zestaw ten sam, nie wyswietlaj ponownie
			for (var li=0; li<4; li++) {
			// zastosuj zmiane stylu tylko dla wybranego obrazka reprezentujacego dany zestaw ...
				if (li===t) {
					var zClick = document.getElementById("z"+t);
					zClick.style.border = "5px solid yellow";
					zClick.style.width = "70px";
					zClick.style.height = "70px";
				} else	{ // ... a pozostale "zestawy" ustaw na styl defaultowy
					document.getElementById("z"+li).style.border = null;
					document.getElementById("z"+li).style.width = "80px";
					document.getElementById("z"+li).style.height = "80px";
				};
			};
			delMat();// wyczysc matryce
			setMat(t); // wyswietl wybrany zestaw obrazkow
			zestawSel.gotowy = t;
		}
		// USUWANIE MATRYCY OBRAZKOW
		function delMat()	{
			console.log("delMat");			
			elem = document.getElementById("popikTop");
			for (var cn = 0; cn<20; cn++){
				elem.removeChild(elem.childNodes[0]);
			};
		}
		// USUWANIE MENU ZESTAWOW
		function delMenuSet ()	{
			console.log("delMenuSet");
			var elem = document.getElementById("popikBottom");
			var bt = document.getElementById("confset");
			bt.removeEventListener("click", removepopap, false );
			for	(var z = 0; z<5; z++)	{
				elem.removeChild(elem.childNodes[0]);	
			};
		}
		function	delBase ()	{
			console.log("delBase");
			var baza = document.getElementById("popRama");
			var cien = document.getElementById("backgnd");
			document.body.removeChild(baza);
			document.body.removeChild(cien);
		}
	}

}

