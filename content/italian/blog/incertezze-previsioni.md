---
date: "2025-09-10"
title: "Perché l’incertezza conta: il vero valore delle previsioni"
image: "images/blog/incertezza.png"
author: "francesco-falcolini"
draft: false
---

Il Machine Learning è sempre più diffuso in ambito aziendale e nella gestione di sistemi complessi come energia, finanza o sanità. Ma c’è un elemento che spesso viene sottovalutato: l’incertezza delle previsioni.
Un modello può sembrare accurato, ma senza una misura della fiducia nelle sue stime, rischia di trasformarsi in una scatola nera poco utile, se non addirittura pericolosa.

## Cos’è l’incertezza e perché è inevitabile

Immagina di voler prevedere se domani pioverà. Puoi consultare le previsioni meteo, ma non avrai mai una certezza assoluta: i meteorologi esprimono infatti la previsione in termini di probabilità (“60% di pioggia”).
Questa probabilità rappresenta l’incertezza: non sappiamo con precisione cosa accadrà, ma possiamo stimare quanto fidarci della previsione.

Lo stesso vale per i modelli di Machine Learning. Ogni previsione porta con sé un margine di incertezza. Questa incertezza ha una duplice natura: da un lato c'è l'imprevedibilità intrinseca del fenomeno che stiamo misurando (come il lancio di un dado), dall'altro ci sono i limiti del nostro modello, legati alla quantità o qualità dei dati con cui è stato addestrato. Ignorare questi fattori significa illudersi di avere risposte esatte in un mondo che, invece, resta sempre parzialmente imprevedibile.

## Perché senza incertezza non possiamo fidarci dei modelli

Un modello che fornisce solo un numero “secco” non basta per prendere decisioni di business. Serve sapere anche quanto possiamo fidarci di quel numero.

Prendiamo un esempio concreto nel settore energetico: la gestione di un sistema di accumulo (BESS, Battery Energy Storage System).
Un operatore può decidere di caricare le batterie quando l’elettricità costa poco e di scaricarle quando il prezzo sale, massimizzando così il profitto.

Se il modello prevede che domani il prezzo salirà del 20%, senza un intervallo di confidenza non sappiamo se questa stima è affidabile o se esiste un alto rischio di errore. Un modello ben progettato dovrebbe invece dire:

> Il nostro modello prevede un aumento del prezzo del 20%, e siamo sicuri al 90% che l'aumento reale sarà compreso tra il 15% e il 25%

Con questa informazione l’operatore può valutare il rischio, scegliere strategie più caute o diversificate e prendere decisioni consapevoli. Senza una misura di incertezza, il modello non sarebbe utilizzabile in pratica.

## La calibrazione delle previsioni

Avere una stima dell’incertezza non basta: quella stima deve anche essere calibrata.
Un modello calibrato è un modello in cui la probabilità dichiarata corrisponde effettivamente alla frequenza reale.

Riprendiamo l’esempio del BESS:
se il modello dice che *c’è l' 80% di probabilità che il prezzo salga*, allora su 100 casi simili ci aspettiamo che in circa 80 effettivamente il prezzo salga.
Se invece questo non accade — ad esempio il prezzo sale solo in 40 casi su 100 — allora il modello non è calibrato e la sua incertezza diventa fuorviante.

La calibrazione, quindi, è ciò che trasforma la previsione in uno strumento realmente utile: non solo un numero, ma un’informazione affidabile con cui prendere decisioni.

## I limiti degli LLM

Negli ultimi anni i Large Language Models (LLM) hanno mostrato capacità impressionanti nella generazione di testi, codice e risposte complesse. Tuttavia, quando si tratta di prendere decisioni critiche, presentano un limite fondamentale: faticano a esprimere in modo attendibile la loro incertezza.

Gli LLM spesso forniscono risposte con tono di sicurezza, anche quando la loro affidabilità è bassa. Inoltre, calibrare correttamente la loro “confidenza” è molto più difficile rispetto ai modelli predittivi tradizionali. Questo li rende inadatti a contesti dove serve affidarsi a previsioni misurabili e responsabili, come la gestione dell’energia o la sanità.

## Tecniche per stimare e calibrare l'incertezza

Nel Machine Learning esistono diversi approcci per stimare l’incertezza:

* Modelli probabilistici: algoritmi che producono non solo una previsione puntuale ma anche una distribuzione (ad esempio, i Gaussian Processes).
* Ensemble methods: si addestrano più modelli e si confrontano le loro previsioni; la variabilità tra modelli è un indicatore di incertezza (tipico esempio: Random Forest o ensemble di reti neurali).
* Quantile regression: invece di prevedere un singolo valore, il modello stima diversi quantili, costruendo così un intervallo di confidenza.

Per la calibrazione, i metodi più diffusi sono:

* Platt scaling (basato su regressione logistica, molto usato con SVM e modelli di classificazione).
* Isotonic regression (più flessibile, adatta per dataset ampi).
* Temperature scaling (particolarmente efficace per le reti neurali).

Un approccio particolarmente interessante è la **Conformal Prediction** (CP):

* È agnostica rispetto al modello, quindi può essere applicata sopra qualsiasi algoritmo di ML.
* Non restituisce solo una previsione puntuale, ma un intervallo predittivo (per variabili continue) o un insieme di etichette (per la classificazione).
* Garantisce formalmente che, a un certo livello scelto (es. 90%), il vero valore sarà contenuto in quell’intervallo almeno nel 90% dei casi.

Nell’esempio del BESS, invece di stimare semplicemente *+20% ± 5%*, la CP potrebbe dire: *con il 90% di confidenza, il prezzo varierà tra +15% e +25%*.

## Conclusione

Ogni previsione di Machine Learning deve essere accompagnata da una misura di incertezza: senza questa informazione non possiamo fidarci del modello, né utilizzarlo in scenari di business, e tanto meno in contesti critici.
La calibrazione è ciò che garantisce che le stime di incertezza siano realistiche e utilizzabili.

Il messaggio finale è chiaro: il valore del Machine Learning non sta solo nell’accuratezza della previsione, ma nella trasparenza con cui comunica i suoi limiti.
Solo così possiamo costruire soluzioni affidabili, responsabili e sostenibili, capaci di generare beneficio reale per imprese, cittadini e società.
