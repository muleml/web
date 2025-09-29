---
date: "2025-09-10"
title: "Data engineering: the invisible backbone of digital"
image: "images/blog/ingegneria_dato.png"
author: "pietro-portolani"
draft: false
---

Behind every digital application lie data infrastructures that collect, transform, and make information available. Modern architectures, from data lakehouses to ELT pipelines, open new opportunities but require attention to costs and complexity. Proportionality, efficiency, and sustainability become guiding principles for systems that are truly useful and long-lasting.

## 1. What is data engineering?

When we talk about **digital transformation**, attention tends to focus on “spectacular” technologies: artificial intelligence, predictive algorithms, automation tools. However, behind these innovations lies a less visible but absolutely crucial discipline: **data engineering**.

A good analogy is the power grid or the internet: no one looks at them directly, but we immediately notice when they stop working. In the same way, without data engineering we would not have advanced analytics or data-driven artificial intelligence systems.

According to [IBM](https://www.ibm.com/think/topics/data-engineering), data engineering is the practice of designing and building systems for the **aggregation**, **storage**, and **analysis** of large volumes of data. This work underpins both decision-making processes and the training of *machine learning* models.

The main activities include:

* **Extract, Transform, Load (ETL)** of data;
* Creation and maintenance of storage architectures;
* Orchestration and management of data flow processes;
* Verification of quality, security, and traceability;
* Provision of data access and consumption services.

---

## 2. From traditional to modern

For a long time, the reference model was ETL, with **centralized** architectures such as **data warehouses**, where data was loaded only after being cleaned, aggregated, structured, and optimized. This choice ensured power and speed, but also introduced rigidity and inefficiencies: data duplication, repeated and unnecessary calculations, management overhead.

In recent years, the scenario has changed. Today, the preferred model is **ELT (Extract-Load-Transform)**: data is extracted and **immediately saved** in the final container, then transformed only when needed.

This evolution is directly linked to the transition from **data warehouse** to **data lakehouse**:

* The **data lake** allows saving any type of data (CSV, images, log files, etc.) without a predefined schema. It offers **flexibility, low cost, and scalability**, but suffers from issues of consistency, management, and performance.
* The **data lakehouse** combines the advantages of the data lake with those of the data warehouse. On top of the file layer, it introduces a **metadata catalog** that applies schemas, **ACID transactions**, indexing, and access control. It also separates storage from the computational layer, enabling exponential increases in volume and power through distributed architectures.

📌 **Note**: However, there are **disadvantages**. The greater flexibility of lakehouses can lead to higher management complexity, unexpected costs for orchestrating the various layers, and the need for advanced technical skills.

---

## 3. The environmental cost of data

Behind every “cloud,” where data is hosted and managed, there is a physical infrastructure: **data centers**. These facilities have also become a focus of attention due to their **environmental impact**.

The [*Environment, Social and Governance Report 2025*](https://www.infrastructuresummit.io/esg-report) by *Structure Research* highlights significant data:

* **Energy consumption**: from 0.78% of global consumption in 2019 to about 1.16% in 2024 (310.6 TWh).
* **CO₂ emissions**: from 42.3 million tons in 2019 to 76.2 million in 2024.
* **Efficiency**: improved, with a decrease from 366.9 to 312.7 million tons of CO₂ equivalent per GWh consumed.
* **Water consumption**: from 138.7 million m³ in 2019 to 210.6 million in 2024, used for rack cooling.

This increase in consumption and emissions has driven the search for countermeasures: emerging solutions such as closed-loop cooling systems or recovering data center heat for urban heating are becoming integral parts of the sector’s sustainability strategies.

➡️ In summary, the data show steady growth in consumption and emissions, only partially mitigated by advances in efficiency and sustainability of data centers.

---

## 4. Big Data… often not so “big”

Another myth to be scaled down concerns **Big Data**.

According to an [analysis](https://www.fivetran.com/blog/how-do-people-use-snowflake-and-redshift) of data published by **Snowflake** and **Redshift**:

* Among queries involving at least 1MB of data, the **median** is 100MB.
* Only the **99.9th percentile** reaches 300GB.
* Most queries involve **insertion or transformation** of data, i.e., typical ETL activities.

👉 This means that “Big Data” concerns a **minority of users**. In everyday practice, most organizations work with much smaller volumes. It is therefore no surprise that there is increasing talk of **Small Data**: smaller, but more targeted and meaningful.

---

## 5. Where modern data engineering should look

From the analysis, some guiding principles emerge for the future of data engineering:

* **Proportionality**: systems must be calibrated to the actual size of the problem. Building massive architectures for relatively modest data means wasting resources and money.
* **Environmental efficiency**: designing pipelines and algorithms that optimize the use of energy and memory (e.g., optimized queries, serverless architectures).
* **Agility**: systems capable of dynamically scaling according to the volume of data to be managed.
* **Craftsmanship approach**: **tailor-made** solutions, designed ad hoc for the current problem but with an eye to the future, to anticipate changes rather than suffer them.

Ultimately, data engineering should no longer be seen only as a set of technical tools, but as a discipline that combines **engineering precision, environmental sustainability, and economic efficiency**.

---

## 📌 What to ask when developing data engineering solutions:

🔍 Do we really need a “Big Data” infrastructure, or are our datasets actually “Small”?  

⚖️ Is the chosen architecture proportionate to the problem, or are we at risk of oversizing and unnecessary costs?  

🌱 Have the environmental implications (energy consumption, water use, emissions) been considered?  

⚡ Are the pipelines optimized to reduce computational and memory waste?  

🛠️ Is the solution agile enough to adapt to future changes in scale?  

💰 Have we estimated the overhead costs (e.g., services running 24/7 unnecessarily)?  

> 👉 **Answering these questions means not only having more sustainable and higher-performing systems, but also containing costs and reducing strategic risks.**
