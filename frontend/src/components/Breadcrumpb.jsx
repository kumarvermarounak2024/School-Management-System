import React from "react";
import { useLocation, Link } from "react-router-dom";
import breadcrumbConfig from "./breadcrumbconfig";
import { Home } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
const breadcrumbs = pathnames.map((_, index) => {
  const to = "/" + pathnames.slice(0, index + 1).join("/");

  // First try exact match
  let name = breadcrumbConfig[to];

  // If not found, try parent static path
  if (!name) {
    const staticPath = "/" + pathnames.slice(0, index).join("/");

    // agar parent path config me ho, toh uska naam le lo
    if (breadcrumbConfig[staticPath]) {
      // agar yeh ek ObjectId lag rahi hai, toh show "Edit" or "Update"
      if (/^[0-9a-fA-F]{24}$/.test(pathnames[index])) {
        name = "Edit";
      } else {
        name = pathnames[index]; // fallback
      }
    } else {
      name = to.split("/").pop();
    }
  }

  return {
    name,
    path: to,
  };
});


  return (
    <nav className="text-sm text-gray-600 mb-4">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="text-gray-800 font-semibold hover:underline"><Home/></Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span className="mx-1 font-extrabold">{'>'}</span>
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-800 font-semibold">{crumb.name}</span>
            ) : (
              <Link to={crumb.path} className="text-gray-950 hover:underline">{crumb.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
