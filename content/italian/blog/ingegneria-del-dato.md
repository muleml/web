---
date: "2025-09-10"
title: "Ingegneria del dato: la spina dorsale invisibile del digitale"
image: "images/blog/ingegneria_dato.png"
author: "pietro-portolani"
draft: false
---

Dietro ogni applicazione digitale ci sono infrastrutture di dati che raccolgono, trasformano e rendono disponibili informazioni. Le architetture moderne, dai data lakehouse alle pipeline ELT, aprono nuove opportunità ma richiedono attenzione a costi e complessità. Proporzionalità, efficienza e sostenibilità diventano principi guida per sistemi davvero utili e durevoli.

## 1. Cos'è l’ingegneria del dato?

Quando si parla di **trasformazione digitale**, l’attenzione tende a concentrarsi su tecnologie “spettacolari”: intelligenza artificiale, algoritmi predittivi, strumenti di automazione. Tuttavia, dietro queste innovazioni si cela una disciplina meno visibile ma assolutamente cruciale: **l’ingegneria del dato** o *data engineering* in inglese.

Un buon paragone è la rete elettrica o internet: nessuno le osserva direttamente, ma ci accorgiamo subito se smettono di funzionare. Allo stesso modo, senza ingegneria del dato non avremmo né analisi avanzate né sistemi di intelligenza artificiale basati sui dati.

Secondo [IBM](https://www.ibm.com/think/topics/data-engineering), l’ingegneria del dato è la pratica di progettare e costruire sistemi per l’**aggregazione**, lo **stoccaggio** e l’**analisi** di grandi quantità di dati. Questo lavoro è alla base sia dei processi decisionali sia dell’addestramento dei modelli di *machine learning*.

Le attività principali includono:

* **Estrazione, trasformazione e caricamento (ETL)** dei dati;
* Creazione e manutenzione delle architetture di stoccaggio;
* Orchestrazione e gestione dei processi di flusso dati;
* Verifica di qualità, sicurezza e tracciabilità;
* Fornitura di servizi di accesso e consumo dei dati.

---

## 2. Dal tradizionale al moderno

Per lungo tempo, il modello di riferimento è stato l’ETL, con architetture **centralizzate** come i **data warehouse**, dove i dati venivano caricati solo dopo essere stati puliti, aggregati, inseriti all'interno di una struttura ben definita e ottimizzati. Questa scelta garantiva potenza e velocità, ma introduceva anche rigidità e inefficienze: duplicazioni di dati, calcoli ripetuti e inutili, overhead di gestione.

Negli ultimi anni, lo scenario è cambiato. Oggi si preferisce il modello **ELT (Extract-Load-Transform)**: i dati vengono estratti e **salvati subito** nel contenitore finale, per poi essere trasformati solo quando servono.

Questa evoluzione è direttamente collegata al passaggio dal **data warehouse** al **data lakehouse**:

* Il **data lake** consente di salvare qualsiasi tipo di dato (CSV, immagini, file di log, ecc.) senza schema predefinito. Offre **flessibilità, costi contenuti e scalabilità**, ma soffre di problemi di consistenza, gestione e performance.
* Il **data lakehouse** combina i vantaggi del data lake con quelli del data warehouse. Sopra lo strato di file introduce un **catalogo di metadati** che applica schemi, **transazioni ACID**, indicizzazione e controllo degli accessi. Inoltre, separa l’archiviazione dallo strato computazionale, permettendo un aumento esponenziale di volume e potenza grazie ad architetture distribuite.

📌 **Nota**: Non mancano però gli **svantaggi**. La maggiore flessibilità dei lakehouse può portare a complessità di gestione più elevate, a costi imprevisti per orchestrare i vari livelli e alla necessità di competenze tecniche avanzate.

---

## 3. Il costo ambientale dei dati

Dietro ogni “cloud”, dove vengono ospitati e gestiti i dati, c’è un’infrastruttura fisica: i **data center**. Queste strutture sono diventate protagoniste anche per il loro **impatto ambientale**.

Il [*Environment, Social and Governance Report 2025*](https://www.infrastructuresummit.io/esg-report) di *Structure Research* evidenzia dati significativi:

* **Consumi energetici**: dallo 0.78% del consumo mondiale nel 2019 a circa l’1.16% nel 2024 (310.6 TWh).
* **Emissioni di CO₂**: da 42.3 milioni di tonnellate nel 2019 a 76.2 milioni nel 2024.
* **Efficienza**: migliorata, con un calo da 366.9 a 312.7 milioni di tonnellate di CO₂ equivalente per GWh consumato.
* **Consumo idrico**: passato da 138.7 milioni di m³ nel 2019 a 219.6 milioni nel 2024, usati per il raffreddamento delle rack.

Questa crescita dei consumi e delle emissioni ha stimolato la ricerca di contromisure: soluzioni emergenti come i sistemi di raffreddamento a circuito chiuso o il recupero del calore dei data center per il riscaldamento urbano stanno diventando parte integrante delle strategie di sostenibilità del settore.

➡️ In sintesi, i dati mostrano una crescita costante di consumi ed emissioni, mitigata solo parzialmente dai progressi in efficienza e sostenibilità dei data center.

---

## 4. Big Data… spesso non così “big”

Un altro mito da ridimensionare riguarda i **Big Data**.

Secondo un’[analisi](https://www.fivetran.com/blog/how-do-people-use-snowflake-and-redshift) dei dati pubblicati da **Snowflake** e **Redshift**:

* Tra le query che coinvolgono almeno 1MB di dati, la **mediana** è di 100MB.
* Solo il **99.9° percentile** raggiunge 300GB.
* La maggior parte delle query riguarda **inserimento o trasformazione** dei dati, cioè attività tipiche di ETL.

👉 Questo significa che i “Big Data” riguardano una **minoranza di utenti**. Nella pratica quotidiana, la maggior parte delle organizzazioni lavora con volumi molto più contenuti. Non sorprende quindi che si parli sempre più di **Small Data**: dati più piccoli, ma più mirati e significativi.

---

## 5. Dove dovrebbe guardare l’ingegneria del dato moderna

Dall’analisi fatta emergono alcuni principi guida per il futuro dell’ingegneria del dato:

* **Proporzionalità**: i sistemi devono essere calibrati sulla reale dimensione del problema. Costruire architetture gigantesche per dati relativamente modesti significa sprecare risorse e denaro.
* **Efficienza ambientale**: progettare pipeline e algoritmi che ottimizzino l’uso di energia e memoria (es. query ottimizzate, architetture serverless).
* **Agilità**: sistemi in grado di ridimensionarsi dinamicamente in base al volume di dati da gestire.
* **Approccio artigianale**: soluzioni **su misura**, pensate ad hoc per il problema attuale, ma con uno sguardo al futuro, così da non subire i cambiamenti ma anticiparli.

In definitiva, l’ingegneria del dato non deve più essere vista solo come un insieme di strumenti tecnici, ma come una disciplina che unisce **precisione ingegneristica, sostenibilità ambientale ed efficienza economica**.

---

## 📌 Cosa chiedere quando si sviluppano soluzioni di ingegneria del dato:

🔍 Abbiamo davvero bisogno di un’infrastruttura “Big Data” o i nostri dati sono in realtà “Small”?

⚖️ L’architettura scelta è proporzionata al problema o rischiamo sovradimensionamento e costi superflui?

🌱 Sono state valutate le implicazioni ambientali (consumi energetici, uso di acqua, emissioni)?

⚡ Le pipeline sono ottimizzate per ridurre sprechi di calcolo e memoria?

🛠️ La soluzione è abbastanza agile e adattabile a futuri cambiamenti di scala?

💰 Abbiamo stimato i costi di overhead (es. servizi accesi h24 non necessari)?

> 👉 **Rispondere a queste domande significa non solo avere sistemi più sostenibili e performanti, ma anche contenere i costi e ridurre rischi strategici.**
