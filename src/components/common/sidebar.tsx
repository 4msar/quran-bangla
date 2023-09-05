import { Link } from "react-router-dom";
import { BookIcon, HeartIcon, SettingIcon } from "src/assets/icons";

export function Sidebar() {
    return (
        <aside className="hidden md:flex h-full bg-gray-50 w-20 flex-col items-center justify-between">
            <div className="top-nav mt-12 flex flex-col space-y-4">
                <Link to="/" className="w-8 h-8">
                    <BookIcon />
                </Link>
                <Link to="/" className="w-8 h-8">
                    <HeartIcon />
                </Link>
            </div>
            <div className="bottom-nav">
                <Link to="/">
                    <SettingIcon />
                </Link>
            </div>
        </aside>
    );
}
