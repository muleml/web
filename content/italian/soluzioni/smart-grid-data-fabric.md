---
title: "Smart Grid Data Fabric"
description: "Infrastruttura dati aperta per i sistemi energetici: ingestion, storage analitico, trasformazione, query, analytics e data catalog in un'unica architettura."
draft: false
layout: "smart-grid-data-fabric"

# banner (Hero)
banner:
  variant: "home"
  subtitle: "Smart Grid Data Fabric"
  title: "Il data layer per analytics, AI ed energia"
  description: "**Le soluzioni data-driven funzionano solo se i dati sono affidabili, accessibili e utilizzabili.** <br><br>Smart Grid Data Fabric collega dispositivi, storage, trasformazioni e applicazioni in un'unica architettura aperta, progettata per i sistemi energetici."
  image: "images/solutions/smart-grid-data-fabric-hero.png"
  button:
    enable: false
    label: "Parliamo del tuo progetto"
    icon: "fas fa-arrow-right"
    link: "contact/"

# approach_box — processo "Dal dato grezzo all'applicazione" (5 step + flusso animato)
approach_box:
  style: "data_flow"
  subtitle: "Percorso del dato"
  title: "Dal dato grezzo all'applicazione"
  description: "Un unico flusso collega le sorgenti sul campo agli strumenti che utilizzano i dati."
  approach_box_item:
  - number: "01"
    title: "Ingestion & Streaming"
    icon: "fas fa-cloud-arrow-down"
    content: "Acquisisce dati batch e streaming provenienti da BESS, sensori, sistemi energetici e altre sorgenti, rendendoli disponibili in modo coerente all'interno della piattaforma."

  - number: "02"
    title: "Analytical Lakehouse Storage"
    icon: "fas fa-database"
    content: "Conserva dati storici e operativi in formati analitici aperti, creando una base comune per elaborazioni, query e applicazioni."

  - number: "03"
    title: "Data <br>Transformation"
    icon: "fas fa-gears"
    content: "Trasforma i dati grezzi in dataset coerenti, validati e pronti per essere utilizzati dalle applicazioni a valle."

  - number: "04"
    title: "Analytical Query Engine"
    icon: "fas fa-magnifying-glass-chart"
    content: "Permette di interrogare e analizzare grandi quantità di dati direttamente sul layer analitico, riducendo movimenti e duplicazioni non necessarie."

  - number: "05"
    title: "Analytics & Exploration"
    icon: "fas fa-chart-pie"
    content: "Rende i dati disponibili a dashboard, applicazioni analitiche e modelli di machine learning e AI."

# skills_box — "Guardalo in azione" (video)
skills_box:
  enable: true
  subtitle: "Dimostrazione"
  title: "Guardalo in azione"
  description: "Dal dato acquisito sul campo alla query analitica: Smart Grid Data Fabric rende accessibile in un unico ambiente l'intero percorso del dato."
  video: "videos/sgdf-demo.mp4"
  image: "images/video-thumb.jpg"

# benefit_info — "I dati sono un asset" (6 blocchi)
benefit_info:
  enable: true
  inline_title: true
  subtitle: "Sovranità dei dati"
  title: "I dati sono un asset. Il loro valore cresce quando restano sotto il tuo controllo."
  description: "Chi gestisce sistemi energetici produce ogni giorno un patrimonio di dati. Il problema non è generarli, ma riuscire a conservarli, comprenderli e riutilizzarli senza perdere controllo e indipendenza tecnologica. Smart Grid Data Fabric nasce per dare al proprietario dei dati gli strumenti per valorizzarli mantenendo sovranità, portabilità e trasparenza."

  block:
  - icon: "fas fa-code"
    title: "Open source"
    content: "**Nessun costo di licenza**<br>Il core della piattaforma utilizza tecnologie open source, riducendo i costi ricorrenti del data layer e lasciando libertà di evoluzione tecnologica."

  - icon: "fas fa-lock-open"
    title: "Nessun lock-in"
    content: "**Standard e formati aperti**<br>I dati rimangono accessibili attraverso tecnologie e formati aperti, evitando che il patrimonio informativo dipenda da un singolo fornitore."

  - icon: "fas fa-layer-group"
    title: "End-to-end"
    content: "**Tutto ciò che serve, senza complessità inutile**<br>Ingestion, storage, trasformazione, query e analytics convivono in un'architettura compatta, evitando di sovrapporre servizi non necessari."

  - icon: "fas fa-cloud"
    title: "Portabile"
    content: "**Cloud, on-premise o ibrido**<br>La containerizzazione permette di eseguire la stessa architettura in cloud, sull'infrastruttura del cliente o in configurazioni ibride."

  - icon: "fas fa-clipboard-check"
    title: "Auditabile"
    content: "**Tracciabilità, immutabilità e trasparenza**<br>Dati e processi possono essere gestiti in modo tracciabile e verificabile."

  - icon: "fas fa-diagram-project"
    title: "Multi-nodo"
    content: "**Scalabilità e sovranità dei dati**<br>Più nodi possono cooperare per distribuire i carichi oppure mantenere i dati vicino al luogo in cui vengono prodotti."


# scalability — "Scalabilità orizzontale e data federation" (2 blocchi con figure)
scalability:
  enable: true
  subtitle: "Architettura"
  title: "Scalabilità orizzontale e data federation"
  description: "Un'architettura multi-nodo non serve soltanto a gestire più dati: permette di scegliere dove eseguire il calcolo e dove mantenere il dato."

  block:
  - title: "Scalabilità orizzontale"
    bold: "Crescere aggiungendo risorse, non sostituendo l'architettura"
    content: "Quando volumi e carichi aumentano, nuovi nodi possono essere aggiunti per distribuire le elaborazioni e aumentare progressivamente la capacità del sistema."
    image: "images/solutions/distribuited-query.png"

  - title: "Data federation"
    bold: "I dati possono restare dove vengono prodotti"
    content: "Siti o organizzazioni differenti possono mantenere localmente i propri dati e renderli disponibili in modo controllato, costruendo una vista federata senza imporre la centralizzazione."
    image: "images/solutions/federated-data.png"

# prestazioni — "Prestazioni elevate con risorse contenute"
prestazioni:
  enable: true
  subtitle: "Prestazioni"
  title: "Prestazioni elevate con risorse contenute"
  description: "Un'infrastruttura dati efficiente non dovrebbe richiedere hardware sovradimensionato per svolgere attività analitiche ordinarie. Smart Grid Data Fabric utilizza tecnologie analitiche moderne e formati colonnari per sfruttare in modo efficiente CPU, memoria e storage, rendendo possibile eseguire workload significativi anche su hardware compatto.</br></br>
  Sotto il cofano, Smart Grid Data Fabric utilizza **DuckDB**, motore OLAP open source progettato per analytics ad alte prestazioni direttamente sui dati, con continuità e indipendenza del progetto tutelate dalla [DuckDB Foundation](https://duckdb.org/foundation/)."
  image: "images/solutions/minipc.png"

  hardware:
  - label: "CPU"
    value: "Ryzen 7 PRO 6850U"
  - label: "CPU type"  
    value: "8 core / 16 thread"
  - label: "RAM"
    value: "32 GB DDR5"
  - label: "Storage"
    value: "1 TB NVMe"
  - label: "Dimensions"
    value: "132×125×58 mm"

  benchmark:
  - label: "Scale factor"
    value: "SF100"
  - label: "Dataset"
    value: "~26 GB - 22 queries"
  - label: "Tempo complessivo"
    value: "~200 s"
  - label: "Latenza mediana"
    value: "~7 s"
  - label: "Limite memoria"
    value: "8 GB"

# cta — CTA finale
cta:
  enable: true
  title: "Costruiamo una base dati che rimanga tua"
  description: "Dall'acquisizione sul campo alle applicazioni analitiche, Smart Grid Data Fabric permette di costruire un'infrastruttura aperta intorno ai dati del tuo sistema energetico."
  button_label: "Parliamo della tua infrastruttura dati"
  button_link: "contact/"
  image: "images/cta.png"

# career
career:
  enable: false
---

