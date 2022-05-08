import { Link, useLoaderData, useParams, Outlet } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import widgetThemeStylesheetURL from "~/styles/widget-theme.css";
import { getIndicatorsByProblem } from "~/models/theme.server";
import { deslugify } from '~/utils/deslugify';
import { slugify } from '~/utils/slugify';
import { unpackRoutes } from '~/utils/unpackRoutes';
import invariant from "tiny-invariant";

// Note: You'd expect this component to be nested, but the UI demands that it's a fake nesting

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: widgetThemeStylesheetURL}
  ]
};

type LoaderData = {
  indicators: Awaited<ReturnType<typeof getIndicatorsByProblem>>['indicators'];
  sparkData: Awaited<ReturnType<typeof getIndicatorsByProblem>>['sparkData'];
};

export const loader: LoaderFunction = async ({
  params
}) => {
  invariant(params.problem, `params.problem is required`);

  const indicators = await getIndicatorsByProblem(params.problem)
  invariant(indicators, `Indicators not found for problem ${params.problem}`);

  const data: LoaderData = {
    ...indicators
  }
  return json(data)
}

export default function WidgetIndicator(){
  const params = useParams();
  const data = useLoaderData<LoaderData>();
  return (
    <>
    <div className="DashboardFocus">
      <Outlet />
    </div>
      <div className="DashboardThemeSelection">
      <div className="DashboardThemeSelectionWelcomeWrapper">
        <h1>Hello <strong>Farnney the Dinosaur</strong></h1>
      </div>
        <div className="WidgetThemeCarousel">
            <div className="WidgetActiveTheme">
              <div className="ThemeButtonActive">
                <p>{params ? deslugify(unpackRoutes(params.theme)) : ""}</p>
              </div>
            </div>
            <div className="WidgetActiveProblem">
              <div className="ProblemButtonActive">
                <p>{params ? deslugify(params.problem) : ""}</p>
              </div>
            </div>
      </div>
    </div>
    <div className="DashboardCarousel">
      {data && data.indicators.map((indicator) => (
        <div className="IndicatorContainer" key={indicator.id}>
          <Link to={`${indicator.slug}/${slugify(indicator.config.layout)}`}>
            <h1>{indicator.name}</h1>
          </Link>
        </div>
      ))}
    </div>
    </>
  )
};
