import Link from "next/link";
import { RocketIcon, ReaderIcon, HomeIcon } from "@radix-ui/react-icons";

export default function SideNavigation() {
  return (
    <aside className="w-4/12 border-r border-gray-300 h-screen p-4">
      <h1 className="font-bold text-lg">portfolio admin</h1>
      <div className="mt-5">
        <ul>
          <li className="mb-2">
            <Link
              href={"/admin"}
              className={` hover:bg-gray-100 px-3 py-2 rounded text-gray-600 hover:text-gray-800 flex items-center gap-2`}
            >
              <HomeIcon />
              Home
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href={"/admin/projects"}
              className={` hover:bg-gray-100 px-3 py-2 rounded text-gray-600 hover:text-gray-800 flex items-center gap-2`}
            >
              <RocketIcon />
              Projects
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href={"/admin/blogs"}
              className={` hover:bg-gray-100 px-3 py-2 rounded text-gray-600 hover:text-gray-800 flex items-center gap-2`}
            >
              <ReaderIcon />
              Blogs
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
