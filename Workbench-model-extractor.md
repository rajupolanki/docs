You are an expert in MySQL Workbench, SQL, and Spring Boot development.

## Task
Parse a MySQL Workbench model file and generate SQL + Spring JPA code for specific tables,
then save all output files to the specified folders.

---

## Input
- **File location:** <FOLDER_PATH>/<FILE_NAME>.mwb
- **Target table color (new tables):** <COLOR_1> (e.g., #FFFFFF or "light blue")
- **Exclude table color (existing tables):** <COLOR_2> (e.g., #AAAAAA or "yellow")

> Note: A `.mwb` file is a ZIP archive. Unzip it and parse the `document.mwb.xml` file inside.
> Table colors are found in the `<value key="color">` tag within each `<object class="db.Table">` element.

---

## Output Destinations
| Output Type              | Output Folder Path                                      | File Naming Convention               |
|--------------------------|---------------------------------------------------------|--------------------------------------|
| SQL CREATE scripts       | <SQL_OUTPUT_PATH>                                       | <table_name>.sql                     |
| Spring JPA Entity class  | <JAVA_OUTPUT_PATH>/entity/                              | <EntityName>.java                    |
| Spring JPA Repository    | <JAVA_OUTPUT_PATH>/repository/                          | <EntityName>Repository.java          |
| Summary report           | <SQL_OUTPUT_PATH>                                       | _summary.txt                         |

> Save each table's SQL and Java files as **separate files** in the folders above.
> Create the folders if they do not already exist.

---

## Step-by-Step Instructions

### Step 1 — Parse the .mwb File
1. Unzip the `.mwb` file from: `<FOLDER_PATH>/<FILE_NAME>.mwb`
2. Extract and parse `document.mwb.xml`
3. Identify all `<object class="db.Table">` elements
4. Filter tables WHERE `<value key="color">` = **<COLOR_1>** (new tables to generate)
5. Ignore tables WHERE `<value key="color">` = **<COLOR_2>** (existing tables — skip entirely)

---

### Step 2 — Generate SQL CREATE Statements
For each filtered table from Step 1, generate a standard SQL CREATE TABLE statement including:
- All columns with correct data types
- PRIMARY KEY constraints
- FOREIGN KEY constraints (only referencing tables that exist in the schema)
- NOT NULL, DEFAULT, AUTO_INCREMENT, and UNIQUE constraints where defined
- Proper MySQL syntax

Save each as: `<SQL_OUTPUT_PATH>/<table_name>.sql`

**File format:**
-- ============================================================
-- Table: <table_name>
-- Generated from: <FILE_NAME>.mwb
-- ============================================================
CREATE TABLE `<table_name>` (
  ...
);

---

### Step 3 — Generate Spring JPA Entity Classes
For each table from Step 1, generate a Java Spring JPA Entity class:
- Package: `com.<your_package>.entity`
- Annotations: `@Entity`, `@Table(name="<table_name>")`
- Use `@Id` and `@GeneratedValue(strategy = GenerationType.IDENTITY)` for primary keys
- Use `@Column(name="<col_name>")` for all fields
- Use appropriate Java types (Long, String, Integer, LocalDateTime, BigDecimal, Boolean, etc.)
- Use `@ManyToOne`, `@OneToMany`, `@JoinColumn` for relationships where foreign keys exist
- Include Lombok annotations: `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`

Save each as: `<JAVA_OUTPUT_PATH>/entity/<EntityName>.java`

---

### Step 4 — Generate Spring JPA Repository Interfaces
For each Entity from Step 3, generate a Spring JPA Repository interface:
- Package: `com.<your_package>.repository`
- Extend `JpaRepository<EntityName, PrimaryKeyType>`
- Add `@Repository` annotation
- Include commonly useful custom query methods based on the table's columns, such as:
  - `findBy<UniqueColumn>(...)`
  - `findBy<ForeignKeyField>(...)`
  - `existsBy<Column>(...)`

Save each as: `<JAVA_OUTPUT_PATH>/repository/<EntityName>Repository.java`

---

## Output Structure
Deliver the output in this exact order:

1. **Summary report** — List all tables found by color with ✅ (generate) or ⏭️ (skip) label,
   saved to `<SQL_OUTPUT_PATH>/_summary.txt`
2. **SQL Scripts** — One `.sql` file per new table saved to `<SQL_OUTPUT_PATH>/`
3. **Java Entity Classes** — One `.java` file per new table saved to `<JAVA_OUTPUT_PATH>/entity/`
4. **Java Repository Interfaces** — One `.java` file per new table saved to `<JAVA_OUTPUT_PATH>/repository/`

---

## Placeholders to Fill Before Using This Prompt
| Placeholder          | Replace With                                              | Example                                      |
|----------------------|-----------------------------------------------------------|----------------------------------------------|
| `<FOLDER_PATH>`      | Absolute path to your .mwb file folder                    | C:/projects/mydb or /home/user/mydb          |
| `<FILE_NAME>`        | Name of your .mwb file (without extension)                | my_schema                                    |
| `<COLOR_1>`          | Hex or name of color for NEW tables                       | #FF0000 or "green"                           |
| `<COLOR_2>`          | Hex or name of color for EXISTING tables                  | #FFFF00 or "yellow"                          |
| `<SQL_OUTPUT_PATH>`  | Folder where .sql files should be saved                   | C:/output/sql or /home/user/output/sql       |
| `<JAVA_OUTPUT_PATH>` | Root folder for Java files (entity/ and repository/ auto-created inside) | C:/projects/myapp/src/main/java/com/mypackage |
| `com.<your_package>` | Your actual Java base package name                        | com.mycompany.myapp                          |
