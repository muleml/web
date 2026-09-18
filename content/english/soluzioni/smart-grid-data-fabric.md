---
title: "Smart Grid Data Fabric"
description: "Open data infrastructure for energy systems: ingestion, analytical storage, transformation, queries, analytics and a data catalog in a single architecture."
draft: false
layout: "smart-grid-data-fabric"

# banner (Hero)
banner:
  variant: "home"
  subtitle: "Smart Grid Data Fabric"
  title: "The data layer for analytics, AI and energy"
  description: "**Data-driven solutions only work when data is reliable, accessible and usable.** <br><br>Smart Grid Data Fabric connects devices, storage, transformations and applications in a single open architecture designed for energy systems."
  image: "images/solutions/smart-grid-data-fabric-hero.png"
  button:
    enable: false
    label: "Let's discuss your project"
    icon: "fas fa-arrow-right"
    link: "contact/"

# approach_box — processo "Dal dato grezzo all'applicazione" (5 step + flusso animato)
approach_box:
  style: "data_flow"
  subtitle: "Data journey"
  title: "From raw data to applications"
  description: "A single flow connects field sources to the tools that use the data."
  approach_box_item:
  - number: "01"
    title: "Ingestion & Streaming"
    icon: "fas fa-cloud-arrow-down"
    content: "Collects batch and streaming data from BESS, sensors, energy systems and other sources, making it consistently available within the platform."

  - number: "02"
    title: "Analytical Lakehouse Storage"
    icon: "fas fa-database"
    content: "Stores historical and operating data in open analytical formats, creating a shared foundation for processing, queries and applications."

  - number: "03"
    title: "Data <br>Transformation"
    icon: "fas fa-gears"
    content: "Transforms raw data into consistent, validated datasets ready for use by downstream applications."

  - number: "04"
    title: "Analytical Query Engine"
    icon: "fas fa-magnifying-glass-chart"
    content: "Enables querying and analysis of large volumes of data directly on the analytical layer, reducing unnecessary data movement and duplication."

  - number: "05"
    title: "Analytics & Exploration"
    icon: "fas fa-chart-pie"
    content: "Makes data available to dashboards, analytical applications, and machine learning and AI models."

# skills_box — "Guardalo in azione" (video)
skills_box:
  enable: true
  subtitle: "Demonstration"
  title: "See it in action"
  description: "From data collected in the field to analytical queries: Smart Grid Data Fabric makes the entire data journey accessible in a single environment."
  video: "videos/sgdf-demo.mp4"
  image: "images/video-thumb.jpg"

# benefit_info — "I dati sono un asset" (6 blocchi)
benefit_info:
  enable: true
  inline_title: true
  subtitle: "Data sovereignty"
  title: "Data is an asset. Its value grows when it stays under your control."
  description: "Energy system operators generate a wealth of data every day. The challenge is not generating it, but retaining, understanding and reusing it without losing control or technological independence. Smart Grid Data Fabric gives data owners the tools to realize its value while maintaining sovereignty, portability and transparency."

  block:
  - icon: "fas fa-code"
    title: "Open source"
    content: "**No licensing costs**<br>The platform core uses open source technologies, reducing recurring data layer costs and preserving the freedom to evolve the technology."

  - icon: "fas fa-lock-open"
    title: "No lock-in"
    content: "**Open standards and formats**<br>Data remains accessible through open technologies and formats, avoiding dependence on a single vendor for your information assets."

  - icon: "fas fa-layer-group"
    title: "End-to-end"
    content: "**Everything needed, without unnecessary complexity**<br>Ingestion, storage, transformation, queries and analytics coexist in a compact architecture, avoiding layers of unnecessary services."

  - icon: "fas fa-cloud"
    title: "Portable"
    content: "**Cloud, on-premises or hybrid**<br>Containerization allows the same architecture to run in the cloud, on the client's infrastructure or in hybrid configurations."

  - icon: "fas fa-clipboard-check"
    title: "Auditable"
    content: "**Traceability, immutability and transparency**<br>Data and processes can be managed in a traceable, verifiable way."

  - icon: "fas fa-diagram-project"
    title: "Multi-node"
    content: "**Scalability and data sovereignty**<br>Multiple nodes can work together to distribute workloads or keep data close to where it is generated."


# scalability — "Scalabilità orizzontale e data federation" (2 blocchi con figure)
scalability:
  enable: true
  subtitle: "Architecture"
  title: "Horizontal scaling and data federation"
  description: "A multi-node architecture does more than handle more data: it lets you choose where to run computations and where to keep data."

  block:
  - title: "Horizontal scaling"
    bold: "Grow by adding resources, without replacing the architecture"
    content: "As data volumes and workloads increase, new nodes can be added to distribute processing and progressively increase system capacity."
    image: "images/solutions/distribuited-query.png"

  - title: "Data federation"
    bold: "Data can stay where it is generated"
    content: "Different sites or organizations can keep their data locally and make it available in a controlled way, building a federated view without requiring centralization."
    image: "images/solutions/federated-data.png"

# prestazioni — "Prestazioni elevate con risorse contenute"
prestazioni:
  enable: true
  subtitle: "Performance"
  title: "High performance with modest resources"
  description: "Efficient data infrastructure should not require oversized hardware for routine analytical tasks. Smart Grid Data Fabric uses modern analytical technologies and columnar formats to make efficient use of CPU, memory and storage, enabling substantial workloads even on compact hardware.</br></br>
    Under the hood, Smart Grid Data Fabric uses **DuckDB**, an open source OLAP engine designed for high-performance analytics directly on data, with the project's continuity and independence safeguarded by the [DuckDB Foundation](https://duckdb.org/foundation/)."
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
  - label: "Total time"
    value: "~200 s"
  - label: "Median latency"
    value: "~7 s"
  - label: "Memory limit"
    value: "8 GB"

# cta — CTA finale
cta:
  enable: true
  title: "Let's build a data foundation that stays yours"
  description: "From field data collection to analytical applications, Smart Grid Data Fabric enables open infrastructure built around your energy system's data."
  button_label: "Let's discuss your data infrastructure"
  button_link: "contact/"
  image: "images/cta.png"

# career
career:
  enable: false
---
