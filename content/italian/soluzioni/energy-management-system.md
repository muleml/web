---
title: "Energy Management System"
description: "Energy Management System per BESS: previsioni, Battery Intelligence, vincoli fisici e segnali di mercato per definire strategie di dispatch ottimizzate e consapevoli del degrado."
draft: false
layout: "energy-management-system"

# banner (Hero)
banner:
  variant: "home"
  subtitle: "Energy Management System"
  title: "Ottimizzare il BESS tra vincoli fisici e opportunità di mercato"
  description: "**Previsioni, Battery Intelligence e segnali economici per trasformare il controllo dell'asset in una decisione ottimizzata.** <br><br>L'Energy Management System di muleML combina dati operativi, previsioni e vincoli tecnici per definire come utilizzare il BESS nelle diverse condizioni di mercato e di esercizio. L'obiettivo non è semplicemente controllare l'asset, ma orchestrarlo in modo consapevole del degrado, del rischio e del valore economico."
  # Immagine hero dedicata all'EMS
  image: "images/solutions/energy-management-system-hero.png"
  button:
    enable: false
    label: "Parliamo del tuo sistema energetico"
    icon: "fas fa-arrow-right"
    link: "contact/"

# 1. Dal dato alla decisione operativa (riusa benefit_info, 4 blocchi)
benefit_info:
  enable: true
  inline_title: true
  subtitle: "Dal dato alla decisione"
  title: "Dal dato alla decisione operativa"
  description: "Un EMS efficace deve decidere cosa fare, quando farlo e con quale intensità, tenendo insieme comportamento dell'asset, previsioni e condizioni economiche."

  block:
  - icon: "fas fa-clock"
    title: "Previsioni <br>multi-orizzonte"
    content: "**Anticipare ciò che accadrà**<br>Previsioni di prezzi, carichi e produzione rinnovabile su differenti orizzonti temporali per supportare le decisioni operative."

  - icon: "fas fa-heart-pulse"
    title: "Dispatch consapevole del degrado"
    content: "**Ottimizzare senza ignorare il costo della batteria**<br>La strategia di utilizzo considera l'effetto delle decisioni sul degrado e sulla vita dell'asset, non soltanto il beneficio economico immediato."

  - icon: "fas fa-scale-balanced"
    title: "Co-ottimizzazione"
    content: "**Vincoli fisici e mercato nello stesso problema**<br>Potenza, energia, SoC e altri limiti tecnici vengono valutati insieme a prezzi, servizi e opportunità economiche."

  - icon: "fas fa-shield-halved"
    title: "Rendimento corretto <br>per il rischio"
    content: "**Non soltanto il massimo ricavo teorico**<br>Le strategie possono essere valutate considerando rendimento atteso, incertezza e rischio operativo."

# 2. Guardalo in azione (riusa skills_box, video provvisorio già usato nelle altre pagine soluzione)
skills_box:
  enable: true
  subtitle: "Dimostrazione"
  title: "Guardalo in azione"
  description: "Dalle previsioni al programma di dispatch: esplora come l'EMS combina dati, vincoli e segnali economici per costruire una strategia operativa."
  video: "videos/simulazione-demo.mp4"
  image: "images/video-thumb.jpg"

# 3. Dal controllo dell'asset all'orchestrazione energetica (processo visuale HTML + JS)
orchestration:
  enable: true
  subtitle: "Orchestrazione energetica"
  title: "Dal controllo dell'asset all'orchestrazione energetica"
  description: "Il BESS non opera in isolamento. Il suo valore dipende dalla capacità di coordinare asset fisici, previsioni e segnali provenienti dal sistema energetico."

  # box di sinistra: i segnali esterni che alimentano l'EMS
  input:
    title: "Mercati e segnali"
    items:
    - icon: "fas fa-chart-column"
      label: "MGP / MI"
    - icon: "fas fa-bolt"
      label: "MSD"
    - icon: "fas fa-gauge-high"
      label: "Capacità e flessibilità"
    - icon: "fas fa-file-contract"
      label: "Tariffe e <br>contratti"

  # blocco centrale: l'EMS come processo a tre moduli consecutivi
  system:
    label: "Energy Management System"
    module:
    - icon: "fas fa-chart-line"
      title: "Forecasting"
      meta: "prezzi · carichi · rinnovabili"

    - icon: "fas fa-gears"
      title: "Optimization Engine"
      meta: "vincoli · degrado · rischio · valore"
      highlight: true

    - icon: "fas fa-sliders"
      title: "Dispatch &amp; Control"
      meta: "setpoint · comandi · controllo"

    feedback: "Dati in tempo reale e stato asset"

  # box di destra: gli asset comandati, origine del flusso di ritorno
  output:
    title: "Asset energetici"
    items:
    - icon: "fas fa-battery-full"
      label: "BESS"
    - icon: "fas fa-solar-panel"
      label: "Rinnovabili"
    - icon: "fas fa-tower-broadcast"
      label: "Rete"
    - icon: "fas fa-plug"
      label: "Carichi"

  

# 4. Un'unica logica, scenari diversi (4 blocchi)
scenarios:
  enable: true
  subtitle: "Scenari"
  title: "Un'unica logica, scenari diversi"
  description: "La stessa architettura di previsione e ottimizzazione può essere adattata a sistemi energetici con obiettivi, vincoli e modelli di ricavo differenti."

  block:
  - icon: "fas fa-server"
    title: "Data center AI"
    content: "Coordinamento di BESS, rete, generazione e carichi ad alta intensità energetica."

  - icon: "fas fa-battery-full"
    title: "Stand-alone e co-locati"
    content: "Ottimizzazione di sistemi di accumulo indipendenti o integrati con fonti rinnovabili."

  - icon: "fas fa-store"
    title: "Retailer e aggregatori"
    content: "Gestione di portafogli e flessibilità in relazione a mercati, prezzi e contratti."

  - icon: "fas fa-sitemap"
    title: "Microgrid e multi-sito"
    content: "Coordinamento di asset distribuiti, carichi e generazione su uno o più siti."

# 5. Ottimizzare conoscendo lo stato della batteria (flusso Battery Intelligence -> EMS)
battery_value:
  enable: true
  subtitle: "Battery Intelligence + EMS"
  title: "Ottimizzare conoscendo lo stato della batteria"
  description: "L'Energy Management System integra capacità di Battery Intelligence per considerare stato, prestazioni e degrado del BESS nelle decisioni operative. In questo modo la strategia non si limita a chiedere quanta energia può essere caricata o scaricata, ma tiene conto di come l'utilizzo dell'asset può influenzarne prestazioni e vita nel tempo."

  item:
  - icon: "fas fa-heart-pulse"
    title: "Battery Intelligence"
    meta: "stato · prestazioni · degrado"

  - icon: "fas fa-gears"
    title: "EMS Optimization"

  - icon: "fas fa-shield-halved"
    title: "Valore operativo<br>+<br>Tutela dell'asset"


# CTA finale (unica CTA della pagina)
cta:
  enable: true
  title: "Trasforma ogni decisione operativa in una decisione ottimizzata"
  description: "Costruiamo strategie di controllo che tengono insieme asset, previsioni, mercato e degrado della batteria."
  button_label: "Parliamo del tuo sistema energetico"
  button_link: "contact/"
  image: "images/cta.png"

# career
career:
  enable: false
---
