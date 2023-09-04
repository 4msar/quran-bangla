import logo from "src/assets/logo.svg";

export function Header() {
    return (
        <header className="flex h-20 items-center justify-between bg-white px-4">
            <div className="flex items-center">
                <div className="logo max-[120px] pr-4">
                    <img src={logo} alt="logo" className="max-[120px] p-2" />
                </div>
                <h4 className="text-xl pr-4 text-slate-800 font-bold">
                    Quran Bangla
                </h4>
            </div>

            <nav className="flex flex-1 items-center justify-between ml-8 space-x-2">
                <div className="search">
                    <input type="text" placeholder="Search" />
                </div>
                <a className="pr-4" href="http://msar.me">
                    Home
                </a>
            </nav>
        </header>
    );
}
