import { Link } from "react-router-dom";
import book from "src/assets/book.svg";
import heart from "src/assets/heart.svg";
import setting from "src/assets/setting.svg";

export function Sidebar() {
    return (
        <aside className="hidden md:flex h-full bg-white w-20 flex-col items-center justify-between fixed top-20 left-0">
            <div className="top-nav mt-12 flex flex-col space-y-4">
                <Link to="/" className="w-8 h-8">
                    <img src={book} alt="logo" />
                </Link>
                <Link to="/" className="w-8 h-8">
                    <img src={heart} alt="favorite" />
                </Link>
            </div>
            <div className="bottom-nav">
                <Link to="/">
                    <img src={setting} alt="settings" />
                </Link>
            </div>
        </aside>
    );
}
