# **Documentation: Using Bun and Prisma**

This documentation explains the steps to set up and run existing migrations using **Bun** and **Prisma**.

## **1. Clone the Repository**

Clone the desired project repository:

```bash
git clone https://github.com/project-satu/quiz-bun.git

cd quiz-bun
```

## **2. Install Dependencies**

### **2.1 Install Bun**

If Bun is not already installed, install it using the following command:

```bash
curl -fsSL https://bun.sh/install | bash
```

After installation, verify that Bun is correctly installed by running:

```bash
bun --version
```

### **2.2 Install All Dependencies**

If the repository includes a **`package.json`** file with a list of dependencies, you only need to run:

```bash
bun install
```

This command will install all dependencies listed in the **`package.json`** file, including Prisma and other libraries.

If you need to add new dependencies, use the following commands as needed:

- For runtime dependencies:

  ```bash
  bun add package-name
  ```

- For development dependencies:
  ```bash
  bun add package-name --dev
  ```

## **3. Configure Prisma**

Initialize Prisma in your project if not already done:

```bash
bunx prisma init
```

This command will create a **`prisma/`** folder and a **`.env`** configuration file.

Next, open the **`.env`** file and set the database connection URL, for example:

```env
DATABASE_URL="mysql://user:password@localhost:3306/mydb"
```

Replace **`user`**, **`password`**, and **`mydb`** with your database configuration details.

## **4. Apply Existing Migrations**

To apply all existing migrations to the database, run the following command:

```bash
bunx prisma migrate deploy
```

## **5. Check Migration Status**

Verify the status of applied migrations with:

```bash
bunx prisma migrate status
```

This command provides information about the migrations that have been applied and those that are pending.

## **6. Run the Application**

After applying the migrations successfully, you can run the application with the following commands:

### **Production Mode**

```bash
bun run start
```

### **Development Mode**

```bash
bun run start:dev
```

By using **`bun install`**, you can efficiently install all pre-defined dependencies in the **`package.json`** file without manually adding them. This simplifies project setup and ensures a smooth workflow.
