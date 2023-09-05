import { Link } from "react-router-dom";

export function Header() {
    return (
        <header className="flex fixed left-0 top-0 w-full h-20 items-center justify-between bg-white">
            <div className="flex items-center">
                <Link to="/" className="logo max-[120px] pr-4">
                    <img
                        src="/logo.svg"
                        alt="logo"
                        className="max-[120px] p-2"
                    />
                </Link>
                <h4 className="text-xl hidden md:block pr-4 text-slate-800 font-bold">
                    Quran Bangla
                </h4>
            </div>

            <nav className="flex flex-1 items-center justify-between mr-4 max-w-md">
                <input
                    className="bg-white border border-gray-100 outline-none text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                    type="search"
                    placeholder="Search"
                />
            </nav>
        </header>
    );
}
