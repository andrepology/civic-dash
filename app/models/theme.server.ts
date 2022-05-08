import { db } from "~/utils/db.server";
import { redis } from "~/models/redis.server"

type Theme = {
  id: number;
  name: string;
  description: string;
  slug: string;
}

type Problem = {
  id: number;
  name: string;
  description: string;
  slug: string;
}

type Config = {
  layout: string
}

type Indicator = {
  id: number;
  name: string;
  description: string;
  slug: string;
  favourite: boolean;
  config: Config
}

export async function getThemes(): Promise<Array<Theme>>{
  const themes = await db.theme.findMany()
  return themes
  }

export async function getProblems(): Promise<Array<Problem>>{
  const problems = await db.problem.findMany()
  return problems
}

export async function getProblemsByTheme(theme_slug: string): Promise<Array<Problem>>{
  const problems = await db.problem.findMany({
    where: {
      themes: {
        some: {
          theme: {
            slug: theme_slug // typescript really doesn't like this
            }
          }
        }
      }
  })
  return problems
}

export async function getIndicatorsByFavourite(): Promise<Array<Indicator>>{
  const indicators = await db.indicator.findMany({
    where: {
      favourite: true
    },
    include: {
      config: {
        select: {
          layout: true
        }
      }
    }
  })
  var sparkDataArray = [];
  for(indicator of indicators){
    const sparkData = await redis.get(indicator.sparkDataKey)

    sparkDataArray.push({indicatorName: indicator.name, data: sparkData})
  }
  return({indicators: indicators, sparkData: sparkDataArray})
}

export async function getIndicatorsByTheme(theme_slug: string): Promise<Array<Indicator>>{
  const indicators = await db.indicator.findMany({
    where: {
      themes: {
        some: {
          theme: {
            slug: theme_slug
          }
        }
      }
    },
    include: {
      config: {
        select: {
          layout: true
        }
      }
    }
  })
  var sparkDataArray = [];
  for(indicator of indicators){
    const sparkData = await redis.get(indicator.sparkDataKey)

    sparkDataArray.push({indicatorName: indicator.name, data: sparkData})
  }
  return({indicators: indicators, sparkData: sparkDataArray})
}

export async function getIndicatorsByProblem(problem_slug: string): Promise<Array<Indicator>>{
  const indicators = await db.indicator.findMany({
    where: {
      problems: {
        some: {
          problem: {
            slug: problem_slug
          }
        }
      }
    },
    include: {
      config: {
        select: {
          layout: true
        }
      }
    }
  })
  var sparkDataArray = [];
  for(indicator of indicators){
    const sparkData = await redis.get(indicator.sparkDataKey)

    sparkDataArray.push({indicatorName: indicator.name, data: sparkData})
  }
  return({indicators: indicators, sparkData: sparkDataArray})
}
