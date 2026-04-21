---
date: "2026-04-21"
title: "Dalle righe alle colonne: viaggio nell'evoluzione dei sistemi di dati"
image: "images/blog/arrow/front.png"
author: "pietro-portolani"
draft: true
---

L’evoluzione dei sistemi di gestione dei dati è profondamente legata al modo in cui i dati vengono rappresentati e organizzati in memoria e su disco. In questo articolo analizzeremo come il passaggio dal modello **orientato alle righe** al modello **colonnare** abbia cambiato radicalmente le prestazioni nei diversi contesti applicativi, distinguendo tra carichi **transazionali (OLTP)** e **analitici (OLAP)**. A partire da queste basi, introdurremo l’ecosistema della Apache Software Foundation, esplorando il ruolo di tecnologie come **Apache Arrow**, **Arrow Flight**, **Arrow Flight SQL**, **ADBC** e **Apache Parquet**, evidenziando come queste componenti si integrino per costruire pipeline dati moderne, efficienti e interoperabili.

## Il formato "orientato alle righe": origine e dominio applicativo

I primi formati di memorizzazione dei dati nascono con un’impostazione **orientata alle righe**, direttamente ispirata al modello relazionale introdotto da Edgar F. Codd nei primi anni ’70. Nel suo celebre articolo del 1970[^1] Codd propose un cambio di paradigma radicale rispetto ai sistemi gerarchici e a rete allora dominanti: invece di strutture complesse e difficili da interrogare, i dati venivano organizzati in **relazioni** composte da tuple e attributi - rappresentate da tabelle, righe e colonne -, manipolabili tramite operazioni matematiche derivate dall’algebra relazionale. Questo approccio introduceva concetti fondamentali ancora oggi centrali, come l’indipendenza tra modello logico e fisico dei dati, e la possibilità di interrogare i database in modo dichiarativo.

{{< single-image
  src="images/blog/arrow/example-relational.png"
  alt="example-relational"
  class="img-fluid rounded-lg d-block mx-auto w-75"
  width="1600x"
>}}

*Fig. 1 - Esempio di modello relazionale in ambito energetico. Ogni misura rilevata è associata ad un sensore che, a sua volta, è assegnato ad un impianto e all'azienda che lo ha prodotto.*

Nei sistemi pionieristici – come il prototipo IBM System R[^2] – e poi nei database commerciali successivi, questa visione si traduce naturalmente in una memorizzazione fisica basata sulle *righe*: ogni tupla viene trattata come un’unità autonoma e salvata in *blocchi contigui di memoria*. Ad esempio, in una tabella `sensori`, tutte le informazioni relative a un singolo sensore (id, impianto su cui è installato, tipo, modello, unità di misura) vengono archiviate una accanto all’altra: leggere o aggiornare quel sensore significa accedere a un’*unica porzione compatta di memoria*. Una scelta non solo intuitiva, ma anche coerente con il modo in cui le applicazioni interagiscono con i dati, ovvero tramite operazioni su singoli record.

{{< single-image
  src="images/blog/arrow/example-table-row.png"
  alt="example-table-row"
  class="img-fluid rounded-lg d-block mx-auto"
  width="1600x"
>}}

*Fig. 2 - Esempio semplificato di come una tabella viene salvata in memoria in maniera orientata alle righe.*

Questo approccio presenta vantaggi molto concreti. Prima di tutto, l’accesso alle singole righe è estremamente rapido: operazioni tipiche come l’inserimento di un ordine, l’aggiornamento di un saldo o la lettura del profilo di un utente richiedono il recupero di un solo record, senza dover attraversare strutture disperse. Inoltre, la contiguità dei dati migliora la località di cache e riduce il numero di accessi a memoria, rendendo il sistema particolarmente efficiente sotto carichi intensivi e ad alta frequenza.

In questo contesto nasce e si afferma il paradigma **Online Transaction Processing (OLTP)**, ovvero sistemi progettati per gestire un grande numero di transazioni brevi, atomiche e concorrenti. In un sistema OLTP – come quelli utilizzati per e-commerce, sistemi bancari o gestione degli ordini – ogni operazione riguarda tipicamente poche righe alla volta e la priorità non è tanto analizzare grandi volumi di dati, quanto garantire *velocità*, *consistenza* e *affidabilità* per ogni singola transazione. L’organizzazione dei dati basata su righe si rivela particolarmente allineata alle necessità di questi sistemi, perché consente di leggere e scrivere rapidamente record completi, supportando al contempo meccanismi di isolamento e controllo delle operazioni concorrenti (come lock a livello di riga o versionamento), fondamentali per evitare conflitti tra operazioni simultanee.

Questa affidabilità si basa su un insieme di proprietà fondamentali note come **ACID: Atomicity, Consistency, Isolation e Durability**[^3]. L’*atomicità* garantisce che una transazione venga eseguita completamente oppure non venga eseguita affatto: ad esempio, un bonifico bancario deve aggiornare sia il conto sorgente sia quello destinazione, o nessuno dei due. La *consistenza* assicura che ogni transazione porti il database da uno stato valido a un altro stato valido, rispettando vincoli e regole definite come chiavi primarie o vincoli di integrità. L’*isolamento* permette a più transazioni concorrenti di operare senza interferenze, facendo sì che ciascuna si comporti come se fosse eseguita da sola, anche in presenza di accessi simultanei. Infine, la *durabilità* garantisce che, una volta confermata, una transazione non venga persa nemmeno in caso di crash o guasti del sistema.

In conclusione, l’organizzazione dei dati orientati alle righe si è affermata - e continua ad essere insostituibile - in contesti dove serve leggere e scrivere rapidamente record completi ed in cui la velocità, la consistenza e la robustezza delle operazioni sono elementi critici, come sistemi bancari o commerciali.

### I limiti del formato a righe nei carichi analitici

L’evoluzione dei sistemi informativi, soprattutto a partire dagli anni 2000 con la crescita dei data warehouse e delle piattaforme di Business Intelligence, ha fatto emergere in modo sempre più evidente i limiti dei formati orientati alle righe nei contesti analitici. I sistemi usati in questi ambiti, chiamati sistemi di **Online Analytical Processing (OLAP)**, si distinguono nettamente dai tradizionali OLTP: mentre gli OLTP gestiscono transazioni brevi e frequenti su poche righe, gli OLAP sono progettati per analizzare grandi volumi di dati storici attraverso query complesse e aggregazioni. In questo quadro si inserisce il contributo di William H. Inmon, considerato il “padre del data warehousing”, che ha formalizzato l’idea di un sistema orientato all’analisi e al supporto decisionale[^4]. La differenza di carico di lavoro tra i due paradigmi di gestione dei dati è cruciale: gli OLTP accedono tipicamente a intere righe, mentre gli OLAP leggono molte righe ma solo poche colonne per volta. Le scelte progettuali che risultano essere ottimali per i primi, mostrano dei limiti ed inefficienze nei secondi.

Nei carichi di lavoro analitici, il formato orientato alle righe introduce due inefficienze principali: da un lato incrementa i **cache miss**, aumentando la latenza degli accessi alla memoria e determinando un utilizzo inefficiente dei cicli di CPU a causa degli stall (cicli in cui il processore aspetta che un altro blocco di dati venga caricato nella cache); dall’altro induce il trasferimento di dati non necessari, compromettendo l’efficienza nell’uso della **memory bandwidth**. Questo accade perché ogni riga contiene tutte le colonne: anche quando una query richiede solo due o tre attributi, l’intero record deve essere caricato in memoria, causando un overhead significativo.

Per rendere più intuitivi questi problemi, consideriamo un esempio concreto. Immaginiamo una tabella `sensori` con milioni di record che rappresentano misure, con colonne come *id*, *timestamp*, *sensor_id*, *valore*. Supponiamo di voler calcolare la media dei *valori* per tutte le misure di un certo sensore. In un formato orientato alle righe, i dati sono organizzati come una sequenza di record completi: ogni riga contiene tutti i campi. Per eseguire la query, la CPU è costretta a leggere anche *timestamp* e *id*, che però non servono alla computazione. Questo porta a tre effetti distinti ma correlati.

Primo, si verificano *cache miss* più frequenti[^5]: la CPU carica in cache intere righe (tipicamente cache line da 64 byte), ma solo una piccola parte di questi dati è utile. La cache si riempie quindi di informazioni irrilevanti, causando accessi ripetuti alla memoria principale, molto più lenta. Secondo, si ha un uso inefficiente della *memory bandwidth*[^6]: invece di leggere solo le colonne *valore* e *sensor_id*, il sistema trasferisce blocchi contenenti tutte le colonne, usando molta più banda del necessario. Infine, il layout impedisce di sfruttare le istruzioni **SIMD (Single Instruction, Multiple Data)**: i valori della colonna *valore* sono dispersi tra altri campi, rendendo difficile caricare dati contigui in registri vettoriali ed eseguire operazioni in parallelo. 

I moderni processori, infatti sono dotati di speciali registri che permettono di applicare la stessa operazione a più dati contemporaneamente. Questi registri possono essere lunghi da 128 a 512 bit e vengono organizzati in *piste* di varie dimensioni. Ad esempio, un registro da 128 bit diviso in 4 piste può contenere fino a 4 valori da 32 bit ciascuno. Un'istruzione SIMD approfitta di questa caratteristica per applicare contemporaneamente la stessa operazione a tutti i dati contenuti nel registro. Naturalmente, questo può avvenire solo se i dati sono tutti dello stesso tipo e, di conseguenza, è necessario che essi risiedano in celle di memoria contigue - cosa che, come abbiamo già visto, non accade nel formato a righe.

{{< single-image
  src="images/blog/arrow/simd.png"
  alt="simd"
  class="img-fluid rounded-lg d-block mx-auto w-75"
  width="1600x"
>}}

*Fig. 3 - I registri speciali utilizzati da SIMD (sinistra) sono in grado di sommare tutti i numeri in una volta sola mentre i registri normali (destra) devono sommarli uno alla volta. I colori diversi indicano momenti diversi in cui avviene l'operazione.*

Un'ulteriore limitazione del layout per righe riguarda la grande diminuzione dell’efficacia delle tecniche di **compressione**, che sono fondamentali nei sistemi analitici per ridurre sia lo spazio occupato dai dati sia i costi di I/O. Molte tecniche di compressione si basano su proprietà che emergono chiaramente solo a livello di colonna:
- **Omogeneità dei dati** (stesso tipo, distribuzione e dominio), sfruttata da tecniche come *bit packing*, *frame of reference* e *delta encoding*.
- **Contiguità di valori simili**, alla base del *run-length encoding*.
- **Bassa cardinalità per colonna**, che abilita il *dictionary encoding*.
- **Correlazione tra valori vicini**, sfruttata ancora da *delta encoding* e *frame of reference*.

Nel formato a righe, queste proprietà vengono “diluite” dalla presenza di dati eterogenei all’interno della stessa riga, riducendo drasticamente l’efficacia della compressione. Il risultato è un ulteriore aumento dell’overhead sia in termini di spazio che di I/O, aggravando le inefficienze associate all'elaborazione dei dati a livello di processore.

## Il formato colonnare

Il **formato colonnare** è stato sviluppato come risposta diretta alle inefficienze del modello orientato alle righe, affrontandole su due livelli distinti ma complementari: a **basso livello**, migliorando l’uso di CPU, cache e memoria; e ad **alto livello**, ottimizzando le operazioni tipiche dei sistemi analitici. È importante sottolineare che questa scelta non contraddice il modello relazionale: la teoria proposta da Edgar F. Codd non impone infatti alcun layout fisico dei dati, lasciando libertà implementativa.

Nel modello colonnare, i dati vengono organizzati salvando in **aree contigue di memoria** i valori appartenenti alla stessa colonna, anziché quelli della stessa riga. Questo comporta il passaggio da un array di strutture (nel formato orientato alle righe) a una struttura di array (nel formato colonnare), rendendo i dati omogenei fisicamente adiacenti e quindi più efficienti da elaborare.

{{< single-image
  src="images/blog/arrow/example-table-col.png"
  alt="example-table-col"
  class="img-fluid rounded-lg d-block mx-auto"
  width="1600x"
>}}

*Fig. 4 - Esempio semplificato di come una tabella viene salvata in memoria in un formato colonnare.*

Questa scelta risolve innanzitutto i problemi a basso livello tipici del formato a righe: evita il caricamento di dati non necessari, riduce i cache miss e consente un utilizzo più efficiente della memoria e delle istruzioni vettoriali (SIMD), grazie alla disposizione contigua di valori dello stesso tipo.

A livello di database, invece, il formato colonnare abilita una serie di vantaggi strutturali nelle operazioni analitiche:
- Riduzione dell’I/O: le query leggono solo le colonne necessarie invece dell’intera riga, diminuendo drasticamente la quantità di dati trasferiti.
- Compressione più efficace: la similarità tra valori consecutivi nella stessa colonna consente tecniche di compressione molto più efficienti rispetto al formato a righe.
- Aggregazioni veloci: operazioni come `SUM`, `AVG` o `COUNT` possono essere eseguite scansionando direttamente colonne compatte, spesso senza necessità di ricostruire le tuple complete.
- Join più efficienti: grazie a tecniche come la materializzazione ritardata (*late materialization*) e all’uso di strutture intermedie (ad esempio bitmap o vettori di indici), è possibile ridurre il lavoro necessario.

La **late materialization** è una strategia in cui il sistema evita di ricostruire immediatamente le righe complete (tuple) durante l’esecuzione della query. Invece di combinare subito tutte le colonne, il motore lavora inizialmente su rappresentazioni leggere — come insiemi di posizioni o maschere booleane — applicando filtri e join solo sulle colonne strettamente necessarie, materializzando i record completi solo nelle fasi finali. Questa tecnica non è esclusiva dei sistemi colonnari: può essere adottata anche in database orientati alle righe, ad esempio utilizzando indici per identificare le tuple rilevanti e accedendo ai dati completi solo successivamente. Tuttavia, in questi sistemi la sua efficacia è limitata dal layout fisico dei dati, che porta a accessi più sparsi e meno efficienti.

I benefici del formato colonnare, quindi, non derivano solo dal fatto di “leggere meno dati” - che spesso è l'unica cosa messa in risalto -, ma da una riorganizzazione più profonda del layout e del modello di esecuzione[^8], che lo rende particolarmente adatto ai carichi di lavoro analitici su larga scala.

Alla luce di queste caratteristiche, non sorprende che la maggior parte dei sistemi OLAP moderni adotti un’architettura colonnare come scelta di default. Sistemi pionieristici come MonetDB e C-Store hanno dimostrato per primi questi vantaggi in ambito accademico, mentre soluzioni industriali come Amazon Redshift, Google BigQuery e Snowflake li hanno resi lo standard de facto per l’analisi dei dati su larga scala. Anche l’ecosistema Apache Software Foundation ha adottato in modo esteso questo paradigma all’interno dei propri framework open source per la gestione e l’elaborazione dei dati, confermando come il modello colonnare sia oggi alla base delle architetture analitiche moderne.

## L'ecosistema colonnare di Apache Software Foundation

La *Apache Software Foundation* è un’organizzazione no-profit che promuove lo sviluppo di software open source secondo principi ben definiti — spesso riassunti nel motto “The Apache Way”, che privilegia la collaborazione aperta e la qualità del codice costruita dalla comunità[^9]. Nel corso degli anni, ha dato vita a numerosi progetti fondamentali per l’ecosistema dei dati, contribuendo in modo significativo all’evoluzione delle piattaforme di analisi su larga scala. In questo scenario si inserisce **Apache Arrow**, un formato dati colonnare progettato esplicitamente per l’elaborazione *in memoria*.

### Apache Arrow: formato colonnare in-memory

Apache Arrow[^10] è un formato colonnare **in-memory** che, a differenza di altri formati, non nasce semplicemente per ottimizzare lo storage o la scansione dei dati con le tecniche descritte nella sezione precedente, ma anche per affrontare un problema più sottile e spesso trascurato: il **costo della serializzazione e deserializzazione** quando i dati vengono scambiati tra sistemi diversi o tra componenti scritti in linguaggi differenti. Senza un formato standard, ogni database o servizio deve implementare una sua rappresentazione interna dei dati che inserische un costo elevato e non trascurabile legato al trasferimento dei dati. Ogni passaggio richiede tipicamente due operazioni:
- Serializzazione: trasformare una struttura dati in memoria (oggetti, array, tabelle) in una rappresentazione trasferibile, spesso un flusso di byte.
- Deserializzazione: ricostruire la struttura dati originale a partire da quel flusso.

Questo processo introduce diversi costi nascosti ma significativi. Innanzitutto, comporta un **overhead computazionale**: la CPU deve continuamente convertire i dati da un formato all’altro, occupando cicli che potrebbero essere dedicati all’elaborazione vera e propria. Inoltre, genera un **uso inefficiente della memoria**, perché spesso implica la **creazione di copie intermedie** dei dati. A ciò si aggiunge un aumento della latenza complessiva: ogni trasformazione introduce un passaggio aggiuntivo prima che i dati possano essere effettivamente utilizzati. Il problema diventa ancora più evidente nei workload analitici, dove i volumi di dati sono elevati e le pipeline coinvolgono numerosi strumenti eterogenei. In questi casi, una parte non trascurabile del tempo di esecuzione non è spesa per calcolare risultati, ma per **trasformare i dati in formati compatibili** tra sistemi. Un'ulteriore criticità deriva dal fatto che la differenza di rappresentazione dei dati in sistemi differenti implica spesso che gli stessi algoritmi usati su sistemi diversi devono spesso essere riscritti, introducendo un ulteriore costo che grava sugli sviluppatori.

Apache Arrow affronta questo problema alla radice proponendo un approccio diverso: invece di convertire continuamente i dati, definisce un **formato colonnare standardizzato** in memoria, condiviso tra linguaggi e sistemi. Le librerie Arrow permettono a diversi componenti di accedere agli stessi dati direttamente, senza passare per una fase di serializzazione/deserializzazione completa. Questo modello, spesso descritto come *zero-copy*, consente di eliminare gran parte dell’overhead associato allo scambio di dati. In questo modo, Arrow non si limita a migliorare le performance locali, ma interviene su un livello più profondo dell’architettura dei sistemi dati: riduce la “frizione” tra componenti eterogenei, trasformando lo scambio di dati da operazione costosa a operazione quasi trasparente.

{{< single-image
  src="images/blog/arrow/standardization.png"
  alt="standardization"
  class="img-fluid rounded-lg d-block mx-auto"
  width="1600x"
>}}

*Fig. 5 - Usando il formato Arrow i sistemi possono trasferire i dati evitando costose serializzazioni e deserializzazioni con le associate copie, inoltre la standardizzazione facilita il riutilizzo di algoritmi anche in diversi linguaggi.*

Apache Arrow non definisce solo un principio generale, ma anche un insieme preciso di strutture dati in memoria che rendono possibile questo modello zero-copy. Il concetto fondamentale è che i dati non sono rappresentati come una singola tabella monolitica, ma come una sequenza di unità chiamate *RecordBatch*. Un RecordBatch può essere visto come un blocco di dati tabellari:
- Ha uno schema che definice colonne e tipi.
- Contiene un insieme di colonne omogenee.
- Ogni colonna è rappresentata come un array colonnare.
Questa struttura fondamentale implementa il formato colonnare e molteplici RecordBatch con lo stesso schema possono essere concatenati logicamente per rappresentare dataset più grandi, mantenendo però la granularità necessaria per un'efficiente elaborazione e trasferimento dei dati.

{{< single-image
  src="images/blog/arrow/recordbatch.png"
  alt="record-batch"
  class="img-fluid rounded-lg d-block mx-auto w-50"
  width="1600x"
>}}

*Fig. 6 - Rappresentazione di un Arrow RecordBatch con le sue componenti.*

Apache Arrow comprende un grande numero di tipi che vanno da quelli primitivi (lunghezza fissa e variabile) a quelli complessi e nidificati (list, struct, map) fino ai tipi definiti dagli utenti ed estensioni che si impongono come standard all'interno della comunità di utenti come GeoArrow[^11]. Inoltre, il formato integra diverse tecniche tipiche dei formati colonnari come il dictionary encoding o il run encoding e sfrutta le moderne artchitetture CPU usando la parallellizzazione (SIMD) e ottimizzando l'uso della memoria, descritte precedentemente.

### Apache Arrow IPC: scambio dati standardizzato

Apache Arrow **Inter-Process Communication** (IPC) rappresenta il livello protocollare che consente a **Apache Arrow** di trasferire dati tra processi e sistemi mantenendo la stessa rappresentazione in memoria, evitando conversioni costose[^12]. L’unità fondamentale di questo scambio è il *RecordBatch*, ovvero, come già visto, una collezione ordinata di colonne (array) tutte della stessa lunghezza ma con tipi potenzialmente diversi, descritte da uno schema condiviso. Il protocollo IPC organizza la comunicazione come un flusso unidirezionale di messaggi binari — principalmente *Schema*, *RecordBatch* e *DictionaryBatch* — incapsulati in un formato che separa metadati e dati: i primi, serializzati tramite Flatbuffers, descrivono completamente struttura, tipi e posizione dei buffer; i secondi contengono i blocchi di memoria veri e propri, allineati e organizzati in modo da poter essere ricostruiti tramite semplice aritmetica sui puntatori, senza copie. Questo design è ciò che abilita il paradigma *zero-copy*: il ricevente può interpretare i dati leggendo solo i metadati, accedendo direttamente ai buffer sottostanti.

All’interno di IPC, Arrow distingue però due modalità diverse, pensate per esigenze differenti. Il formato **streaming** è concepito per il **trasferimento sequenziale** dei dati: lo stream inizia con uno Schema valido per tutti i batch successivi, seguito da eventuali DictionaryBatch e dai RecordBatch, che possono anche essere interleavati. In questo caso il lettore consuma i messaggi uno dopo l’altro, verificando di volta in volta se lo stream continua e quale sia la dimensione del messaggio successivo; la fine può essere segnalata esplicitamente con un marcatore di end-of-stream oppure semplicemente con la chiusura del canale.

Il formato **file**, invece, è definito come un’estensione del formato stream ma aggiunge una struttura pensata per la persistenza e l’accesso casuale. Il file inizia e termina con la stringa magica `ARROW1` e, oltre alla sequenza di messaggi equivalente allo stream, contiene in coda un *footer* con una copia ridondante dello schema e soprattutto con offset e dimensioni dei blocchi dati. Questo elemento cambia in modo sostanziale l’uso del formato: mentre nello streaming i batch devono essere letti in successione, nel file il lettore può saltare direttamente al blocco desiderato, ottenendo random access ai singoli record batch senza dover scorrere tutto il contenuto precedente. Questo formato è stato introdotto nel caso ci sia bisogno di salvare semilavorati di dati e non specificatamente come salvataggio a lungo termine.

Inoltre, IPC integra meccanismi opzionali come la *compressione dei buffer* (ad esempio LZ4 o ZSTD, applicata in modo indipendente per ciascun buffer), il supporto per *metadati applicativi personalizzati* e la gestione di tipi estesi (*extension types*), che permettono di arricchire i tipi Arrow standard con semantiche specifiche senza perdere interoperabilità. 

### Apache Arrow Flight/Flight SQL: comunicazione ad alte prestazioni

All’interno dell’ecosistema Apache Arrow, *Arrow Flight* rappresenta il **livello di comunicazione** ad alte prestazioni progettato per trasferire dati in formato Arrow tra sistemi distribuiti[^13]. Si tratta di un **framework RPC** costruito sopra gRPC e basato sul formato IPC di Arrow, che consente di scambiare direttamente stream di record batch senza passaggi intermedi di serializzazione/deserializzazione costosi. A differenza delle API tradizionali orientate a oggetti o righe, *Flight opera nativamente su flussi colonnari*, permettendo trasferimenti efficienti e parallelizzabili.

Il modello di interazione è centrato su alcuni concetti chiave. I dataset sono identificati tramite un *FlightDescriptor*, che può rappresentare sia un **percorso** (ad esempio un file o una tabella) sia un **comando arbitrario** (come una query SQL). Il client, tramite chiamate come *GetFlightInfo*, ottiene una descrizione logica del dataset sotto forma di *FlightInfo*, che include metadati (schema, dimensione stimata) e soprattutto una **lista di endpoint**. Ogni endpoint rappresenta una porzione dei dati e contiene le informazioni necessarie (location e ticket) per recuperarli tramite la chiamata *DoGet*. Questo design abilita naturalmente **parallelismo**, **distribuzione** e **load balancing**, poiché il client può scaricare i diversi endpoint in parallelo, anche da server differenti. Per casi più complessi, Flight supporta anche upload (*DoPut*) e comunicazioni bidirezionali (*DoExchange*), rendendo possibile implementare pipeline di elaborazione dati direttamente sul canale RPC.

{{< single-image
  src="images/blog/arrow/arrow-flight.png"
  alt="arrow-flight"
  class="img-fluid rounded-lg d-block mx-auto w-75"
  width="1600x"
>}}

*Fig. 7 - Schema della procedura di scaricamento dati tramite la chiamata DoGet di Arrow Flight.*

Un aspetto rilevante è che Flight separa chiaramente metadati e dati: il primo passo è sempre la scoperta tramite metodi come ListFlights o GetFlightInfo, mentre il trasferimento effettivo avviene successivamente tramite stream di record batch. Questo approccio, insieme all’uso di token opachi (ticket) e URI flessibili (anche HTTP per accesso diretto a object storage), consente di integrare facilmente sistemi distribuiti e storage eterogenei mantenendo alte prestazioni.

Su queste fondamenta si innesta **Arrow Flight SQL**, che estende Flight per supportare *l’interazione con database relazionali*[^14]. Invece di definire un nuovo protocollo, Flight SQL riutilizza gli stessi metodi RPC (come *GetFlightInfo*, *DoGet* e *DoPut*) introducendo una serie di comandi standardizzati codificati in Protobuf. In pratica, una query SQL, una richiesta di metadati o un’operazione di ingestione vengono incapsulate in un FlightDescriptor e gestite come normali flussi Flight.

{{< single-image
  src="images/blog/arrow/arrow-flight-sql.png"
  alt="arrow-flight"
  class="img-fluid rounded-lg d-block mx-auto w-75"
  width="1600x"
>}}

*Fig. 8 - Schema della procedura di una interrogazione ad-hoc tramite Arrow Flight SQL.*

Questo implica un cambiamento importante: anche i risultati delle query SQL e i metadati del database sono restituiti come dati Arrow, mantenendo coerenza con il modello in-memory e riducendo ulteriormente i costi di conversione. Ad esempio, una query viene eseguita tramite GetFlightInfo, che restituisce i ticket per accedere ai risultati; questi vengono poi scaricati con DoGet come stream di record batch. Allo stesso modo, operazioni di scrittura o ingestione massiva utilizzano DoPut, permettendo di caricare direttamente stream Arrow in una tabella. I comandi definiti da Fight SQL comprendono interrogazioni ad hoc, recupero del catalogo (tabelle, schemi, chiavi primarie/esterne), operazioni di aggiornamento e bulk ingestion e gestione dello stato tramite sessioni (variabili di sessione, transazioni).

Un elemento distintivo è che il client non necessita di un driver specifico per ogni database: qualsiasi database che implementa il protocollo Flight SQL può essere interrogato tramite un client generico. Questo introduce un livello di interoperabilità simile a quello di JDBC/ODBC, ma con prestazioni nettamente superiori grazie all’uso del formato Arrow e allo streaming nativo.

Arrow Flight, quindi, fornisce il canale di trasporto ad alte prestazioni per dati colonnari mentre Flight SQL costruisce sopra di esso un protocollo standard per l’accesso ai database, eliminando gran parte dell’overhead tipico delle interfacce SQL tradizionali e rendendo il trasferimento dei dati coerente con il modello *in-memory* di Arrow.

### Apache ADBC: interfaccia unificata per database

A completare lo stack Apache Arrow si colloca  **Arrow Database Connectivity (ADBC)**, un’iniziativa che affronta un problema diverso ma complementare: fornire **API standard lato client** per accedere ai database utilizzando Arrow come formato nativo[^15]. ADBC è prima di tutto una specifica di API *multi-linguaggio* che definisce come un’applicazione può interagire con un database utilizzando dati Arrow in memoria. Queste API vengono poi implementate tramite driver o driver manager, che si occupano di tradurre le chiamate verso i protocolli specifici del database sottostante (ad esempio Flight SQL, PostgreSQL, SQLite, ecc.). A differenza delle interfacce tradizionali, ADBC restituisce i risultati delle query direttamente come stream di dati Arrow, sfruttando i vantaggi già menzionati.

Il progetto Arrow ADBC è stato sviluppato per evitare che lo sviluppatore di un’applicazione, pur volendo utilizzare Arrow come formato in memoria, debba gestire manualmente la conversione dei dati provenienti da sistemi non compatibili nativamente con Arrow. Questo tipo di attività, oltre a richiedere tempo, espone anche al rischio di introdurre errori o implementare soluzioni subottimali. ADBC affronta questo problema fornendo un’unica interfaccia uniforme basata su Arrow, indipendentemente dal fatto che il database sia nativamente compatibile con questo formato oppure no. In questo modo, il codice applicativo non deve più occuparsi di orchestrare conversioni tra rappresentazioni diverse né di utilizzare driver specifici per ogni sistema.

In questo senso, ADBC svolge un ruolo analogo ai modelli JDBC/ODBC, ma è progettato fin dall’inizio per il modello colonnare e per l’integrazione con Arrow: i risultati delle query non vengono esposti riga-per-riga, bensì come stream di dati colonnari Arrow, perfettamente integrabili con librerie di analytics e data processing moderne.

Questo progetto presenta quindi diversi vantaggi:
- Uso di API standard nei linguaggi più diffusi per utilizzo di fonti dati arrow native e non.
- Semplicità di connessione a sistemi non nativamente compatibili con Arrow.
- Possibilità di utilizzare Flight SQL per connettersi a sistemi nativamente compatibili con Arrow.
- Integrazione nativa con strumenti di analytics e data processing basati su Arrow.

ADBC è versionato separatamente rispetto al core Arrow e segue semantic versioning, consentendo evoluzioni indipendenti delle API e delle implementazioni. In conclusione, Arrow ADBC è particolarmente adatto in contesti in cui si vuole sfruttare tutti i vantaggi del formato Arrow ma si è in presenza di fonti di dati che non lo supportano nativamente.

### Apache Parquet: persistenza efficiente su vasta scala

Apache Parquet è un formato colonnare progettato specificamente per la **persistenza di grandi volumi di dati** su disco in sistemi distribuiti, con un forte focus sulla **riduzione dello spazio occupato** e sull’**ottimizzazione delle operazioni di lettura**, nato all’interno dell’ecosistema Hadoop e parte della Apache Software Foundation[^16]. A livello strutturale, i dati sono suddivisi in *“row group”*, ulteriormente organizzati in *“column chunk”* e *“pages”*, una gerarchia che consente sia parallelismo nella lettura sia una gestione efficiente dello storage. Inoltre, Parquet integra tecniche avanzate di compressione e codifica (come i già citati dictionary encoding e run-length encoding), che sfruttano le caratteristiche dei dati per ridurre significativamente lo spazio occupato.

Un altro aspetto rilevante è la presenza di **metadati e statistiche** (come valori min/max per colonna o per blocco) che abilitano il *predicate pushdown*: una tecnica in cui le condizioni di filtro di una query vengono “spinte” il più vicino possibile al livello di storage, evitando di leggere dati non necessari. Ad esempio, se una tabella è suddivisa in più *row group* e una query richiede WHERE anno = 2024, Parquet può usare le statistiche per capire quali blocchi contengono valori diversi (es. solo anni 2020–2022) e saltarli completamente, senza leggerli da disco. Questo riduce le operazioni di lettura e accelera significativamente le query analitiche. Queste proprietà lo rendono uno standard de facto nei sistemi di big data: aziende come Uber lo utilizzano per migliorare l’efficienza dei propri data pipeline, riducendo i costi di storage e calcolo[^17].

Se confrontato con l’Arrow IPC file format (la variante su file del progetto Apache Arrow), emergono differenze fondamentali legate agli obiettivi progettuali. Parquet è esplicitamente progettato per lo storage su disco a lungo termine: ottimizza lo spazio e l’I/O attraverso compressione spinta, organizzazione gerarchica e metadati ricchi, ma richiede una fase di decoding prima che i dati possano essere utilizzati in memoria. L’Arrow IPC file format, invece, non nasce per massimizzare la compressione o ridurre lo spazio, bensì per preservare esattamente la rappresentazione in-memory di Arrow anche quando viene salvata su disco. I dati sono memorizzati come sequenze di record batch già pronti all’uso, con layout identico a quello utilizzato in RAM: questo consente di mappare il file direttamente in memoria (memory-mapping) ed evitare completamente la deserializzazione.

In sintesi, mentre Parquet è ottimizzato per la persistenza efficiente e la riduzione dello spazio occupato, l’Arrow IPC file format è ottimizzato per il riutilizzo immediato dei dati senza trasformazioni: il primo privilegia lo storage e l’accesso selettivo, il secondo la velocità di caricamento e l’interoperabilità. Per questo motivo, nelle architetture moderne *i due formati risultano complementari*: Parquet viene utilizzato come formato di persistenza nei data lake, mentre Arrow IPC file viene impiegato quando è necessario salvare dati già pronti per il calcolo o trasferirli tra processi mantenendo il layout Arrow nativo.

## Conclusione

Il confronto tra formato orientato alle righe e formato colonnare mostra come *non esista una soluzione universalmente migliore*, ma scelte progettuali profondamente legate al tipo di carico di lavoro. I sistemi OLTP continuano a beneficiare del layout a righe, mentre i sistemi OLAP trovano nel modello colonnare un vantaggio decisivo in termini di efficienza computazionale e di I/O. Su queste basi, l’ecosistema Apache costruisce un’architettura coerente che va oltre il semplice formato dati: con Apache Arrow come standard in-memory, Arrow Flight per il trasferimento ad alte prestazioni, ADBC per l’accesso uniforme ai database e Apache Parquet per la persistenza, emerge un **paradigma integrato** in cui il dato mantiene coerenza lungo tutta la pipeline. Questo approccio riduce drasticamente le conversioni, semplifica lo sviluppo e permette di sfruttare appieno le caratteristiche delle architetture hardware moderne, abilitando lo sviluppo di piattaforme analitiche di nuova generazione leggere e ad alte prestazioni.

[^1]: *E. F. Codd*. "A Relational Model of Data for Large Shared Data Banks", 1970
[^2]: https://research.ibm.com/publications/system-r-an-architectural-overview
[^3]: https://www.databricks.com/blog/what-are-acid-transactions
[^4]: *W. H. Inmon*. "Building the Data Warehouse", 2005
[^5]: *P. A. Boncz et al.*. "MonetDB/X100: Hyper-Pipelining Query Execution", 2005
[^6]: *M. Stonebraker et al.*. "C-Store: A Column-oriented DBMS", 2005
[^7]: https://vectrx.substack.com/p/simd-a-practical-guide
[^8]: *D. Abadi et al.*. "Column-Stores vs. Row-Stores: How Different Are They Really?", 2008
[^9]: https://apache.org/foundation/
[^10]: https://arrow.apache.org/overview/
[^11]: https://geoarrow.org/
[^12]: https://arrow.apache.org/docs/format/Columnar.html
[^13]: https://arrow.apache.org/docs/format/Flight.html
[^14]: https://arrow.apache.org/docs/format/FlightSql.html
[^15]: https://arrow.apache.org/docs/format/ADBC.html
[^16]: https://parquet.apache.org/docs/overview/
[^17]: https://www.uber.com/it/en/blog/cost-efficiency-big-data/
