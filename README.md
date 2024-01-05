<!--Застосунок був виконаний за допомогю таких техноголій:

Фреймворк NestJs - потужний JS фреймворк для розробки веб додатків, з коробки має багато-функціональні інструменти для розробки

ORM TypeOrm - зараз усі представленні ORM системи особливо не відрізняються і мають подібний функціонал і інтерфейс користування, обрана ця orm із особистих вподобань та управляє БД Postgres, яка запущена контейнері docker

У процесі виконання піднялось питання як, зберігати розміри, можна було зберігати як рядок json, але був обраний кращий підхід с точки зору архітектури та масштабування - збурішання розмірів у окремій таблиці і зʼвязувти взуття з розміром через звʼзок багато-багато

Для парсингу даних з гугл таблиці використана бібліотека google-spreadsheet, має зручний інтерфейс та функціонал. Також в процесі роботи з даною гугл таблицею виникли деякі помилки, так як поле код товару виявилося не унікальми на всій таблиці, тому для зіставлення даних з таблиці і бд, використовується імʼя товару, це не є максимально безпечним підходом, отримавши права редактора на таблицю цього можна уникнути

Для запуску необхідно встановити docker та запустити в терміналі з директорії проекту:

# run

$ docker-compose up -->
# Shoe Store Data Management API

This NestJS-based REST API application serves as a data management system for a shoe store, allowing the parsing of data from Google Sheets and storing it in a database for easy manipulation and retrieval.

## Features

- **Google Sheets Integration**: Connects with the Google Sheets API to fetch shoe inventory and related data.
- **Database Storage**: Stores the parsed shoe data in a database for efficient management.
- **RESTful Endpoints**: Provides endpoints for CRUD operations on shoe inventory, allowing easy manipulation of data.

## Installation

### Prerequisites

- Docker installed
- Google Cloud Platform project with Sheets API enabled
- Database (PostgreSQL) configured and accessible

### Steps

1. Clone the repository: `git clone https://github.com/Makstorm/resto-waves.git`
2. Set up Google Sheets API credentials and database configuration (see `docker.env.example`).
3. Start the server: `docker-compose up`

## Usage

### Google Sheets Integration

- Configure Google Sheets API credentials in the `docker.env` file.

### Database Operations

- Use the respective endpoints (`/shoes`) for CRUD operations on shoe inventory and related data.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
