import { Link } from "@remix-run/react";
import { deslugify } from '~/utils/deslugify';

type Params = {
  theme?: string;
}

type Data = {
  problems: Array<any>;
}

interface CarouselProps{
  params: Params;
  data: Data;
}

export function ThemeCarousel(props: CarouselProps){
  return(
    <>
    <div className="DashboardActiveTheme">
      <div className="ThemeButtonActive">
        <p>{props.params ? deslugify(props.params.theme ? props.params.theme : "") : ""}</p>
      </div>
    </div>
    <div className="DashboardThemeIndicatorCarousel">
      {props.data && props.data.problems.map((problem)=>(
          <div key={problem.id} className="ProblemButton">
            <Link to={`problem/${problem.slug}`}>
            <p>{problem.name}</p>
            </Link>
          </div>
      ))}
      </div>
    </>
  )
}
