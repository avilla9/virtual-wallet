# VirtualWallet: Arquitectura de Microservicios BFF

Este proyecto implementa una solución de E-Wallet (Billetera Electrónica) utilizando una **Arquitectura de Microservicios** con el patrón **Backend for Frontend (BFF)**. El diseño se enfoca en una separación clara de responsabilidades (SRP) mediante dos servicios distintos, orquestados por Docker Compose.

-----

## Arquitectura y Diseño

El sistema está diseñado bajo los principios de **SOLID** (especialmente SRP y DIP) y una **Arquitectura de Capas** (`Layered Architecture`), garantizando un código desacoplado, mantenible y escalable.

| Componente | Patrón/Rol | Responsabilidad Principal | Tecnologías |
| :--- | :--- | :--- | :--- |
| **`wallet-service`** | **Rest-2 / BFF** | **Lógica de Negocio de Alto Nivel** y Exposición de la API Pública. Actúa como *Gateway*, orquestando llamadas al servicio de datos. | TypeScript, Express, Axios |
| **`database-service`** | **Rest-1 / Data Service** | **Acceso Directo a la Base de Datos** (CRUD). Implementa el patrón **Repository** para desacoplar la lógica de persistencia. | TypeScript, Express, MySQL2, Repository Pattern |
| **`mysql`** | **Base de Datos** | Persistencia de datos. | MySQL 8.0 |

### Patrones de Diseño Clave

  * **Repository Pattern (en `database-service`):** Separa completamente la lógica de acceso a datos (ejecución de SQL) de la lógica de negocio, permitiendo un cambio futuro de base de datos con mínimo impacto.
  * **Dependency Inversion Principle (DIP):** Las capas de alto nivel (Controllers, Services) dependen de abstracciones (`IAccountRepository`), no de implementaciones concretas (ej. `MySQLAccountRepository`).
  * **Backend for Frontend (BFF):** El servicio `wallet-service` expone una API optimizada para el cliente (frontend), componiendo la información de diferentes fuentes internas.

-----

## Requisitos Previos

Asegúrate de tener instalado **Docker** y **Docker Compose** en tu sistema para poder levantar la aplicación con un solo comando.

-----

## Proceso de Levantamiento y Ejecución

La arquitectura completa (Base de Datos, Servicio de Datos, Servicio de Lógica y Frontend) se orquesta mediante **Docker Compose**.

### 1\. Configuración del Entorno (`.env`)

El archivo `.env.example` en la raíz del proyecto contiene las variables de entorno necesarias.

1.  Copia el archivo de ejemplo para crear tu configuración local:
    ```bash
    cp .env.example .env
    ```
2.  **Verificación de Variables:**
    El archivo `.env` en la raíz es crucial para la ejecución local si no se usa Docker, pero en este proyecto, todas las variables de los servicios están ya inyectadas y configuradas dentro de `docker-compose.yml` (e.g., `DB_HOST: mysql` y `REST1_URL: http://rest1_data_service:3001`), lo que garantiza que la comunicación interna de Docker sea correcta.

3.  **Entorno de frontend:**
    Existe un archivo `.env.example` en la raíz de la carpeta `frontend` en la cual debe realizarse un procedimeinto similar al anterior.

### 2\. Despliegue con un Solo Comando

Ejecuta el siguiente comando en la raíz del proyecto (donde se encuentra `docker-compose.yml`):

```bash
docker compose up --build -d
```

| Comando | Descripción |
| :--- | :--- |
| `up` | Crea e inicia los contenedores definidos en el archivo. |
| `--build` | Fuerza la reconstrucción de las imágenes para incluir las últimas modificaciones del código. |
| `-d` | Ejecuta los contenedores en modo *detached* (segundo plano). |

### 3\. Verificación de Servicios

Una vez que los contenedores estén levantados, verifica su estado:

```bash
docker compose ps
```

Deberías ver los siguientes contenedores en estado `running`:

  * `wallet_db` (MySQL)
  * `wallet_data_service` (Data Service - Rest-1)
  * `wallet_logic_service` (Logic/BFF Service - Rest-2)
  * `wallet_frontend` (Frontend)

### 4\. Acceso a la Aplicación

| Componente | Puerto Público | URL Base |
| :--- | :--- | :--- |
| **Frontend (React)** | **`8080`** | `http://localhost:8080/` |
| **BFF / Lógica (Rest-2)** | **`3000`** | `http://localhost:3000/api/v1` |
| Data Service (Rest-1) | `3001` | **No debe ser accedido públicamente.** |

-----

## Frontend (Interfaz de Usuario)

Una vez que el contenedor de Docker esté en funcionamiento, se puede acceder a la interfaz de usuario (Frontend) a través de la siguiente dirección en tu navegador: **$\text{http://localhost:8080/}$**

| Característica | Descripción |
| :--- | :--- |
| **Tecnología Principal** | Desarrollado con **React**, utilizando sus capacidades de componentes para una interfaz de usuario dinámica y eficiente. |
| **Principios de Diseño** | El código base sigue los principios de **DRY** (*Don't Repeat Yourself*) y **SOLID**, asegurando mantenibilidad, escalabilidad y una lógica clara. |
| **Arquitectura de UI** | Se implementa una arquitectura basada en **Componentes Reusables** para la interfaz de usuario, promoviendo la consistencia visual y la reutilización de código. |

### Vistas Clave

#### 1\. Consulta de Saldo y Datos de Sesión

Esta vista permite al usuario consultar su saldo actual y la información de la sesión activa (Documento y Teléfono).

#### 2\. Registro de Cuenta

Esta vista es utilizada para que nuevos usuarios puedan crear una cuenta en la Virtual Wallet.

-----

## Uso y Pruebas de la API (Postman)

Se proporciona una colección de Postman para probar fácilmente todos los *endpoints* públicos de la API expuestos por el servicio BFF (`wallet-service`).

### A. Colección de Postman

Puedes acceder a la colección de la API pública aquí:

**[Colección de Postman: VirtualWallet API](https://red-satellite-565796.postman.co/workspace/Team-Workspace~57aef50a-178b-42b9-8e4d-8aa1835fb5fd/collection/25656325-a0ae3ece-0147-402b-bee9-15b6cdfbf764?action=share&creator=25656325)**

### B. Importar JSON de Colección

Para un uso local y sin conexión, el archivo **`VirtualWallet.postman_collection.json`** se encuentra en la raíz del proyecto. Impórtalo en tu aplicación Postman.

-----

## Detener y Limpiar

Para detener y eliminar todos los contenedores y la red de Docker (manteniendo los datos persistentes en el volumen `db_data`):

```bash
docker compose stop
docker compose rm -f
```

Para detener y **eliminar todos los volúmenes** (incluyendo los datos de MySQL, ideal para un *clean start*):

```bash
docker compose down -v
```