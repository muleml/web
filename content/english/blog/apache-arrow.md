---
date: "2026-04-21"
title: "From Rows to Columns: A Journey Through the Evolution of Data Systems"
image: "images/blog/arrow/front.png"
author: "pietro-portolani"
draft: false
_build:
  render: always
  list: never
---

The evolution of data management systems is deeply tied to the way data is represented and organized in memory and on disk. In this article, we will examine how the shift from the **row-oriented** model to the **columnar** model has radically changed performance across different application contexts, distinguishing between **transactional (OLTP)** and **analytical (OLAP)** workloads. Building on these foundations, we will introduce the Apache Software Foundation ecosystem, exploring the role of technologies such as **Apache Arrow**, **Arrow Flight**, **Arrow Flight SQL**, **ADBC**, and **Apache Parquet**, highlighting how these components integrate to build modern, efficient, and interoperable data pipelines.

## The "row-oriented" format: origins and application domain

The earliest data storage formats emerged with a **row-oriented** approach, directly inspired by the relational model introduced by Edgar F. Codd in the early 1970s. In his landmark 1970 paper[^1], Codd proposed a radical paradigm shift from the hierarchical and network systems that were dominant at the time: instead of complex and hard-to-query structures, data would be organized into **relations** made up of tuples and attributes - represented as tables, rows, and columns - and manipulated through mathematical operations derived from relational algebra. This approach introduced fundamental concepts that remain central today, such as the independence between the logical and physical data model, and the possibility of querying databases declaratively.

{{< single-image
src="images/blog/arrow/example-relational.png"
alt="example-relational"
class="img-fluid rounded-lg d-block mx-auto w-75"
width="1600x"
>}}

*Fig. 1 - Example of a relational model in the energy domain. Each recorded measurement is associated with a sensor, which in turn is assigned to a plant and to the company that produced it.*

In pioneering systems - such as the IBM System R prototype[^2] - and later in commercial databases, this vision naturally translated into physical storage based on *rows*: each tuple was treated as a self-contained unit and stored in *contiguous blocks of memory*. For example, in a `sensors` table, all the information related to a single sensor (id, plant where it is installed, type, model, unit of measure) is stored next to one another: reading or updating that sensor means accessing a *single compact memory region*. This is not only an intuitive choice, but also one that aligns with the way applications interact with data, namely through operations on individual records.

{{< single-image
src="images/blog/arrow/example-table-row.png"
alt="example-table-row"
class="img-fluid rounded-lg d-block mx-auto"
width="1600x"
>}}

*Fig. 2 - Simplified example of how a table is stored in memory in a row-oriented format.*

This approach offers very concrete advantages. First of all, access to individual rows is extremely fast: typical operations such as inserting an order, updating a balance, or reading a user profile require retrieving only a single record, without traversing scattered structures. In addition, the contiguity of data improves cache locality and reduces the number of memory accesses, making the system particularly efficient under intensive, high-frequency workloads.

It is in this context that the **Online Transaction Processing (OLTP)** paradigm emerged and became established, referring to systems designed to handle a large number of short, atomic, and concurrent transactions. In an OLTP system - such as those used for e-commerce, banking systems, or order management - each operation typically involves only a few rows at a time, and the priority is not so much to analyze large volumes of data, but rather to ensure *speed*, *consistency*, and *reliability* for every single transaction. Row-based data organization proves especially well aligned with the needs of these systems, because it allows complete records to be read and written quickly while also supporting mechanisms for isolation and control of concurrent operations (such as row-level locks or versioning), which are essential to avoid conflicts between simultaneous operations.

This reliability is based on a set of fundamental properties known as **ACID: Atomicity, Consistency, Isolation, and Durability**[^3]. *Atomicity* ensures that a transaction is either executed completely or not executed at all: for example, a bank transfer must update both the source and destination account, or neither of them. *Consistency* ensures that every transaction takes the database from one valid state to another valid state, respecting constraints and rules such as primary keys or integrity constraints. *Isolation* allows multiple concurrent transactions to operate without interference, ensuring that each behaves as if it were executed alone, even when simultaneous access occurs. Finally, *durability* guarantees that once a transaction has been committed, it will not be lost even in the event of crashes or system failures.

In conclusion, row-oriented data organization became established - and continues to be indispensable - in contexts where complete records must be read and written quickly and where speed, consistency, and operational robustness are critical, such as banking or commercial systems.

### The limits of row format in analytical workloads

The evolution of information systems, especially from the 2000s onward with the growth of data warehouses and Business Intelligence platforms, made the limits of row-oriented formats in analytical contexts increasingly evident. The systems used in these domains, called **Online Analytical Processing (OLAP)** systems, differ sharply from traditional OLTP systems: while OLTP handles short and frequent transactions on a few rows, OLAP is designed to analyze large volumes of historical data through complex queries and aggregations. In this context, the contribution of William H. Inmon, considered the “father of data warehousing,” is particularly important, as he formalized the idea of a system oriented toward analysis and decision support[^4]. The difference in workload between the two data management paradigms is crucial: OLTP typically accesses entire rows, whereas OLAP reads many rows but only a few columns at a time. Design choices that are optimal for the former reveal limitations and inefficiencies in the latter.

In analytical workloads, the row-oriented format introduces two main inefficiencies: on the one hand, it increases **cache misses**, raising memory access latency and leading to inefficient use of CPU cycles because of stalls (cycles in which the processor waits for another block of data to be loaded into cache); on the other hand, it causes unnecessary data transfers, compromising efficiency in the use of **memory bandwidth**. This happens because each row contains all columns: even when a query requires only two or three attributes, the entire record must be loaded into memory, causing significant overhead.

To make these problems more intuitive, let us consider a concrete example. Imagine a `sensors` table with millions of records representing measurements, with columns such as *id*, *timestamp*, *sensor_id*, *value*. Suppose we want to calculate the average of *values* for all measurements from a given sensor. In a row-oriented format, the data is organized as a sequence of complete records: each row contains all fields. To execute the query, the CPU is forced to read *timestamp* and *id* as well, even though they are not needed for the computation. This leads to three distinct but related effects.

First, *cache misses* occur more frequently[^5]: the CPU loads entire rows into cache (typically 64-byte cache lines), but only a small portion of that data is actually useful. The cache therefore fills up with irrelevant information, causing repeated accesses to main memory, which is much slower. Second, *memory bandwidth* is used inefficiently[^6]: instead of reading only the *value* and *sensor_id* columns, the system transfers blocks containing all columns, consuming much more bandwidth than necessary. Finally, this layout prevents efficient use of **SIMD (Single Instruction, Multiple Data)** instructions: the values in the *value* column are scattered among other fields, making it difficult to load contiguous data into vector registers and perform operations in parallel.

Modern processors are in fact equipped with special registers that make it possible to apply the same operation to multiple data items simultaneously. These registers can range from 128 to 512 bits in length and are organized into *lanes* of different sizes. For example, a 128-bit register divided into 4 lanes can hold up to 4 values of 32 bits each. A SIMD instruction takes advantage of this feature by applying the same operation simultaneously to all the data stored in the register. Naturally, this is only possible if the data is of the same type and, consequently, if it resides in contiguous memory cells - which, as we have already seen, is not the case in row format.

{{< single-image
src="images/blog/arrow/simd.png"
alt="simd"
class="img-fluid rounded-lg d-block mx-auto w-75"
width="1600x"
>}}

*Fig. 3 - The special registers used by SIMD (left) can sum all the numbers at once, while normal registers (right) must sum them one at a time. The different colors indicate different moments when the operation takes place.*

A further limitation of row-based layout concerns the significant reduction in the effectiveness of **compression** techniques, which are fundamental in analytical systems to reduce both storage footprint and I/O costs. Many compression techniques rely on properties that emerge clearly only at the column level:

* **Data homogeneity** (same type, distribution, and domain), exploited by techniques such as *bit packing*, *frame of reference*, and *delta encoding*.
* **Contiguity of similar values**, which underlies *run-length encoding*.
* **Low cardinality per column**, which enables *dictionary encoding*.
* **Correlation between nearby values**, exploited again by *delta encoding* and *frame of reference*.

In row format, these properties are “diluted” by the presence of heterogeneous data within the same row, drastically reducing compression effectiveness. The result is a further increase in overhead in terms of both storage space and I/O, worsening the inefficiencies associated with processor-level data processing.

## The columnar format

The **columnar format** was developed as a direct response to the inefficiencies of the row-oriented model, addressing them on two distinct but complementary levels: at a **low level**, by improving the use of CPU, cache, and memory; and at a **high level**, by optimizing the operations typical of analytical systems. It is important to stress that this choice does not contradict the relational model: the theory proposed by Edgar F. Codd does not in fact impose any physical data layout, leaving implementation freedom.

In the columnar model, data is organized by storing the values belonging to the same column in **contiguous areas of memory**, rather than the values belonging to the same row. This implies a shift from an array of structures (in the row-oriented format) to a structure of arrays (in the columnar format), making homogeneous data physically adjacent and therefore more efficient to process.

{{< single-image
src="images/blog/arrow/example-table-col.png"
alt="example-table-col"
class="img-fluid rounded-lg d-block mx-auto"
width="1600x"
>}}

*Fig. 4 - Simplified example of how a table is stored in memory in a columnar format.*

This choice first and foremost solves the low-level problems typical of row format: it avoids loading unnecessary data, reduces cache misses, and enables more efficient use of memory and vector instructions (SIMD), thanks to the contiguous arrangement of values of the same type.

At the database level, the columnar format enables a series of structural advantages in analytical operations:

* Reduced I/O: queries read only the necessary columns instead of the entire row, drastically decreasing the amount of data transferred.
* More effective compression: the similarity between consecutive values in the same column allows compression techniques to work far more efficiently than in row format.
* Faster aggregations: operations such as `SUM`, `AVG`, or `COUNT` can be executed by scanning compact columns directly, often without the need to reconstruct complete tuples.
* More efficient joins: thanks to techniques such as delayed materialization (*late materialization*) and the use of intermediate structures (for example bitmaps or index vectors), it is possible to reduce the amount of work required.

**Late materialization** is a strategy in which the system avoids reconstructing complete rows (tuples) immediately during query execution. Instead of combining all columns right away, the engine initially works on lightweight representations - such as sets of positions or boolean masks - applying filters and joins only on the strictly necessary columns, and materializing complete records only in the final stages. This technique is not exclusive to columnar systems: it can also be adopted in row-oriented databases, for example by using indexes to identify relevant tuples and accessing the full data only later. However, in those systems its effectiveness is limited by the physical layout of the data, which leads to more scattered and less efficient access patterns.

The benefits of the columnar format, therefore, do not come only from “reading less data” - which is often the only aspect emphasized - but from a deeper reorganization of the layout and execution model[^8], which makes it particularly well suited to large-scale analytical workloads.

In light of these characteristics, it is not surprising that most modern OLAP systems adopt a columnar architecture by default. Pioneer systems such as MonetDB and C-Store first demonstrated these advantages in academia, while industrial solutions such as Amazon Redshift, Google BigQuery, and Snowflake have made them the de facto standard for large-scale data analytics. The Apache Software Foundation ecosystem has also extensively adopted this paradigm within its open-source frameworks for data management and processing, confirming that the columnar model is now the foundation of modern analytical architectures.

## The columnar ecosystem of the Apache Software Foundation

The *Apache Software Foundation* is a non-profit organization that promotes the development of open-source software according to well-defined principles - often summarized in the motto “The Apache Way,” which privileges open collaboration and code quality built by the community[^9]. Over the years, it has launched numerous foundational projects for the data ecosystem, contributing significantly to the evolution of large-scale analytics platforms. In this context, **Apache Arrow** plays a central role as a columnar data format explicitly designed for *in-memory* processing.

### Apache Arrow: in-memory columnar format

Apache Arrow[^10] is an **in-memory** columnar format that, unlike other formats, was not created simply to optimize data storage or scanning with the techniques described in the previous section, but also to address a subtler and often overlooked problem: the **cost of serialization and deserialization** when data is exchanged between different systems or between components written in different languages. Without a standard format, each database or service must implement its own internal data representation, which introduces a high and non-negligible cost associated with data transfer. Each step typically requires two operations:

* Serialization: transforming an in-memory data structure (objects, arrays, tables) into a transferable representation, often a stream of bytes.
* Deserialization: reconstructing the original data structure from that stream.

This process introduces several hidden but significant costs. First of all, it creates **computational overhead**: the CPU must continuously convert data from one format to another, consuming cycles that could otherwise be dedicated to the actual computation. In addition, it leads to **inefficient memory usage**, because it often implies the **creation of intermediate copies** of the data. On top of that, it increases overall latency: every transformation introduces an additional step before the data can be effectively used. The problem becomes even more evident in analytical workloads, where data volumes are large and pipelines involve numerous heterogeneous tools. In such cases, a non-negligible portion of execution time is spent not on computing results, but on **transforming data into compatible formats** across systems. A further critical issue stems from the fact that differences in data representation across systems often mean that the same algorithms used in different systems must be rewritten, introducing an additional cost for developers.

Apache Arrow addresses this problem at its root by proposing a different approach: instead of continuously converting data, it defines a **standardized in-memory columnar format** shared across languages and systems. Arrow libraries allow different components to access the same data directly, without going through a full serialization/deserialization phase. This model, often described as *zero-copy*, makes it possible to eliminate much of the overhead associated with data exchange. In this way, Arrow does not merely improve local performance, but intervenes at a deeper architectural level in data systems: it reduces the “friction” between heterogeneous components, turning data exchange from a costly operation into an almost transparent one.

{{< single-image
src="images/blog/arrow/standardization.png"
alt="standardization"
class="img-fluid rounded-lg d-block mx-auto"
width="1600x"
>}}

*Fig. 5 - By using the Arrow format, systems can transfer data while avoiding costly serializations and deserializations along with the associated copies; in addition, standardization makes it easier to reuse algorithms across different languages.*

Apache Arrow defines not only a general principle, but also a precise set of in-memory data structures that make this zero-copy model possible. The fundamental concept is that data is not represented as a single monolithic table, but as a sequence of units called *RecordBatch*. A RecordBatch can be seen as a block of tabular data:

* It has a schema that defines columns and types.
* It contains a set of homogeneous columns.
* Each column is represented as a columnar array.
  This fundamental structure implements the columnar format, and multiple RecordBatches with the same schema can be logically concatenated to represent larger datasets, while preserving the granularity needed for efficient data processing and transfer.

{{< single-image
src="images/blog/arrow/recordbatch.png"
alt="record-batch"
class="img-fluid rounded-lg d-block mx-auto w-50"
width="1600x"
>}}

*Fig. 6 - Representation of an Arrow RecordBatch and its components.*

Apache Arrow includes a large number of types, ranging from primitive ones (fixed-length and variable-length) to complex and nested types (list, struct, map), all the way to user-defined types and extensions that have become standards within the user community, such as GeoArrow[^11]. In addition, the format integrates several techniques typical of columnar formats, such as dictionary encoding and run encoding, and takes advantage of modern CPU architectures by using parallelization (SIMD) and optimizing memory usage, as described earlier.

### Apache Arrow IPC: standardized data exchange

Apache Arrow **Inter-Process Communication** (IPC) represents the protocol layer that allows **Apache Arrow** to transfer data between processes and systems while preserving the same in-memory representation, avoiding costly conversions[^12]. The fundamental unit of this exchange is the *RecordBatch*, that is, as already discussed, an ordered collection of columns (arrays), all of the same length but potentially of different types, described by a shared schema. The IPC protocol organizes communication as a unidirectional stream of binary messages - mainly *Schema*, *RecordBatch*, and *DictionaryBatch* - encapsulated in a format that separates metadata and data: the former, serialized via Flatbuffers, fully describes structure, types, and buffer positions; the latter contains the actual memory blocks, aligned and organized so that they can be reconstructed through simple pointer arithmetic, without copying. This design is what enables the *zero-copy* paradigm: the receiver can interpret the data by reading only the metadata and directly accessing the underlying buffers.

Within IPC, however, Arrow distinguishes between two different modes, designed for different needs. The **streaming** format is intended for the **sequential transfer** of data: the stream begins with a Schema valid for all subsequent batches, followed by any DictionaryBatch messages and by the RecordBatches, which may also be interleaved. In this case, the reader consumes messages one after another, checking each time whether the stream continues and what the size of the next message is; the end may be explicitly signaled with an end-of-stream marker or simply by closure of the channel.

The **file** format, by contrast, is defined as an extension of the stream format but adds a structure designed for persistence and random access. The file begins and ends with the magic string `ARROW1` and, in addition to the sequence of messages equivalent to the stream, contains at the end a *footer* with a redundant copy of the schema and, above all, with offsets and sizes of the data blocks. This element significantly changes how the format is used: while in streaming the batches must be read in sequence, in a file the reader can jump directly to the desired block, obtaining random access to individual record batches without having to scan all the preceding content. This format was introduced for cases in which there is a need to save intermediate data artifacts, and not specifically for long-term storage.

In addition, IPC integrates optional mechanisms such as *buffer compression* (for example LZ4 or ZSTD, applied independently to each buffer), support for *custom application metadata*, and the management of *extension types*, which make it possible to enrich standard Arrow types with domain-specific semantics without losing interoperability.

### Apache Arrow Flight/Flight SQL: high-performance communication

Within the Apache Arrow ecosystem, *Arrow Flight* represents the **high-performance communication layer** designed to transfer Arrow-formatted data across distributed systems[^13]. It is an **RPC framework** built on top of gRPC and based on Arrow’s IPC format, enabling direct exchange of streams of record batches without the costly intermediate serialization/deserialization steps. Unlike traditional APIs oriented around objects or rows, *Flight operates natively on columnar streams*, enabling efficient and parallelizable transfers.

The interaction model is centered around several key concepts. Datasets are identified through a *FlightDescriptor*, which can represent either a **path** (for example a file or table) or an **arbitrary command** (such as an SQL query). Through calls such as *GetFlightInfo*, the client obtains a logical description of the dataset in the form of *FlightInfo*, which includes metadata (schema, estimated size) and above all a **list of endpoints**. Each endpoint represents a portion of the data and contains the information needed (location and ticket) to retrieve it through the *DoGet* call. This design naturally enables **parallelism**, **distribution**, and **load balancing**, because the client can download different endpoints in parallel, even from different servers. For more complex cases, Flight also supports uploads (*DoPut*) and bidirectional communication (*DoExchange*), making it possible to implement data processing pipelines directly over the RPC channel.

{{< single-image
src="images/blog/arrow/arrow-flight.png"
alt="arrow-flight"
class="img-fluid rounded-lg d-block mx-auto w-75"
width="1600x"
>}}

*Fig. 7 - Diagram of the data download procedure through the Arrow Flight DoGet call.*

A relevant aspect is that Flight clearly separates metadata from data: the first step is always discovery through methods such as ListFlights or GetFlightInfo, while the actual transfer takes place afterward through streams of record batches. This approach, together with the use of opaque tokens (tickets) and flexible URIs (including HTTP for direct access to object storage), makes it easy to integrate distributed systems and heterogeneous storage while maintaining high performance.

Built on top of these foundations is **Arrow Flight SQL**, which extends Flight to support *interaction with relational databases*[^14]. Rather than defining a new protocol, Flight SQL reuses the same RPC methods (such as *GetFlightInfo*, *DoGet*, and *DoPut*) while introducing a series of standardized commands encoded in Protobuf. In practice, an SQL query, a metadata request, or an ingestion operation is encapsulated in a FlightDescriptor and handled as a normal Flight stream.

{{< single-image
src="images/blog/arrow/arrow-flight-sql.png"
alt="arrow-flight"
class="img-fluid rounded-lg d-block mx-auto w-75"
width="1600x"
>}}

*Fig. 8 - Diagram of the procedure for an ad hoc query through Arrow Flight SQL.*

This entails an important shift: even SQL query results and database metadata are returned as Arrow data, maintaining consistency with the in-memory model and further reducing conversion costs. For example, a query is executed through GetFlightInfo, which returns the tickets for accessing the results; these are then downloaded with DoGet as streams of record batches. Likewise, write operations or bulk ingestion use DoPut, allowing Arrow streams to be loaded directly into a table. The commands defined by Flight SQL include ad hoc queries, catalog retrieval (tables, schemas, primary/foreign keys), update operations and bulk ingestion, and state management through sessions (session variables, transactions).

A distinctive element is that the client does not need a specific driver for each database: any database that implements the Flight SQL protocol can be queried through a generic client. This introduces a level of interoperability similar to JDBC/ODBC, but with significantly higher performance thanks to the use of the Arrow format and native streaming.

Arrow Flight, therefore, provides the high-performance transport channel for columnar data, while Flight SQL builds on top of it a standard protocol for database access, eliminating much of the overhead typical of traditional SQL interfaces and making data transfer consistent with Arrow’s *in-memory* model.

### Apache ADBC: a unified interface for databases

Completing the Apache Arrow stack is **Arrow Database Connectivity (ADBC)**, an initiative that addresses a different but complementary problem: providing **standard client-side APIs** for accessing databases using Arrow as the native format[^15]. ADBC is first and foremost a *multi-language* API specification that defines how an application can interact with a database using in-memory Arrow data. These APIs are then implemented through drivers or a driver manager, which translate calls toward the specific protocols of the underlying database (for example Flight SQL, PostgreSQL, SQLite, etc.). Unlike traditional interfaces, ADBC returns query results directly as Arrow data streams, taking advantage of the benefits already discussed.

The Arrow ADBC project was developed to avoid forcing application developers, even when they want to use Arrow as the in-memory format, to manually handle the conversion of data coming from systems that are not natively compatible with Arrow. This type of activity, in addition to being time-consuming, also carries the risk of introducing errors or implementing suboptimal solutions. ADBC addresses this problem by providing a single uniform interface based on Arrow, regardless of whether the database is natively compatible with this format or not. In this way, application code no longer needs to orchestrate conversions between different representations or use specific drivers for each system.

In this sense, ADBC plays a role analogous to JDBC/ODBC, but it is designed from the ground up for the columnar model and for integration with Arrow: query results are not exposed row by row, but as streams of Arrow columnar data, perfectly integrable with modern analytics and data processing libraries.

This project therefore offers several advantages:

* Use of standard APIs in the most widespread languages for working with both Arrow-native and non-native data sources.
* Simplicity in connecting to systems that are not natively compatible with Arrow.
* Ability to use Flight SQL to connect to systems that are natively compatible with Arrow.
* Native integration with analytics and data processing tools based on Arrow.

ADBC is versioned separately from the Arrow core and follows semantic versioning, allowing independent evolution of APIs and implementations. In conclusion, Arrow ADBC is particularly well suited to contexts where one wants to exploit all the advantages of the Arrow format while dealing with data sources that do not support it natively.

### Apache Parquet: efficient persistence at scale

Apache Parquet is a columnar format designed specifically for the **persistence of large volumes of data** on disk in distributed systems, with a strong focus on **reducing storage footprint** and **optimizing read operations**, originally developed within the Hadoop ecosystem and now part of the Apache Software Foundation[^16]. At the structural level, data is divided into *row groups*, which are further organized into *column chunks* and *pages* - a hierarchy that enables both parallelism in reading and efficient storage management. In addition, Parquet integrates advanced compression and encoding techniques (such as the previously mentioned dictionary encoding and run-length encoding), which exploit the characteristics of the data to significantly reduce the occupied space.

Another relevant aspect is the presence of **metadata and statistics** (such as min/max values per column or per block), which enable *predicate pushdown*: a technique in which query filter conditions are “pushed” as close as possible to the storage layer, avoiding unnecessary reads. For example, if a table is divided into multiple *row groups* and a query requires `WHERE year = 2024`, Parquet can use statistics to determine which blocks contain different values (e.g. only years 2020–2022) and skip them entirely without reading them from disk. This reduces read operations and significantly accelerates analytical queries. These properties have made Parquet a de facto standard in big data systems: companies such as Uber use it to improve the efficiency of their data pipelines, reducing storage and compute costs[^17].

When compared with the Arrow IPC file format (the file variant of the Apache Arrow project), fundamental differences emerge that are tied to design goals. Parquet is explicitly designed for long-term storage on disk: it optimizes storage space and I/O through strong compression, hierarchical organization, and rich metadata, but it requires a decoding phase before the data can be used in memory. The Arrow IPC file format, by contrast, is not designed to maximize compression or reduce storage space, but to preserve Arrow’s exact in-memory representation even when saved to disk. Data is stored as sequences of record batches that are already ready to use, with a layout identical to the one used in RAM: this makes it possible to memory-map the file directly and avoid deserialization entirely.

In summary, while Parquet is optimized for efficient persistence and reduced storage footprint, the Arrow IPC file format is optimized for immediate data reuse without transformations: the former prioritizes storage and selective access, the latter loading speed and interoperability. For this reason, in modern architectures *the two formats are complementary*: Parquet is used as a persistence format in data lakes, while Arrow IPC file is used when it is necessary to save data already ready for computation or transfer it between processes while preserving the native Arrow layout.

## Conclusion

The comparison between row-oriented and columnar formats shows that *there is no universally better solution*, but rather design choices that are deeply tied to the type of workload. OLTP systems continue to benefit from row-based layout, while OLAP systems find in the columnar model a decisive advantage in terms of computational and I/O efficiency. On these foundations, the Apache ecosystem builds a coherent architecture that goes beyond the simple data format: with Apache Arrow as the in-memory standard, Arrow Flight for high-performance transfer, ADBC for uniform database access, and Apache Parquet for persistence, an **integrated paradigm** emerges in which data maintains consistency throughout the entire pipeline. This approach drastically reduces conversions, simplifies development, and makes it possible to fully exploit the characteristics of modern hardware architectures, enabling the development of lightweight, high-performance next-generation analytical platforms.

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