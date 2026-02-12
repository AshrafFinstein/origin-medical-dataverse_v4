import { PrismaClient } from '@prisma/client'
import * as fs from 'fs/promises';
import * as path from 'path';

const client = new PrismaClient({
  datasources: {
    db: {
      // replace here
      url: "postgres://postgres:root@127.0.0.1:5434/dataverse_image_final"
    }
  }
})

const fixturesDir = path.join(__dirname, 'fixtures');

const main = async () => {
  console.log('populating patient')
  await fs.readdir(path.join(fixturesDir, 'patients'))
    .then(async (filenames: string[]) => {
      for (let filename of filenames) {
        await fs.readFile(path.join(fixturesDir, 'patients', filename), 'utf-8')
          .then(async (data: string) => {
            await client.patient.createMany({
              data: JSON.parse(data),
              skipDuplicates: true
            })
          })
      }
    })
  console.log('populating visit')
  await fs.readdir(path.join(fixturesDir, 'visits'))
    .then(async (filenames: string[]) => {
      for (let filename of filenames) {
        await fs.readFile(path.join(fixturesDir, 'visits', filename), 'utf-8')
          .then(async (data: string) => {
            await client.visit.createMany({
              data: JSON.parse(data),
              skipDuplicates: true
            })
          })
      }
    })
  console.log('populating raw')
  await fs.readdir(path.join(fixturesDir, 'raw_resources'))
    .then(async (filenames: string[]) => {
      for (let filename of filenames) {
        await fs.readFile(path.join(fixturesDir, 'raw_resources', filename), 'utf-8')
          .then(async (data: string) => {
            await client.rawResource.createMany({
              data: JSON.parse(data),
              skipDuplicates: true
            })
          })
      }
    })
  console.log('populating resource')
  await fs.readdir(path.join(fixturesDir, 'extracted_resources'))
    .then(async (filenames: string[]) => {
      for (let filename of filenames) {
        await fs.readFile(path.join(fixturesDir, 'extracted_resources', filename), 'utf-8')
          .then(async (data: string) => {
            await client.extractedResource.createMany({
              data: JSON.parse(data),
              skipDuplicates: true
            })
          })
      }
    })
}

main()
  .then(async () => {
    await client.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await client.$disconnect()
    process.exit(1)
  })
