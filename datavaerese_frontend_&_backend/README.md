# Dataverse Platform

Dataverse Platform for validation, grading, and all clinical studies

## Contribution Guildlines

- Run `npm install` to install all the dependencies.
- Run `npm run dev` to start the development server.
- Download docker for desktop : <https://www.docker.com/get-started/>.
- Add an .env file to the root folder (download it from the Software Team shared drive folder).
- Run command `docker compose -f docker-compose-db.yml up` to build and start the Postgres container.
- Run `npx prisma generate` to generate types and other dependencies to work with the database.
- Run `npx prisma migrate dev` to perform schema migration in dev environment.
- Run `npx prisma db seed` to seed the database with sample data.

### For production

- Run `npm run build` to build into production.
- Run `npm run start` to start the production server.