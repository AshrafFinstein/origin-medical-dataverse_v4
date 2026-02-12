import { randomUUID } from 'node:crypto'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedExtractedResource(dLSessionIds: string[], cESessionIds: string[]) {
  const data = await import('./data.json')
  const patients: Prisma.PatientCreateInput[] = data.patients.map((patient, patientIndex) => ({
    id: patient.id,
    visits: {
      create: patient.visits.map((visit, visitIndex) => ({
        rawResources: {
          create: visit.rawResources.map((rawResource, rawResourceIndex) => ({
            id: randomUUID(),
            metadata: rawResource.metadata,
            machine: rawResource.machine,
            center: rawResource.center,
            extractedResources: {
              create: rawResource.extractedResources.map((extractedResource, extractedResourceIndex) => ({
                id: extractedResource.id,
                metadata: extractedResource.metadata,
                thumbnailUrl: extractedResource.thumbnailUrl,
                dLSessions: {
                  createMany: {
                    data: dLSessionIds.map(dLSessionId => ({
                      dLSessionId,
                      status: 'PENDING',
                    })),
                  },
                },
                cESessions: {
                  createMany: {
                    data: cESessionIds.map((cESessionId, cESessionIndex) => ({
                      cESessionId,
                      index: patientIndex * 10000 + visitIndex * 1000 + rawResourceIndex * 100 + extractedResourceIndex * 10 + cESessionIndex,
                      result: Prisma.JsonNull,
                    })),
                  },
                },
              })),
            },
          })),
        },
      })),
    },
  }))

  await prisma.$transaction(
    patients.map(patient =>
      prisma.patient.create(
        {
          select: {
            id: true,
          },
          data: patient,
        },
      ),
    ),
  )
}

async function seedLabel() {
  const labels: Prisma.LabelCreateInput[] = []
  for (let i = 0; i < 100; i++) {
    labels.push({
      name: `Label${i}`,
      abbreviation: `L${i}`,
    })
  }
  return await prisma.$transaction(
    labels.map(label =>
      prisma.label.create(
        {
          select: {
            id: true,
          },
          data: label,
        },
      ),
    ),
  )
}

async function seedEpic() {
  const epics: Prisma.EpicCreateInput[] = []
  for (let i = 0; i < 100; i++) {
    epics.push({
      name: `Epic ${i}`,
      description: `Epic ${i} description`,
    })
  }

  return await prisma.$transaction(
    epics.map(epic =>
      prisma.epic.create(
        {
          select: {
            id: true,
          },
          data: epic,
        },
      ),
    ),
  )
}

async function seedProject(epicIds: string[]) {
  const projects: Prisma.ProjectCreateInput[] = []
  for (let i = 0; i < 100; i++) {
    projects.push({
      name: `Project ${i}`,
      description: `Project ${i} description`,
      epic: {
        connect: {
          id: epicIds[i],
        },
      },
      users: {
        createMany: {
          data: [
            {
              userId: 'auth0|628e5b7ca6c13000680ce0a7',
              userRole: 'NORMAL',
            },
          ],
        },
      },
    })
  }

  return await prisma.$transaction(
    projects.map(project =>
      prisma.project.create(
        {
          select: {
            id: true,
          },
          data: project,
        },
      ),
    ),
  )
}

async function seedDLSession(projectIds: string[], labelIds: string[]) {
  const dLSessions: Prisma.DLSessionCreateInput[] = []
  for (let i = 0; i < 100; i++) {
    dLSessions.push({
      name: `DL session ${i}`,
      description: `Data Labelling Session ${i} description`,
      priority: 3,
      sop: ['www.example.com'],
      project: {
        connect: {
          id: projectIds[i],
        },
      },
      labels: {
        createMany: {
          data: labelIds.map(id => ({ labelId: id })),
        },
      },
    })
  }
  return await prisma.$transaction(
    dLSessions.map(session =>
      prisma.dLSession.create(
        {
          select: {
            id: true,
          },
          data: session,
        },
      ),
    ),
  )
}

async function seedCESession(projectIds: string[]) {
  const cESessions: Prisma.CESessionCreateInput[] = []
  for (let i = 0; i < 100; i++) {
    cESessions.push({
      name: `CE session ${i}`,
      description: `Clinical Evaluation Session ${i} description`,
      priority: 3,
      sop: ['www.example.com'],
      project: {
        connect: {
          id: projectIds[i],
        },
      },
      resultTemplate: {
        startAt: null,
        finishAt: null,
        sections: [
          {
            index: 0,
            name: 'Section 1',
            measurements: [],
            assessments: [],
          },
        ],
      },
    })
  }
  return await prisma.$transaction(
    cESessions.map(session =>
      prisma.cESession.create(
        {
          select: {
            id: true,
          },
          data: session,
        },
      ),
    ),
  )
}

async function main() {
  const labelIds = await seedLabel()
  const epicIds = await seedEpic()
  const projectIds = await seedProject(epicIds.flatMap(epicId => epicId.id))
  const dLSessionIds = await seedDLSession(
    projectIds.flatMap(projectId => projectId.id),
    labelIds.flatMap(labelId => labelId.id),
  )
  const cESessionIds = await seedCESession(
    projectIds.flatMap(projectId => projectId.id),
  )
  await seedExtractedResource(
    dLSessionIds.flatMap(dLSessionId => dLSessionId.id),
    cESessionIds.flatMap(cESessionId => cESessionId.id),
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
