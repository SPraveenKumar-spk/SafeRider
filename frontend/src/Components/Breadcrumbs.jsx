import { Link, useLocation } from "react-router-dom";

function Breadcrumbs() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="text-gray-600 text-md my-4">
      <ol className="flex space-x-2">
        <li>
          <Link to="/" className="text-blue-500 hover:underline">
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <li key={to} className="flex items-center">
              <span className="mx-2">/</span>
              <Link
                to={to}
                className="text-blue-500 hover:underline capitalize"
              >
                {value.replace("-", " ")}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
